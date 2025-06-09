#!/bin/bash

if [ $# -ne 1 ]; then
    echo "Error: expected one argument: the jwt"
    exit 1
fi

jwt=$1
endpoint="localhost:5000/auth/me"
response=$(curl "$endpoint" -i -s -H "Authorization: Bearer $jwt")
status=$?
if [ $status -ne 0 ]; then
    echo "Error when calling the curl command"
    exit 1
else
    status_code=$(echo "$response" | head -n 1 | awk '{print $2}')
    response_body=$(echo "$response" | tail -n 1)
    if [ $status_code -eq 401 ]; then
        echo "Your jwt seems to be invalid"
        exit 1
    elif [ $status_code -eq 200 ]; then
        data=$(echo "$response_body" | jq '.data')
        echo "Successfully got this answer from the server:"
        echo "$data"
        exit 0
    else
        echo "Something went wrong during the request"
        echo "Status code: $status_code"
        echo "Response body: $response_body"
        exit 1
    fi
fi