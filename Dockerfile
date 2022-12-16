FROM node:18-alpine
WORKDIR /usr/src/app
COPY services/ ./services
COPY package.json package-lock.json tsconfig.json ./
RUN npm ci
RUN npm run build
EXPOSE 8000
CMD npm start