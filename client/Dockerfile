
# base image
# alpine : 보통 최소화된 이미지.. base image생성할 때 단순히 build 만 해주기 때문에 사용..
FROM node:12.2.0-alpine as client
# set working directory 
WORKDIR /app 
# install and cache app dependencies 
# package-lock.json 이 있을 수 있기 때문에 이거랑 package.json둘다 복사해준다.
COPY package*.json /app/
RUN yarn
#Copy everything
# 로컬에 현재 디렉토리 아래에 있는 모든것을 work directory 인 /app 에 다가 모두 복사한다.
COPY . .
#build the application
RUN yarn build

#build nginx server
FROM nginx:latest
EXPOSE 80
# Copy all the contents from the build directory into the web root
COPY --from=client /app/build/ /var/www/html
COPY ./default.conf /etc/nginx/conf.d
# start app
# CMD ["npm", "start"]
CMD [ "nginx", "-g", "daemon off;" ]