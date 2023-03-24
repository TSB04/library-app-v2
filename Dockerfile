FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/back
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
RUN npm install mongoose-unique-validator --save
COPY . .
EXPOSE 4898
RUN chown -R node /usr/src/back
USER node
CMD ["node", "server.js"]