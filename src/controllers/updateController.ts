import {Request, Response} from 'express'
import parseDomains from '../utils/parseDomains'
import {DnsRecord, RecordType} from '../types/api'
import AppLogger from '../utils/logger'
import config from '../config'

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
    const log = AppLogger.getInstance()
    if(!req.netcupService) {
        res.status(500).send('API service not available')
        return
    }

    const apiKey = config.api.key
    const apiPw = config.api.password
    const customerId = config.api.customerId

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
        res.status(400).send('Could not start api session')
        return
    }

    for (const [primaryDomain, { subdomains }] of Object.entries(domains)) {
        const updatedDnsRecords: DnsRecord[] = []
        log.debug(`Requesting DNS information for ${primaryDomain}`)
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
            log.debug('Updating DNS records')
            const success = await req.netcupService.updateDnsRecords(primaryDomain, customerId, apiKey, sessionId, {
                dnsrecords: updatedDnsRecords,
            })
            if(success) {
                log.info('Successfully updated DNS records')
            } else {
                log.error('Could not update DNS records')
            }
        } else {
            log.debug('DNS information is already up to date')
        }
    }


    await req.netcupService.endSession(customerId, apiKey, sessionId)
    res.sendStatus(204)
}


