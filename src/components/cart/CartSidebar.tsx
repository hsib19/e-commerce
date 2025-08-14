import { useEffect, useState, useCallback, useMemo } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { toggleCart, removeFromCart, decreaseQuantity, increaseQuantity } from "@/store/slice/cartSlice";
import Image from "next/image";
import { formatCurrency } from "@/utils/currency";
import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";
import Button from "../ui/Button";

export default function CartSidebar() {
    const dispatch = useAppDispatch();
    const { items, isOpen } = useAppSelector((state) => state.cart ?? { items: [], isOpen: false });

    const [showSidebar, setShowSidebar] = useState(false);
    const [animateIn, setAnimateIn] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setShowSidebar(true);
            setTimeout(() => setAnimateIn(true), 0);
        } else {
            setAnimateIn(false);
            const timer = setTimeout(() => setShowSidebar(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    // Total price with discount calculation memoized
    const total = useMemo(() => {
        return items.reduce((sum, item) => {
            const price = item.product?.price ?? 0;
            const discount = item.product?.discount ?? 0;
            const discountedPrice = price * (1 - discount / 100);
            return sum + discountedPrice * item.quantity;
        }, 0);
    }, [items]);

    // Handlers memoized
    const handleToggleCart = useCallback(() => {
        dispatch(toggleCart());
    }, [dispatch]);

    const handleRemoveFromCart = useCallback(
        (id: string) => {
            dispatch(removeFromCart(id));
        },
        [dispatch]
    );

    const handleDecreaseQuantity = useCallback(
        (id: string) => {
            dispatch(decreaseQuantity(id));
        },
        [dispatch]
    );

    const handleIncreaseQuantity = useCallback(
        (id: string) => {
            dispatch(increaseQuantity(id));
        },
        [dispatch]
    );

    // Render cart items memoized
    const renderedItems = useMemo(() => {
        return items.map((item) => {
            const variantImage =
                item.product?.images?.find((img) => img.color === item.variant) || item.product?.images?.[0];
            const price = item.product?.price ?? 0;
            const discount = item.product?.discount ?? 0;
            const discountedPrice = price * (1 - discount / 100);

            return (
                <div key={item.id} className="relative flex justify-between items-center mb-4 border-b border-gray-300 pb-3">
                    <div className="flex items-center space-x-3">
                        {variantImage && (
                            <Image
                                src={variantImage.url}
                                alt={item.product?.name ?? ""}
                                width={60}
                                height={60}
                                className="rounded object-cover"
                            />
                        )}
                        <div>
                            <p className="font-medium">{item.product?.name ?? ""}</p>
                            <p className="text-xs text-gray-500">{item.variant ?? ""}</p>
                            <p className="text-sm text-gray-500">
                                {item.quantity} ×{" "}
                                {discount > 0 ? (
                                    <>
                                        <span className="line-through mr-2 text-xs">{formatCurrency(price)}</span>
                                        <span className="text-black font-bold">{formatCurrency(discountedPrice)}</span>
                                    </>
                                ) : (
                                    <span>{formatCurrency(price)}</span>
                                )}
                            </p>

                            {/* Quantity Counter */}
                            <div className="flex items-center space-x-2 mt-2">
                                <button
                                    onClick={() => handleDecreaseQuantity(item.id)}
                                    className="p-1 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
                                    aria-label={`Decrease quantity of ${item.product?.name}`}
                                >
                                    <FiMinus size={16} />
                                </button>
                                <span>{item.quantity}</span>
                                <button
                                    onClick={() => handleIncreaseQuantity(item.id)}
                                    className="p-1 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
                                    aria-label={`Increase quantity of ${item.product?.name}`}
                                >
                                    <FiPlus size={16} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Trash button top-right */}
                    <button
                        onClick={() => handleRemoveFromCart(item.id)}
                        className="absolute top-0 right-0 text-gray-600 hover:text-gray-800 cursor-pointer"
                        aria-label={`Remove ${item.product?.name} from cart`}
                    >
                        <FiTrash2 size={20} />
                    </button>

                    {/* Price total for item */}
                    <div className="flex items-center space-x-2">
                        <p className="font-semibold">{formatCurrency(discountedPrice * item.quantity)}</p>
                    </div>
                </div>
            );
        });
    }, [items, handleDecreaseQuantity, handleIncreaseQuantity, handleRemoveFromCart]);

    if (!showSidebar) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black opacity-50 z-50 transition-opacity duration-300"
                onClick={handleToggleCart}
                data-testid="overlay-cart"
            />

            {/* Sidebar */}
            <div
                className={`fixed top-0 right-0 h-full w-96 bg-white shadow-lg transform transition-transform duration-300 z-50 flex flex-col ${animateIn ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-300">
                    <h2 className="text-lg font-semibold">Your Cart</h2>
                    <button
                        onClick={handleToggleCart}
                        className="text-gray-500 hover:text-gray-700 cursor-pointer"
                        aria-label="Close cart"
                    >
                        ✕
                    </button>
                </div>

                {/* List of Items */}
                <div className="flex-1 overflow-y-auto p-4">
                    {items.length === 0 ? <p className="text-gray-500">Your cart is empty</p> : renderedItems}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-300">
                    <div className="flex justify-between font-semibold mb-4">
                        <span>Total</span>
                        <span>{formatCurrency(total)}</span>
                    </div>
                    <Button type="link" href="/cart" onClick={handleToggleCart}>
                        Proceed to Cart
                    </Button>
                </div>
            </div>
        </>
    );
}
