import React, { useCallback } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { increaseQuantity, decreaseQuantity, removeFromCart } from "@/store/slice/cartSlice";
import MainLayout from "@/layouts/MainLayout";
import Breadcrumb from "@/components/common/Breadcrumb";
import CartTableRow from "@/components/cart/CartTableRow";
import CartItemMobile from "@/components/cart/CartItemMobile";
import CartSummary from "@/components/cart/CartSummary";
import Button from "@/components/ui/Button";
import { FiChevronLeft } from "react-icons/fi";
import { useCartCalculations } from "@/hooks/useCartCalculations";

export default function Cart() {
    const dispatch = useAppDispatch();
    const items = useAppSelector((state) => state.cart?.items ?? []);
    const { subtotal, totalDiscount, total } = useCartCalculations();

    const handleDecrease = useCallback((id: string) => dispatch(decreaseQuantity(id)), [dispatch]);
    const handleIncrease = useCallback((id: string) => dispatch(increaseQuantity(id)), [dispatch]);
    const handleRemove = useCallback((id: string) => dispatch(removeFromCart(id)), [dispatch]);

    if (items.length === 0) {
        return <p className="text-center py-4 text-gray-500">Your cart is empty</p>;
    }

    return (
        <MainLayout>
            <h2 className="text-2xl font-bold mt-8 mb-5">Your Cart</h2>
            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Cart" }]} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Desktop Table */}
                <div className="hidden md:block md:col-span-2 overflow-x-auto">
                    <table className="min-w-full border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th>Product</th><th>Qty</th><th>Price</th><th>Discount</th><th>Total</th><th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => (
                                <CartTableRow key={item.id} item={item} onIncrease={handleIncrease} onDecrease={handleDecrease} onRemove={handleRemove} />
                            ))}
                        </tbody>
                    </table>
                    <div className="flex py-4">
                        <Button type="link" href="/" startIcon={<FiChevronLeft />}>
                            Back to Shop
                        </Button>
                    </div>
                </div>

                {/* Mobile List */}
                <div className="md:hidden">
                    {items.map((item) => (
                        <CartItemMobile key={item.id} item={item} onIncrease={handleIncrease} onDecrease={handleDecrease} onRemove={handleRemove} />
                    ))}
                </div>

                {/* Summary */}
                <CartSummary subtotal={subtotal} discount={totalDiscount} total={total} />
            </div>
        </MainLayout>
    );
}
