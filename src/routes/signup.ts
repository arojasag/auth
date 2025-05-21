import express from "express"
import { DataResponse, SignupRequest } from "../interfaces/interfaces"

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from "@prisma/client";

const router = express.Router()
const prisma = new PrismaClient()

router.post<{}, DataResponse, SignupRequest>('/signup', async (req, res, next) => {
    const response: DataResponse = { data: null, errors: [] }
    const { email, password } = req.body as SignupRequest

    //TODO: make sure only @unal.edu.co emails are allowed
    if (typeof email !== 'string' || typeof password !== 'string') {
        response.errors.push({ message: 'Invalid user information has been provided' })
        res.status(400).json(response)
        return
    }

    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(password, salt)

    //TODO: improve error handling to inform that the email already has an account, if that's the case
    const user = await prisma.user.create({
        data: { email: email.trim(), password: hashedPassword },
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
  
    //FIXME: it seems that the jwt library has since been updated and this code no longer works
    //const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
    //  expiresIn: process.env.USER_TOKEN_EXPIRATION_TIME as string,
    //});

    //TODO: add token to the response data
    //TODO: don't return the hashed password. That's just being lazy
    response.data = { ...user };

    res.status(201).json(response);
})

export default router