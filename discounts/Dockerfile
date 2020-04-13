FROM phusion/baseimage:0.9.19

RUN apt-get update &&\
    apt-get install -y npm &&\
    npm install -g n

ARG NODE_ENV=production
ARG NODE_VERSION=latest
ARG PROJECT_PATH=/opt/app/
ARG YARN=false

ENV YARN=$YARN
ENV PROJECT_PATH=$PROJECT_PATH
ENV NODE_ENV=$NODE_ENV

RUN if [ ! $(getent group onehelp) ]; then \
    groupadd -r onehelp &&\
    useradd -r -g onehelp onehelp \
;fi

RUN mkdir -p /home/onehelp &&\
    chmod 777 /home/onehelp -R

# Install the specified NODE_VERSION or grab latest
RUN n "$NODE_VERSION"

# Install Yarn

RUN if [ ${YARN} = true ]; then \
    npm install -g yarn \
;fi

COPY run.sh /usr/bin/run-app

RUN chmod 700 /usr/bin/run-app

WORKDIR /opt/app
