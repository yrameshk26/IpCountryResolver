import express from 'express'
import { getCountry } from './ipLookupService.js'
import { clearCache } from './ipCountryCache.js'
import { validateIPAddress } from '#util.js'
import logger from './logger.js'
import { swaggerSpec, swaggerUi } from './swagger.js'

const app = express()

// Serve Swagger API documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

/**
 * @swagger
 * /api/clear-cache:
 *   delete:
 *     summary: Clear cache
 *     description: Clears the cache and returns the number of items removed.
 *     responses:
 *       200:
 *         description: Cache cleared successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Failed to clear cache
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
app.delete('/api/clear-cache', (req, res) => {
	try {
		const size = clearCache()
		res.json({ message: `Cache cleared. Items: ${size}` })
	} catch (error) {
		logger.error(`Error clearing cache: ${error.message}`)
		res.status(500).json({ error: 'Failed to clear cache' })
	}
})

/**
 * @swagger
 * /api/country:
 *   get:
 *     summary: Get country by IP address
 *     description: Returns the country name for the provided IP address
 *     parameters:
 *       - in: query
 *         name: ip
 *         required: true
 *         description: IP address to look up
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Country name
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 country:
 *                   type: string
 *       400:
 *         description: Invalid input
 *       429:
 *         description: Rate limit exceeded
 *       500:
 *         description: Server error
 */
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
