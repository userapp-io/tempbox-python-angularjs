Tempbox / Python
================================

Tempoary file storage demo app powered by UserApp, Python (Tornado) and AngularJS.

### Launching the demo app

  1) Download and unzip the code
  
    $ wget -qO- -O ua-tmp.zip https://github.com/userapp-io/tempbox-python-angularjs/archive/master.zip && unzip ua-tmp.zip && rm ua-tmp.zip
  
  2) Update the configuration with your app ID
  
    $ cd tempbox-python-angularjs-master/
    $ vim config.py
    
*Edit the line where it says `APP_ID = 'YOUR_APP_ID'` with your app id ([locate it](https://help.userapp.io/customer/portal/articles/1322336-how-do-i-find-my-app-id-)).*

  3) Run the server
  
    $ chmod +x server.py
    $ ./server.py
    
  4) Visit the address mentioned in the console

*If you haven't changed the port it should be running on [http://localhost:31415/](http://localhost:31415/)*

### License

MIT
