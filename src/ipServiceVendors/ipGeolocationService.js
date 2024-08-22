import axios from 'axios'
import { RateLimiterMemory } from 'rate-limiter-flexible'

const { IPGEOLOCATION_RATE_LIMIT, VENDOR_RATE_LIMIT_DURATION = 3600, IPGEOLOCATION_URL, IPGEOLOCATION_API_KEY } = process.env

const rateLimiter = new RateLimiterMemory({
	points: IPGEOLOCATION_RATE_LIMIT,
	duration: VENDOR_RATE_LIMIT_DURATION
})

export const getCountry = async (ip) => {
	try {
		await rateLimiter.consume(1)
	} catch (rateLimitError) {
		throw new Error(`Rate limit exceeded for ipGeoLocationService: ${rateLimitError.message}`)
	}

	try {
		const response = await axios.get(`${IPGEOLOCATION_URL}?apiKey=${IPGEOLOCATION_API_KEY}&ip=${ip}&fields=country_name`)
		return response.data.country_name
	} catch (apiError) {
		if (apiError.response?.data?.message.includes('bogon')) {
			throw new Error(`Error getting country from ipGeoLocationService: Reserved IP Address: ${ip}`)
		}

		const errorMsg = apiError.response?.data?.message || apiError.message
		throw new Error(`Error getting country from ipGeoLocationService: ${errorMsg}`)
	}
}
