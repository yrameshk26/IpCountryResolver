import { getOrCreateCache } from './cacheManager.js'
import dotenv from 'dotenv'

dotenv.config()

const DEFAULT_CACHE_SIZE = 10000

const cacheSize = parseInt(process.env.CACHE_MAX_SIZE, 10) || DEFAULT_CACHE_SIZE

const ipCountryCache = getOrCreateCache('ipCountryCache', { max: cacheSize })

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
