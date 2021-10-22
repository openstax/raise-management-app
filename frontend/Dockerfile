FROM node:14 as builder

WORKDIR /code

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

RUN npm run build

FROM nginx:1.21

COPY --from=builder /code/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /code/dist /usr/share/nginx/html
