type Action = 'login' | 'logout'

type Status = 'error' | 'started' | 'pending' | 'warning' | 'success'

type ApiResponse<T = { [key: string]: string }> = {
    serverrequestid: string
    clientrequestid: string | null
    action: Action
    status: Status
    statuscode: number
    shortmessage: string
    longmessage: string
    responsedata: T
}

type LoginResponseData = {
    apisessionid: string
}

export default class NetcupService {
    constructor() {
    }

    private async callApi<T>(action: Action, payload: { [key: string]: string }): Promise<ApiResponse<T> | null> {
        try {
            const response = await fetch('https://ccp.netcup.net/run/webservice/servers/endpoint.php?JSON', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    action,
                    param: payload,
                }),
            })
            if (response.ok) {
                const data = await response.json() as ApiResponse<T>
                if (data.status === 'success') {
                    return data
                }
            }
        } catch (e: unknown) {
            if (e instanceof Error) {
                console.error(`Error occurred while fetching the API: ${e.message}`)
            } else {
                console.error(`Unknown error occurred while fetching the API: ${e}`)
            }
        }
        return null
    }

    async startSession(customerNumber: string, apiKey: string, apiPassword: string): Promise<string | false> {
        const payload = {
            customernumber: customerNumber,
            apikey: apiKey,
            apipassword: apiPassword,
        }
        const response = await this.callApi<LoginResponseData>('login', payload)
        if(response) {
            return response.responsedata.apisessionid
        }
        return false
    }

    async endSession(customerNumber: string, apiKey: string, apiSessionId: string): Promise<boolean> {
        const payload = {
            customernumber: customerNumber,
            apikey: apiKey,
            apisessionid: apiSessionId,
        }
        const response = await this.callApi<string>('logout', payload)
        return !!response
    }

}
