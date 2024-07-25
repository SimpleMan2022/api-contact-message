import jwt from "jsonwebtoken"
import { ENV } from "../constant/variable"

export class HelperToken {
  static GenerateToken(): string {
    return jwt.sign({}, ENV.SECRET_KEY, {
      expiresIn: "1d",
    })
  }
}
