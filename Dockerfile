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

ARG DB_HOST=${DB_HOST}
ENV DB_HOST=${DB_HOST}

ARG DB_PORT=${DB_PORT}
ENV DB_PORT=${DB_PORT}

ARG DB_NAME=${DB_NAME}
ENV DB_NAME=${DB_NAME}

ARG DB_USER=${DB_USER}
ENV DB_USER=${DB_USER}

ARG DB_PASSWORD=${DB_PASSWORD}
ENV DB_PASSWORD=${DB_PASSWORD}

ARG PORT=${PORT}
ENV PORT=${PORT}

ARG SECRET_JWT=${SECRET_JWT}
ENV SECRET_JWT=${SECRET_JWT}

ARG PASSWORD=${PASSWORD}
ENV PASSWORD=${PASSWORD}

EXPOSE 4000
CMD [ "node", "dist/index.js" ]
USER node
