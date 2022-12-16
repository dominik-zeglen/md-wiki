FROM node:18-alpine
WORKDIR /usr/src/app
COPY package.json ./
COPY .babelrc ./
RUN npm install
COPY ./src ./src
RUN npm run build
EXPOSE 8000
CMD npm run start-production