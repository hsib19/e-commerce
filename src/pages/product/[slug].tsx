import { useRouter } from "next/router";
import Image from "next/image";
import MainLayout from "@/layouts/MainLayout";
import ProductImageZoom from "@/components/product/ProductImageZoom";
import { useAppDispatch } from "@/store/hooks";
import { addToCart, toggleCart } from "@/store/slice/cartSlice";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import { Product } from "@/types/product";
import { formatCurrency } from "@/utils/currency";
import { FiChevronLeft, FiShoppingCart } from "react-icons/fi";
import ProductDetailSkeleton from "@/components/skeletons/ProductDetailSkeleton";
import { getProductBySlug } from "@/services/productsService";
import DynamicHead from "@/components/DynamicHead";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useMemo } from "react";

const colorMap: Record<string, string> = {
    Silver: "#C0C0C0",
    Black: "#000000",
};

export default function ProductDetailPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const slug = router.query.slug as string | undefined;

    const { data: product = undefined, isLoading, isError, error } = useQuery<Product, Error>({
        queryKey: ["product", slug],
        queryFn: () => getProductBySlug(slug!),
        enabled: Boolean(slug),
    });

    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);

    // Set default color
    useEffect(() => {
        if (product?.variants?.length && !selectedColor) {
            setSelectedColor(product.variants[0].color);
        }
    }, [product, selectedColor]);

    // Set default/fallback image
    useEffect(() => {
        if (!product || !selectedColor) {
            setSelectedImageUrl(null);
            return;
        }
        const mainImg = product.images.find((img) => img.color === selectedColor);
        if (mainImg) {
            setSelectedImageUrl(mainImg.url);
        } else {
            const fallbackMain = product.images.find((img) => img.main);
            setSelectedImageUrl(fallbackMain?.url || null);
        }
    }, [product, selectedColor]);

    const handleAddToCart = () => {
        if (!product) return;
        dispatch(addToCart({ product, variant: selectedColor || "" }));
        dispatch(toggleCart());
        toast.success("Added to cart!");
    };

    // Optimisasi: thumbnails & harga pakai useMemo biar gak hitung ulang tiap render
    const thumbnails = useMemo(
        () =>
            selectedColor
                ? (product?.images ?? []).filter((img) => img.color === selectedColor)
                : product?.images ?? [],
        [product, selectedColor]
    );


    const discountedPrice = useMemo(
        () =>
            product?.discount
                ? product.price * (1 - product.discount / 100)
                : product?.price,
        [product]
    );

    if (isLoading) {
        return (
            <MainLayout>
                <DynamicHead
                    title={`${product?.name || "Loading"} | ROLO`}
                    fallback="Loading product..."
                />
                <ProductDetailSkeleton />
            </MainLayout>
        );
    }

    if (isError || !product) {
        return (
            <MainLayout>
                <p className="text-red-500">
                    {error?.message || "Product not found"}
                </p>
            </MainLayout>
        );
    }

    return (
        <>
            <DynamicHead title={`${product.name} | ROLO`} fallback="Loading product..." />

            <MainLayout>
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Left */}
                        <div className="md:w-2/5 w-full">
                            <div className="md:sticky md:top-20 flex flex-col space-y-4">
                                <div className="relative w-full h-[400px] overflow-hidden rounded-md">
                                    {selectedImageUrl && (
                                        <ProductImageZoom
                                            src={selectedImageUrl}
                                            alt={`${product.name} - ${selectedColor}`}
                                        />
                                    )}
                                </div>
                                <div className="flex space-x-3 overflow-x-auto">
                                    {thumbnails.map((img, i) => {
                                        const isActive = img.url === selectedImageUrl;
                                        return (
                                            <button
                                                key={i}
                                                onClick={() => setSelectedImageUrl(img.url)}
                                                className={`w-20 h-20 rounded-sm border cursor-pointer transition-colors ${isActive
                                                        ? "border-gray-800"
                                                        : "border-gray-300 hover:border-gray-500"
                                                    }`}
                                                type="button"
                                                aria-pressed={isActive}
                                            >
                                                <Image
                                                    src={img.url}
                                                    alt={`${product.name} thumbnail ${i + 1}`}
                                                    width={80}
                                                    height={80}
                                                    className="object-contain"
                                                />
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Right */}
                        <div className="md:w-3/5 flex flex-col">
                            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

                            <div className="mb-2">
                                {product.tags.map((tag, index) => (
                                    <span key={index} className="text-sm pr-1 py-1">
                                        {tag}
                                        {index !== product.tags.length - 1 && ", "}
                                    </span>
                                ))}
                            </div>

                            <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between sm:space-x-3 space-y-2 sm:space-y-0">
                                <div className="flex flex-wrap items-center space-x-3">
                                    <span className="text-2xl font-bold">
                                        {formatCurrency(discountedPrice || 0)}
                                    </span>
                                    {product.discount && (
                                        <>
                                            <span className="line-through text-gray-400">
                                                {formatCurrency(product.price)}
                                            </span>
                                            <span className="bg-red-600 text-white px-2 py-0.5 rounded text-sm font-semibold">
                                                -{product.discount}%
                                            </span>
                                        </>
                                    )}
                                </div>
                                {product.discount && (
                                    <p className="text-sm text-green-600 font-semibold bg-green-100 px-3 py-1 rounded-md">
                                        {product.discount}%, limited time offer
                                    </p>
                                )}
                            </div>

                            <hr className="mb-4 border-0 h-px bg-gray-300" />

                            {/* Color Picker */}
                            <div className="mb-6 flex items-center space-x-4">
                                <span className="font-semibold">Colour</span>
                                <div className="flex space-x-3">
                                    {(product.variants || []).map(({ color }) => {
                                        const isSelected = selectedColor === color;
                                        return (
                                            <button
                                                key={color}
                                                onClick={() => setSelectedColor(color)}
                                                title={color}
                                                className={`w-8 h-8 rounded-full border-2 ${isSelected
                                                        ? "border-gray-800"
                                                        : "border-gray-300 hover:border-gray-500"
                                                    }`}
                                                style={{ backgroundColor: colorMap[color] || "#ccc" }}
                                                aria-pressed={isSelected}
                                                type="button"
                                            />
                                        );
                                    })}
                                </div>
                                <span className="ml-auto">{selectedColor}</span>
                            </div>

                            <hr className="mb-4 border-0 h-px bg-gray-300" />

                            <div
                                className="mb-6 prose max-w-none text-sm description-content"
                                dangerouslySetInnerHTML={{ __html: product.description || "" }}
                            />

                            <hr className="mb-6 border-0 h-px bg-gray-300" />

                            <section>
                                <h3 className="font-semibold mb-2">What&apos;s in the box</h3>
                                <ul className="list-disc list-inside space-y-1">
                                    {(product.whatsInTheBox || []).map((item, i) => (
                                        <li key={i} className="text-sm">
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        </div>
                    </div>
                </div>

                {/* Bottom Navbar */}
                <div className="fixed bottom-0 left-0 w-full bg-white border-t border-t-gray-300 shadow-md flex items-center justify-between px-4 py-5 z-50">
                    <button onClick={() => router.back()} className="flex items-center space-x-2">
                        <FiChevronLeft className="w-6 h-6" />
                        <span>Back</span>
                    </button>
                    <div className="flex items-center space-x-4">
                        <Button
                            type="button"
                            onClick={handleAddToCart}
                            data-testid="btn-add-to-cart"
                            startIcon={<FiShoppingCart className="w-5 h-5" />}
                        >
                            Add to Cart
                        </Button>
                    </div>
                </div>
            </MainLayout>
        </>
    );
}
