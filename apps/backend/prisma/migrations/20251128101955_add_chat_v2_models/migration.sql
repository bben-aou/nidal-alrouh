/*
  Warnings:

  - You are about to drop the column `encryptedContent` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `keyFingerprint` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `nonce` on the `messages` table. All the data in the column will be lost.
  - Made the column `content` on table `messages` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "ConversationTypeV2" AS ENUM ('DM', 'CHANNEL');

-- CreateEnum
CREATE TYPE "ParticipantRoleV2" AS ENUM ('CREATOR', 'MEMBER');


-- CreateTable
CREATE TABLE "conversations_v2" (
    "id" UUID NOT NULL,
    "type" "ConversationTypeV2" NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "creatorId" UUID,
    "isPaused" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "conversations_v2_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversation_participants_v2" (
    "id" UUID NOT NULL,
    "conversationId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "role" "ParticipantRoleV2" NOT NULL DEFAULT 'MEMBER',
    "encryptedSymmetricKey" TEXT,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leftAt" TIMESTAMP(3),
    "lastReadAt" TIMESTAMP(3),

    CONSTRAINT "conversation_participants_v2_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages_v2" (
    "id" UUID NOT NULL,
    "conversationId" UUID NOT NULL,
    "senderId" UUID NOT NULL,
    "encryptedContent" TEXT NOT NULL,
    "initializationVector" TEXT NOT NULL,
    "authTag" TEXT NOT NULL,
    "encryptedMetadata" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "messages_v2_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message_seen_v2" (
    "id" UUID NOT NULL,
    "messageId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "seenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "message_seen_v2_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "conversations_v2_type_createdAt_idx" ON "conversations_v2"("type", "createdAt");

-- CreateIndex
CREATE INDEX "conversations_v2_creatorId_idx" ON "conversations_v2"("creatorId");

-- CreateIndex
CREATE INDEX "conversation_participants_v2_userId_idx" ON "conversation_participants_v2"("userId");

-- CreateIndex
CREATE INDEX "conversation_participants_v2_conversationId_leftAt_idx" ON "conversation_participants_v2"("conversationId", "leftAt");

-- CreateIndex
CREATE UNIQUE INDEX "conversation_participants_v2_conversationId_userId_key" ON "conversation_participants_v2"("conversationId", "userId");

-- CreateIndex
CREATE INDEX "messages_v2_conversationId_createdAt_idx" ON "messages_v2"("conversationId", "createdAt");

-- CreateIndex
CREATE INDEX "messages_v2_senderId_idx" ON "messages_v2"("senderId");

-- CreateIndex
CREATE INDEX "message_seen_v2_userId_seenAt_idx" ON "message_seen_v2"("userId", "seenAt");

-- CreateIndex
CREATE UNIQUE INDEX "message_seen_v2_messageId_userId_key" ON "message_seen_v2"("messageId", "userId");

-- AddForeignKey
ALTER TABLE "conversations_v2" ADD CONSTRAINT "conversations_v2_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversation_participants_v2" ADD CONSTRAINT "conversation_participants_v2_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "conversations_v2"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversation_participants_v2" ADD CONSTRAINT "conversation_participants_v2_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages_v2" ADD CONSTRAINT "messages_v2_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "conversations_v2"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages_v2" ADD CONSTRAINT "messages_v2_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_seen_v2" ADD CONSTRAINT "message_seen_v2_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "messages_v2"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_seen_v2" ADD CONSTRAINT "message_seen_v2_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
