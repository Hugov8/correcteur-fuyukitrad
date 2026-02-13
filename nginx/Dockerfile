FROM node:current-slim AS builder
ENV NODE_ENV production
WORKDIR /app

COPY ../front/package*.json ./

RUN npm install --omit=dev

COPY ../front .

RUN npm run build

FROM nginx
COPY ./default.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/build /sur/share/nginx/html

ENTRYPOINT ["nginx","-g","daemon off;"]