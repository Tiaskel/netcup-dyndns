import express from 'express'
import dotenv from 'dotenv'
import routes from './routes'
import {dependencyInjector} from './middleware/dependencyInjector'

dotenv.config()

const app = express()
const port = process.env.PORT || 3000

app.use(dependencyInjector)

app.use('/api', routes)

app.listen(port, () => {
    console.log(`Server started on port http://localhost:${port}`)
})
