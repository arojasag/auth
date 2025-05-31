import express from "express"
import { DataResponse } from "../interfaces/interfaces"
import { verifyToken } from "../middlewares/auth_middleware"

const router = express.Router()

router.get<{}, DataResponse>('/auth/me', async (req, res) => {

    verifyToken(req, res, () => {
        const response: DataResponse = {data: null, errors: []}
        const decodedToken = res.locals.decodedToken
        const userId = decodedToken.id
        response.data = {id: userId}

        res.status(200).json(response)
    })
})

export default router