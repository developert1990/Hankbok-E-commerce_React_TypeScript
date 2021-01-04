FROM node:latest
WORKDIR /app
COPY /package.json ./
# /app/package.json 존재
COPY /tsconfig.json ./
# /app/tsconfig.json 추가
RUN npm install
# /app/node_modules 설치 된다 여기서도 bcrypt 가 linux환경에서 설치되므로 거기에 맞는 버전이 설치가 된다.
# RUN npm install tsc -g
COPY . ./
# 나머지 모든 디렉토리 복사
RUN npm run show-version
# npm test, npm start, npm restart, npm stop 얘들만 run 없이 가능하고 나머지 script는 모두 run xxx 로 명령어를 실행해야한다.
RUN npm run build
EXPOSE 9002
CMD [ "node", "./build/index.js" ]