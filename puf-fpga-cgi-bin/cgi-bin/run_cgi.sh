#!/bin/bash

PORT=8080
CGI_BIN_PARENT_PATH=/home/root/projects/

#busybox httpd -p [port number] -f -v -h [path to the parent directory of `cgi-bin` directory]
#busybox httpd -p 0.0.0.0:$PORT -f -v -h $CGI_BIN_PARENT_PATH

busybox httpd -p 0.0.0.0:$PORT -h $CGI_BIN_PARENT_PATH
