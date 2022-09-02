(async function () {
  const keys = require("./keys");
  const redis = require("redis");

  const redisClient = redis.createClient({
    url: `redis://${keys.redisHost}:${keys.redisPort}`,
  });

  const sub = redisClient.duplicate();
  function fib(index) {
    if (index < 2) return 1;
    return fib(index - 1) + fib(index - 2);
  }

  redisClient.on("connect", function (error) {
    console.error(error);
  });

  redisClient.on("error", function (error) {
    console.error(error);
  });

  await redisClient.connect();

  await sub.connect();

  sub.subscribe("insert", (message) => {
    console.log("value", message);
    redisClient.hSet("values", message, fib(parseInt(message)));
  });
})();
