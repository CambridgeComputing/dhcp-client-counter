FROM node:19
ENV TZ="America/Chicago"
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD [ "node", "app.js" ]