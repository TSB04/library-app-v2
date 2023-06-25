FROM node:16-alpine
ENV NODE_ENV=production
WORKDIR /front
COPY package*.json ./
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 3000
CMD ["yarn", "start"]