import axios from 'axios'
import { RateLimiterMemory } from 'rate-limiter-flexible'

const rateLimiter = new RateLimiterMemory({
	points: process.env.IPGEOLOCATION_RATE_LIMIT,
	duration: process.env.VENDOR_RATE_LIMIT_DURATION || 3600
})

export const getCountry = async (ip) => {
	try {
		await rateLimiter.consume(1)
	} catch (e) {
		throw new Error(`Rate limit exceeded for ipGeoLocationService: ${e}`)
	}
	try {
		const response = await axios.get(
			`${process.env.IPGEOLOCATION_URL}?apiKey=${process.env.IPGEOLOCATION_API_KEY}&ip=${ip}&fields=country_name`
		)
		return response.data.country_name
	} catch (e) {
		if (e.response && e.response.data && e.response.data.message.includes('bogon')) {
			throw new Error(`Error getting country from ipGeoLocationService: Reserved IP Address: ${ip}`)
		}

		const errorMsg = e.response && e.response.data && e.response.data.message ? e.response.data.message : e
		throw new Error(`Error getting country from ipGeoLocationService: ${errorMsg}`)
	}
}
