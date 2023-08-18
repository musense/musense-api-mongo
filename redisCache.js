// redisCache.js
const redis = require("redis");
const client = redis.createClient(); // 這裡可以傳入自定義的連接參數

client.on("error", (error) => {
  console.error(error);
});

const setCache = (key, value) => {
  client.setex(key, 1800, JSON.stringify(value)); // 30 minutes
};

const getCache = (key, callback) => {
  client.get(key, (err, result) => {
    if (err) throw err;
    callback(result ? JSON.parse(result) : null);
  });
};

const clearCache = (key) => {
  client.del(key);
};

const updateCache = (key, value) => {
  client.setex(key, 1800, JSON.stringify(value)); // Update value with 30 minutes expiration
};

module.exports = {
  setCache,
  getCache,
  clearCache,
  updateCache,
};
