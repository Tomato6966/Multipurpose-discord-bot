module.exports = {
  apps : [{
    name: `Cepheid`,
    max_memory_restart: `5G`,
    script: 'index.js',
    cron_restart: "0 0 * * SUN"
  }]
};
