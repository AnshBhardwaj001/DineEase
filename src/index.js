import express from "express"
import path from "path"
import { Server } from "socket.io";
import http, {get} from "http"


const app = new express()
const server = http.createServer(app)
const io = new Server(server)

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(process.cwd() , "/public")

app.use(express.static(publicDirectoryPath))

server.listen(port, () => {
    console.log('Server is up and running on port: ', port)
})   