FROM node:14 as builder

WORKDIR /code

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

ARG VITE_COGNITO_USER_POOL_ID
ARG VITE_COGNITO_CLIENT_ID
ARG VITE_FAKE_AUTH_MODE

RUN npm run build

FROM nginx:1.21

COPY --from=builder /code/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /code/dist /usr/share/nginx/html
