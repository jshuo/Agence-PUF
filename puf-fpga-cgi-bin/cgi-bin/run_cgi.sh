#!/bin/bash
########################################################################################
#
#  Copyright (c) 2022-2023 PUFsecurity and/or its affiliates. All Rights Reserved.
#
#######################################################################################

#######################################################################################
#
# File: run_cgi.sh
#
#       bash script to start busybox httpd
#
# History:
#
# 2022/11/08  v1.1.0    First release
# 2023/06/01  v1.2.0    Add flock protection
#
#######################################################################################

PORT=80
CGI_BIN_PARENT_PATH=/home/root/projects/

#busybox httpd -p [port number] -f -v -h [path to the parent directory of `cgi-bin` directory]
#busybox httpd -p 0.0.0.0:$PORT -f -v -h $CGI_BIN_PARENT_PATH

busybox httpd -p 0.0.0.0:$PORT -h $CGI_BIN_PARENT_PATH
