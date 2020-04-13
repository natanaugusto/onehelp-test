#!/bin/bash

SCRIPT="$1"

if [[ ${PROJECT_PATH:0:1} = "/" ]]; then
    export PROJECT_PATH=$PROJECT_PATH
else
    export PROJECT_PATH="/opt/app/"$PROJECT_PATH
fi

cd $PROJECT_PATH

chown -R www-data:www-data /opt/app

if [[ $YARN = true ]]; then
    su -c "cd $PROJECT_PATH; yarn" -s /bin/bash www-data
else
    su -c "cd $PROJECT_PATH; npm i --force" -s /bin/bash www-data
fi

su -c "cd $PROJECT_PATH; npm run build" -s /bin/bash www-data


su -c "cd $PROJECT_PATH; $SCRIPT" -s /bin/bash www-data
