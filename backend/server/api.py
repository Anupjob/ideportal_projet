import os
import subprocess
from datetime import datetime, date
import sys
from fastapi import FastAPI, Body, Depends

from server.model import PostSchema, UserLoginSchema
from server.auth.auth_bearer import JWTBearer
from server.auth.auth_handler import signJWT
from fastapi_utils.tasks import repeat_every
from glyder import glogger, connection

app = FastAPI()
logger = glogger.get_glogger("server")


@app.post("/user/login", tags=["user"])
async def user_login(user: UserLoginSchema = Body(...)):
    if user.password == os.getenv('API-Key'):
        logger.info(f"login successful on {datetime.now()}")
        return signJWT()
    return {
        "error": "Wrong login details!"
    }


@app.get("/provider/{id}", dependencies=[Depends(JWTBearer())], tags=["posts"])
async def add_post(id: int) -> dict:
    return {
        "data": "post added."
    }


@app.on_event("startup")
@repeat_every(seconds=3600 * 24, logger=logger, wait_first=True)
def periodic():
    logger.info(f"started the process at {date.today()}")
    con = connection.Connect()
    collection = con.db['processors']
    proc = subprocess.run('which python', stdout=subprocess.PIPE)
    line = proc.stdout.decode("utf-8")
    python = line.rstrip()
    for processor in collection.find():
        try:
            processor_path = os.path.join('processors', 'scripts', processor['processor'])
            process = subprocess.Popen(f"{python} {processor_path} --target_folder{processor['folder']}"
                                       f" --target_collection{processor['collection']}",
                                       stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            out, err = process.communicate()
            return_code = process.poll()
            out = out.decode(sys.stdin.encoding)
            err = err.decode(sys.stdin.encoding)
            logger.into(f"processed {processor['folder']} with output of {out}")
            logger.error(f"Processed failed for {processor['folder']} with {err}")
        except Exception as e:
            logger.error(f"Error processing {processor['processor']} due to {e}")

    pass
