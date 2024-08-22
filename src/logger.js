import winston from 'winston'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const logFilePath = path.join(__dirname, 'logs/app.log')

const { combine, timestamp, printf, errors } = winston.format

const logFormat = printf(({ level, message, timestamp, stack }) => {
	return `${timestamp} [${level}]: ${stack || message}`
})

const logLevel = process.env.LOG_LEVEL || 'info'

const logger = winston.createLogger({
	level: logLevel,
	format: combine(errors({ stack: true }), timestamp(), logFormat),
	transports: [
		new winston.transports.Console(),
		new winston.transports.File({
			filename: logFilePath,
			maxsize: 10000000,
			maxFiles: 5,
			tailable: true
		})
	],

	exceptionHandlers: [new winston.transports.File({ filename: path.join(__dirname, 'logs/exceptions.log') })],
	rejectionHandlers: [new winston.transports.File({ filename: path.join(__dirname, 'logs/rejections.log') })]
})

export default logger
