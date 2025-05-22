import express from "express"
import { DataResponse, AuthRequest } from "../interfaces/interfaces"

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from "@prisma/client";

const router = express.Router()
const prisma = new PrismaClient()

router.post<{}, DataResponse, AuthRequest>('/signup', async (req, res, next) => {
    const response: DataResponse = { data: null, errors: [] }
    const { email, password } = req.body as AuthRequest

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

    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(password, salt)

    //TODO: improve error handling to inform that the email already has an account, if that's the case
    const user = await prisma.user.create({
        data: { email: email.toLowerCase().trim(), password: hashedPassword },
    }).catch( e => {
        console.error('Unexpected error creating user', e)

        response.errors.push({ message: 'Unexpected error creating user', stack: e })
        res.statusCode = 500
        return null
    })

    if (user === null) {
        next(response.errors[0]);
        return
    }
  
    const token = jwt.sign({ id: user.id, expiresIn: process.env.USER_TOKEN_EXPIRATION_TIME as string }, 
                            process.env.JWT_SECRET as string);

    response.data = {uuid: user.id, jwt: token}

    res.status(201).json(response);
})

export default router