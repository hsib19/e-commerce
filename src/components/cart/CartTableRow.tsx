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

export default function CartTableRow({ item, onIncrease, onDecrease, onRemove }: Props) {
    if (!item.product) return null;

    const { product, quantity, id, variant } = item;
    const price = product.price ?? 0;
    const discount = product.discount ?? 0;
    const discountedPrice = price * (1 - discount / 100);
    const variantImage = product.images.find((img) => img.color === variant) || product.images[0];

    return (
        <tr className="border-b border-gray-300 dark:border-gray-600">
            <td className="flex items-center space-x-3 px-4 py-2">
                {variantImage && (
                    <Image src={variantImage.url} alt={product.name} width={200} height={200} className="w-30 h-30 object-cover rounded" loading="lazy" />
                )}
                <div className="flex flex-col space-y-1">
                    <span className="font-black dark:text-white">{product.name}</span>
                    <span className="text-gray-900 dark:text-white text-xs">{variant}</span>
                </div>
            </td>
            <td className="text-center px-4 py-2">
                <button onClick={() => onDecrease(id)} className="p-1 bg-gray-200 rounded hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600">
                    <FiMinus className="w-4 h-4" />
                </button>
                <span className="mx-2">{quantity}</span>
                <button onClick={() => onIncrease(id)} className="p-1 bg-gray-200 rounded hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600">
                    <FiPlus className="w-4 h-4" />
                </button>
            </td>
            <td className="text-right px-4 py-2">{formatCurrency(price)}</td>
            <td className="text-right px-4 py-2 text-red-600">{discount}%</td>
            <td className="text-right px-4 py-2">{formatCurrency(discountedPrice * quantity)}</td>
            <td className="text-center px-4 py-2">
                <button onClick={() => onRemove(id)} className="text-red-600 hover:text-red-800 dark:hover:text-red-400">
                    <FiTrash2 className="inline w-5 h-5" />
                </button>
            </td>
        </tr>
    );
}
