import { getOrCreateCache } from './cacheManager.js'
import dotenv from 'dotenv'
dotenv.config()

const ipCountryCache = getOrCreateCache('ipCountryCache', { max: parseInt(process.env.CACHE_MAX_SIZE) || 10000 })

export const clearCache = () => {
	const size = ipCountryCache.size
	ipCountryCache.clear()
	return size
}

export const getCountryFromCache = (ip) => {
	return ipCountryCache.get(ip)
}

export const setCountryInCache = (ip, country) => {
	ipCountryCache.set(ip, country)
}
