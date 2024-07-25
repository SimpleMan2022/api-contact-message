import express from "express"
import rateLimit from "express-rate-limit"
import { MessageHandler } from "../handler/message-handler"

export const authRoute = express.Router()

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  limit: 5,
  handler: (req, res, next, options) => {
    res.status(429).json({
      status: "failed",
      message: "Jangan DDOS Bang heker plis",
    })
  },
})

authRoute.post("/login", limiter, MessageHandler.handleOTP)
