import express from "express"

import morgan from "morgan"
import helmet from "helmet"
import cors from "cors"

const app = express()

//I use dev because this microservice won't be run in production. We aren'interested
//in deploying it to the cloud, just in showing it running locally in class.
//If this were a constantly running production app we would use "combined"
app.use(morgan("dev"))
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

export default app