/*
  Warnings:

  - You are about to drop the `TOTP` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TOTP" DROP CONSTRAINT "TOTP_userId_fkey";

-- DropTable
DROP TABLE "TOTP";

-- CreateTable
CREATE TABLE "Totp" (
    "userId" TEXT NOT NULL,
    "secret" TEXT NOT NULL,

    CONSTRAINT "Totp_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "Totp" ADD CONSTRAINT "Totp_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
