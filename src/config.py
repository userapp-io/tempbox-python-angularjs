import os

# Your UserApp AppId
# https://help.userapp.io/customer/portal/articles/1322336-how-do-i-find-my-app-id-
APP_ID = 'YOUR_APP_ID'

# Which port to host the server on
SERVER_HOST_PORT = 31415

# Absolute path to where files are uploaded
ABSOLUTE_UPLOAD_PATH = "http://localhost:"+str(SERVER_HOST_PORT)+"/files"

# Server paths
BASE_FILE_PATH = os.path.dirname(os.path.abspath(__file__))
PUBLIC_WWW_DIR_PATH = BASE_FILE_PATH + "/public_www"
UPLOAD_DIR_PATH = BASE_FILE_PATH + "/files"