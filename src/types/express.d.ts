import NetcupService from '../services/netcupService'

declare global {
    namespace Express {
        interface Request {
            netcupService?: NetcupService;
        }
    }
}
