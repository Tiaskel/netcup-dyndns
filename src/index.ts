import express from 'express'
import dotenv from 'dotenv'
import routes from './routes'
import {dependencyInjector} from './middleware/dependencyInjector'
import AppLogger from './utils/logger'

dotenv.config()

const log = AppLogger.getInstance()

const app = express()
const port = process.env.PORT || 3000

app.use(dependencyInjector)

app.use('/api', routes)

app.listen(port, () => {
    log.info(`Server started on port http://localhost:${port}`)
})
