import {Request, Response} from 'express'
import parseDomains from '../utils/parseDomains'
import {DnsRecord, RecordType} from '../types/api'

interface UpdateDnsQueryParams {
    username: string
    password: string
    domains: string
    ipv4: string
    ipv6: string
}

type UpdateRequest = Request<unknown,unknown,unknown,UpdateDnsQueryParams>

function findOrCreateDnsRecord(
    subdomain: string,
    records: DnsRecord[],
    recordType: RecordType,
    destinationIp: string
): DnsRecord | null {
    const existingRecord = records.find((record) => record.hostname === subdomain && record.type === recordType)

    if (existingRecord) {
        if (existingRecord.destination !== destinationIp) {
            const updatedRecord = structuredClone(existingRecord)
            updatedRecord.destination = destinationIp
            return updatedRecord
        }
        return null
    }

    return {
        id: '',
        type: recordType,
        hostname: subdomain,
        destination: destinationIp,
        priority: '',
        state: '',
        deleterecord: false,
    }
}

export default async function updateDns(req: UpdateRequest, res: Response) {
    const apiKey = process.env.NETCUP_API_KEY
    const apiPw = process.env.NETCUP_API_PASSWORD
    const customerId = process.env.NETCUP_CUSTOMER_NUMBER

    if(!req.netcupService || !apiKey || !apiPw || !customerId) {
        res.status(400).send('Credentials not set')
        return
    }

    const ipv4 = req.query.ipv4
    const ipv6 = req.query.ipv6
    if(!ipv4 && !ipv6) {
        res.status(400).send('IP address not set')
        return
    }

    const domainQuery = req.query.domains
    if(!domainQuery) {
        res.status(400).send('Domains not set')
        return
    }

    const domains = parseDomains(domainQuery)

    const sessionId = await req.netcupService.startSession(customerId, apiKey, apiPw)
    if(!sessionId) {
        res.status(403).send('Session not found')
        return
    }


    for (const [primaryDomain, { subdomains }] of Object.entries(domains)) {
        const updatedDnsRecords: DnsRecord[] = []
        const records = await req.netcupService.getDnsRecordsInfo(primaryDomain, customerId, apiKey, sessionId)

        if (records) {
            for (const subdomain of subdomains) {
                if (ipv4) {
                    const ipv4Record = findOrCreateDnsRecord(subdomain, records, 'A', ipv4)
                    if (ipv4Record) updatedDnsRecords.push(ipv4Record)
                }

                if (ipv6) {
                    const ipv6Record = findOrCreateDnsRecord(subdomain, records, 'AAAA', ipv6)
                    if (ipv6Record) updatedDnsRecords.push(ipv6Record)
                }
            }
        }

        if (updatedDnsRecords.length > 0) {
            const success = await req.netcupService.updateDnsRecords(primaryDomain, customerId, apiKey, sessionId, {
                dnsrecords: updatedDnsRecords,
            })
        }
    }


    await req.netcupService.endSession(customerId, apiKey, sessionId)
    res.send('Foo')
}


