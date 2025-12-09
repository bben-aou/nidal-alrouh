-- AlterTable
ALTER TABLE "messages" ADD COLUMN     "encryptedContent" TEXT,
ADD COLUMN     "keyFingerprint" TEXT,
ADD COLUMN     "nonce" TEXT,
ALTER COLUMN "content" DROP NOT NULL;
