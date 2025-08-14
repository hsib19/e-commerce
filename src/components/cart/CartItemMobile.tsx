import React from "react";
import Image from "next/image";
import { FiPlus, FiMinus, FiTrash2 } from "react-icons/fi";
import { formatCurrency } from "@/utils/currency";
import { CartItem } from "@/types/cart";

interface Props {
    item: CartItem;
    onIncrease: (id: string) => void;
    onDecrease: (id: string) => void;
    onRemove: (id: string) => void;
}

export default function CartItemMobile({ item, onIncrease, onDecrease, onRemove }: Props) {
    if (!item.product) return null;

    const { product, quantity, id, variant } = item;
    const price = product.price ?? 0;
    const discount = product.discount ?? 0;
    const discountedPrice = price * (1 - discount / 100);
    const variantImage = product.images.find((img) => img.color === variant) || product.images[0];

    return (
        <div className="relative flex justify-between items-center mb-4 border-b border-gray-300 pb-3">
            <div className="flex items-center space-x-3">
                {variantImage && (
                    <Image src={variantImage.url} alt={product.name} width={60} height={60} className="rounded object-cover" />
                )}
                <div>
                    <p className="font-medium dark:text-white">{product.name}</p>
                    <p className="text-xs text-gray-500">{variant}</p>
                    <p className="text-sm text-gray-500">
                        {quantity} ×{" "}
                        {discount > 0 ? (
                            <>
                                <span className="line-through mr-2 text-xs">{formatCurrency(price)}</span>
                                <span className="font-bold">{formatCurrency(discountedPrice)}</span>
                            </>
                        ) : (
                            formatCurrency(price)
                        )}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                        <button onClick={() => onDecrease(id)} className="p-1 bg-gray-200 rounded dark:bg-gray-700">
                            <FiMinus size={16} />
                        </button>
                        <span>{quantity}</span>
                        <button onClick={() => onIncrease(id)} className="p-1 bg-gray-200 rounded dark:bg-gray-700">
                            <FiPlus size={16} />
                        </button>
                    </div>
                </div>
            </div>
            <button onClick={() => onRemove(id)} className="absolute top-0 right-0 text-gray-600 hover:text-gray-800">
                <FiTrash2 size={20} />
            </button>
        </div>
    );
}
