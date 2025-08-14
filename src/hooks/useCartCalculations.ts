import { useMemo } from "react";
import { useAppSelector } from "@/store/hooks";

export function useCartCalculations() {
    const items = useAppSelector((state) => state.cart?.items ?? []);

    const subtotal = useMemo(
        () => items.reduce((sum, i) => sum + (i.product?.price ?? 0) * i.quantity, 0),
        [items]
    );

    const totalDiscount = useMemo(
        () =>
            items.reduce((sum, i) => {
                const price = i.product?.price ?? 0;
                const discount = i.product?.discount ?? 0;
                return sum + (price * (discount / 100)) * i.quantity;
            }, 0),
        [items]
    );

    const total = useMemo(() => subtotal - totalDiscount, [subtotal, totalDiscount]);

    return { items, subtotal, totalDiscount, total };
}
