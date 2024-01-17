/*
  Warnings:

  - Added the required column `interval` to the `Totp` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeOrigin` to the `Totp` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Totp" ADD COLUMN     "interval" INTEGER NOT NULL,
ADD COLUMN     "registered" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "timeOrigin" INTEGER NOT NULL;
