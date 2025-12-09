/*
  Warnings:

  - You are about to drop the column `encryptedContent` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `keyFingerprint` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `nonce` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the `conversation_participants_v2` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `conversations_v2` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `message_seen_v2` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `messages_v2` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `content` on table `messages` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "HelperStatus" AS ENUM ('PENDING_VERIFICATION', 'VERIFIED', 'AUTO_VERIFIED', 'SUSPENDED', 'REJECTED');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW');

-- DropForeignKey
ALTER TABLE "conversation_participants_v2" DROP CONSTRAINT "conversation_participants_v2_conversationId_fkey";

-- DropForeignKey
ALTER TABLE "conversation_participants_v2" DROP CONSTRAINT "conversation_participants_v2_userId_fkey";

-- DropForeignKey
ALTER TABLE "conversations_v2" DROP CONSTRAINT "conversations_v2_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "message_seen_v2" DROP CONSTRAINT "message_seen_v2_messageId_fkey";

-- DropForeignKey
ALTER TABLE "message_seen_v2" DROP CONSTRAINT "message_seen_v2_userId_fkey";

-- DropForeignKey
ALTER TABLE "messages_v2" DROP CONSTRAINT "messages_v2_conversationId_fkey";

-- DropForeignKey
ALTER TABLE "messages_v2" DROP CONSTRAINT "messages_v2_senderId_fkey";

-- AlterTable
ALTER TABLE "messages" DROP COLUMN "encryptedContent",
DROP COLUMN "keyFingerprint",
DROP COLUMN "nonce",
ALTER COLUMN "content" SET NOT NULL;

-- DropTable
DROP TABLE "conversation_participants_v2";

-- DropTable
DROP TABLE "conversations_v2";

-- DropTable
DROP TABLE "message_seen_v2";

-- DropTable
DROP TABLE "messages_v2";

-- DropEnum
DROP TYPE "ConversationTypeV2";

-- DropEnum
DROP TYPE "ParticipantRoleV2";

-- CreateTable
CREATE TABLE "helper_profiles" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "status" "HelperStatus" NOT NULL DEFAULT 'AUTO_VERIFIED',
    "bio" TEXT NOT NULL,
    "specializations" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "languages" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "maxSessionsPerWeek" INTEGER DEFAULT 4,
    "calUsername" TEXT,
    "calEventTypeId" TEXT,
    "bookingUrl" TEXT,
    "licenseNumber" TEXT,
    "yearsOfExperience" INTEGER,
    "verificationDocs" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "verifiedAt" TIMESTAMP(3),
    "verifiedBy" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "helper_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "support_sessions" (
    "id" UUID NOT NULL,
    "seekerId" UUID NOT NULL,
    "helperId" UUID NOT NULL,
    "helperProfileId" UUID NOT NULL,
    "status" "SessionStatus" NOT NULL DEFAULT 'SCHEDULED',
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL DEFAULT 50,
    "calBookingId" TEXT,
    "calBookingUid" TEXT,
    "meetingUrl" TEXT,
    "topic" TEXT,
    "seekerNote" TEXT,
    "helperNote" TEXT,
    "completedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "cancelledBy" UUID,
    "cancelReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "support_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session_feedback" (
    "id" UUID NOT NULL,
    "sessionId" UUID NOT NULL,
    "seekerId" UUID NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "session_feedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "helper_profiles_userId_key" ON "helper_profiles"("userId");

-- CreateIndex
CREATE INDEX "helper_profiles_status_idx" ON "helper_profiles"("status");

-- CreateIndex
CREATE INDEX "helper_profiles_calUsername_idx" ON "helper_profiles"("calUsername");

-- CreateIndex
CREATE UNIQUE INDEX "support_sessions_calBookingUid_key" ON "support_sessions"("calBookingUid");

-- CreateIndex
CREATE INDEX "support_sessions_seekerId_scheduledAt_idx" ON "support_sessions"("seekerId", "scheduledAt");

-- CreateIndex
CREATE INDEX "support_sessions_helperId_scheduledAt_idx" ON "support_sessions"("helperId", "scheduledAt");

-- CreateIndex
CREATE INDEX "support_sessions_status_scheduledAt_idx" ON "support_sessions"("status", "scheduledAt");

-- CreateIndex
CREATE INDEX "support_sessions_calBookingId_idx" ON "support_sessions"("calBookingId");

-- CreateIndex
CREATE UNIQUE INDEX "session_feedback_sessionId_key" ON "session_feedback"("sessionId");

-- CreateIndex
CREATE INDEX "session_feedback_seekerId_idx" ON "session_feedback"("seekerId");

-- CreateIndex
CREATE INDEX "session_feedback_rating_idx" ON "session_feedback"("rating");

-- AddForeignKey
ALTER TABLE "helper_profiles" ADD CONSTRAINT "helper_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_sessions" ADD CONSTRAINT "support_sessions_seekerId_fkey" FOREIGN KEY ("seekerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_sessions" ADD CONSTRAINT "support_sessions_helperId_fkey" FOREIGN KEY ("helperId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_sessions" ADD CONSTRAINT "support_sessions_helperProfileId_fkey" FOREIGN KEY ("helperProfileId") REFERENCES "helper_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_feedback" ADD CONSTRAINT "session_feedback_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "support_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_feedback" ADD CONSTRAINT "session_feedback_seekerId_fkey" FOREIGN KEY ("seekerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
