import express from "express"
import { verifyToken } from "../middlewares/auth_middleware"
import { DataResponse, MessageResponse } from "../interfaces/interfaces"
import type Redis from "ioredis"

const router = express.Router()
router.post<{}>("/logout", async (req, res, next) => {

    verifyToken(req, res, async () => {
        const whitelist = res.locals.whitelist as Redis
        const encodedToken = res.locals.encodedToken
        try {
            const ans = await whitelist.del(encodedToken)
            // When successfully called, the whitelist tells us how many items were deleted
            if ( ans != 1) {
                const response: DataResponse = { data: null, errors: []} 
                console.log(`Couldn't delete from the whitelist the token ${encodedToken}`)
                response.errors.push({ message: "Couldn't log out for some reason"})
                return res.status(500).json(response)
            }

            const response: MessageResponse = {message: "Successfully logged out"}
            res.status(204).json(response)
        } catch (err) {
            console.log("Error when deleting a token from the whitelist:", err)
            console.error(err)
        }
    })
})

export default router