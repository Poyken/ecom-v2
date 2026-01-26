/*
  Warnings:

  - You are about to drop the column `attributes` on the `skus` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "skus" DROP COLUMN "attributes";

-- CreateTable
CREATE TABLE "sku_values" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "skuId" UUID NOT NULL,
    "optionValueId" UUID NOT NULL,

    CONSTRAINT "sku_values_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "sku_values_skuId_idx" ON "sku_values"("skuId");

-- CreateIndex
CREATE INDEX "sku_values_optionValueId_idx" ON "sku_values"("optionValueId");

-- CreateIndex
CREATE UNIQUE INDEX "sku_values_skuId_optionValueId_key" ON "sku_values"("skuId", "optionValueId");

-- AddForeignKey
ALTER TABLE "sku_values" ADD CONSTRAINT "sku_values_skuId_fkey" FOREIGN KEY ("skuId") REFERENCES "skus"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sku_values" ADD CONSTRAINT "sku_values_optionValueId_fkey" FOREIGN KEY ("optionValueId") REFERENCES "option_values"("id") ON DELETE CASCADE ON UPDATE CASCADE;
