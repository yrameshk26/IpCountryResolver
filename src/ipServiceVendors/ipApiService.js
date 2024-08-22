import axios from 'axios'
import { RateLimiterMemory } from 'rate-limiter-flexible'

const { IPAPI_RATE_LIMIT, VENDOR_RATE_LIMIT_DURATION = 3600, IPAPI_URL } = process.env

const rateLimiter = new RateLimiterMemory({
	points: IPAPI_RATE_LIMIT,
	duration: VENDOR_RATE_LIMIT_DURATION
})

export const getCountry = async (ip) => {
	try {
		await rateLimiter.consume(1)
	} catch (rateLimitError) {
		throw new Error(`Rate limit exceeded for ipApiService: ${rateLimitError.message}`)
	}

	try {
		const response = await axios.get(`${IPAPI_URL}/${ip}/json/`)
		const { data } = response

		if (data.error) {
			throw new Error(`${data.reason}: ${ip}`)
		}

		return data.country_name
	} catch (apiError) {
		throw new Error(`Error retrieving country from ipApiService: ${apiError.message}`)
	}
}
