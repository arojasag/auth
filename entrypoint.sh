#!/usr/bin/env bash

# HACK: Source .env file if it exists
if [ -f .env ]; then
  >&2 echo "Loading environtment from existing .env file"
  set -o allexport
  source .env
  set +o allexport
fi

required_vars=(
  "REDIS_CONNECTION_STRING"
  "JWT_SECRET"
  "USER_TOKEN_EXPIRATION_TIME"
  "DATABASE_URL"
)

missing_vars=0
missing_vars_list=()

for var in "${required_vars[@]}"; do
  if [[ -z "${!var}" ]]; then
    missing_vars_list+=("$var")
    ((missing_vars++))
  fi
done

if [[ $missing_vars -gt 0 ]]; then
  >&2 echo "The following $missing_vars environment variables are missing:"
  >&2 printf '%s\n' "${missing_vars_list[@]}"
  exit 1
fi

echo "All required environment variables are set"
exit 0
