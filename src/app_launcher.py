import uvicorn
from server import app

def run():
    uvicorn.run(app, host="127.0.0.1", port=8001)

if __name__ == "__main__":
    run() 