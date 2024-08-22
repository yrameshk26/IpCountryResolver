import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const swaggerDefinition = {
	openapi: '3.0.0',
	info: {
		title: 'IP Country API',
		version: '1.0.0',
		description: 'API documentation for the IP Country service'
	},
	servers: [
		{
			url: 'http://localhost:3000',
			description: 'Development server'
		}
	]
}

const options = {
	swaggerDefinition,
	apis: ['./src/app.js']
}

const swaggerSpec = swaggerJsdoc(options)

export { swaggerSpec, swaggerUi }
