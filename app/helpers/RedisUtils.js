const redis = require('../lib/redis');

class RedisUtils {
	static getByToken(token) {
		return new Promise((resolve, reject) => {
			redis.hgetall(token, (err, data) => {
				if (err) reject(err);
				return resolve(data);
			});
		});
	}

	static add(key, data) {
		return new Promise((ok, reject) => {
			redis.hmset(key, data);
			ok(data);
		});
	}
	static delete(token) {
		return new Promise((ok, reject) => {
			redis.del(token);
			ok();
		});
	}
	// timeout in sec
	static setKeyTimeout(key, timeout) {
		return new Promise((ok, reject) => {
			redis.expire(key, timeout, (err, _) => {
				if (err) reject(err);
				ok();
			});
		});
	}

	static lPush(key, items) {
		return new Promise((ok, reject) => {
			redis.lpush(key, items, (err, _) => {
				if (err) reject(err);
				ok(items);
			});
		});
	}

	// start = 0, end = -1 for all items
	static lRange(key, start = 0, end = -1) {
		return new Promise((ok, reject) => {
			redis.LRANGE(key, start, end, (err, data) => {
				if (err) reject(err);
				ok(data);
			});
		});
	}
}

module.exports = RedisUtils;
