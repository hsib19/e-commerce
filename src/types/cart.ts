import { Product } from "./product";

export interface CartItem {
    id: string;
    product: Product;
    variant?: string;
    quantity: number;
}

export interface CartState {
    items: CartItem[];
}

export interface AddToCartPayload {
    product: Product;
    variant?: string;
}
