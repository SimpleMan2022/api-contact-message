export type MessageRequest = {
  avatar: string
  username: string
  content: string
}

export type MessageReplyRequest = {
  content: string
}

export type GetAllMessageResponse = {
  sender: GetMessageResponse
  reply: GetReplyResponse | null
}

export type GetReplyResponse = {
  id: number
  content: string
  created_at: string
}

export type GetMessageResponse = {
  id: number
  username: string
  avatar: string
  content: string
  likes: number
  created_at: string
}
