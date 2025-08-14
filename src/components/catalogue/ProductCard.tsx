import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '../../types/product';
import { formatCurrency } from '../../utils/currency';

// Mapping warna ke hex, tambahkan fallback dengan warna abu-abu
const colorMap: Record<string, string> = {
    Silver: '#C0C0C0',
    Black: '#000000',
    // Bisa ditambah warna lain di sini
};

// Fungsi ekstrak text dari HTML string
function extractText(html: string) {
    if (typeof window === 'undefined') {
        // SSR: hapus tag HTML dengan regex sederhana
        return html.replace(/<[^>]+>/g, '');
    }
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
}

type ProductCardProps = {
    product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
    // Extract preview text dari description
    const rawText = product.description ? extractText(product.description) : '';
    const previewText = rawText.length > 100 ? rawText.slice(0, 100) + '...' : rawText;

    // State untuk tracking mounting dan warna terpilih
    const [mounted, setMounted] = useState(false);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);

    // Set mounted true setelah render pertama (untuk safe DOM access)
    useEffect(() => {
        setMounted(true);
    }, []);

    // Set warna default dari variant pertama saat product.variants berubah
    useEffect(() => {
        if (product.variants?.length) {
            setSelectedColor(product.variants[0].color);
        }
    }, [product.variants]);

    // Cari gambar sesuai warna terpilih, kalau gak ada fallback ke main image atau image pertama
    const mainImageUrl = useMemo(() => {
        const imageByColor = product.images.find(img => img.color === selectedColor);
        if (imageByColor) return imageByColor.url;

        const mainImg = product.images.find(img => img.main);
        return mainImg ? mainImg.url : product.images[0]?.url || '';
    }, [product.images, selectedColor]);

    // Hitung harga diskon (jika ada)
    const discountedPrice = useMemo(() => {
        return product.discount
            ? product.price * (1 - product.discount / 100)
            : product.price;
    }, [product.price, product.discount]);

    return (
        <Link href={`/product/${product.slug}`} passHref data-testid={`card-product-${product.id}`}>
            <span className="block rounded-md overflow-hidden" aria-label={`Product: ${product.name}`}>
                <div className="relative w-full h-80 border border-gray-300 rounded-md overflow-hidden">
                    <Image
                        src={mainImageUrl}
                        alt={product.name}
                        fill
                        className="object-contain py-5"
                        sizes="(max-width: 768px) 100vw, 400px"
                    />
                </div>
                <div className="p-4">
                    <h2 className="text-lg font-semibold">{product.name}</h2>

                    {product.description && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2" >
                            {previewText}
                        </p>
                    )}

                    {/* Pilihan variant warna */}
                    {product.variants && mounted && (
                        <div className="flex space-x-2 mt-3">
                            {product.variants.map(({ color }) => {
                                const isSelected = selectedColor === color;
                                return (
                                    <button
                                        key={color}
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setSelectedColor(color);
                                        }}
                                        title={color}
                                        className={`w-6 h-6 rounded-full border-2 focus:outline-none transition-colors duration-200
                      ${isSelected ? 'border-gray-800' : 'border-gray-300 hover:border-gray-500'}`}
                                        style={{ backgroundColor: colorMap[color] || '#ccc' }}
                                        aria-pressed={isSelected}
                                    />
                                );
                            })}
                        </div>
                    )}

                    {/* Harga dan diskon */}
                    <div className="mt-2 flex items-center space-x-2">
                        {product.discount ? (
                            <>
                                <span className="text-black font-bold">{formatCurrency(discountedPrice)}</span>
                                <span className="line-through text-gray-400 text-sm">{formatCurrency(product.price)}</span>
                                <span className="bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded">
                                    -{product.discount}%
                                </span>
                            </>
                        ) : (
                            <span className="text-black font-bold">{formatCurrency(product.price)}</span>
                        )}
                    </div>
                </div>
            </span>
        </Link>
    );
}
