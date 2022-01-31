FROM keymetrics/pm2:latest-stretch

# Bundle APP files
COPY . src/
WORKDIR src

# Install app dependencies
ENV NPM_CONFIG_LOGLEVEL warn
ENV NUXT_HOST 0.0.0.0
RUN npm install

# Expose the listening port of your app
EXPOSE 3000

# Show current folder structure in logs
CMD pm2-runtime start ecosystem.config.js
