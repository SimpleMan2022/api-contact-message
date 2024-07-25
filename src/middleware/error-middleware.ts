import { NextFunction, Request, Response } from "express"
import { ResponseError } from "../error/response-error"
import { Helper, ResponseErrorParams, ResponseParams } from "../helper/response"
import { ZodError } from "zod"

function formattedZodError(error: ZodError) {
  return error.errors.map((err) => ({
    field: err.path.join("."),
    message: err.message,
  }))
}

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ZodError) {
    const format = formattedZodError(err)

    const params: ResponseErrorParams = {
      status: "Failed",
      status_code: 400,
      errors: format,
    }
    return res.status(400).json(params)
  } else if (err instanceof ResponseError) {
    const params: ResponseParams = {
      status_code: err.status,
      message: err.message,
    }
    res.status(err.status).json(Helper.Response(params))
  } else {
    res.status(500).json({
      errors: "Internal server error",
    })
  }
}
