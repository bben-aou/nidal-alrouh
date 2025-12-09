/*
  Warnings:

  - You are about to drop the `message_read_receipts` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('workshop', 'supportSession', 'consultation', 'communityMeeting', 'webinar');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('upcoming', 'ongoing', 'completed', 'cancelled');

-- DropForeignKey
ALTER TABLE "public"."message_read_receipts" DROP CONSTRAINT "message_read_receipts_messageId_fkey";

-- DropForeignKey
ALTER TABLE "public"."message_read_receipts" DROP CONSTRAINT "message_read_receipts_userId_fkey";

-- DropTable
DROP TABLE "public"."message_read_receipts";

-- CreateTable
CREATE TABLE "events" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "EventType" NOT NULL,
    "status" "EventStatus" NOT NULL DEFAULT 'upcoming',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "timezone" TEXT NOT NULL,
    "location" TEXT,
    "meetingUrl" TEXT,
    "maxAttendees" INTEGER,
    "currentAttendees" INTEGER NOT NULL DEFAULT 0,
    "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
    "coverImage" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "organizerId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "events_status_startDate_idx" ON "events"("status", "startDate");

-- CreateIndex
CREATE INDEX "events_type_startDate_idx" ON "events"("type", "startDate");

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
