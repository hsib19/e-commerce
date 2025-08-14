export interface ProductImage {
    url: string;
    color: string
    main: boolean;
}

export interface ProductVariant {
    color: string;
}

export interface Product {
    id: number;
    name: string;
    price: number;
    discount?: number;
    description?: string; 
    images: ProductImage[];
    variants?: ProductVariant[];
    whatsInTheBox?: string[];
    slug: string;
    tags: string[];
}
