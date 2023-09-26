const redis = require('redis');
const redisClient = redis.createClient({
	port: process.env.REDIS_PORT,
	host: process.env.REDIS_HOST,
	// password: process.env.REDIS_PASS || undefined,
});

redisClient.on('connect', function () {
	console.log(`Redis client connection success`);
});
redisClient.on('error', function (err) {
	console.log(`Redis client connection error`);
	console.log(err);
});

module.exports = redisClient;
