########################
# BUILD FOR PRODUCTION
########################

FROM node:20-alpine AS production

ENV NODE_ENV production

USER node
WORKDIR /home/node

COPY --chown=node:node package*.json ./

RUN npm ci --force -s --only=production
RUN npm prune --omit=dev --force

CMD ["npm", "run", "start"]

########################
# BUILD FOR DEVELOPMENT
########################

FROM node:20-alpine AS development

ENV NODE_ENV development

USER node
WORKDIR /home/node

COPY --chown=node:node package*.json ./
COPY --chown=node:node . .

RUN npm i --force -s

CMD ["npm", "run", "start:dev"]