import api from "@/lib/apiClient";
import { AxiosResponse } from "axios";
import { Product } from "@/types/product";

// Semua produk
export const getProducts = async (): Promise<Product[]> => {
    const { data }: AxiosResponse<Product[]> = await api.get("/products");
    return data;
};

// Search produk
export const searchProducts = async (keyword: string): Promise<Product[]> => {
    const { data }: AxiosResponse<Product[]> = await api.get("/products", {
        params: { search: keyword },
    });
    return data;
};

// Detail produk berdasarkan slug
export const getProductBySlug = async (slug: string): Promise<Product> => {
    const { data }: AxiosResponse<Product> = await api.get(`/products/${slug}`);
    return data;
};
