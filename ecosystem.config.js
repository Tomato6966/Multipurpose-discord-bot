module.exports = {
  apps : [{
    name: `Milrato`,
    max_memory_restart: `5G`,
    script: 'index.js',
//    max_restarts: 5,
    cron_restart: "0 1 * * *"
  }]
};
