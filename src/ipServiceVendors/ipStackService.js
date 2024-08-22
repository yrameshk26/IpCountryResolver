import axios from 'axios'
import { RateLimiterMemory } from 'rate-limiter-flexible'

const rateLimiter = new RateLimiterMemory({
	points: process.env.IPSTACK_RATE_LIMIT,
	duration: process.env.VENDOR_RATE_LIMIT_DURATION || 3600
})

export const getCountry = async (ip) => {
	try {
		await rateLimiter.consume(1)
	} catch (e) {
		throw new Error(`Rate limit exceeded for ipStackService: ${e}`)
	}
	try {
		const response = await axios.get(`${process.env.IPSTACK_URL}${ip}?access_key=${process.env.IPSTACK_API_KEY}&fields=country_name`)
		if (response.data.error) {
			throw new Error(`${response.data.error.info}`)
		}
		if (!response.data.country_name) {
			throw new Error(`Reserved IP Address: ${ip}`)
		}
		return response.data.country_name
	} catch (e) {
		throw new Error(`Error getting country from ipStackService: ${e}`)
	}
}
