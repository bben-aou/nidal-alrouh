-- CreateEnum
CREATE TYPE "ChatRoomType" AS ENUM ('DM', 'GROUP');

-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "quotedPostId" UUID;

-- CreateTable
CREATE TABLE "chat_rooms" (
    "id" UUID NOT NULL,
    "type" "ChatRoomType" NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chat_rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "room_participants" (
    "id" UUID NOT NULL,
    "roomId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastReadAt" TIMESTAMP(3),

    CONSTRAINT "room_participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" UUID NOT NULL,
    "roomId" UUID NOT NULL,
    "senderId" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "room_participants_userId_idx" ON "room_participants"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "room_participants_roomId_userId_key" ON "room_participants"("roomId", "userId");

-- CreateIndex
CREATE INDEX "messages_roomId_createdAt_idx" ON "messages"("roomId", "createdAt");

-- CreateIndex
CREATE INDEX "posts_quotedPostId_idx" ON "posts"("quotedPostId");

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_quotedPostId_fkey" FOREIGN KEY ("quotedPostId") REFERENCES "posts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_participants" ADD CONSTRAINT "room_participants_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "chat_rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_participants" ADD CONSTRAINT "room_participants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "chat_rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
