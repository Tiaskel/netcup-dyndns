// src/config.ts
import dotenv from 'dotenv'

dotenv.config()


function getEnvVar(key: string, defaultValue?: string): string {
    const value = process.env[key] || defaultValue
    if (!value) {
        throw new Error(`Missing environment variable: ${key}`)
    }
    return value
}

// Configuration object
const config = {
    api: {
        key: getEnvVar('NETCUP_API_KEY'),
        password: getEnvVar('NETCUP_API_PASSWORD'),
        customerId: getEnvVar('NETCUP_CUSTOMER_NUMBER'),
    },
    server: {
        port: parseInt(getEnvVar('SERVER_PORT', '3000'), 10),
    },
    logger: {
        debug: getEnvVar('DEBUG', 'false') === 'true',
    },
}

export default config
