/*
  Warnings:

  - You are about to drop the column `totalAmount` on the `Order` table. All the data in the column will be lost.
  - Added the required column `subTotal` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "totalAmount",
ADD COLUMN     "discountAmount" DECIMAL(20,2) NOT NULL DEFAULT 0.00,
ADD COLUMN     "subTotal" DECIMAL(20,2) NOT NULL;
