#!/usr/bin/env bash

# List of required environment variables
required_vars=(
  "REDIS_CONNECTION_STRING"
  "JWT_SECRET"
  "USER_TOKEN_EXPIRATION_TIME"
  "DATABASE_URL"
)

# Collect missing vars
missing_vars_list=()

# Check which are already set
for var in "${required_vars[@]}"; do
    if [[ -z "${!var}" ]]; then
        missing_vars_list+=("$var")
    fi
done

# Try to load missing vars from .env if it exists
if [[ ${#missing_vars_list[@]} -gt 0 && -f ".env" ]]; then
    >&2 echo -e "WARN: ${#missing_vars_list[@]} variables are missing.\nTrying to load from .env ..."

    # HACK: Source .env file if it exists
    set -o allexport
    source .env
    set +o allexport

    # Re-check missing vars
    STILL_MISSING=()
    for var in "${missing_vars_list[@]}"; do
        if [[ -z "${!var}" ]]; then
            STILL_MISSING+=("$var")
        fi
    done
    missing_vars_list=("${STILL_MISSING[@]}")
fi

# Exit if any are still missing
if [[ ${#missing_vars_list[@]} -gt 0 ]]; then
    >&2 echo "Error: ${#missing_vars_list[@]} required environment variables are missing:"
    for var in "${missing_vars_list[@]}"; do
        >&2 echo -e "\t- $var"
    done
    exit 1
fi

echo "All required environment variables are set."

# Start the app
exec "$@"
