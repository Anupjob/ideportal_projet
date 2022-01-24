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
from azure.storage.blob import BlobServiceClient
import pandas as pd
from io import BytesIO, StringIO
import base64
import json

folderFileProcessing = "fileprocessing/"
container = "incomingfiles"
connect_str_use = 'DefaultEndpointsProtocol=https;AccountName=idedata;AccountKey=7o/tRVR7exoh8XqFc2q/IRwm+YEo7/uxV3q1GjWeEYcfDbV56FC8xkp5xzLaO/rUnkI3JfnA1XFyq5dmDbJjXA==;EndpointSuffix=core.windows.net'

def getConn():
    conn = 'mongodb://ide21qadguser_qa:shSgSAd63SDsgh67S@18.232.50.247:27021/ide_database_qa?authMechanism=SCRAM-SHA-256&authSource=ide_database_qa'
    client_mongo = pymongo.MongoClient(conn)
    db_mongo = client_mongo.ide_database_qa
    return db_mongo

def blob_connection():
    connect_str = connect_str_use
    blob_service_client = BlobServiceClient.from_connection_string(connect_str)
    return blob_service_client

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
    processorContainerPath: Optional[str] = None

class EmailSchema(BaseModel):
   email: List[EmailStr]

class IssueSchema(BaseModel):
   errMsg: str
   doc_id: str

class PdfDataSchema(BaseModel):
   fileName: str
   containerPath: str

class GoogleVisionSchema(BaseModel):
   docId: str
   resType: str
   pageNum: int

class ProcessorDataSchema(BaseModel):
   companyId: str

class UserDataSchema(BaseModel):
   companyId: str

def download_blob_azure(local_path, complete_file_name):
    print("download_blob_azure", local_path, complete_file_name);

    try:
        blob_service_client = blob_connection()
        print("blob_service_client",blob_service_client)
        blob_client = blob_service_client.get_blob_client(container=container, blob=complete_file_name)
        with open(local_path, "wb") as my_blob:
            download_stream = blob_client.download_blob()
            my_blob.write(download_stream.readall())
    except Exception as e:
        print(f"download_blob_azure Error {complete_file_name} , {local_path} due to {e}")
        # print('Error in downloading', complete_file_name, local_path)

def download_blob_azure_buffer(complete_file_name):
    print("download_blob_azure_buffer", complete_file_name);

    try:
        blob_service_client = blob_connection()
        print("blob_service_client",blob_service_client)

        blob_client = blob_service_client.get_blob_client(container=container, blob=complete_file_name)

        # with BytesIO() as my_blob:
        #     # Download as a stream
        #     download_stream = blob_client.download_blob()
        #     download_stream.readinto(my_blob)
        #
        #     # needed to reset the buffer, otherwise, panda won't read from the start
        #     my_blob.seek(0)
        #
        # return my_blob

        download_stream = blob_client.download_blob()
        return download_stream.readall()

    except Exception as e:
        print(f"download_blob_azure_buffer Error {complete_file_name} due to {e}")
        return ""
        # print('Error in downloading', complete_file_name, local_path)

def pdf_blob_azure_buffer(complete_file_name):
    print("pdf_blob_azure_buffer", complete_file_name);

    try:
        blob_service_client = blob_connection()

        blob_client = blob_service_client.get_blob_client(container=container, blob=complete_file_name)
        print("blob_client",blob_client)

        with BytesIO() as my_blob:
            # Download as a stream
            download_stream = blob_client.download_blob()
            download_stream.readinto(my_blob)

            # needed to reset the buffer, otherwise, panda won't read from the start
            my_blob.seek(0)

            base64Str = base64.b64encode(my_blob.getvalue())
        return {"result":base64Str, "err":None}

        # download_stream = blob_client.download_blob()
        # return download_stream.readall()

    except Exception as e:
        print(f"pdf_blob_azure_buffer Error {complete_file_name} due to {e}")
        return {"result":None, "err": e}
        # print('Error in downloading', complete_file_name, local_path)

def upload_blob_azure_process(fileName, local_file_comp, folder_name_process):
    #     try:
    container_path = folderFileProcessing + str(folder_name_process) + '/' + str(fileName)
    file_url = local_file_comp
    blob_service_client = blob_connection()
    blob_client_upload = blob_service_client.get_blob_client(container=container, blob=container_path)
    if (blob_client_upload.exists()):
        print("already exists", container_path, container, fileName)
    else:
        print(container_path, container, fileName)
        #     try:
        with open(local_file_comp, "rb") as data:
            blob_client_upload.upload_blob(data, overwrite=True)
    #     except:
    #         print(container_path,' doesnot exsist')
    return container_path

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


def getDataForPage(data, pageNo):
    dataret = []
    #     print(data)
    if (len(data) > 0):
        for dats in data:
            if (dats['pageCount'] == pageNo):
                dataret.append(dats)
                print("some data found for this page")

    return dataret

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

@app.post("/getPdfFile")
async def get_pdf_file(incData: PdfDataSchema = Body(...)):
    fileName = incData.fileName
    containerPath = incData.containerPath

    # completeFileName = containerPath+"/"+fileName

    db_mongo = getConn()
    files_incoming_breakup_c = db_mongo.files_incoming_breakup

    files_incoming_breakup_p = files_incoming_breakup_c.find_one({"filenameprocessing": fileName, "pageNo": 1})
    print("files_incoming_breakup_p",files_incoming_breakup_p)

    if files_incoming_breakup_p :
        completeFileName = containerPath + "/" + files_incoming_breakup_p["pdf"]

        data = pdf_blob_azure_buffer(completeFileName)
        print("getPdfFile data", data)

        return data
    else:
        return {"result": None, "err": "No file found"}

    # if(data and data["pdfRes"] and len(data["pdfRes"]) > 0):
    #     return {"result": data["pdfRes"], "err": None}
    # else:
    #     return {"result": None, "err": data.err}

@app.post("/getGoogleVisionData")
async def get_google_vision_data(incData: GoogleVisionSchema = Body(...)):

    print("get_google_vision_data",incData)

    docId = incData.docId
    resType = incData.resType
    pageNum = incData.pageNum

    db_mongo = getConn()
    files_incoming_c = db_mongo.files_incoming

    files_incoming_p = files_incoming_c.find_one({"_id": ObjectId(docId)})
    print("files_incoming_p",files_incoming_p)

    colName = 'google_vision_response_filename'

    if resType == "googlet":
        colName = 'google_vision_response_filename'
    elif resType == "azuret":
        colName = 'azure_form_filename'

    print("colName",colName)
    # if ('google_vision_response_filename' in files_incoming_p and files_incoming_p['google_vision_response_filename'] != ''):
    if colName in files_incoming_p and files_incoming_p[colName] != '':

        try:
            blob_service_client = blob_connection()

            complete_file_name = files_incoming_p["processorContainerPath"] + "/" + files_incoming_p[colName]
            print("complete_file_name", complete_file_name)

            blob_client = blob_service_client.get_blob_client(container=container, blob=complete_file_name)
            print("blob_client", blob_client)

            download_stream = blob_client.download_blob()
            my_blob = download_stream.readall()
            jsonFileData = json.loads(my_blob)

            dataRet = getDataForPage(jsonFileData, pageNum)
            fullTextAnnotation_text = dataRet[0]['data']

            return {"result": fullTextAnnotation_text, "err": None}

            # if resType == "googlev" or resType == "googlet":
            #     dataRet = getDataForPage(jsonFileData, pageNum)
            #     fullTextAnnotation_text = dataRet[0]['data']
            #
            #     return {"result": fullTextAnnotation_text, "err": None}
            #
            # else:
            #     return {"result": jsonFileData, "err": None}

            # download_stream = blob_client.download_blob()
            # return download_stream.readall()

        except Exception as e:
            print(f"get_google_vision_data Error {complete_file_name} due to {e}")
            return {"result": None, "err": e}

    else:
        return {"result": None, "err": "No file found"}

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
        processorContainerPath = ""
        final_filename = ""
        filenameProcessing = ""

        if 'noOfPages' in ids_s:
            noOfPages = ids_s["noOfPages"]

        if 'processorGroup' in ids_s:
            processorGroup = ids_s["processorGroup"]

        if 'processorName' in ids_s:
            processorName = ids_s["processorName"]

        if 'errMsg' in ids_s:
            errMsg = ids_s["errMsg"]

        if 'processorContainerPath' in ids_s:
            processorContainerPath = ids_s["processorContainerPath"]

        if 'final_filename' in ids_s:
            final_filename = ids_s["final_filename"]

        if 'filenameprocessing' in ids_s:
            filenameProcessing = ids_s["filenameprocessing"]

        ids_dict.append({
            "doc_id":str(ids_s["_id"]),
            "docStatus":ids_s["status"],
            "dateRec":ids_s["createdOn"],
            "dateProcessed": ids_s["file_date"],
            # "dateRec": ids_s["file_date"],
            # "dateProcessed": ids_s["step2time"],
            "noOfPages": noOfPages,
            "processorGroup": processorGroup,
            "processorName": processorName,
            "processorContainerPath": processorContainerPath,
            "finalFileName": final_filename,
            "pdfFilename": filenameProcessing,
            "errMsg": errMsg
        })

    return {"result": ids_dict, "err": None}

@app.post("/finalData")
async def final_data(incData: FinalData = Body(...)):
    file_name = incData.fileName
    processorContainerPath = incData.processorContainerPath

    print("final_data", incData)

    finalDataRes = getFinalData(file_name)
    print("finalDataRes", finalDataRes)

    # local_path = "../csv_final_data/"+file_name
    local_path = "csv_final.csv"
    complete_file_name = "fileprocessing" + "/" +processorContainerPath + "/" + file_name

    # download_blob_azure(local_path, complete_file_name)
    file_buffer = download_blob_azure_buffer(complete_file_name)
    print("file_buffer", file_buffer)

    data = pd.read_csv(BytesIO(file_buffer))
    # data = pd.read_csv(file_buffer)
    data = data.drop("index", axis=1)
    data = data.fillna(0)
    data_dict = data.to_dict("list")

    # data_keys =
    # data_values =

    # df = pd.DataFrame(data)
    # print("df",df)
    # print("dict(df.values)",dict(df.values))
    # print("dict(df.keys)",dict(df.keys))

    return {"result": data_dict, "err": None}

@app.post("/getProcessorData")
async def get_processors(incData: ProcessorDataSchema = Body(...)):
    companyId = incData.companyId

    db_mongo = getConn()
    processors_c = db_mongo.processors

    processors_p = processors_c.find({"company_id": ObjectId(companyId)})
    print("processors_p",processors_p)

    if processors_p :

        processor_dict = []
        for processor_dict_s in processors_p:
            processor_dict.append(
                {
                    "processor_id": str(processor_dict_s["_id"]),
                    "group": processor_dict_s["group"],
                    "name": processor_dict_s["name"],
                    "folder": processor_dict_s["folder"],
                    "processor": processor_dict_s["processor"],
                    "collection": processor_dict_s["collection"]
                }
            )

        return {"result": processor_dict, "err": None}
    else:
        return {"result": None, "err": "no records found"}

@app.get("/getCompaniesData")
async def get_companies():

    db_mongo = getConn()
    companies_c = db_mongo.companies

    companies_p = companies_c.find({})
    print("companies_p",companies_p)

    if companies_p :

        companies_dict = []
        for company_dict_s in companies_p:
            companies_dict.append(
                {
                    "comp_id": str(company_dict_s["_id"]),
                    "name": company_dict_s["companyName"]
                }
            )

        return {"result": companies_dict, "err": None}
    else:
        return {"result": None, "err": "no records found"}

@app.post("/getUsersData")
async def get_users(incData: UserDataSchema = Body(...)):
    companyId = incData.companyId

    db_mongo = getConn()
    users_c = db_mongo.users

    users_p = users_c.find({"companyId": ObjectId(companyId)})
    print("users_p",users_p)

    if users_p :

        user_dict = []
        for user_dict_s in users_p:
            user_dict.append(
                {
                    "user_id": str(user_dict_s["_id"]),
                    "email": user_dict_s["email"],
                    "name": user_dict_s["name"]
                }
            )

        return {"result": user_dict, "err": None}
    else:
        return {"result": None, "err": "no records found"}

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
