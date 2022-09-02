(async function () {
  require("dotenv").config();

  const keys = require("./keys");

  // Express App Setup
  const express = require("express");
  const cors = require("cors");

  const app = express();
  app.use(cors());
  app.use(express.json());

  // Postgres Client Setup
  const { Pool } = require("pg");
  const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort,
  });

  pgClient.on("connect", (client) => {
    client
      .query("CREATE TABLE IF NOT EXISTS values (number INT)")
      .catch((err) => console.error(err));
  });

  console.log(keys);

  // Redis Client Setup
  const redis = require("redis");
  const redisClient = redis.createClient({
    url: `redis://${keys.redisHost}:${keys.redisPort}`,
  });

  redisClient.on("error", function (error) {
    console.error("Redis client error", error);
  });

  redisClient.on("connect", function (error) {
    console.error(error);
  });

  await redisClient.connect();

  const redisPublisher = redisClient.duplicate();
  await redisPublisher.connect();

  // Express route handlers

  app.get("/", (req, res) => {
    res.send("Hi");
  });

  app.get("/values/all", async (req, res) => {
    try {
      const values = await pgClient.query("SELECT * from values");
      res.send(values.rows);
    } catch (error) {
      console.log(error);
      res.send([]);
    }
  });

  app.get("/values/current", async (req, res) => {
    try {
      const values = redisClient.hGetAll("values");
      res.send(values);
    } catch (error) {
      res.send([]);
    }
  });

  app.post("/values", async (req, res) => {
    try {
      const index = req.body.index;

      if (parseInt(index) > 40) {
        return res.status(422).send("Index too high");
      }

      redisClient.hSet("values", index, "Nothing yet!");
      await redisPublisher.publish("insert", index);
      pgClient.query("INSERT INTO values(number) VALUES($1)", [index]);

      res.send({ working: true });
    } catch (error) {
      console.log(error);
      res.send({ working: false });
    }
  });

  app.listen(5001, (err) => {
    console.log("Listening at 5001");
  });
})();
