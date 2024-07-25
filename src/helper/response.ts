export type ResponseParams = {
  status_code: number
  message: string
  data?: any
}

export type ResponseErrorParams = {
  status: string
  status_code: number
  errors: any
}

export type ResponseWithData = {
  status: string
  status_code: number
  message: string
  data: any
}

export type ResponseWithoutData = {
  status: string
  status_code: number
  message: string
}

export class Helper {
  static Response(
    param: ResponseParams
  ): ResponseWithData | ResponseWithoutData {
    var status: string
    if (param.status_code >= 200 && param.status_code < 300) {
      status = "success"
    } else {
      status = "failed"
    }
    if (param.data) {
      return {
        status: status,
        status_code: param.status_code,
        message: param.message,
        data: param.data,
      }
    } else {
      return {
        status: status,
        status_code: param.status_code,
        message: param.message,
      }
    }
  }
}
