FROM node:14

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package.json ./
COPY yarn.lock ./

RUN yarn

# Bundle app source
COPY . .
RUN yarn build

ENV NODE_ENV production

ENV DATABASE_URL=${DATABASE_URL}

ENV PORT=${PORT}

ENV SECRET_JWT=${SECRET_JWT}

ENV PASSWORD=${PASSWORD}

EXPOSE 4000
CMD [ "node", "dist/index.js" ]
USER node
