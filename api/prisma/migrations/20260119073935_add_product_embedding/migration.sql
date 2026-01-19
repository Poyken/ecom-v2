-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "embedding" vector(768);

-- CreateIndex
CREATE INDEX "idx_product_embedding" ON "Product"("embedding");
