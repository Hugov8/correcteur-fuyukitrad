FROM node:26.12.1-alpine

ENV NODE_ENV production
WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "deploy" ]

