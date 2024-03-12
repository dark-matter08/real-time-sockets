FROM node:21-alpine3.18

RUN apk update && apk add --no-cache curl file && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./

RUN yarn install

COPY . .


RUN npm run test && npm run build

EXPOSE 8000

CMD ["npm", "run", "start"]