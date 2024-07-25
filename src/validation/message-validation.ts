import { ZodType, z } from "zod"

export class MessageValidation {
  static readonly CREATE_MESSAGES: ZodType = z.object({
    username: z
      .string()
      .nullable()
      .refine(
        (val) => {
          if (val === null || val === "") return true
          return val.length >= 3 && val.length <= 12
        },
        {
          message: "Username must be between 3 and 12 characters",
        }
      ),
    content: z
      .string()
      .min(3, "Message must be at least 3 characters")
      .max(300, "Message must be less than 300 characters"),
    avatar: z
      .string()
      .refine((val) => avatarList.some((avatar) => avatar.src === val), {
        message: "Invalid avatar URL",
      }),
  })

  static readonly MESSAGE_REPLY: ZodType = z.object({
    content: z
      .string()
      .min(3, "Message must be at least 3 characters")
      .max(300, "Message must be less than 300 characters"),
  })
}

interface Avatar {
  src: string
  alt: string
}

export const avatarList: Avatar[] = [
  {
    src: "https://res.cloudinary.com/destjdrbz/image/upload/v1721633556/avatar/avatar-3_mcx4h9.png",
    alt: "PHP Meme",
  },
  {
    src: "https://res.cloudinary.com/destjdrbz/image/upload/v1721633556/avatar/avatar-5_zwccy9.jpg",
    alt: "Cartoon that idk the name",
  },
  {
    src: "https://res.cloudinary.com/destjdrbz/image/upload/v1721633556/avatar/avatar-1_myxuwr.jpg",
    alt: "Cat give thumbs up",
  },
  {
    src: "https://res.cloudinary.com/destjdrbz/image/upload/v1721633555/avatar/avatar-2_yigxvz.png",
    alt: "Simpson boy",
  },
  {
    src: "https://res.cloudinary.com/destjdrbz/image/upload/v1721633556/avatar/avatar-2_xsog7v.jpg",
    alt: "Sad Dog",
  },
  {
    src: "https://res.cloudinary.com/destjdrbz/image/upload/v1721633556/avatar/avatar-4_hdiicm.jpg",
    alt: "Simpson fat guy",
  },
]
