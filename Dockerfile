FROM --platform=linux/amd64 node:17-alpine 

WORKDIR  /app

COPY package.json .


RUN npm install 

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]

