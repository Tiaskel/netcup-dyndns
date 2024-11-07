import {Router} from 'express'
import updateDns from '../controllers/updateController'

const router = Router()

router.get('/update', updateDns)

export default router
