import os
import subprocess
from datetime import datetime, date
import sys
from fastapi import FastAPI, Body, Depends
from pydantic import BaseModel, Field, EmailStr
from typing import Optional

from server.model import PostSchema, UserLoginSchema
from server.auth.auth_bearer import JWTBearer
from server.auth.auth_handler import signJWT
from fastapi_utils.tasks import repeat_every
# from glyder import glogger, connection
from random import randint, randrange

import pymongo
import datetime
from fastapi.middleware.cors import CORSMiddleware
from azure.core.credentials import AzureKeyCredential
import smtplib
from fastapi_mail import FastMail, MessageSchema,ConnectionConfig
from typing import List
from bson.objectid import ObjectId

def getConn():
    conn = 'mongodb://ide21qadguser_qa:shSgSAd63SDsgh67S@18.232.50.247:27021/ide_database_qa?authMechanism=SCRAM-SHA-256&authSource=ide_database_qa'
    client_mongo = pymongo.MongoClient(conn)
    db_mongo = client_mongo.ide_database_qa
    return db_mongo

class UserLogin(BaseModel):
    email: str
    password: Optional[str] = None
    otp: Optional[int] = None

class IncomingData(BaseModel):
    docType: Optional[str] = None
    dateRec: Optional[date] = None
    dateProcessed: Optional[date] = None
    docStatus: Optional[str] = None

class FinalData(BaseModel):
    fileName: Optional[str] = None

class EmailSchema(BaseModel):
   email: List[EmailStr]

class IssueSchema(BaseModel):
   errMsg: str
   doc_id: str

def getUserForEmail(emailStr):
    print("getUserForEmail",emailStr)
    db_mongo = getConn()
    users_c = db_mongo.users
    # users_p = users_c.find({"email": emailStr})
    users_p = users_c.find({"email": {"$regex": emailStr, "$options": "i"}})

    return users_p

def createOTPRecord(emailStr, otp):
    db_mongo = getConn()
    users_otp_c = db_mongo.users_otp
    current_date_and_time = datetime.datetime.now()
    print(current_date_and_time)
    hours = 1
    hours_added = datetime.timedelta(hours=hours)
    future_date_and_time = current_date_and_time + hours_added
    result = users_otp_c.insert_one({"email": emailStr, "otp": otp, "insertTime": datetime.datetime.now(), "expiryTime": future_date_and_time})
    return result

def checkOTP(emailStr, otp):
    db_mongo = getConn()
    users_otp_c = db_mongo.users_otp

    # email_str = '/' + str(emailStr) + '/i'
    # email_str = str(emailStr)

    # print("checkOTP email_str",email_str)
    # result = users_otp_c.find_one({"email": emailStr, "otp": otp, "expiryTime": {"$gt": datetime.datetime.now()}})
    result = users_otp_c.find_one({"email": {"$regex":emailStr, "$options":"i"}, "otp": otp, "expiryTime": {"$gt": datetime.datetime.now()}})

    # find_query = {"email": {"$regex":email_str, "$options":"i"}, "otp": otp, "expiryTime": {"$gt": datetime.datetime.now()}}
    # print("find_query",find_query)
    #
    # result2 = users_otp_c.find_one(find_query)
    # print("checkOTP result2",result2)
    return result

def getCompany(companyId):
    db_mongo = getConn()
    companies_c = db_mongo.companies
    result = companies_c.find_one({"_id": companyId})
    return result

app = FastAPI()
# logger = glogger.get_glogger("server")

origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

conf = ConnectionConfig(
    MAIL_FROM='support@vercx.com',
    MAIL_USERNAME='support@vercx.com',
    MAIL_PASSWORD='VercX2018$$',
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_TLS=True,
    MAIL_SSL=False
)

def getIncomingData(dateRec, dateProcessed, docStatus, docType):
    print("getIncomingData", dateRec, dateProcessed, docStatus, docType)
    db_mongo = getConn()
    files_incoming_c = db_mongo.files_incoming

    query_str = {}
    # query_str = {"file_date": {"$gte": dateRec}, "file_date": {"$lte": dateProcessed}}

    if docStatus != 'all':
        query_str = {"status": docStatus}

    print("query_str",query_str)

    files_incoming_p = files_incoming_c.find(query_str)
    # files_incoming_p = files_incoming_c.find({"status": docStatus}, {'_id': 0})

    return files_incoming_p

async def send_otp_mail(otp, recipient):
    print("send_otp_mail", otp, recipient)

    html_template = '<html><head><title>OTP</title><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">'
    html_template += '<p>Dear Valued Customer,</p><br/><br/>'
    html_template += '<p>Your Password for Secure Login is: ' + otp + '<br /><br/>'
    html_template += '</div></div><br/><br/><div class="row" style="background-color:#dbdada"><div class="col-sm-4"></div> <div class="col-sm-4" style="font-size:16px;padding:10px;">'
    html_template += '<b>Thank you.<br/><br/></b></div><div class="col-sm-4"></div></div></div></body></html>'

    template = """
                <html>
                <body>
                <p>Hi !!!
                <br>Thanks for using fastapi mail, keep using it..!!!</p>
                </body>
                </html>
                """

    template2 = "<html><body><p>Hi !!!<br>Thanks for using fastapi mail, keep using it..!!!</p></body></html>"

    message = MessageSchema(
        subject='OTP for secure login on IDE Portal',
        recipients=[recipient],  # List of recipients, as many as you can pass
        body=html_template,
        subtype="html"
    )

    print("message", message)
    print("conf", conf)

    fm = FastMail(conf)
    print("sending email")

    return await fm.send_message(message)

def getFinalData(file_name):
    print("getFinalData", file_name)
    db_mongo = getConn()
    files_incoming_c = db_mongo.files_incoming

    # files_incoming_p = files_incoming_c.find({"final_filename":file_name})
    files_incoming_p = files_incoming_c.find_one({"final_filename":file_name})
    # files_incoming_p = files_incoming_c.find({"status": docStatus}, {'_id': 0})

    return files_incoming_p

@app.get("/")
async def root():
    return {"message": "Welcome to IDE Portal"}


@app.post("/user/login")
# async def user_login(user: UserLogin = Body(..., embed=True)):
async def user_login(user: UserLogin = Body(...)):
    # print("sending email")
    # mailServer = smtplib.SMTP('smtp.gmail.com', 587)
    # mailServer.starttls()
    # print("authenticate email")
    # mailServer.login('support@vercx.com', 'vercxSupport2017')
    # print("login success email")
    # mailServer.sendmail('support@vercx.com', 'saurabh.dhiman@digitalglyde.com', 'message from ideprotal')
    # print("sent success email")

    if user and user.otp and user.otp > 0:
        print("user found", user.email, user.otp)
        userres = checkOTP(user.email, user.otp)
        print("userres",userres)
        userfound = False

        if userres:
            for user_s in userres:
                userfound = True
                print(user_s)
            if (userfound):
                return {"result":"success", "err":None}
            else:
                return {"result": None, "err": "Email not found in System "}
                # return {"error": "Email not found in System "}
        else:
            return {"result": None, "err": "invalid OTP"}
    else:
        if user and user.email and len(user.email) > 0:
            users_p = getUserForEmail(user.email)
            userfound = False
            user_data = None
            for user_s in users_p:
                userfound = True
                print("user_s",user_s)
                user_data = user_s
            if (userfound):
                companyData = getCompany(user_data["companyId"])
                print("companyData", companyData)
                otp = randint(100000, 999999)

                createOTPRecord(user.email, otp)

                await send_otp_mail(str(otp), user.email)

                user_comp_details = {
                    "company":companyData["companyName"],
                    "email": user_data["email"],
                    "name": user_data["name"]
                }
                return {"result": user_comp_details, "err": None}
            else:
                # return {"error": "Email not found in System "}
                return {"result": None, "err": "Email not found in System "}


        else:
            return {"result": None, "err": "No email found"}

            # return {"error": "No email found "}

    # if user.password == os.getenv('API-Key'):
    #     logger.info(f"login successful on {datetime.now()}")
    #     return signJWT()
    # return {
    #     "error": "Wrong login details!"
    # }


@app.post("/user/loginDND", tags=["user"])
async def user_login(user: UserLoginSchema = Body(...)):
    if user.password == os.getenv('API-Key'):
        # logger.info(f"login successful on {datetime.now()}")
        return signJWT()
    return {
        "error": "Wrong login details!"
    }

@app.post("/reportIssue")
async def report_issue(incData: IssueSchema = Body(...)):
    errMsg = incData.errMsg
    doc_id = incData.doc_id

    db_mongo = getConn()
    files_incoming_c = db_mongo.files_incoming

    result = files_incoming_c.update_one({"_id": ObjectId(doc_id)}, {"$set": {"errMsg": errMsg, "status":"Error"}})
    print("reportIssue  result", result)
    return {"result": "issue reported successfully", "err": None}

@app.post("/incomingData")
async def incoming_data(incData: IncomingData = Body(...)):
    dateRec = incData.dateRec
    dateProcessed = incData.dateProcessed
    docStatus = incData.docStatus
    docType = incData.docType
    print("incoming_data", incData)

    incomingDataRes = getIncomingData(dateRec, dateProcessed, docStatus, docType)

    ids_dict = []
    for ids_s in incomingDataRes:
        noOfPages = 0
        processorGroup = ""
        processorName = ""
        errMsg = ""

        if 'noOfPages' in ids_s:
            noOfPages = ids_s["noOfPages"]

        if 'processorGroup' in ids_s:
            processorGroup = ids_s["processorGroup"]

        if 'processorName' in ids_s:
            processorName = ids_s["processorName"]

        if 'errMsg' in ids_s:
            errMsg = ids_s["errMsg"]

        ids_dict.append({
            "doc_id":str(ids_s["_id"]),
            "docStatus":ids_s["status"],
            "dateRec":ids_s["createdOn"],
            "dateProcessed": ids_s["file_date"],
            "noOfPages": noOfPages,
            "processorGroup": processorGroup,
            "processorName": processorName,
            "errMsg": errMsg
        })

    return {"result": ids_dict, "err": None}

@app.post("/finalData")
async def final_data(incData: FinalData = Body(...)):
    file_name = incData.fileName

    print("final_data", incData)

    finalDataRes = getFinalData(file_name)
    print("finalDataRes", finalDataRes)

    return {"result": "finaldata success", "err": None}

@app.get("/provider/{id}", dependencies=[Depends(JWTBearer())], tags=["posts"])
async def add_post(id: int) -> dict:
    return {
        "data": "post added."
    }


# @app.on_event("startup")
# @repeat_every(seconds=3600 * 24, logger=logger, wait_first=True)
# def periodic():
#     logger.info(f"started the process at {date.today()}")
#     con = connection.Connect()
#     collection = con.db['processors']
#     proc = subprocess.run('which python', stdout=subprocess.PIPE)
#     line = proc.stdout.decode("utf-8")
#     python = line.rstrip()
#     for processor in collection.find():
#         try:
#             processor_path = os.path.join('processors', 'scripts', processor['processor'])
#             process = subprocess.Popen(f"{python} {processor_path} --target_folder{processor['folder']}"
#                                        f" --target_collection{processor['collection']}",
#                                        stdout=subprocess.PIPE, stderr=subprocess.PIPE)
#             out, err = process.communicate()
#             return_code = process.poll()
#             out = out.decode(sys.stdin.encoding)
#             err = err.decode(sys.stdin.encoding)
#             logger.into(f"processed {processor['folder']} with output of {out}")
#             logger.error(f"Processed failed for {processor['folder']} with {err}")
#         except Exception as e:
#             logger.error(f"Error processing {processor['processor']} due to {e}")
#
#     pass
