import { redis } from '../config/redisClient.js';

class CacheService {
	async get(key) {
		const data = await redis.get(key);
		return data ? JSON.parse(data) : null;
	}

	async set(key, value, ttl = 3600) {
		await redis.set(key, JSON.stringify(value), 'EX', ttl);
	}
}

export { CacheService };
