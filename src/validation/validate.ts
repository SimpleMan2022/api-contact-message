import { ZodType } from "zod"

export class Validation {
  static validate<T>(data: T, schema: ZodType): T {
    return schema.parse(data)
  }
}
