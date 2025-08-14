import { CartItem } from "@/types/cart";

export function getCartTotals(items: CartItem[]) {
    const subtotal = items.reduce((sum, item) => {
        const price = item.product?.price ?? 0;
        return sum + price * item.quantity;
    }, 0);

    const totalDiscount = items.reduce((sum, item) => {
        const price = item.product?.price ?? 0;
        const discount = item.product?.discount ?? 0;
        return sum + price * (discount / 100) * item.quantity;
    }, 0);

    const total = subtotal - totalDiscount;

    return { subtotal, totalDiscount, total };
}
