import express from "express"

import morgan from "morgan"
import helmet from "helmet"
import cors from "cors"
import signup from "./routes/signup"
import login from "./routes/login"

import dotenv from "dotenv"

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

app.use(signup)
app.use(login)

export default app