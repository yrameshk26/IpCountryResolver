import request from 'supertest'
import app from '../src/app.js'
import { expect } from 'chai'
import { describe, it } from 'mocha'

const validIp = '8.8.8.8'
const invalidIp = 'invalid-ip'
const reservedIp = '0.0.0.0'
const rateLimitedIps = ['200.201.201.1', '200.201.201.2', '200.201.201.3', '200.201.201.4', '200.201.201.5', '200.201.201.6']

describe('API Endpoints', () => {
	describe('GET /api/country', () => {
		it('should return 400 if IP address is not provided', async () => {
			const res = await request(app).get('/api/country')
			expect(res.status).to.equal(400)
			expect(res.body.error).to.equal('IP Address is mandatory.')
		})

		it('should return 400 for invalid IP address', async () => {
			const res = await request(app).get(`/api/country?ip=${invalidIp}`)
			expect(res.status).to.equal(400)
			expect(res.body.error).to.equal('Invalid IP Address.')
		})

		it('should return the country for a valid IP address', async () => {
			const res = await request(app).get(`/api/country?ip=${validIp}`)
			expect(res.status).to.equal(200)
			expect(res.body.country).to.equal('United States')
		})

		it('should return 400 for reserved IP address', async () => {
			const res = await request(app).get(`/api/country?ip=${reservedIp}`)
			expect(res.status).to.equal(400)
			expect(res.body.error).to.include('This is a Reserved IP Address')
		})

		it('should return 429 if rate limits are exceeded for multiple IPs', async () => {
			let lastResponse

			for (let i = 0; i < rateLimitedIps.length; i++) {
				lastResponse = await request(app).get(`/api/country?ip=${rateLimitedIps[i]}`)
				if (i < 3) {
					expect(lastResponse.status).to.equal(200)
				} else {
					expect(lastResponse.status).to.equal(429)
					expect(lastResponse.body.error).to.include('All vendors have exceeded their rate limits.')
				}
			}
		})
	})

	describe('DELETE /api/clear-cache', () => {
		it('should clear the cache and return success message', async () => {
			const res = await request(app).delete('/api/clear-cache')
			expect(res.status).to.equal(200)
			expect(res.body.message).to.match(/Cache cleared. Items: \d+/)
		})
	})
})
