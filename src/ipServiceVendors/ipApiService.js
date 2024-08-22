import axios from 'axios'
import { RateLimiterMemory } from 'rate-limiter-flexible'

const rateLimiter = new RateLimiterMemory({
	points: process.env.IPAPI_RATE_LIMIT,
	duration: process.env.VENDOR_RATE_LIMIT_DURATION || 3600
})

export const getCountry = async (ip) => {
	try {
		await rateLimiter.consume(1)
	} catch (e) {
		throw new Error(`Rate limit exceeded for ipApiService: ${e}`)
	}
	try {
		const response = await axios.get(`${process.env.IPAPI_URL}/${ip}/json/`)
		if (response.data.error) {
			throw new Error(`${response.data.reason}: ${ip}`)
		}
		return response.data.country_name
	} catch (e) {
		throw new Error(`Error getting country from ipApiService: ${e}`)
	}
}
