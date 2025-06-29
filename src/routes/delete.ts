import { PrismaClient } from "@prisma/client"
import express from "express"
import { verifyToken } from "../middlewares/auth_middleware"
import { DataResponse } from "../interfaces/interfaces"
import Redis from "ioredis"

const router = express.Router()
const prisma = new PrismaClient()

router.delete<{}, DataResponse>("/auth/delete", async(req, res) => {
    verifyToken(req, res, async() => {
        const response : DataResponse = { data: null, errors: [] }
        const userId = res.locals.decodedToken.id
        const deleteUser = await prisma.user.delete({
            where: {
                id: userId
            }
        }).catch( e => {
            console.log("Error deleting user:", e)
            response.errors.push({ message: "Error deleting user", stack: e })

            res.statusCode = 500
            return null
        })

        if (!deleteUser) {
            res.status(500).json(response)
            return
        }

        const whitelist = res.locals.whitelist as Redis
        const encodedToken = res.locals.encodedToken
        whitelist.del(encodedToken)
        res.status(204).json(response)
        return
    })
})

export default router