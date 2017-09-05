FROM ubuntu:14.04

# Install Node.js
RUN apt-get update
RUN apt-get install --yes curl
RUN curl -sL https://deb.nodesource.com/setup_6.x | sudo bash -
RUN apt-get install --yes nodejs
RUN apt-get install --yes build-essential

# Install Git
RUN apt-get install --yes git

RUN mkdir -p /opt/apigee/edge-launchpad
RUN mkdir -p /opt/apigee/deploy

# Copy src files
#   Note .dockerignore
COPY . /opt/apigee/edge-launchpad
COPY ./gulpfile.js /opt/apigee/deploy
COPY ./package.json.docker /opt/apigee/deploy/package.json
RUN cd /opt/apigee/deploy && npm install

# Install gulp cli
RUN npm install -g gulp-cli

WORKDIR /opt/apigee/deploy
