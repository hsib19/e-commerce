import Image from "next/image";
import { formatCurrency } from "@/utils/currency";
import { CartItem } from "@/types/cart";

type Props = {
    item: CartItem;
    isLast: boolean;
};

export function CheckoutSummaryItem({ item, isLast }: Props) {
    if (!item.product) return null;

    const price = item.product.price ?? 0;
    const discount = item.product.discount ?? 0;
    const discountedPrice = price * (1 - discount / 100);
    const variantImage =
        item.product.images?.find((img) => img.color === item.variant) ||
        item.product.images?.[0];

    return (
        <div
            className={`flex items-center ${!isLast ? "border-b border-b-gray-300 mb-3 pb-3" : ""}`}
        >
            {variantImage && (
                <Image
                    src={variantImage.url}
                    alt={item.product.name}
                    width={200}
                    height={200}
                    className="w-12 h-12 object-cover rounded mr-3"
                    loading="lazy"
                />
            )}
            <div className="flex-1">
                <p className="text-sm font-medium dark:text-white">{item.product.name}</p>
                <div className="flex flex-wrap items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                    {discount > 0 && <span className="line-through">{formatCurrency(price)}</span>}
                    <span className="font-semibold text-black dark:text-white">
                        {formatCurrency(discount > 0 ? discountedPrice : price)}
                    </span>
                    <span>× {item.quantity}</span>
                </div>
            </div>
            <div className="ml-auto font-semibold dark:text-white">
                {formatCurrency((discount > 0 ? discountedPrice : price) * item.quantity)}
            </div>
        </div>
    );
}
