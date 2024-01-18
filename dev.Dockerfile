FROM node:lts
LABEL authors="Khanh Tran"

WORKDIR /var/application
COPY ./ /var/application
RUN npm install
