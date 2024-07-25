import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"
import { broadcastMessage } from "../main"

dotenv.config()

const SUPABASE_URL = process.env.SUPABASE_URL as string
const SUPABASE_KEY = process.env.SUPABASE_KEY as string

export const client = createClient(SUPABASE_URL, SUPABASE_KEY)

client
  .channel("realtime:public:messages")
  .on(
    "postgres_changes",
    { event: "*", schema: "public", table: "messages" },
    (payload) => {
      broadcastMessage(payload.new)
    }
  )
  .subscribe()

client
  .channel("realtime:public:message_replies")
  .on(
    "postgres_changes",
    { event: "*", schema: "public", table: "message_replies" },
    (payload) => {
      broadcastMessage(payload.new)
    }
  )
  .subscribe()
