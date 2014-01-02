#!/usr/bin/env python

import os
import datetime, time
import uuid, json, zipfile
import tornado, tornado.ioloop, tornado.web

import config, userapp

class ServiceError(Exception):
    """
    API service error.
    """
    def __init__(self, error_code, message):
        Exception.__init__(self, message)
        self.error_code = error_code

class FileUploadHandler(tornado.web.RequestHandler):
    def post(self):
        """Upload a new file."""
        result = None

        try:
            user_id = self._get_user_id()

            filename = str(uuid.uuid4()) + '.zip'
            user_upload_dir_path = config.UPLOAD_DIR_PATH + "/" + user_id

            if not os.path.exists(user_upload_dir_path):
                os.makedirs(user_upload_dir_path)

            if 'uploadedFile' in self.request.files:
                files = self.request.files["uploadedFile"]

                # Don't pack a single file if it's already been packed.
                if len(files) == 1 and os.path.splitext(files[0]["filename"])[1] == '.zip':
                    file = open(user_upload_dir_path + '/' + filename, 'w')
                    file.write(files[0]["body"])
                    file.close()
                else:
                    zip_file = zipfile.ZipFile(user_upload_dir_path + '/' + filename, 'w')

                    for uploaded_file in files:
                        zip_file.writestr(uploaded_file['filename'], uploaded_file['body'])

                    zip_file.close()

                result = {'file_url': config.ABSOLUTE_UPLOAD_PATH + "/" + user_id + "/" + filename}
            else:
                raise ServiceError('INVALID_UPLOAD_DATA', 'Missing or invalid upload data.')
        except (ServiceError, userapp.UserAppServiceException) as e:
            result = {'error_code':e.error_code, 'message':e.message}

        self.finish(result)

    def get(self):
        """Get files for the current user."""
        result = []

        try:
            user_id = self._get_user_id()
            user_upload_dir_path = config.UPLOAD_DIR_PATH + "/" + user_id

            if os.path.exists(user_upload_dir_path):
                for filename in os.listdir(user_upload_dir_path):
                    if os.path.isfile(os.path.join(user_upload_dir_path, filename)):
                        result.append({
                            'file_url':config.ABSOLUTE_UPLOAD_PATH + "/" + user_id + "/" + filename,
                            'created_at': int(os.path.getmtime(user_upload_dir_path + "/" + filename))
                        })
        except (ServiceError, userapp.UserAppServiceException) as e:
            result = {'error_code':e.error_code, 'message':e.message}

        self.finish(json.dumps(result))

    def _get_user_id(self):
        """Resolve the user id from an authenticated user."""
        if 'ua_session_token' in self.cookies:
            # A good idea would be to add caching here so we don't need to hit the UserApp API every time
            api = userapp.API(app_id=config.APP_ID, token=self.get_cookie('ua_session_token'))
            return api.user.get(fields=['user_id'])[0].user_id
        else:
            raise ServiceError('USER_NOT_AUTHORIZED', 'User not authorized. Please log in.')

def cleanup_upload_files():
    """Delete uploaded files older than 24 hours. Runs every 30 minutes."""
    wait_seconds = 60*30 # 30 minutes
    ioloop_instance = tornado.ioloop.IOLoop.instance()

    for dirpath, dirnames, filenames in os.walk(config.UPLOAD_DIR_PATH):
        for filename in filenames:
            filepath = os.path.join(dirpath, filename)
            file_modified = datetime.datetime.fromtimestamp(os.path.getmtime(filepath))

            if datetime.datetime.now()-file_modified > datetime.timedelta(hours=24):
                os.remove(filepath)

    ioloop_instance.add_timeout(time.time()+wait_seconds, cleanup_upload_files)

application = tornado.web.Application([
    (r"/files/", FileUploadHandler),
    (r"/files/(.*)", tornado.web.StaticFileHandler, {'path': config.UPLOAD_DIR_PATH}),
    (r"/", tornado.web.RedirectHandler, {'url': '/index.html'}),
    (r"/(.*)", tornado.web.StaticFileHandler, {'path': config.PUBLIC_WWW_DIR_PATH})
], debug=True)

if __name__ == "__main__":
    cleanup_upload_files()
    
    application.listen(config.SERVER_HOST_PORT)
    print("* Server running on port " + str(config.SERVER_HOST_PORT))

    tornado.ioloop.IOLoop.instance().start()