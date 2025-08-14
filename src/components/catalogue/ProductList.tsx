import React from 'react';
import ProductCard from './ProductCard';
import { Product } from '@/types/product';

type ProductListProps = {
    products: Product[];
};

export default function ProductList({ products }: ProductListProps) {
    return (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </section>
    );
}
