import express, {Request, Response} from 'express'
import routes from './routes'
import {dependencyInjector} from './middleware/dependencyInjector'
import AppLogger from './utils/logger'
import config from './config'

const log = AppLogger.getInstance()

const app = express()

app.use(dependencyInjector)

app.use('/api', routes)

app.use((req: Request, res: Response) => {
    res.status(404).send('Not Found')
})

app.listen(config.server.port, () => {
    log.info(`Server started on port http://localhost:${config.server.port}`)
})
