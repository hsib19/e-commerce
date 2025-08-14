// src/hooks/useProductSearch.ts
import { searchProducts } from "@/services/productsService";
import { Product } from "@/types/product";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface UseProductSearchResult {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    products: Product[];
    isLoading: boolean;
    isError: boolean;
}

/**
 * Custom hook for searching products based on a keyword.
 * Uses React Query for data fetching and caching.
 */
export function useProductSearch(): UseProductSearchResult {
    const [searchTerm, setSearchTerm] = useState("");

    const {
        data: products = [],
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["products", searchTerm],
        queryFn: () => searchProducts(searchTerm),
        enabled: searchTerm.trim().length > 0, // Only fetch if search term is not empty
    });

    return {
        searchTerm,
        setSearchTerm,
        products,
        isLoading,
        isError,
    };
}
