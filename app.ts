import express from 'express'
import config from 'config'
import mongoose from 'mongoose'

import auth from './src/routes/auth.routes.js'
import path, { dirname } from 'path'
import dictionary from './src/routes/dictionary.routes.js'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()

app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb' }))

app.use('/api/dictionary', dictionary)
app.use('/api/auth', auth)

if (process.env.NODE_ENV === 'production') {
	app.use('/', express.static(path.join(__dirname, 'client', 'build')))

	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
	})
}

const PORT = config.get('port') || 5005

async function start() {
	try {
		await mongoose.connect(config.get('mongoURL'))

		app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`))
	} catch (e: any) {
		console.log('Server error: ', e.message)
		process.exit(1)
	}
}

start()
