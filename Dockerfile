FROM node:14.15.3 AS builder
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build

FROM nginx:stable-alpine AS release
ARG BOT_PHRASES_URL=""
COPY --from=builder /app/public /usr/share/nginx/html
RUN test -n "$BOT_PHRASES_URL" && curl -o /app/public/botPhrases.js "$BOT_PHRASES_URL"
