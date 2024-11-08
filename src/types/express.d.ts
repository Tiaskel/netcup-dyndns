import NetcupService from '../services/netcupService'
import AuthService from '../services/authService'

declare global {
    namespace Express {
        interface Request {
            authService: AuthService
            netcupService: NetcupService;
        }
    }
}
