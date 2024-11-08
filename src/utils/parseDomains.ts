export interface DomainConfig {
    [domain: string]: {
        subdomains: Set<string>;
    };
}
export default function parseDomains(domainString: string) {
    const domainStructure: DomainConfig = {}

    const domains = domainString.split(',')

    domains.forEach((fullDomain) => {
        const parts = fullDomain.split('.').reverse()

        const primaryDomain = `${parts[1]}.${parts[0]}`
        const subdomain = parts.slice(2).reverse().join('.') || '*'

        if (!domainStructure[primaryDomain]) {
            domainStructure[primaryDomain] = { subdomains: new Set() }
        }

        domainStructure[primaryDomain].subdomains.add(subdomain)
    })

    return domainStructure
}
