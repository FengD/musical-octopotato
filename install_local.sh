#!/bin/bash
echo "this script should be executed in root mode"
echo "you should have npm installed"

# getting parent path
parent_path=$( cd "$(dirname "${BASH_SOURCE}")" ; pwd -P )
cd "$parent_path"

# installing backend
echo "installing users service..."
cd backend/users
npm install
echo "installing mixes service..."
cd ../mixes
npm install
echo "installing mp3-files service..."
cd ../mp3-files
npm install

# installing frontend
echo "installing frontend..."
cd ../../clientAngular
bower install
npm install

# installing tools
echo "installing forever..."
npm install -g forever
echo "installing grunt..."
npm install -g grunt
