-- CreateEnum
CREATE TYPE "SupportedPromptLocale" AS ENUM ('en', 'fr', 'ar');

-- CreateTable
CREATE TABLE "prompts" (
    "id" UUID NOT NULL,
    "category" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prompts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prompt_translations" (
    "id" UUID NOT NULL,
    "promptId" UUID NOT NULL,
    "locale" "SupportedPromptLocale" NOT NULL,
    "text" TEXT NOT NULL,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prompt_translations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "prompt_translations_promptId_locale_key" ON "prompt_translations"("promptId", "locale");

-- AddForeignKey
ALTER TABLE "prompt_translations" ADD CONSTRAINT "prompt_translations_promptId_fkey" FOREIGN KEY ("promptId") REFERENCES "prompts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
