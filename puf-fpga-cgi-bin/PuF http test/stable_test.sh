#!/bin/bash

# make sure foler path is correct here
cd ~/workspace/agence-cgi-bin/PuF\ http\ test

for ((i=0; i<1000; ))
do
    npx mocha PuF_http.js --exit -t 60000 -R progress
    # sleep 3
done

# for job in `jobs -p`
# do
#   wait $job
# done