import { NextFunction, Request, Response } from "express"
import { MessageUsecase } from "../usecase/message-usecase"
import { Helper, ResponseParams } from "../helper/response"
import { MessageRequest } from "../application/model/message-model"
import { broadcastMessage } from "../main"

export class MessageHandler {
  static async createMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const request: MessageRequest = req.body as MessageRequest

      const message = await MessageUsecase.createMessage(request)
      console.log(message)

      const param: ResponseParams = {
        status_code: 201,
        message: message,
      }

      res.status(201).json(Helper.Response(param))
    } catch (error) {
      next(error)
    }
  }

  static async createReply(req: Request, res: Response, next: NextFunction) {
    try {
      const request: MessageRequest = req.body as MessageRequest
      const id = parseInt(req.params.id)
      const message = await MessageUsecase.createReply(id, request)
      console.log(message)

      const param: ResponseParams = {
        status_code: 201,
        message: message,
      }
      res.status(201).json(Helper.Response(param))
    } catch (error) {
      next(error)
    }
  }

  static async getAllMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await MessageUsecase.getAllMessage()
      const param: ResponseParams = {
        status_code: 200,
        message: "Success get all message",
        data: response,
      }
      res.status(200).json(Helper.Response(param))
    } catch (error) {
      next(error)
    }
  }

  static async likeMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id)
      const message = await MessageUsecase.likeMessage(id)
      console.log(message)

      const param: ResponseParams = {
        status_code: 200,
        message: message,
      }
      res.status(200).json(Helper.Response(param))
    } catch (error) {
      next(error)
    }
  }

  static async dislikeMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id)
      const message = await MessageUsecase.dislikeMessage(id)

      const param: ResponseParams = {
        status_code: 200,
        message: message,
      }
      res.status(200).json(Helper.Response(param))
    } catch (error) {
      next(error)
    }
  }

  static async handleOTP(req: Request, res: Response, next: NextFunction) {
    try {
      const { otp } = req.body
      const response = await MessageUsecase.otpVerification(otp)
      const param: ResponseParams = {
        status_code: 200,
        message: "Success OTP verification",
        data: response,
      }
      res.status(200).json(Helper.Response(param))
    } catch (error) {
      next(error)
    }
  }

  static async deleteMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id)
      const message = await MessageUsecase.deleteMessage(id)
      const param: ResponseParams = {
        status_code: 200,
        message: message,
      }
      res.status(200).json(Helper.Response(param))
    } catch (error) {
      next(error)
    }
  }

  static async deleteMessageReply(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = parseInt(req.params.id)
      const message = await MessageUsecase.deleteMessageReply(id)
      const param: ResponseParams = {
        status_code: 200,
        message: message,
      }
      res.status(200).json(Helper.Response(param))
    } catch (error) {
      next(error)
    }
  }
}
