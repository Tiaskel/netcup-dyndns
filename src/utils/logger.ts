import Logger from '@ptkdev/logger'
import config from '../config'

export default class AppLogger {
    private static instance: Logger

    private constructor() {}

    public static getInstance() {
        if (!AppLogger.instance) {
            AppLogger.instance = new Logger({
                language: 'en',
                colors: true,
                debug: config.logger.debug,
                info: true,
                warning: true,
                error: true,
            })
        }
        return AppLogger.instance
    }
}
