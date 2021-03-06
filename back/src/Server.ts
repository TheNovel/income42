import * as bodyParser from 'body-parser'
import * as cors from 'cors'
import * as express from 'express'
import * as jwt from 'express-jwt'

import graphqlMiddleware from '@income42/graphql/middleware'
import { check, register, token } from '@income42/routes'

export default class Server {
    public static start = (port: number): Server => {
        const server = new Server()
        server.app.listen(port)

        return server
    }

    private app: express.Application

    constructor() {
        this.app = express()

        this.config()
        this.router()
    }

    private config() {
        this.app.use(bodyParser.json())

        // CORS
        this.app.use(cors())

        // JWT
        const secret = process.env.JWT_SECRET || 'not-secret'
        this.app.use(jwt({ secret }).unless({ path: ['/register', '/token'] }))

        // GrapQL
        this.app.use('/graphql', graphqlMiddleware)
    }

    private router() {
        const router = express.Router()

        router.post('/check', check)
        router.post('/register', register)
        router.post('/token', token)

        this.app.use(router)
    }
}
