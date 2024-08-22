import dotenv from 'dotenv'
dotenv.config()
import app from './app.js'

const PORT = process.env.PORT || 3000

app
	.listen(PORT, () => {
		console.log(`🚀 Server is running on port ${PORT}`)
	})
	.on('error', (err) => {
		console.error(`Failed to start server: ${err.message}`)
	})
