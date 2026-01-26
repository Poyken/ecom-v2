-- AlterTable
ALTER TABLE "products" ADD COLUMN     "costPrice" DECIMAL(10,2),
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "dimensions" JSONB,
ADD COLUMN     "publishedAt" TIMESTAMP(3),
ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "tags" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "weight" DECIMAL(8,3);

-- AlterTable
ALTER TABLE "skus" ADD COLUMN     "costPrice" DECIMAL(10,2),
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "dimensions" JSONB,
ADD COLUMN     "trackInventory" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "weight" DECIMAL(8,3);

-- CreateTable
CREATE TABLE "collections" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "collections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products_on_collections" (
    "productId" UUID NOT NULL,
    "collectionId" UUID NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "products_on_collections_pkey" PRIMARY KEY ("productId","collectionId")
);

-- CreateTable
CREATE TABLE "warehouses" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "address" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "warehouses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_items" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "skuId" UUID NOT NULL,
    "warehouseId" UUID NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "reserved" INTEGER NOT NULL DEFAULT 0,
    "reorderPoint" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventory_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "collections_tenantId_idx" ON "collections"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "collections_tenantId_slug_key" ON "collections"("tenantId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "warehouses_tenantId_code_key" ON "warehouses"("tenantId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_items_skuId_warehouseId_key" ON "inventory_items"("skuId", "warehouseId");

-- CreateIndex
CREATE INDEX "products_deletedAt_idx" ON "products"("deletedAt");

-- AddForeignKey
ALTER TABLE "collections" ADD CONSTRAINT "collections_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products_on_collections" ADD CONSTRAINT "products_on_collections_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products_on_collections" ADD CONSTRAINT "products_on_collections_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "collections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouses" ADD CONSTRAINT "warehouses_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_skuId_fkey" FOREIGN KEY ("skuId") REFERENCES "skus"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "warehouses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
