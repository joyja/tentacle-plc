module.exports = {
  apps: [
    {
      name: 'tentacle',
      script: './scripts/start.js',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
}
