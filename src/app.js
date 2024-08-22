import express from 'express'
import { getCountry } from './ipLookupService.js'
import { clearCache } from './ipCountryCache.js'
import { validateIPAddress } from '#util.js'
import logger from './logger.js'
const app = express()

// Clear cache API endpoint
app.delete('/api/clear-cache', (req, res) => {
	try {
		const size = clearCache()
		res.json({ message: `Cache cleared. Items: ${size}` })
	} catch (error) {
		logger.error(`Error clearing cache: ${error.message}`)
		res.status(500).json({ error: 'Failed to clear cache' })
	}
})

app.get('/api/country', async (req, res) => {
	const ip = req.query.ip
	if (!ip) {
		return res.status(400).json({ error: 'IP Address is mandatory.' })
	}

	// Check if IP is valid IPv4 or IPv6
	if (!validateIPAddress(ip)) {
		return res.status(400).json({ error: 'Invalid IP Address.' })
	}

	try {
		const country = await getCountry(ip)
		res.json({ country })
	} catch (error) {
		if (error.message.includes('rate limits')) {
			logger.warn('Rate limit exceeded', { error: error.message })
			return res.status(429).json({ error: error.message })
		}
		if (error.message.includes('Reserved IP Address')) {
			logger.info('Reserved IP Address encountered', { error: error.message })
			return res.status(400).json({ error: error.message })
		}
		logger.error('Failed to get country', { error: error.message })
		res.status(500).json({ error: 'Failed to get country information' })
	}
})

export default app
