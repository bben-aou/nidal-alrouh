/*
  Warnings:

  - You are about to drop the column `is_active` on the `prompts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "prompts" DROP COLUMN "is_active",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "reflections" ADD COLUMN     "wordCount" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "reflections_userId_createdAt_idx" ON "reflections"("userId", "createdAt");
