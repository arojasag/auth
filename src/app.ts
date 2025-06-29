import express from "express"

import morgan from "morgan"
import helmet from "helmet"
import cors from "cors"

import signup from "./routes/signup"
import login from "./routes/login"
import auth_me from "./routes/auth_me"
import logout from "./routes/logout"
import deleteAuth from "./routes/delete"

import dotenv from "dotenv"

import Redis from 'ioredis'
import { MessageResponse } from "./interfaces/interfaces"

const app = express()
dotenv.config()

const isProduction = process.env.NODE_ENV === "production"
const morganFormat = (isProduction) ? "combined" : "dev"

app.use(morgan(morganFormat))
app.use(helmet())
/*TODO: the default configuration of this middleware basically disables all CORS
  protection by allowing every origin and every method.
  The middleware should be configured so that it only accepts requests from the
  main backend, but I don't know how to specify the origin in that case, and it is
  possible that this is unnecesary when every component is running in a container and
  the Docker networks are properly configured so that only the main backend can access 
  this microservice
*/
app.use(cors())
app.use(express.json())

app.get<{}>('/', (req, res) => {
  res.json({
    message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄',
  });
});

const whitelist = new Redis(process.env.REDIS_CONNECTION_STRING as string)

// We provide the whitelist to each request because many endpoints need it
// Signup and login require the whitelist to add tokens to it
// Logout requires it to invalidate tokens
// /auth/me requires it to verify the token is in the list
app.use(async (_req, res, next) => {
  res.locals.whitelist = whitelist;
  return next();
});

app.get<{}, MessageResponse>('/ping', async (_, res) => {
  const ping = await whitelist.ping();
  res.json({ message: ping });
})

app.use(signup)
app.use(login)
app.use(auth_me)
app.use(logout)
app.use(deleteAuth)

export default app