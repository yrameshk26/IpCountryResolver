import { LRUCache } from 'lru-cache'

const caches = {}

// Method to get or create a cache
const getOrCreateCache = (cacheName, options) => {
	if (!caches[cacheName]) {
		caches[cacheName] = new LRUCache(options)
	}
	return caches[cacheName]
}

export { getOrCreateCache }
