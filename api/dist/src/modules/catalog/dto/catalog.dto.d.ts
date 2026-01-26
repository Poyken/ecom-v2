export declare class CreateCategoryDto {
    name: string;
    slug: string;
    description?: string;
    parentId?: string;
}
export declare class CreateSkuDto {
    sku: string;
    price: number;
    comparePrice?: number;
    stock: number;
    attributes?: any;
}
export declare class CreateProductDto {
    name: string;
    slug: string;
    description?: string;
    basePrice: number;
    categoryId?: string;
    skus: CreateSkuDto[];
}
