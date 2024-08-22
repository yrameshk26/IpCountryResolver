import axios from 'axios'
import { RateLimiterMemory } from 'rate-limiter-flexible'

const { IPSTACK_RATE_LIMIT, VENDOR_RATE_LIMIT_DURATION = 3600, IPSTACK_URL, IPSTACK_API_KEY } = process.env

const rateLimiter = new RateLimiterMemory({
	points: IPSTACK_RATE_LIMIT,
	duration: VENDOR_RATE_LIMIT_DURATION
})

export const getCountry = async (ip) => {
	try {
		await rateLimiter.consume(1)
	} catch (rateLimitError) {
		throw new Error(`Rate limit exceeded for ipStackService: ${rateLimitError.message}`)
	}

	try {
		const response = await axios.get(`${IPSTACK_URL}${ip}?access_key=${IPSTACK_API_KEY}&fields=country_name`)

		if (response.data.error) {
			throw new Error(`API Error: ${response.data.error.info}`)
		}

		const country = response.data.country_name

		if (!country) {
			throw new Error(`Reserved IP Address: ${ip}`)
		}

		return country
	} catch (apiError) {
		const errorMsg = apiError.response?.data?.error?.info || apiError.message
		throw new Error(`Error getting country from ipStackService: ${errorMsg}`)
	}
}
