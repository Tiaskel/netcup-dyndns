import {Request, Response, NextFunction} from 'express'
import NetcupService from '../services/netcupService'
import AuthService from '../services/authService'

export function dependencyInjector(req: Request, res: Response, next: NextFunction) {
    req.authService = new AuthService()
    req.netcupService = new NetcupService()
    next()
}
