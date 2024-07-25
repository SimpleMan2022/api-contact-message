import express from "express"
import rateLimit from "express-rate-limit"
import { MessageHandler } from "../handler/message-handler"
import { verifyToken } from "../middleware/jwt-middleware"

export const messageRoute = express.Router()

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  limit: 10,
  handler: (req, res, next, options) => {
    res.status(429).json({
      status: "failed",
      message: "Jangan banyak banyak kirim pesannya bang!",
    })
  },
})

messageRoute.get("/", MessageHandler.getAllMessage)
messageRoute.post("/", limiter, MessageHandler.createMessage)
messageRoute.delete(
  "/reply/:id",
  verifyToken,
  MessageHandler.deleteMessageReply
)
messageRoute.delete("/:id", verifyToken, MessageHandler.deleteMessage)
messageRoute.put("/:id/like", MessageHandler.likeMessage)
messageRoute.put("/:id/dislike", MessageHandler.dislikeMessage)
messageRoute.post("/:id/reply", verifyToken, MessageHandler.createReply)
