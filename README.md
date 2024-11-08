# Netcup DynDNS
A lightweight Node.js service for dynamically updating DNS records on Netcup domains, designed for use with FritzBox routers and other devices. This service authenticates with the Netcup API to update IPv4 and IPv6 addresses for specified domains/subdomains.

## Setup
1. Checkout the repository on your vps
2. If you want to use pm2, adjust the supplied ecosystem.config.js file and enter your netcup api credentials. 
3. Install the dependencies using your package manager, e.g. ``yarn install``
4. Run the build script: ``yarn build``
5. Start the server with pm2: ``pm2 start ecosystem.config.js``
6. Set up a reverse proxy with a public url to point to the express server, e.g. nginx.

After setup, the dyndns service should be available under ``https://your.domain/api/update``.

Add the appropriate query parameters when using it in your fritzbox interface:
``https://your.domain/api/update?domains=<domain>&ipv4=<ipaddr>&ipv6=<ip6addr>&username=<username>&password=<pass>``



