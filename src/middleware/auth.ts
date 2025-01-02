import dotenv from "dotenv"
import fs from "fs"
import jose from "node-jose"
import { IAuthRequest } from "../interfaces/auth.js"
import { NextFunction, Response } from "express"
import BlacklistToken from "../models/BlacklistToken.js"
import { GraphQLError } from "graphql"
import user from "../models/user.js"

dotenv.config()

export default async(
    request: IAuthRequest,
    _: Response,
    next: NextFunction
): Promise<void> => {
    const header = request.get("Authorization")
    if (!header) {
        request.isAuth = false
        return next()   
    }
    const token = header.split(" ")[1]
    if (!token) {
        request.isAuth = false
        return next()
    }
    try {
        const blackListedToken = await BlacklistToken.findOne({ token })

        if (blackListedToken) {
           throw new GraphQLError("Invalid Authentication", {
            extensions: {
                http:{
                    status: 401,
                },
            },
           })
        }   

        const pathToPublicKey = process.env.PUBLIC_KEY_PATH

        if (!pathToPublicKey) {
            request.isAuth = false
            return next()
        }


        const PUBLIC_KEY = fs.readFileSync(pathToPublicKey, "utf-8")
        const store = jose.JWK.createKeyStore()
        const key = await store.add(PUBLIC_KEY, "pem")


        const result = await jose.JWS.createVerify(key).verify(token)

        const decodedToken = JSON.parse(result.payload.toString())
        const { exp, sub } = decodedToken

        const now = Math.floor(Date.now() / 1000)
        if (!decodedToken || (exp && exp < now)) {
            request.isAuth = false
            return next() // ang token na expire
        }

        const User = await user.findById(sub)

        if (!User) {
            request.isAuth = false
            return next()
        }

        request.authId = sub
        request.authRole = User.role
        request.isAuth = true

        return next()
    }
    catch (error) {
        console.error('Authentication Error:', error)
        request.isAuth = false
        return next()
    }
}

