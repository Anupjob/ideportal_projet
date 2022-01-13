import os
import subprocess
from datetime import datetime, date
import sys
from fastapi import FastAPI, Body, Depends
from pydantic import BaseModel, Field
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

def getIncomingData(dateRec, dateProcessed, docStatus, docType):
    print("getIncomingData", docStatus)
    db_mongo = getConn()
    files_incoming_c = db_mongo.files_incoming

    files_incoming_p = files_incoming_c.find({"status": docStatus})
    # files_incoming_p = files_incoming_c.find({"status": docStatus}, {'_id': 0})

    return files_incoming_p

@app.get("/")
async def root():
    return {"message": "Welcome to IDE Portal"}


@app.post("/user/login")
# async def user_login(user: UserLogin = Body(..., embed=True)):
async def user_login(user: UserLogin = Body(...)):

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
            for user_s in users_p:
                userfound = True
                print(user_s)
            if (userfound):
                otp = randint(100000, 999999)
                createOTPRecord(user.email, otp)
                # return {"validate": "OTP Created, login with OTP"}
                return {"result": "OTP Created, login with OTP", "err": None}
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
