/*
  Warnings:

  - You are about to drop the `Message` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MessageReply` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MessageReply" DROP CONSTRAINT "MessageReply_messageId_fkey";

-- DropTable
DROP TABLE "Message";

-- DropTable
DROP TABLE "MessageReply";

-- CreateTable
CREATE TABLE "messages" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message_replies" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "messageId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "message_replies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "message_replies_messageId_key" ON "message_replies"("messageId");

-- AddForeignKey
ALTER TABLE "message_replies" ADD CONSTRAINT "message_replies_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "messages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
