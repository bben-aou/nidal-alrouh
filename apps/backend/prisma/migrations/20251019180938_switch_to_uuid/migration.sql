/*
  Warnings:

  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `id` on the `users` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- Step 1: Add a temporary UUID column
ALTER TABLE "users" ADD COLUMN "id_new" UUID DEFAULT gen_random_uuid();

-- Step 2: Update all rows to have UUID values
UPDATE "users" SET "id_new" = gen_random_uuid();

-- Step 3: Drop the primary key constraint
ALTER TABLE "users" DROP CONSTRAINT "users_pkey";

-- Step 4: Drop the old id column
ALTER TABLE "users" DROP COLUMN "id";

-- Step 5: Rename the new column to id
ALTER TABLE "users" RENAME COLUMN "id_new" TO "id";

-- Step 6: Make the new id column NOT NULL and set as primary key
ALTER TABLE "users" ALTER COLUMN "id" SET NOT NULL;
ALTER TABLE "users" ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");
