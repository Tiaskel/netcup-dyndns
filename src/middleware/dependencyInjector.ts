import {Request, Response, NextFunction} from 'express'
import NetcupService from '../services/netcupService'

export function dependencyInjector(req: Request, res: Response, next: NextFunction) {
    req.netcupService = new NetcupService()
    next()
}
