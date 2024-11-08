import Logger from '@ptkdev/logger'

export default class AppLogger {
    private static instance: Logger

    private constructor() {}

    public static getInstance() {
        if (!AppLogger.instance) {
            AppLogger.instance = new Logger({
                language: 'en',
                colors: true,
                debug: true,
                info: true,
                warning: true,
                error: true,
            })
        }
        return AppLogger.instance
    }
}
