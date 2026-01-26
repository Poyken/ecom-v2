export declare class CreateOptionValueDto {
    value: string;
    displayName: string;
}
export declare class CreateProductOptionDto {
    name: string;
    values: CreateOptionValueDto[];
}
export declare class CreateSkuValueDto {
    optionName: string;
    value: string;
}
export declare class CreateSkuDto {
    sku: string;
    price: number;
    comparePrice?: number;
    stock: number;
    optionValues: CreateSkuValueDto[];
}
export declare class CreateProductDto {
    name: string;
    slug: string;
    description?: string;
    basePrice: number;
    categoryId?: string;
    options: CreateProductOptionDto[];
    skus: CreateSkuDto[];
}
export declare class CreateCategoryDto {
    name: string;
    slug: string;
    description?: string;
    parentId?: string;
}
