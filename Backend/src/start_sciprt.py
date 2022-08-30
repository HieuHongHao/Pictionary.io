import os

if __name__ == "__main__":
    os.system("gunicorn --worker-class eventlet -w 1 main:app --reload")
    
    