FROM node:latest
WORKDIR /app
COPY /package.json ./app
COPY /tsconfig.json ./app
RUN npm install
COPY . /app
RUN npm build
EXPOSE 9002
CMD [ "node", "./build/index.js" ]