FROM node:fermium

WORKDIR /app

COPY . /app/ 

RUN yarn
