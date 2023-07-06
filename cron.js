const CronJob = require("cron").CronJob;
const axios = require("axios");
require("dotenv").config();

const LOCAL_DOMAIN = process.env.LOCAL_DOMAIN;

new CronJob({
  cronTime: "* * 0 * * *",
  onTick: async function () {
    try {
      const response = await axios.delete(`${LOCAL_DOMAIN}tempEditor`);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  },
  onComplete: null,
  start: false,
  timezone: "Asia/Taipei",
});
// Use this if the 4th param is default value(false)
// job.start();
