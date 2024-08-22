import { LRUCache } from 'lru-cache'

const caches = {}

const defaultOptions = {
	max: 100,
	ttl: 1000 * 60 * 60 // 1 hour
}

const getOrCreateCache = (cacheName, options = {}) => {
	if (typeof cacheName !== 'string' || !cacheName.trim()) {
		throw new Error('Invalid cache name provided.')
	}

	if (!caches[cacheName]) {
		const cacheOptions = { ...defaultOptions, ...options }
		caches[cacheName] = new LRUCache(cacheOptions)
	}

	return caches[cacheName]
}

export { getOrCreateCache }
