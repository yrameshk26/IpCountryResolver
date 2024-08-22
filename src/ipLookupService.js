import { getCountryFromCache, setCountryInCache } from './ipCountryCache.js'
import { getCountry as getCountryFromIpStack } from './ipServiceVendors/ipStackService.js'
import { getCountry as getCountryFromIpApi } from './ipServiceVendors/ipApiService.js'
import { getCountry as getCountryFromIpGeoLocation } from './ipServiceVendors/ipGeolocationService.js'
import logger from './logger.js'

// Vendor configuration
const VENDORS = {
	ipStack: { enabled: process.env.ENABLE_IPSTACK === 'true', service: getCountryFromIpStack },
	ipApi: { enabled: process.env.ENABLE_IPAPI === 'true', service: getCountryFromIpApi },
	ipGeoLocation: { enabled: process.env.ENABLE_IPGEOLOCATION === 'true', service: getCountryFromIpGeoLocation }
}

// Handle common errors and logging
const handleVendorError = (e, vendorName, errors) => {
	if (e.message.includes('Rate limit exceeded')) {
		errors.rateLimitExceeded = true
	} else if (e.message.includes('Reserved IP Address')) {
		errors.reservedIPAddress = true
	} else {
		errors[vendorName] = e.message
	}
	logger.error(`[${vendorName}] Error: ${e.message}`)
}

export const getCountry = async (ip) => {
	const cachedCountry = getCountryFromCache(ip)
	if (cachedCountry) {
		if (cachedCountry === 'Reserved_IP') {
			throw new Error('This is a Reserved IP Address.')
		}
		return cachedCountry
	}

	if (Object.values(VENDORS).every((vendor) => !vendor.enabled)) {
		throw new Error('All IP location vendors are disabled.')
	}

	let errors = { rateLimitExceeded: false, reservedIPAddress: false }

	for (const [vendorName, { enabled, service }] of Object.entries(VENDORS)) {
		if (enabled) {
			try {
				const country = await service(ip)
				setCountryInCache(ip, country)
				return country
			} catch (e) {
				handleVendorError(e, vendorName, errors)
			}
		}
	}

	if (errors.rateLimitExceeded) {
		throw new Error('All vendors have exceeded their rate limits.')
	}

	if (errors.reservedIPAddress) {
		setCountryInCache(ip, 'Reserved_IP')
		throw new Error('This is a Reserved IP Address.')
	}

	throw new Error('Failed to get country from all vendors.' + JSON.stringify(errors))
}
