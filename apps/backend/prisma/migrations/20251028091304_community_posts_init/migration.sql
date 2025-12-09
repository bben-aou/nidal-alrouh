-- CreateEnum
-- Optional: enable pg_trgm for faster ILIKE searches (if permitted)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TYPE "PostPrivacy" AS ENUM ('PUBLIC', 'FRIENDS_ONLY', 'PRIVATE');

-- CreateTable
CREATE TABLE "posts" (
    "id" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "userId" UUID NOT NULL,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "privacy" "PostPrivacy" NOT NULL DEFAULT 'PUBLIC',
    "locale" "SupportedPromptLocale" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" UUID NOT NULL,
    "postId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_likes" (
    "id" UUID NOT NULL,
    "postId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "post_likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_reports" (
    "id" UUID NOT NULL,
    "postId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "reason" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "post_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hidden_posts" (
    "id" UUID NOT NULL,
    "postId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hidden_posts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "posts_locale_createdAt_idx" ON "posts"("locale", "createdAt");

-- CreateIndex
CREATE INDEX "posts_userId_createdAt_idx" ON "posts"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "comments_postId_createdAt_idx" ON "comments"("postId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "post_likes_postId_userId_key" ON "post_likes"("postId", "userId");

-- CreateIndex
CREATE INDEX "post_reports_postId_status_idx" ON "post_reports"("postId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "hidden_posts_postId_userId_key" ON "hidden_posts"("postId", "userId");

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_likes" ADD CONSTRAINT "post_likes_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_likes" ADD CONSTRAINT "post_likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_reports" ADD CONSTRAINT "post_reports_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_reports" ADD CONSTRAINT "post_reports_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hidden_posts" ADD CONSTRAINT "hidden_posts_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hidden_posts" ADD CONSTRAINT "hidden_posts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
