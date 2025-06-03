import app from "./app"

const internalPort = process.env.INTERNAL_PORT
app.listen(internalPort, () => {
    console.log(`Listening inside the docker network on port ${internalPort}`)

    const exposedPort = process.env.EXPOSED_PORT
    console.log(`You can connect to it through http://localhost:${exposedPort}`)
})
