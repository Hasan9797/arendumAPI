/*
  Warnings:

  - You are about to drop the column `expire` on the `UserToken` table. All the data in the column will be lost.
  - You are about to drop the column `token` on the `UserToken` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserToken" DROP COLUMN "expire",
DROP COLUMN "token",
ADD COLUMN     "access_token" TEXT,
ADD COLUMN     "refresh_token" TEXT;
