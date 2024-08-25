### STAGE 1: Build ###
FROM node:16.13.0 AS build

WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build --prod

RUN echo $(ls -1 /usr/src/app/dist/smart-factory-sandbox-ui/assets)

### STAGE 2: Run ###
FROM nginx:latest
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/src/app/dist/smart-factory-sandbox-ui /usr/share/nginx/html
EXPOSE 80 443

CMD ["/bin/sh", "-c", "envsubst < /usr/share/nginx/html/assets/env.template.js > /usr/share/nginx/html/assets/env.js && exec nginx -g 'daemon off;'"]

# ENTRYPOINT [ "nginx","-g","daemon off;" ]