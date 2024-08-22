import request from 'supertest'
import app from '../src/app.js'
import { expect } from 'chai'
import { describe, it } from 'mocha'

describe('API Endpoints', () => {
	describe('GET /api/country', () => {
		it('should return 400 if IP address is not provided', async () => {
			const res = await request(app).get('/api/country')
			expect(res.status).to.equal(400)
			expect(res.body.error).to.equal('IP Address is mandatory.')
		})

		it('should return 400 for invalid IP address', async () => {
			const res = await request(app).get('/api/country?ip=invalid-ip')
			expect(res.status).to.equal(400)
			expect(res.body.error).to.equal('Invalid IP Address.')
		})

		// This will consume one point in the rate limiter in first vendor
		it('should return the country for a valid IP address', async () => {
			const res = await request(app).get('/api/country?ip=8.8.8.8')
			expect(res.status).to.equal(200)
			expect(res.body.country).to.equal('United States')
		})

		// This should consume one point in each vendor rate limiter
		it('should return 400 for reserved IP address', async () => {
			const res = await request(app).get('/api/country?ip=0.0.0.0')
			expect(res.status).to.equal(400)
			expect(res.body.error).to.includes('This is a Reserved IP Address')
		})
	})

	describe('GET /api/country', () => {
		it('should fail when fetching more than 6(4 + 3) IPs within a time frame (IP Stack is disabled)', async () => {
			const ipList = ['200.201.201.1', '200.201.201.2', '200.201.201.3', '200.201.201.4', '200.201.201.5', '200.201.201.6']

			let lastResponse

			for (let i = 0; i < ipList.length; i++) {
				lastResponse = await request(app).get(`/api/country?ip=${ipList[i]}`)
				if (i < 3) {
					// since already previous test cases have consumed 1 request
					expect(lastResponse.status).to.equal(200)
				} else {
					expect(lastResponse.status).to.equal(429)
					expect(lastResponse.body.error).to.includes('All vendors have exceeded their rate limits.')
				}
			}
		})
	})

	describe('DELETE /api/clear-cache', () => {
		it('should clear the cache and return success message', async () => {
			const res = await request(app).delete('/api/clear-cache')
			expect(res.status).to.equal(200)
			expect(res.body.message).to.match(/Cache cleared. Items : \d+/)
		})
	})
})
