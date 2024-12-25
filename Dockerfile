FROM node:latest

RUN mkdir node
COPY . ./home/app
WORKDIR ./home/app

RUN npm install

EXPOSE 8080

CMD [ "npm", "start" ]