/*
  Warnings:

  - Added the required column `type` to the `InventoryLog` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "InventoryLogType" AS ENUM ('IMPORT', 'EXPORT', 'ADJUST', 'SALE', 'RETURN', 'TRANSFER');

-- AlterTable
ALTER TABLE "InventoryLog" ADD COLUMN     "type" "InventoryLogType" NOT NULL,
ALTER COLUMN "reason" DROP NOT NULL;
