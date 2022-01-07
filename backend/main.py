import uvicorn
from utils.logging import logger

if __name__ == "__main__":
    uvicorn.run("server.api:app", host="0.0.0.0", port=8081, reload=True, log_config=logger)
