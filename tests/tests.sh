#!/bin/bash

REL_PATH=`dirname $0`
cd ${REL_PATH}
CURRENT_DIR=`pwd`

echo ${CURRENT_DIR}
cd ${CURRENT_DIR}

echo '##################'
echo '# Running tests! #'
echo '##################'

echo '# API'

cd ../api

echo '# Running fixtures'
npm run seed:test

echo '# Running API server in test mode'
pm2 start 'npm run start:test' --name='now-i-am-api-test'

echo '# Running frontend in test mode'
cd ../front
pm2 start 'npm run start:test' --name='now-i-am-front-test'

while ! nc -z localhost 4210; do
  sleep 0.1
done

#echo '# Running tests'
#cd ../tests
#echo "$@"
#npx codeceptjs run --steps "$@"
#EXIT_CODE=$?

echo '# Killing test processes'
pm2 kill

exit ${EXIT_CODE}
