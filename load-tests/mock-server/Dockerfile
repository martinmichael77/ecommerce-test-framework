FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY load-tests/mock-server ./load-tests/mock-server

EXPOSE 4000

CMD ["node", "load-tests/mock-server/server.js"]