module.exports = {
    apps: [
        {
            name: 'netcup-dyndns',
            script: './dist/index.js',
            env: {
                NETCUP_CUSTOMER_NUMBER: '',
                NETCUP_API_KEY: '',
                NETCUP_API_PASSWORD: '',
                AUTH_USERNAME: '',
                AUTH_PASSWORD: '',
                PORT: 3000,
                DEBUG: false,
            },
            env_production: {
                NODE_ENV: 'production',
            }
        }
    ]
}

