#!/bin/bash

if [ $# -ne 2 ]; then
    echo "Error: expected two arguments: email and password"
    exit 1
fi

EMAIL=$1
PASSWORD=$2

endpoint="localhost:5000/login"
response=$(./get_jwt.sh "$endpoint" "$EMAIL" "$PASSWORD")
status=$?
if [ $status -ne 0 ]; then
    echo "Error when calling the get_jwt command"
    echo "" # Leave some space to make the output prettier and easier to read
    echo "Command response: $response"
    exit 1
else
    echo "Successfully logged in"
    echo "Your jwt is $response"
    exit 0
fi