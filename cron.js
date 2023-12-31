const CronJob = require("cron").CronJob;
const axios = require("axios");
require("dotenv").config();

const LOCAL_DOMAIN = process.env.LOCAL_DOMAIN;

const job = new CronJob({
  cronTime: "0 5,10,15,20,25,30,35,40,45,50,55,0 * * * *",
  onTick: async function () {
    try {
      const response1 = await axios.patch(
        `${LOCAL_DOMAIN}editor/checkScheduleEditors`
      );
      const response2 = await axios.delete(`${LOCAL_DOMAIN}editor/cleanupIps`);
      let now = new Date();
      console.log(`${now}${response1.data.message}`);
      console.log(`${now}${response2.data.message}`);
      // this.stop();
    } catch (error) {
      console.error(error);
    }
  },
  onComplete: null,
  start: true,
  timezone: "Asia/Taipei",
});
const job2 = new CronJob({
  cronTime: "0 0 0 1 * *",
  onTick: async function () {
    try {
      const response = await axios.delete(
        `${LOCAL_DOMAIN}logs/archive-and-delete-logs`
      );
      await axios.delete(`${LOCAL_DOMAIN}tempEditor`);
      let now = new Date();
      console.log(`${now}${response.data.message}`);
    } catch (error) {
      console.error(error);
    }
  },
  onComplete: null,
  start: true,
  timezone: "Asia/Taipei",
});

// Use this if the 4th param is default value(false)
job.start();
job2.start();
