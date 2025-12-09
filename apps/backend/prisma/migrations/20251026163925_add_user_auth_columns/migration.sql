/*
  Warnings:

  - Added the required column `passwordHash` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'SEEKER', 'HELPER', 'ADMIN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('pending', 'active', 'suspended');

-- CreateEnum
CREATE TYPE "ReflectionMood" AS ENUM ('VERY_HAPPY', 'HAPPY', 'NEUTRAL', 'SAD', 'VERY_SAD');

-- CreateEnum
CREATE TYPE "ReflectionPrivacy" AS ENUM ('PRIVATE', 'PUBLIC', 'FRIENDS_ONLY');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "emailVerifiedAt" TIMESTAMP(3),
ADD COLUMN     "passwordHash" TEXT NOT NULL,
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'USER',
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'active';

-- CreateTable
CREATE TABLE "user_sessions" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "refreshTokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "userAgent" TEXT,
    "ip" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reflections" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "mood" "ReflectionMood" NOT NULL,
    "privacy" "ReflectionPrivacy" NOT NULL DEFAULT 'PRIVATE',
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reflections_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reflections" ADD CONSTRAINT "reflections_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
