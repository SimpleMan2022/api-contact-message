import {
  GetAllMessageResponse,
  MessageReplyRequest,
  MessageRequest,
} from "../application/model/message-model"
import { client } from "../application/database"
import xss from "xss"
import { containsXSS } from "../middleware/xss"
import { ResponseError } from "../error/response-error"
import { Validation } from "../validation/validate"
import { MessageValidation } from "../validation/message-validation"
import { ENV } from "../constant/variable"
import { HelperToken } from "../helper/token"

export class MessageUsecase {
  static async createMessage(request: MessageRequest): Promise<string> {
    const { avatar, username, content }: MessageRequest = Validation.validate(
      request,
      MessageValidation.CREATE_MESSAGES
    )

    if (containsXSS(username) || containsXSS(content)) {
      throw new ResponseError(
        "Ojo neko-neko kowe! Mbok pikir aku iki gampang diapusi nganggo XSS?",
        400
      )
    }
    const sanitizedUsername: string = xss(username)
    const sanitizedContent: string = xss(content)

    const message = await client.from("messages").insert([
      {
        username: sanitizedUsername,
        avatar: avatar,
        content: sanitizedContent,
      },
    ])
    console.log(message)

    if (message.error) {
      throw new ResponseError(message.error.message, 500)
    }

    return "Message has been sent!"
  }

  static async createReply(
    id: number,
    request: MessageReplyRequest
  ): Promise<string> {
    const { content }: MessageReplyRequest = Validation.validate(
      request,
      MessageValidation.MESSAGE_REPLY
    )

    if (containsXSS(content)) {
      throw new ResponseError(
        "Ojo neko-neko kowe! Mbok pikir aku iki gampang diapusi nganggo XSS?!Yen ngganggu terus, tak laporke polisi saiki yo!",
        400
      )
    }

    const sanitizedContent: string = xss(content)

    const message = await client.from("message_replies").insert([
      {
        messageId: id,
        content: sanitizedContent,
      },
    ])

    if (message.error) {
      throw new ResponseError(message.error.message, 500)
    }

    return "Reply has been sent!"
  }

  static async getAllMessage(): Promise<GetAllMessageResponse[]> {
    const { data, error } = await client
      .from("messages")
      .select(`*, message_replies(*)`)
      .order("createdAt", { ascending: false })

    if (error) {
      throw new ResponseError("Failed to get messages", 500)
    }

    const messages: GetAllMessageResponse[] = data.map((message: any) => {
      return {
        sender: {
          id: message.id,
          username: message.username,
          avatar: message.avatar,
          content: message.content,
          likes: message.likes,
          created_at: message.createdAt,
        },
        reply:
          message.message_replies.length > 0
            ? {
                id: message.message_replies[0].id,
                content: message.message_replies[0].content,
                created_at: message.message_replies[0].createdAt,
              }
            : null,
      }
    })

    return messages
  }

  static async likeMessage(id: number): Promise<string> {
    const { data, error } = await client
      .from("messages")
      .select("*")
      .eq("id", id)

    if (error) {
      throw new ResponseError("Failed to like message", 500)
    }

    if (data.length === 0) {
      throw new ResponseError("Message not found", 404)
    }

    const message = data[0]

    const { error: updateError } = await client
      .from("messages")
      .update({
        likes: message.likes + 1,
      })
      .eq("id", id)

    if (updateError) {
      throw new ResponseError("Failed to like message", 500)
    }

    return "Message has been liked!"
  }

  static async dislikeMessage(id: number): Promise<string> {
    const { data, error } = await client
      .from("messages")
      .select("*")
      .eq("id", id)

    if (error) {
      throw new ResponseError("Failed to dislike message", 500)
    }

    if (data.length === 0) {
      throw new ResponseError("Message not found", 404)
    }

    const message = data[0]

    if (message.likes === 0) {
      throw new ResponseError("Message has no likes", 400)
    }

    const { error: updateError } = await client
      .from("messages")
      .update({
        likes: message.likes - 1,
      })
      .eq("id", id)

    if (updateError) {
      throw new ResponseError("Failed to dislike message", 500)
    }

    return "Message has been disliked!"
  }

  static async otpVerification(pin: string): Promise<string> {
    if (pin != ENV.OTP_CODE) {
      throw new ResponseError("Invalid OTP code", 400)
    }
    return HelperToken.GenerateToken()
  }

  static async deleteMessage(id: number): Promise<string> {
    const response = await client.from("messages").delete().eq("id", id)
    console.log(response)

    if (response.error) {
      throw new ResponseError(response.error.message, 400)
    }

    return "Message has been deleted!"
  }
  static async deleteMessageReply(id: number): Promise<string> {
    const response = await client.from("message_replies").delete().eq("id", id)
    console.log(response)

    if (response.error) {
      throw new ResponseError(response.error.message, 400)
    }

    return "Message reply has been deleted!"
  }
}
