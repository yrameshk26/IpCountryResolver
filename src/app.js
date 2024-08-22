import express from 'express'
import { getCountry } from './ipLookupService.js'
import { clearCache } from './ipCountryCache.js'
import { validateIPAddress } from '#util.js'
const app = express()

// clear cache api endpoint
app.delete('/api/clear-cache', (req, res) => {
	try {
		const size = clearCache()
		res.json({ message: 'Cache cleared. Items : ' + size })
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

app.get('/api/country', async (req, res) => {
	const ip = req.query.ip
	if (!ip) {
		return res.status(400).json({ error: 'IP Address is mandatory.' })
	}

	// check if ip is valid ipv4 or ipv6
	if (!validateIPAddress(ip)) {
		return res.status(400).json({ error: 'Invalid IP Address.' })
	}

	try {
		const country = await getCountry(ip)
		res.json({ country })
	} catch (error) {
		if (error.message.includes('rate limits')) {
			return res.status(429).json({ error: error.message })
		}
		if (error.message.includes('Reserved IP Address')) {
			return res.status(400).json({ error: error.message })
		}
		res.status(400).json({ error: error.message })
	}
})

export default app
