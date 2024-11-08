export type Action = 'login' | 'logout' | 'infoDnsZone' | 'infoDnsRecords' | 'updateDnsRecords'

export type Status = 'error' | 'started' | 'pending' | 'warning' | 'success'

export type ApiResponse<T = { [key: string]: string }> = {
    serverrequestid: string
    clientrequestid: string | null
    action: Action
    status: Status
    statuscode: number
    shortmessage: string
    longmessage: string
    responsedata: T
}

export type LoginResponseData = {
    apisessionid: string
}

export type DnsZoneResponseData = {
    name: string
    ttl: string
    serial: string
    refresh: string
    retry: string
    expire: string
    dnssecstatus: boolean
}

export type RecordType = 'A' | 'AAAA' | 'MX' | 'TXT' | 'CNAME' | 'SRV' | 'NS' | 'DS' | 'TLSA' | 'CAA' | 'SSHFP' | 'SMIMEA' | 'OPENPGPKEY'

export type DnsRecord = {
    id: string
    hostname: string
    type: RecordType
    priority: string
    destination: string
    deleterecord: boolean
    state: string
}

export type DnsRecordSet = {
    dnsrecords: DnsRecord[]
}
