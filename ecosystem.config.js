module.exports = {
  apps : [{
    name: `Milrato`,
    max_memory_restart: `4G`,
    script: 'index.js',
    cron_restart: "0 0 * * SUN"
  }]
};
