FROM node:17-alpine 

WORKDIR  /app

COPY package.json .

RUN apk --no-cache add --virtual .builds-deps build-base python3

RUN npm install 

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]

