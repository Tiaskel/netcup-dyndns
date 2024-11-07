import {Request, Response} from 'express'

export default async function updateDns(req: Request, res: Response) {
    const apiKey = process.env.NETCUP_API_KEY
    const apiPw = process.env.NETCUP_API_PASSWORD
    const customerId = process.env.NETCUP_CUSTOMER_NUMBER

    if(!req.netcupService || !apiKey || !apiPw || !customerId) {
        res.status(400).send('Credentials not set')
        return
    }

    const sessionId = await req.netcupService.startSession(customerId, apiKey, apiPw)
    if(!sessionId) {
        res.status(403).send('Session not found')
        return
    }
    console.log(sessionId)


    await req.netcupService.endSession(customerId, apiKey, sessionId)
    res.send('Foo')
}


