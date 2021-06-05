FROM node:stretch-slim

# Create app directory
WORKDIR /app

# Install app dependencies
COPY app/package*.json /app/

RUN npm install

# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . /app

EXPOSE 3000
CMD [ "node", "app/server.js" ]