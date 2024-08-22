import { getCountryFromCache, setCountryInCache } from './ipCountryCache.js'
import { getCountry as getCountryFromIpStack } from './ipServiceVendors/ipStackService.js'
import { getCountry as getCountryFromIpApi } from './ipServiceVendors/ipApiService.js'
import { getCountry as getCountryFromIpGeoLocation } from './ipServiceVendors/ipGeolocationService.js'

export const getCountry = async (ip) => {
	const cachedCountry = getCountryFromCache(ip)
	if (cachedCountry) {
		if (cachedCountry === 'Reserved_IP') {
			throw new Error('This is a Reserved IP Address.')
		}
		return cachedCountry
	}

	let rateLimitExceeded = true
	let reservedIPAddress = true
	let commonErrorMessage = {}

	if (process.env.ENABLE_IPSTACK === 'false' && process.env.ENABLE_IPAPI === 'false' && process.env.ENABLE_IPGEOLOCATION === 'false') {
		throw new Error('All IP location vendors are disabled.')
	}

	if (process.env.ENABLE_IPSTACK === 'true') {
		try {
			const country = await getCountryFromIpStack(ip)
			setCountryInCache(ip, country)
			return country
		} catch (e) {
			if (!e.message.includes('Rate limit exceeded')) {
				rateLimitExceeded = false
			}
			if (!e.message.includes('Reserved IP Address')) {
				reservedIPAddress = false
			}
			commonErrorMessage.ipStack = e.message
			console.error(`${e.message}`)
		}
	}

	if (process.env.ENABLE_IPAPI === 'true') {
		try {
			const country = await getCountryFromIpApi(ip)
			setCountryInCache(ip, country)
			return country
		} catch (e) {
			if (!e.message.includes('Rate limit exceeded')) {
				rateLimitExceeded = false
			}
			if (!e.message.includes('Reserved IP Address')) {
				reservedIPAddress = false
			}
			commonErrorMessage.ipApi = e.message
			console.error(`${e.message}`)
		}
	}

	if (process.env.ENABLE_IPGEOLOCATION === 'true') {
		try {
			const country = await getCountryFromIpGeoLocation(ip)
			setCountryInCache(ip, country)
			return country
		} catch (e) {
			if (!e.message.includes('Rate limit exceeded')) {
				rateLimitExceeded = false
			}
			if (!e.message.includes('Reserved IP Address')) {
				reservedIPAddress = false
			}
			commonErrorMessage.ipGeoLocation = e.message
			console.error(`${e.message}`)
		}
	}

	if (rateLimitExceeded) {
		throw new Error('All vendors have exceeded their rate limits.')
	}

	if (reservedIPAddress) {
		setCountryInCache(ip, 'Reserved_IP')
		throw new Error('This is a Reserved IP Address.')
	}

	throw new Error('Failed to get country from all vendors.' + JSON.stringify(commonErrorMessage))
}
