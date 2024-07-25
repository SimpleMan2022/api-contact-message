import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { ENV } from "../constant/variable"
import { ResponseError } from "../error/response-error"

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"]
  if (!authHeader) {
    throw new ResponseError("token not found", 401)
  }
  const token = authHeader && authHeader.split(" ")[1]

  if (token == null) {
    throw new ResponseError("token not found", 401)
  }
  jwt.verify(token, ENV.SECRET_KEY, (error) => {
    if (error) {
      throw new ResponseError(error.message, 401)
    }
    next()
  })
}
