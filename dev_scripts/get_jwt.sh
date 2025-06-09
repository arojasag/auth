#!/bin/bash

if [ $# -ne 3 ]; then
    echo "Error: expected three arguments: endpoint, email, password"
    exit 1
fi

ENDPOINT=$1
EMAIL=$2
PASSWORD=$3

data="{\"email\": \"$EMAIL\", \"password\": \"$PASSWORD\"}"
response=$(curl -X "POST" "$ENDPOINT" -i -s -d "$data" -H "Content-Type: application/json")
status=$?
if [ $status -ne 0 ]; then
    echo "Error when calling the curl command"
    echo "Error: $response"
    exit 1
else
    # The first line of the full curl response has the HTTP protocol version, the status code and its meaning
    # The three are separated by white spaces. We pick the second field of that
    status_code=$(echo "$response" | head -n 1 | awk '{print $2}')
    if [[ $status_code -eq 200  ||  $status_code -eq 201 ]]; then
        jwt=$(echo "$response" | tail -n 1 | jq '.data.jwt')
        status=$?
        if [ $status -ne 0 ]; then
            echo "Error when retrieving the JWT"
            # This should print the error that the command threw
            echo "$jwt"
            exit 1
        else 
            echo "$jwt"
            exit 0
        fi
    elif [ $status_code -eq 401 ]; then
        echo "Wrong credentials"
        exit 1
    else
        response_body=$(echo "$response" | tail -n 1)
        echo "Something went wrong during the request"
        echo "Status code: $status_code"
        echo "Response body: $response_body"
        exit 1
    fi
fi