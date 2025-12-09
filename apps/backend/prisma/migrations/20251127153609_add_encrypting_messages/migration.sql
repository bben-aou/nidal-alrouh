/*
  Warnings:

  - A unique constraint covering the columns `[eventId,userId]` on the table `event_registrations` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "RegistrationStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ResourceType" AS ENUM ('ARTICLE', 'VIDEO', 'LINK');

-- DropIndex
DROP INDEX "event_registrations_userId_eventId_key";

-- AlterTable
ALTER TABLE "event_registrations" ADD COLUMN     "notes" TEXT,
ADD COLUMN     "status" "RegistrationStatus" NOT NULL DEFAULT 'CONFIRMED';

-- AlterTable
ALTER TABLE "messages" ADD COLUMN     "encryptedPayload" JSONB;

-- CreateTable
CREATE TABLE "conversation_keys" (
    "id" UUID NOT NULL,
    "roomId" UUID NOT NULL,
    "keyVersion" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "edkCipher" BYTEA NOT NULL,
    "edkNonce" BYTEA NOT NULL,
    "edkAuthTag" BYTEA,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rotatedAt" TIMESTAMP(3),

    CONSTRAINT "conversation_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resources" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "ResourceType" NOT NULL,
    "content" TEXT,
    "url" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "authorId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resource_views" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "resourceId" UUID NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "resource_views_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resource_bookmarks" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "resourceId" UUID NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "resource_bookmarks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resource_completions" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "resourceId" UUID NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "resource_completions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_resource_preferences" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "tag" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_resource_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "conversation_keys_roomId_key" ON "conversation_keys"("roomId");

-- CreateIndex
CREATE INDEX "resources_type_createdAt_idx" ON "resources"("type", "createdAt");

-- CreateIndex
CREATE INDEX "resources_authorId_idx" ON "resources"("authorId");

-- CreateIndex
CREATE INDEX "resource_views_userId_viewedAt_idx" ON "resource_views"("userId", "viewedAt");

-- CreateIndex
CREATE INDEX "resource_views_resourceId_viewedAt_idx" ON "resource_views"("resourceId", "viewedAt");

-- CreateIndex
CREATE INDEX "resource_bookmarks_userId_updatedAt_idx" ON "resource_bookmarks"("userId", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "resource_bookmarks_userId_resourceId_key" ON "resource_bookmarks"("userId", "resourceId");

-- CreateIndex
CREATE INDEX "resource_completions_userId_completedAt_idx" ON "resource_completions"("userId", "completedAt");

-- CreateIndex
CREATE UNIQUE INDEX "resource_completions_userId_resourceId_key" ON "resource_completions"("userId", "resourceId");

-- CreateIndex
CREATE INDEX "user_resource_preferences_userId_score_idx" ON "user_resource_preferences"("userId", "score");

-- CreateIndex
CREATE UNIQUE INDEX "user_resource_preferences_userId_tag_key" ON "user_resource_preferences"("userId", "tag");

-- CreateIndex
CREATE INDEX "event_registrations_userId_idx" ON "event_registrations"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "event_registrations_eventId_userId_key" ON "event_registrations"("eventId", "userId");

-- AddForeignKey
ALTER TABLE "conversation_keys" ADD CONSTRAINT "conversation_keys_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "chat_rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resources" ADD CONSTRAINT "resources_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resource_views" ADD CONSTRAINT "resource_views_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resource_views" ADD CONSTRAINT "resource_views_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "resources"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resource_bookmarks" ADD CONSTRAINT "resource_bookmarks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resource_bookmarks" ADD CONSTRAINT "resource_bookmarks_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "resources"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resource_completions" ADD CONSTRAINT "resource_completions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resource_completions" ADD CONSTRAINT "resource_completions_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "resources"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_resource_preferences" ADD CONSTRAINT "user_resource_preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
