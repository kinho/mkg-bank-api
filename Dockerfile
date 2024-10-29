########################
# BUILD FOR PRODUCTION
########################

FROM node:20-alpine AS production

ENV NODE_ENV production

USER node
WORKDIR /home/node

COPY package*.json ./

RUN npm ci --force -s

COPY . .

CMD ["npm", "run", "start"]

########################
# BUILD FOR DEVELOPMENT
########################

FROM node:20-alpine AS development

ENV NODE_ENV development

USER node
WORKDIR /home/node

COPY package*.json ./

RUN npm ci --force -s

COPY . .

CMD ["npm", "run", "start:dev"]