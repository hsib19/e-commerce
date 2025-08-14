import Image from "next/image";
import { FiPlus, FiMinus, FiTrash2 } from "react-icons/fi";
import { formatCurrency } from "@/utils/currency";

type ProductImage = {
    url: string;
    color?: string;
};

type Product = {
    id: number;
    name: string;
    price: number;
    discount?: number;
    images?: ProductImage[];
};

type CartItemType = {
    id: string;
    product: Product;
    variant?: string;
    quantity: number;
};

type CartItemProps = {
    item: CartItemType;
    onIncrease: (id: string) => void;
    onDecrease: (id: string) => void;
    onRemove: (id: string) => void;
};

export default function CartItem({
    item,
    onIncrease,
    onDecrease,
    onRemove,
}: CartItemProps) {
    const price = item.product?.price ?? 0;
    const discount = item.product?.discount ?? 0;
    const discountedPrice = price * (1 - discount / 100);
    const variantImage =
        item.product?.images?.find((img) => img.color === item.variant) ||
        item.product?.images?.[0];

    return (
        <tr className="border-b border-gray-300 dark:border-gray-600">
            <td className="flex items-center space-x-3 px-4 py-2">
                {variantImage && (
                    <Image
                        src={variantImage.url}
                        alt={item.product.name}
                        width={200}
                        height={200}
                        className="w-30 h-30 object-cover rounded"
                    />
                )}
                <div>
                    <span className="font-black">{item.product.name}</span>
                    <span className="text-xs text-gray-500">{item.variant}</span>
                </div>
            </td>
            <td className="text-center">
                <button onClick={() => onDecrease(item.id)}>
                    <FiMinus />
                </button>
                <span className="mx-2">{item.quantity}</span>
                <button onClick={() => onIncrease(item.id)}>
                    <FiPlus />
                </button>
            </td>
            <td className="text-right">{formatCurrency(price)}</td>
            <td className="text-right text-red-600">{discount}%</td>
            <td className="text-right font-semibold">
                {formatCurrency(discountedPrice * item.quantity)}
            </td>
            <td className="text-center">
                <button onClick={() => onRemove(item.id)}>
                    <FiTrash2 />
                </button>
            </td>
        </tr>
    );
}
