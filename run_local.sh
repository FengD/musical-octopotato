#!/bin/bash
echo "you should have node installed and run the install_local.sh script before"

# getting parent path
parent_path=$( cd "$(dirname "${BASH_SOURCE}")" ; pwd -P )
cd "$parent_path"

# starting backend
echo "starting backend..."
echo "starting users service..."
forever start backend/users/app.js
echo "starting mixes service..."
forever start backend/mixes/app.js
echo "starting mp3-files service..."
forever start backend/mp3-files/serverFileUpload.js

# starting frontend
#echo "starting frontend..."
#cd clientAngular
#grunt serve

echo "startup complete"
