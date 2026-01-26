import { CatalogService } from './catalog.service';
import { CreateCategoryDto, CreateProductDto } from './dto/catalog.dto';
export declare class CatalogController {
    private readonly catalogService;
    constructor(catalogService: CatalogService);
    createCategory(dto: CreateCategoryDto): Promise<{
        description: string | null;
        id: string;
        tenantId: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        parentId: string | null;
        image: string | null;
        sortOrder: number;
    }>;
    getCategories(): Promise<{
        description: string | null;
        id: string;
        tenantId: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        parentId: string | null;
        image: string | null;
        sortOrder: number;
    }[]>;
    createProduct(dto: CreateProductDto): Promise<{
        skus: {
            sku: string;
            id: string;
            tenantId: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            price: import("@prisma/client-runtime-utils").Decimal;
            comparePrice: import("@prisma/client-runtime-utils").Decimal | null;
            stock: number;
            attributes: import("@prisma/client/runtime/client").JsonValue;
            barcode: string | null;
            productId: string;
        }[];
    } & {
        description: string | null;
        id: string;
        tenantId: string;
        isActive: boolean;
        metadata: import("@prisma/client/runtime/client").JsonValue;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        status: string;
        slug: string;
        basePrice: import("@prisma/client-runtime-utils").Decimal;
        categoryId: string | null;
        brandId: string | null;
        shortDescription: string | null;
        images: import("@prisma/client/runtime/client").JsonValue;
        salePrice: import("@prisma/client-runtime-utils").Decimal | null;
    }>;
    getProducts(): Promise<({
        category: {
            description: string | null;
            id: string;
            tenantId: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            parentId: string | null;
            image: string | null;
            sortOrder: number;
        } | null;
        skus: {
            sku: string;
            id: string;
            tenantId: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            price: import("@prisma/client-runtime-utils").Decimal;
            comparePrice: import("@prisma/client-runtime-utils").Decimal | null;
            stock: number;
            attributes: import("@prisma/client/runtime/client").JsonValue;
            barcode: string | null;
            productId: string;
        }[];
    } & {
        description: string | null;
        id: string;
        tenantId: string;
        isActive: boolean;
        metadata: import("@prisma/client/runtime/client").JsonValue;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        status: string;
        slug: string;
        basePrice: import("@prisma/client-runtime-utils").Decimal;
        categoryId: string | null;
        brandId: string | null;
        shortDescription: string | null;
        images: import("@prisma/client/runtime/client").JsonValue;
        salePrice: import("@prisma/client-runtime-utils").Decimal | null;
    })[]>;
    getProduct(slug: string): Promise<{
        category: {
            description: string | null;
            id: string;
            tenantId: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            parentId: string | null;
            image: string | null;
            sortOrder: number;
        } | null;
        skus: {
            sku: string;
            id: string;
            tenantId: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            price: import("@prisma/client-runtime-utils").Decimal;
            comparePrice: import("@prisma/client-runtime-utils").Decimal | null;
            stock: number;
            attributes: import("@prisma/client/runtime/client").JsonValue;
            barcode: string | null;
            productId: string;
        }[];
        options: ({
            values: {
                id: string;
                tenantId: string;
                createdAt: Date;
                updatedAt: Date;
                sortOrder: number;
                optionId: string;
                value: string;
                displayName: string;
            }[];
        } & {
            id: string;
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            sortOrder: number;
            productId: string;
        })[];
    } & {
        description: string | null;
        id: string;
        tenantId: string;
        isActive: boolean;
        metadata: import("@prisma/client/runtime/client").JsonValue;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        status: string;
        slug: string;
        basePrice: import("@prisma/client-runtime-utils").Decimal;
        categoryId: string | null;
        brandId: string | null;
        shortDescription: string | null;
        images: import("@prisma/client/runtime/client").JsonValue;
        salePrice: import("@prisma/client-runtime-utils").Decimal | null;
    }>;
}
