import express, { NextFunction, Request, Response } from "express"
import { messageRoute } from "./route/message-route"
import { errorMiddleware } from "./middleware/error-middleware"
import morgan from "morgan"
import cors from "cors"
import { WebSocket, WebSocketServer } from "ws"
import { authRoute } from "./route/auth"
import dotenv from "dotenv"

dotenv.config()

const app = express()
app.use(cors())

app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Content-Security-Policy", "default-src 'self'")
  next()
})

app.use(express.json())
app.use(morgan("combined"))

app.use("/messages", messageRoute)
app.use("/auth", authRoute)

app.use(errorMiddleware)
export default app
const server = app.listen(3000, () => {
  console.log("Server is running on port 3000")
})

const wss = new WebSocketServer({ server, path: "/ws" })

wss.on("connection", (ws) => {
  console.log("New client connected")

  ws.on("message", (message) => {
    console.log("Received message from client:", message)
  })

  ws.on("close", (code, reason) => {
    console.log("Client disconnected", code, reason.toString())
  })

  ws.on("error", (error) => {
    console.error("WebSocket error:", error)
  })
})

export const broadcastMessage = (message: any) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      if (Object.keys(message).length === 4) {
        client.send(JSON.stringify({ sender: null, reply: message }))
        console.log("Broadcasting message:", { sender: null, reply: message })
      } else {
        client.send(JSON.stringify({ sender: message, reply: null }))
        console.log("Broadcasting message:", { sender: message, reply: null })
      }
    }
  })
}
