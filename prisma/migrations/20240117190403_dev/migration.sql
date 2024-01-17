/*
  Warnings:

  - Added the required column `algorithm` to the `Totp` table without a default value. This is not possible if the table is not empty.
  - Added the required column `digits` to the `Totp` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Totp" ADD COLUMN     "algorithm" TEXT NOT NULL,
ADD COLUMN     "digits" INTEGER NOT NULL;
