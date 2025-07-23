/*
  Warnings:

  - Added the required column `fullName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UrlPing" DROP CONSTRAINT "UrlPing_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "fullName" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "UrlPing" ADD CONSTRAINT "UrlPing_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
