/*
  Warnings:

  - You are about to drop the column `encryptedPayload` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the `conversation_keys` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `content` on table `messages` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "conversation_keys" DROP CONSTRAINT "conversation_keys_roomId_fkey";

-- AlterTable
ALTER TABLE "messages" DROP COLUMN "encryptedPayload",
ALTER COLUMN "content" SET NOT NULL;

-- DropTable
DROP TABLE "conversation_keys";
