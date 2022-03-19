FROM keymetrics/pm2:16-buster

# Bundle APP files
COPY src tentacle/src
COPY package.json tentacle/
COPY ecosystem.config.js tentacle/
WORKDIR /tentacle

# Install app dependencies
ENV NPM_CONFIG_LOGLEVEL warn
RUN npm install --production

# Expose the listening port of your app
EXPOSE 4000

# Show current folder structure in logs
CMD [ "pm2-runtime", "start", "ecosystem.config.js" ]
