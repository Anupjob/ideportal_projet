import os
import subprocess
from datetime import datetime, date
import sys
from fastapi import FastAPI, Body, Depends, UploadFile, Form, File
from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List

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
# from typing import List
from bson.objectid import ObjectId
from azure.storage.blob import BlobServiceClient
import pandas as pd
from io import BytesIO, StringIO
import base64
import json
import re

folderFileProcessing = "fileprocessing/"
container = "incomingfiles"
connect_str_use = 'DefaultEndpointsProtocol=https;AccountName=idedata;AccountKey=7o/tRVR7exoh8XqFc2q/IRwm+YEo7/uxV3q1GjWeEYcfDbV56FC8xkp5xzLaO/rUnkI3JfnA1XFyq5dmDbJjXA==;EndpointSuffix=core.windows.net'

def getConn():
    conn = 'mongodb://ide21qadguser_qa:shSgSAd63SDsgh67S@18.232.50.247:27021/ide_database_qa?authMechanism=SCRAM-SHA-256&authSource=ide_database_qa'
    # conn = 'mongodb://ide21qadguser:shSgSAd63SDsgh67S@18.232.50.247:27021/ide_database?authMechanism=SCRAM-SHA-256&authSource=ide_database'
    client_mongo = pymongo.MongoClient(conn)
    # db_mongo = client_mongo.ide_database_qa
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
    companyId: str

class FinalData(BaseModel):
    fileName: Optional[str] = None
    processorContainerPath: Optional[str] = None

class EmailSchema(BaseModel):
   email: List[EmailStr]

class IssueSchema(BaseModel):
   errMsg: str
   doc_id: str
   user_id: str
   company_id: str

class PdfDataSchema(BaseModel):
   fileName: str
   containerPath: str
   fileType: str
   pageNum: int

class GoogleVisionSchema(BaseModel):
   docId: str
   resType: str
   pageNum: int

class ProcessorDataSchema(BaseModel):
   companyId: str

class UserDataSchema(BaseModel):
   companyId: str

class CompanySchema(BaseModel):
   companyName: str
   street1: str
   street2: Optional[str] = None
   city: str
   state: str
   zip: str
   contact: str

class AddProcessorSchema(BaseModel):
   company_id: str
   group: str
   name: str
   folder: str
   processor: str
   collection: str
   googlevision: str
   azure: str
   textract: str
   keywords: List[str]


class AddUserSchema(BaseModel):
   company_id: str
   email: str
   name: str
   image: str

class ReportHistSchema(BaseModel):
   company_id: str
   user_id: str

class UploadFileSchema(BaseModel):
   doc_file: UploadFile
   companyId: str
   userId: str

class ValidateDocSchema(BaseModel):
   doc_id: str
   validated: bool

class DownloadPdfSchema(BaseModel):
   fileName: str
   containerPath: str

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
        # return {"result":base64Str, "err":None}
            return base64Str
        # download_stream = blob_client.download_blob()
        # return download_stream.readall()

    except Exception as e:
        print(f"pdf_blob_azure_buffer Error {complete_file_name} due to {e}")
        # return {"result":None, "err": e}
        return ""
        # print('Error in downloading', complete_file_name, local_path)

def upload_blob_azure_process(fileName, file, folder_name_process):
    print("upload_blob_azure_process", fileName, folder_name_process)
    #     try:
    # container_path = folderFileProcessing + str(folder_name_process) + '/' + str(fileName)
    container_path = str(folder_name_process) + '/' + str(fileName)
    print("container_path", container_path)
    # file_url = local_file_comp
    blob_service_client = blob_connection()
    blob_client_upload = blob_service_client.get_blob_client(container=container, blob=container_path)

    print("blob_client_upload.exists()", blob_client_upload.exists())
    res_msg = ""
    if (blob_client_upload.exists()):
        print("already exists", container_path, container, fileName)
        res_msg = "file already exists"
    else:
        print(container_path, container, fileName)
        try:
            blob_client_upload.upload_blob(file, overwrite=True)
            res_msg = "file uploaded successfully"
        except:
            print(container_path,' doesnot exsist')
            res_msg = "some error"
    return res_msg

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
    # MAIL_PASSWORD='VercX2018$$',
    MAIL_PASSWORD='VercXA2022$$',
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_TLS=True,
    MAIL_SSL=False
)

def getIncomingData(dateRec, dateProcessed, docStatus, docType, companyId):
    print("getIncomingData", dateRec, dateProcessed, docStatus, docType, companyId)
    db_mongo = getConn()
    files_incoming_c = db_mongo.files_incoming

    # print("len(docType)", len(docType))
    # print("str dateRec",str(dateRec))
    query_str = {"companyId": ObjectId(companyId)}
    # date_rec = datetime.datetime.strptime(str(dateRec), "%d %B, %Y")
    # date_proc = datetime.datetime.strptime(str(dateProcessed), "%d %B, %Y")
    # print("date_rec", date_rec)
    #
    # query_str = {"file_date": {"$gte": date_rec}, "file_date": {"$lte": date_proc}}

    if len(docType)>0:
        searchStr = ".*" + docType + ".*"
        # query_str_doctype = {"$or":[{"processorGroup" : {"$regex" : searchStr, "$options":"i"}}, {"processorFolder" : {"$regex" : searchStr, "$options":"i"}}, {"final_filename" : {"$regex" : searchStr, "$options":"i"}}, {"filenameprocessing" : {"$regex" : searchStr, "$options":"i"}}, {"companyName" : {"$regex" : searchStr, "$options":"i"}}]}
        query_str["$or"]=[{"processorGroup" : {"$regex" : searchStr, "$options":"i"}}, {"processorFolder" : {"$regex" : searchStr, "$options":"i"}}, {"final_filename" : {"$regex" : searchStr, "$options":"i"}}, {"filenameprocessing" : {"$regex" : searchStr, "$options":"i"}}, {"companyName" : {"$regex" : searchStr, "$options":"i"}}]
    if docStatus != 'all':
        # query_str_status = {"status": docStatus}
        query_str["status"] = docStatus

    print("query_str",query_str)

    files_incoming_p = files_incoming_c.find(query_str)
    # files_incoming_p = files_incoming_c.find({"status": docStatus}, {'_id': 0})

    return files_incoming_p

async def send_otp_mail(otp, recipient):
    print("send_otp_mail", otp, recipient)

    # html_template = '<html><head><title>OTP</title><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">'
    # html_template += '<p>Dear Valued Customer,</p><br/>'
    # html_template += '<p>Your Password for Secure Login is: ' + otp + '<br /><br/>'
    # html_template += '<div class="row" style="background-color:#dbdada"><div class="col-sm-4"></div> <div class="col-sm-4" style="font-size:16px;padding:10px;">'
    # html_template += '<b>Thank you.<br/><br/></b></div><div class="col-sm-4"></div></div></div></body></html>'

    html_template = f"""
                <html><head><title>OTP</title>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
                    </head>
                    <body>
                        <p style="margin-left:10px">Dear Valued Customer,</p>
                        <p style="margin-left:10px">Your Password for Secure Login is: {otp}</p>
                        <div class="col-sm-4" style="font-size:16px;padding:10px;">
                            <span><b>Important: </b></span> 
                            <p>For any query please send email to <a href="mailto:support@vercx.com">support@vercx.com</a>
                            </p>
                        </div> 
                        <div class="col-sm-4" style="background-color:#dbdada; font-size:16px; padding:10px; margin-left:10px">
                            <b>Thank you.</b><br/>
                        </div>
                        </body>
                    </html>
                """

    message = MessageSchema(
        subject='OTP for secure login on IDE Portal',
        recipients=[recipient],  # List of recipients, as many as you can pass
        html=html_template,
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

def cleanFileName(text):
    # print("cleanFileName", text)
    if (text is None):
        text = "temp"
        text = str(text).replace(" ", "")
    return re.sub('[^\w_.)( -]', '', text)

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

        tokenRes = signJWT()
        print("tokenRes", tokenRes)

        if userres:
            for user_s in userres:
                userfound = True
                print(user_s)
            if (userfound):
                return {"result":tokenRes, "err":None}
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

                if companyData:

                    otp = randint(100000, 999999)
                    createOTPRecord(user.email, otp)
                    await send_otp_mail(str(otp), user.email)

                    is_master = "master" in companyData

                    user_comp_details = {
                        "company":companyData["companyName"],
                        "companyId": str(user_data["companyId"]),
                        "userId": str(user_data["_id"]),
                        "email": user_data["email"],
                        "name": user_data["name"],
                        "master": is_master
                    }

                    return {"result": user_comp_details, "err": None}
                else:
                    return {"result": None, "err": "Company not found in System "}
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

@app.post("/reportIssue", dependencies=[Depends(JWTBearer())])
async def report_issue(incData: IssueSchema = Body(...)):
    print("report_issue", incData)
    errMsg = incData.errMsg
    doc_id = incData.doc_id
    user_id = incData.user_id
    cid = incData.company_id

    db_mongo = getConn()
    files_incoming_c = db_mongo.files_incoming
    report_history_c = db_mongo.report_history
    users_c = db_mongo.users

    result = files_incoming_c.update_one({"_id": ObjectId(doc_id)}, {"$set": {"errMsg": errMsg, "status":"Error"}})

    files_incoming_p = files_incoming_c.find_one({"_id": ObjectId(doc_id)})
    print("reportIssue files_incoming_p",files_incoming_p)

    if files_incoming_p:
        # uid = files_incoming_p["userId"]

        # uid = user_id

        # users_p = users_c.find_one({"_id": ObjectId(files_incoming_p["userId"])})
        users_p = users_c.find_one({"_id": ObjectId(user_id)})
        # cid = files_incoming_p["companyId"]
        # cid = users_p["companyId"]
        # cName = files_incoming_p["companyName"]
        hist_obj = {"userId": ObjectId(user_id), "userEmail": users_p["email"], "companyId": ObjectId(cid), "fileIncomingId": ObjectId(doc_id), "errMsg": errMsg, "insertTime": datetime.datetime.now()}
        print("hist_obj", hist_obj)

        report_history_result = report_history_c.insert_one(hist_obj)
        print("report_history_result", report_history_result)

    print("reportIssue  result", result)
    return {"result": "issue reported successfully", "err": None}

@app.post("/getPdfFile", dependencies=[Depends(JWTBearer())])
async def get_pdf_file(incData: PdfDataSchema = Body(...)):
    fileName = incData.fileName
    containerPath = incData.containerPath
    fileType = incData.fileType
    pageNum = incData.pageNum

    # completeFileName = containerPath+"/"+fileName

    db_mongo = getConn()
    files_incoming_breakup_c = db_mongo.files_incoming_breakup
    files_incoming_c = db_mongo.files_incoming

    files_incoming_breakup_p = files_incoming_breakup_c.find_one({"filenameprocessing": fileName, "pageNo": pageNum})
    files_incoming_p = files_incoming_c.find_one({"filenameprocessing": fileName})
    print("files_incoming_breakup_p",files_incoming_breakup_p)

    if files_incoming_breakup_p :
        file_type_str = "pdf"

        if fileType == "image":
            file_type_str = "img"
        elif fileType == "image_rotated":
            file_type_str = "img_rotated"
        completeFileName = containerPath + "/" + files_incoming_breakup_p[file_type_str]

        base64Str = pdf_blob_azure_buffer(completeFileName)
        print("getPdfFile data", base64Str)
        return {"result": {"base64Str" : base64Str, "noOfPages": files_incoming_p["noOfPages"]}, "err": None}
        # return data
    else:
        return {"result": None, "err": "No file found"}

    # if(data and data["pdfRes"] and len(data["pdfRes"]) > 0):
    #     return {"result": data["pdfRes"], "err": None}
    # else:
    #     return {"result": None, "err": data.err}

@app.post("/getGoogleVisionData", dependencies=[Depends(JWTBearer())])
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

            # dataRet = getDataForPage(jsonFileData, pageNum)
            # fullTextAnnotation_text = dataRet[0]['data']
            #
            # return {"result": fullTextAnnotation_text, "err": None}

            if resType == "googlev" or resType == "googlet":
                dataRet = getDataForPage(jsonFileData, pageNum)
                fullTextAnnotation_text = dataRet[0]['data']

                return {"result": fullTextAnnotation_text, "err": None}

            else:
                print("after loading the files", len(jsonFileData))

                df_final = pd.DataFrame()

                # noOfPages = files_incoming_p["noOfPages"]
                #
                # print("noOfPages", noOfPages)
                #
                # for i in range(noOfPages):

                    # dataRet = getDataForPage(jsonFileData, (i + 1))
                dataRet = getDataForPage(jsonFileData, pageNum)

                # currCont = 0

                data_dict = ""
                for dats in dataRet:

                    table = json.loads(dats['data'])
                    table_count = dats['tableCount']
                    print("***********complete table, ", type(table))

                    rows = table['row_count']
                    columns = table['column_count']
                    print(rows, columns)

                    col_list = list(range(0, columns))
                    indx_list = list(range(0, rows))

                    df_table = pd.DataFrame(index=indx_list, columns=col_list)

                    for cell in table['cells']:
                        # print("cell",cell)
                        row_index = cell['row_index']
                        col_index = cell['column_index']
                        text = cell['text']
                        # text = cell['content']

                        print(row_index,col_index,text)
                        df_table[col_index][row_index] = text

                    df_table.columns = df_table.iloc[0]
                    df_table = df_table.drop([0])
                    df_table = df_table.reindex()

                    s = pd.Series(df_table.columns)
                    s = s.fillna('empty_' + (s.groupby(s.isnull()).cumcount() + 1).astype(str))
                    df_table.columns = s

                    print("df_table.columns::",df_table.columns)

                    # df_table = df_table.drop("index", axis=1)
                    df_table = df_table.fillna("0")
                    # data_dict = df_table.to_dict("list")
                    data_dict = df_table.to_dict(orient='index')

                    final_csv_arr = []
                    for value in data_dict.values():
                        final_csv_arr.append(value)

                    # print(df_table)
                    print("final_csv_arr",final_csv_arr)
                return {"result": final_csv_arr, "err": None}

            # download_stream = blob_client.download_blob()
            # return download_stream.readall()

        except Exception as e:
            print(f"get_google_vision_data Error {complete_file_name} due to {e}")
            return {"result": None, "err": e}

    else:
        return {"result": None, "err": "No file found"}

@app.post("/incomingData", dependencies=[Depends(JWTBearer())])
async def incoming_data(incData: IncomingData = Body(...)):
    dateRec = incData.dateRec
    dateProcessed = incData.dateProcessed
    docStatus = incData.docStatus
    docType = incData.docType
    companyId = incData.companyId
    print("incoming_data", incData)

    incomingDataRes = getIncomingData(dateRec, dateProcessed, docStatus, docType, companyId)

    ids_dict = []
    for ids_s in incomingDataRes:
        noOfPages = 0
        processorGroup = ""
        processorName = ""
        errMsg = ""
        processorContainerPath = ""
        final_filename = ""
        filenameProcessing = ""
        fromEmail = ""
        toEmail = ""
        validatedOn = ""
        # docValidated = False
        # docValidatedStr = "No"
        final_filenames = []

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

        if 'from_email' in ids_s:
            fromEmail = ids_s["from_email"]

        if 'to_mail' in ids_s:
            toEmail = ids_s["to_mail"]

        if 'validatedOn' in ids_s:
            validatedOn = ids_s["validatedOn"]

        if 'final_filenames' in ids_s:
            final_filenames = ids_s["final_filenames"]

        # if 'docValidated' in ids_s:
        #     docValidated = ids_s["docValidated"]

        # if docValidated == True:
        #     docValidatedStr = "Yes"

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
            "final_filenames":final_filenames,
            "pdfFilename": filenameProcessing,
            "errMsg": errMsg,
            "fromEmail":fromEmail,
            "toEmail":toEmail,
            "validatedOn": validatedOn
            # "docValidated": docValidatedStr
        })

    return {"result": ids_dict, "err": None}

@app.post("/finalData", dependencies=[Depends(JWTBearer())])
async def final_data(incData: FinalData = Body(...)):
    print("finalData", incData)
    file_name = incData.fileName
    processorContainerPath = incData.processorContainerPath

    print("final_data", incData)

    finalDataRes = getFinalData(file_name)
    print("finalDataRes", finalDataRes)

    # local_path = "../csv_final_data/"+file_name
    local_path = "csv_final.csv"
    complete_file_name = "fileprocessing" + "/" +processorContainerPath + "/" + file_name
    # complete_file_name = processorContainerPath + "/" + file_name

    # download_blob_azure(local_path, complete_file_name)
    file_buffer = download_blob_azure_buffer(complete_file_name)
    print("file_buffer", file_buffer)

    if file_buffer:
        data = pd.read_csv(BytesIO(file_buffer))
        if "index" in data.columns:
            data = data.drop("index", axis=1)
        data = data.fillna(0)
        # data_dict = data.to_dict("list")
        data_dict = data.to_dict(orient='index')

        final_csv_arr = []
        for value in data_dict.values():
            final_csv_arr.append(value)

        return {"result": final_csv_arr, "err": None}
    else:
        return {"result": None, "err": "file not found"}

@app.post("/getProcessorData", dependencies=[Depends(JWTBearer())])
async def get_processors(incData: ProcessorDataSchema = Body(...)):
    companyId = incData.companyId

    db_mongo = getConn()
    processors_c = db_mongo.processors

    processors_p = processors_c.find({"company_id": ObjectId(companyId)})
    print("processors_p",processors_p)

    if processors_p :

        processor_dict = []
        for processor_dict_s in processors_p:

            azure = ""
            googlevision = ""
            textract = ""
            identify_keywords = ""
            if "google_vision" in processor_dict_s:
                googlevision = processor_dict_s["google_vision"]
            if "azure_form" in processor_dict_s:
                azure = processor_dict_s["azure_form"]
            if "textract" in processor_dict_s:
                textract = processor_dict_s["textract"]
            if "identify_keywords" in processor_dict_s:
                identify_keywords = processor_dict_s["identify_keywords"]

            processor_dict.append(
                {
                    "processor_id": str(processor_dict_s["_id"]),
                    "group": processor_dict_s["group"],
                    "name": processor_dict_s["name"],
                    "folder": processor_dict_s["folder"],
                    "processor": processor_dict_s["processor"],
                    "collection": processor_dict_s["collection"],
                    "google vision": googlevision,
                    "azure": azure,
                    "textract": textract,
                    "identify keywords": identify_keywords
                }
            )

        return {"result": processor_dict, "err": None}
    else:
        return {"result": None, "err": "no records found"}

@app.post("/getReportHistory", dependencies=[Depends(JWTBearer())])
async def get_report_hist(incData: ReportHistSchema = Body(...)):
    print("get_report_hist",incData)
    companyId = incData.company_id
    userId = incData.user_id

    db_mongo = getConn()
    report_history_c = db_mongo.report_history

    report_history_p = report_history_c.find({"companyId": ObjectId(companyId), "userId": ObjectId(userId)})
    print("report_history_p",report_history_p)

    if report_history_p :

        hist_data = []
        for report_history_s in report_history_p:

            userEmail = ""
            if "userEmail" in report_history_s:
                userEmail = report_history_s["userEmail"]

            errMsg = ""
            if "errMsg" in report_history_s:
                errMsg = report_history_s["errMsg"]

            insertTime = ""
            if "insertTime" in report_history_s:
                insertTime = report_history_s["insertTime"]

            hist_data.append(
                {
                    "hist_id": str(report_history_s["_id"]),
                    "User Email": userEmail,
                    # "companyName": report_history_s["companyName"],
                    "Error Message": errMsg,
                    "Insert Time": insertTime
                }
            )
        print("hist_data",hist_data)
        return {"result": hist_data, "err": None}
    else:
        return {"result": None, "err": "no records found"}

@app.post("/addProcessor", dependencies=[Depends(JWTBearer())])
async def add_processor(incData: AddProcessorSchema = Body(...)):
    print("add_processor", incData)

    company_id = incData.company_id
    group = incData.group
    name = incData.name
    folder = incData.folder
    processor = incData.processor
    collection = incData.collection
    googlevision = incData.googlevision
    azure = incData.azure
    textract = incData.textract
    identify_keywords = incData.keywords

    # print("add_processor keywords", identify_keywords)

    db_mongo = getConn()
    processors_c = db_mongo.processors

    processor_ins_result = processors_c.insert_one({"company_id": ObjectId(company_id), "group": group, "name": name, "folder": folder, "processor": processor, "collection": collection, "identify_keywords": identify_keywords, "google_vision": googlevision, "google_vision_response": "all", "azure_form": azure, "azure_document_analyzer": "","textract": textract})

    return {"result": processor_ins_result, "err": None}

@app.get("/getCompaniesData", dependencies=[Depends(JWTBearer())])
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
                    "name": company_dict_s["companyName"],
                    "street1": company_dict_s["street1"],
                    "street2": company_dict_s["street2"],
                    "city": company_dict_s["city"],
                    "state": company_dict_s["state"],
                    "zip": company_dict_s["zip"],
                    "contact": company_dict_s["contact"]
                }
            )

        return {"result": companies_dict, "err": None}
    else:
        return {"result": None, "err": "no records found"}

@app.post("/addCompany", dependencies=[Depends(JWTBearer())])
async def add_company(incData: CompanySchema = Body(...)):
    print("add_company", incData)
    companyName = incData.companyName
    street1 = incData.street1
    street2 = incData.street2
    city = incData.city
    state = incData.state
    zip = incData.zip
    contact = incData.contact

    db_mongo = getConn()
    companies_c = db_mongo.companies

    comp_ins_result = companies_c.insert_one({"companyName": companyName, "street1": street1, "street2": street2, "city": city, "state": state, "zip": zip, "contact": contact})

    return {"result": comp_ins_result, "err": None}

@app.post("/getUsersData", dependencies=[Depends(JWTBearer())])
async def get_users(incData: UserDataSchema = Body(...)):
    print("getUsersData", incData)
    companyId = incData.companyId

    db_mongo = getConn()
    users_c = db_mongo.users

    users_p = users_c.find({"companyId": ObjectId(companyId)})
    print("users_p",users_p)

    if users_p :

        user_dict = []
        for user_dict_s in users_p:
            image = ""

            if 'image' in user_dict_s:
                image = user_dict_s["image"]

            user_dict.append(
                {
                    "user_id": str(user_dict_s["_id"]),
                    "email": user_dict_s["email"],
                    "image": image,
                    "name": user_dict_s["name"]
                }
            )

        return {"result": user_dict, "err": None}
    else:
        return {"result": None, "err": "no records found"}

@app.post("/addUser", dependencies=[Depends(JWTBearer())])
async def add_user(incData: AddUserSchema = Body(...)):
    print("add_user", incData)
    company_id = incData.company_id
    email = incData.email
    name = incData.name
    image = incData.image

    db_mongo = getConn()
    users_c = db_mongo.users

    user_ins_result = users_c.insert_one({"companyId": ObjectId(company_id), "email": email, "name": name})

    return {"result": user_ins_result, "err": None}

@app.post("/uploadFile", dependencies=[Depends(JWTBearer())])
async def add_user(companyId: str = Form(...), companyName: str = Form(...), userId: str = Form(...), email: str = Form(...), fileSize: str = Form(...), doc_file: UploadFile = File(...)):
# async def add_user(doc_file: UploadFile = File(...), incData: UploadFileSchema = Body(...)):

    print("uploadFile userId", userId)
    print("uploadFile companyId", companyId)
    print("uploadFile companyName", companyName)
    print("uploadFile doc_file", doc_file.filename)
    print("uploadFile doc_file size", fileSize)
    print("uploadFile type", doc_file.content_type)

    companyName = "manual"
# if userId is not None and companyId is not None:
    if userId != "null" and companyId != "null" and companyName != "null" and email != "null":
        print("reading data from file")
        content = await doc_file.read()  # async read
        print("after reading data")
        # print("content", content)
        # with BytesIO() as my_blob:
        #     # Download as a stream
        #     # download_stream.readinto(my_blob)
        #     my_blob.write(content)
        #
        #     # needed to reset the buffer, otherwise, panda won't read from the start
        #     my_blob.seek(0)
        # print("my_blob",my_blob)
        cleanFile = cleanFileName(doc_file.filename)
        print("cleanFile", cleanFile)

        file_upload_res = upload_blob_azure_process(cleanFile, content, "manual")
        print("file_upload_res", file_upload_res)
        db_mongo = getConn()
        files_incoming_c = db_mongo.files_incoming
        files_incoming_breakup_c = db_mongo.files_incoming_breakup

        if file_upload_res != "file already exists":

            fileObj = {
                "companyId": ObjectId(companyId),
                "userId": ObjectId(userId),
                "content_type": doc_file.content_type,
                "container_path": container + "/" + cleanFile,
                # "companyName": companyName,
                "original_filename": doc_file.filename,
                "filename": cleanFile,
                # "size": doc_file.size,
                "size": fileSize,
                "container": "idedata",
                "createdOn": datetime.datetime.now(),
                # "created_on": datetime.datetime.now(),
                "file_date": datetime.datetime.now(),
                "uploaded_by": email,
                "status": "Uploaded",
                "processorContainerPath":"fileprocessing/manual",
                "filenameprocessing":cleanFile
            }

            # ins_obj = {"content_type":"application/pdf", "container_path":containe + "/" + cleanFile,
            # "filename": cleanFile, "original_filename": files, "container" : "idedata",
            # "status" : "Uploaded",
            # "uploaded_by": "josiah.babu@digitalglyde.com",
            # "created_on" : datetime.datetime.now(),
            # "file_date": datetime.datetime.now()}

            print("fileObj", fileObj)

            files_incoming_ins_result = files_incoming_c.insert_one(fileObj)
            print("files_incoming_ins_result", files_incoming_ins_result)

            # fileBreakupObj = {
            #     "incoming_id": ObjectId(files_incoming_ins_result.inserted_id),
            #     "filenameprocessing": cleanFile,
            #     "processorContainerPath":"fileprocessing/manual",
            #     "pageNo": 1,
            #     "pdf": cleanFile,
            #     "img": cleanFile,
            #     "img_rotated": cleanFile,
            #     "date_created": datetime.datetime.now()
            # }
            #
            # print("fileBreakupObj", fileBreakupObj)
            # files_incoming_breakup_ins_result = files_incoming_breakup_c.insert_one(fileBreakupObj)
            # print("files_incoming_breakup_ins_result", files_incoming_breakup_ins_result)

        return {"result": file_upload_res, "err": None}
    else:
        return {"result": None, "err": "invalid request"}


@app.post("/validateDoc", dependencies=[Depends(JWTBearer())])
async def validate_doc(incData: ValidateDocSchema = Body(...)):
    print("validateDoc", incData)
    doc_id = incData.doc_id
    validated = incData.validated

    db_mongo = getConn()
    files_incoming_c = db_mongo.files_incoming

    # validatedVal = "false"
    # if validated == True:
    #     validatedVal = "true"
    # doc_validated_result = files_incoming_c.update_one({"_id": ObjectId(doc_id)}, {"$set": {"docValidated": validated}})
    doc_validated_result = files_incoming_c.update_one({"_id": ObjectId(doc_id)}, {"$set": {"status": "Validated", "validatedOn":datetime.datetime.now()}})

    return {"result": doc_validated_result, "err": None}

@app.post("/downloadPdf", dependencies=[Depends(JWTBearer())])
async def download_pdf(incData: DownloadPdfSchema = Body(...)):
    print("downloadPdf", incData)
    fileName = incData.fileName
    containerPath = incData.containerPath

    completeFileName = containerPath + "/" + fileName

    base64Str = pdf_blob_azure_buffer(completeFileName)

    return {"result": base64Str, "err": None}


@app.post("/updateUserPic", dependencies=[Depends(JWTBearer())])
async def update_user_pic(incData: userProfileSchema = Body(...)):
    print("update_user_pic", incData)
    userId = incData.userId
    userPicData = incData.userPicData

    db_mongo = getConn()
    users_c = db_mongo.users

    result = users_c.update_one({"_id": ObjectId(userId)}, {"$set": {"image": userPicData}})
    print("update_one result",result)

    return {"result": "image updated successfully", "err": None}

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
