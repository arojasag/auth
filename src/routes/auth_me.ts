import express from "express"
import { DataResponse } from "../interfaces/interfaces"
import { verifyToken } from "../middlewares/auth_middleware"
import { PrismaClient } from "@prisma/client"

const router = express.Router()
const prisma = new PrismaClient()

router.get<{}, DataResponse>('/auth/me', async (req, res) => {

    verifyToken(req, res, async () => {
        const response: DataResponse = {data: null, errors: []}
        const userId = res.locals.decodedToken.id
        
        try {
            const user = await prisma.user.findUnique({
                where: { id: userId }
            })

            if (user === null) {
                response.errors.push({ message: `User with id ${userId} couldn't be found`})
                return res.status(404).json(response)
            }

            // We return all user fields, excluding the hashed password
            // There are so few fields that this can be done by hand and the microservice is so simple
            // that this is unlikely to change
            response.data = { id: user.id, email: user.email, isSuperuser: user.isSuperuser }
            return res.status(200).json(response)
        } catch (err) {
            console.error(err)
            response.errors.push({ message: "Unexpected error when trying to retrieve user"} )
            res.status(500).json(response)
        }
    })
})

export default router