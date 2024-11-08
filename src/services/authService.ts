import config from '../config'
import {timingSafeEqual, createHash} from 'crypto'

export default class AuthService {
    private readonly username: string
    private readonly password: string

    constructor() {
        this.username = config.auth.username
        this.password = config.auth.password
    }

    private hash(value: string): Buffer {
        return createHash('sha256').update(value, 'utf-8').digest()
    }

    public isAuthorized(username: string, password: string): boolean {
        // Hash data so we have equal length data to compare
        const hashedUsername = this.hash(username)
        const hashedPassword = this.hash(password)
        const storedHashedUsername = this.hash(this.username)
        const storedHashedPassword = this.hash(this.password)

        const isUsernameMatch = timingSafeEqual(hashedUsername, storedHashedUsername)
        const isPasswordMatch = timingSafeEqual(hashedPassword, storedHashedPassword)

        return isUsernameMatch && isPasswordMatch
    }
}
