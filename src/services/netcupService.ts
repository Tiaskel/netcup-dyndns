import {Action, ApiResponse, DnsRecord, DnsRecordSet, DnsZoneResponseData, LoginResponseData} from '../types/api'
import AppLogger from '../utils/logger'
import Logger from '@ptkdev/logger'

export default class NetcupService {
    private log: Logger

    constructor() {
        this.log = AppLogger.getInstance()
    }

    private async callApi<T>(action: Action, payload: { [key: string]: unknown }): Promise<ApiResponse<T> | null> {
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
                    this.log.debug(data.longmessage)
                    return data
                }
            }
        } catch (e: unknown) {
            if (e instanceof Error) {
                this.log.error(`Error occurred while fetching the API: ${e.message}`)
            } else {
                this.log.error(`Unknown error occurred while fetching the API: ${e}`)
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
        if(!response) {
            return false
        }
        return response.responsedata.apisessionid
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


    async getDnsZoneInfo(domainName: string, customerNumber: string, apiKey: string, apiSessionId: string): Promise<DnsZoneResponseData | false> {
        const payload = {
            domainname: domainName,
            customernumber: customerNumber,
            apikey: apiKey,
            apisessionid: apiSessionId,
        }
        const response = await this.callApi<DnsZoneResponseData>('infoDnsZone', payload)
        if(!response) return false
        return response.responsedata
    }

    async getDnsRecordsInfo(domainName: string, customerNumber: string, apiKey: string, apiSessionId: string): Promise<DnsRecord[] | false> {
        const payload = {
            domainname: domainName,
            customernumber: customerNumber,
            apikey: apiKey,
            apisessionid: apiSessionId,
        }
        const response = await this.callApi<DnsRecordSet>('infoDnsRecords', payload)
        if(!response) return false
        return response.responsedata.dnsrecords
    }

    async updateDnsRecords(domainName: string, customerNumber: string, apiKey: string, apiSessionId: string, records: DnsRecordSet): Promise<boolean> {
        const payload = {
            domainname: domainName,
            customernumber: customerNumber,
            apikey: apiKey,
            apisessionid: apiSessionId,
            dnsrecordset: records,
        }
        const response = await this.callApi<DnsRecordSet>('updateDnsRecords', payload)
        return !!response
    }
}
