import express from "express"
import { DataResponse, AuthRequest, ErrorResponse } from "../interfaces/interfaces"

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from "@prisma/client";

const router = express.Router()
const prisma = new PrismaClient()

router.post<{}, DataResponse, AuthRequest>('/login', async (req, res, next) => {
    const response: DataResponse = { data: null, errors: [] }
    const { email, password } = req.body as AuthRequest

    //TODO: these two ifs are an exact copy of the ones in signup and should be abstracted, perhaps
    //into some middleware that validates AuthRequests (signup and login)
    if (typeof email !== 'string' || typeof password !== 'string') {
        response.errors.push({ message: 'Invalid user information has been provided' })
        res.status(400).json(response)
        return
    }
    //MeetUN is meant to be an application exclusive to unal members
    if (!email.toLowerCase().trim().endsWith("@unal.edu.co")) {
        response.errors.push({ message: "Only @unal.edu.co emails are allowed" })
        res.status(400).json(response)
        return
    }


    const user = await prisma.user.findUnique({
        where: { email },
    }).catch( e => {
        console.error('Unexpected error retrieving user', e)

        response.errors.push({
            message: 'Unexpected error retrieving user',
            stack: e,
        })
        res.statusCode = 500

        return null
    });

    if (res.statusCode === 500) {
        next(response.errors[0])
        return
    }

    // We do not reveal which of these two is incorrect to
    //  prevent information leakage
    const badCredentials: ErrorResponse = {
        message: 'Wrong email or password',
    }
    //No user in the database has that email
    if (user === null) {
        response.errors.push(badCredentials)
        res.status(401).json(response)
        return
    }
    //The user exists but doesn't have that password
    const passwordsMatch = await bcrypt.compare(password, user.password);
    if (!passwordsMatch) {
        response.errors.push(badCredentials);
        res.status(401).json(response);
        return
    }

    const token = jwt.sign({ id: user.id, expiresIn: process.env.USER_TOKEN_EXPIRATION_TIME as string }, 
                                process.env.JWT_SECRET as string)
    
    // Add a token with an expiration time of just 180 seconds for now, for testing purposes
    // TODO: this should be abstracted into its own function because it is the same code that is being used in signup
    const whitelist = res.locals.whitelist
    const expirationTime = process.env.mu_auth_ms_USER_TOKEN_EXPIRATION_TIME || 180
    whitelist.set(token, user.id)
    whitelist.expire(token, expirationTime)

    response.data = {id: user.id, jwt: token}
    
    res.status(200).json(response)
})

export default router