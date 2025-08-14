import React from "react";
import { formatCurrency } from "@/utils/currency";
import Button from "@/components/ui/Button";

interface Props {
    subtotal: number;
    discount: number;
    total: number;
}

export default function CartSummary({ subtotal, discount, total }: Props) {
    return (
        <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-md shadow-md h-fit">
            <h3 className="text-lg font-semibold mb-4">Payment Summary</h3>
            <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between mb-2 text-red-600">
                <span>Discount</span>
                <span>-{formatCurrency(discount)}</span>
            </div>
            <hr className="my-4" />
            <div className="flex justify-between font-bold text-lg mb-6">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
            </div>
            <Button type="link" href="/order/checkout">
                Proceed to Checkout
            </Button>
        </div>
    );
}
