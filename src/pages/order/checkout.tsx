import React from "react";
import { useAppDispatch } from "@/store/hooks";
import { setClientSecret, setCustomer } from "@/store/slice/checkoutSlice";
import { useRouter } from "next/router";
import { CheckoutCustomer, CheckoutItem } from "@/types/order";
import { createCheckoutSession, OrderServiceError } from "@/services/orderService";
import MainLayout from "@/layouts/MainLayout";
import Breadcrumb from "@/components/common/Breadcrumb";
import Button from "@/components/ui/Button";
import InputField from "@/components/ui/InputField";
import { useMutation } from "@tanstack/react-query";
import { formatCurrency } from "@/utils/currency";
import Image from "next/image";
import Head from "next/head";
import { useForm } from "@/hooks/useCheckoutForm";
import { useCartCalculations } from "@/hooks/useCartCalculations";

type FormState = {
    name: string;
    email: string;
    streetAddress: string;
    unitNumber: string;
    postalCode: string;
};

export default function Checkout() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { total, subtotal , items, totalDiscount} = useCartCalculations();

    const validateForm = (data: FormState) => {
        const errors: Partial<FormState> = {};
        if (!data.name.trim()) errors.name = "Name is required";
        if (!data.email.trim()) errors.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = "Email is invalid";
        if (!data.streetAddress.trim()) errors.streetAddress = "Street Address is required";
        if (!data.postalCode.trim()) errors.postalCode = "Postal Code is required";
        return errors;
    };

    const { form, errors, handleChange, isValid } = useForm<FormState>(
        { name: "", email: "", streetAddress: "", unitNumber: "", postalCode: "" },
        validateForm
    );

    const { mutate: checkoutMutate, status } = useMutation({
        mutationFn: async () => {
            const payload = {
                customer: {
                    name: form.name,
                    email: form.email,
                    streetAddress: form.streetAddress,
                    postalCode: form.postalCode,
                    ...(form.unitNumber ? { unitNumber: form.unitNumber } : {}),
                },
                items: items.map((item) => ({
                    id: item.product?.id.toString() ?? "0",
                    name: item.product?.name,
                    quantity: item.quantity,
                    variant: item.variant,
                    price: item.product?.price ?? 0,
                    discount: item.product?.discount ?? 0,
                })) as CheckoutItem[],
            };
            return await createCheckoutSession(payload);
        },
        onSuccess: (res) => {
            if (res.status) {
                dispatch(setCustomer(form as CheckoutCustomer));
                dispatch(setClientSecret(res.client_secret));
                router.push("/order/payment");
            } else {
                alert(res.message || "Unknown error");
            }
        },
        onError: (err) => {
            if (err instanceof OrderServiceError) alert(err.message);
            else alert("Unexpected error occurred");
        },
    });

    const handleCheckout = () => {
        if (!isValid) return;
        checkoutMutate();
    };

    if (items.length === 0) return <p className="text-center py-4 text-gray-500">Your cart is empty</p>;

    return (
        <MainLayout>
            <Head>
                <title>Checkout | ROLO</title>
            </Head>
            <div className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
                <h2 className="text-2xl font-bold mt-8 mb-5 text-center md:text-left">Your Details</h2>
                <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Cart", href: "/cart" }, { label: "Checkout" }]} />

                <div className="grid grid-cols-1 md:grid-cols-12 md:gap-8">
                    <div className="md:col-span-7">
                        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                            <InputField
                                label="Your Name"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                error={errors.name}
                                required
                                placeholder="John Doe"
                            />

                            <InputField
                                label="Email Address"
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                error={errors.email}
                                required
                                placeholder="john@example.com"
                            />

                            <InputField
                                label="Street Address"
                                name="streetAddress"
                                value={form.streetAddress}
                                onChange={handleChange}
                                error={errors.streetAddress}
                                required
                                placeholder="123 Main St"
                            />

                            <InputField
                                label="Unit / House Number (Optional)"
                                name="unitNumber"
                                value={form.unitNumber}
                                onChange={handleChange}
                                placeholder="Apt 4B"
                            />

                            <InputField
                                label="Postal Code"
                                name="postalCode"
                                value={form.postalCode}
                                onChange={handleChange}
                                error={errors.postalCode}
                                required
                                placeholder="10001"
                            />

                            <div className="flex flex-wrap gap-4 py-4">
                                {/* <Button type="link" href="/cart" startIcon={<FiChevronLeft />}>Back to Cart</Button> */}
                                <Button type="button" onClick={handleCheckout} disabled={status === "pending" || !isValid}>
                                    {status === "pending" ? "Processing..." : "Proceed to Payment"}
                                </Button>
                            </div>
                        </form>
                    </div>

                    <div className="mt-8 md:mt-0 md:col-span-5">
                        <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-md shadow-md h-fit">
                            <h3 className="text-lg font-semibold mb-4">Payment Summary</h3>
                            <hr className="mb-4 border-0 h-px bg-gray-300" />
                            <div className="mb-6 max-h-48 overflow-y-auto">
                                {items.map((item, idx) => {
                                    const price = item.product?.price ?? 0;
                                    const discount = item.product?.discount ?? 0;
                                    const discountedPrice = price * (1 - discount / 100);
                                    const variantImage = item.product?.images?.find(img => img.color === item.variant) ?? item.product?.images?.[0];
                                    return (
                                        <div key={item.id} className={`flex items-center ${idx !== items.length - 1 ? "border-b border-b-gray-300 mb-3 pb-3" : ""}`}>
                                            {variantImage && <Image src={variantImage.url} alt={item.product?.name ?? ""} width={200} height={200} className="w-12 h-12 object-cover rounded mr-3" />}
                                            <div className="flex-1">
                                                <p className="text-sm font-medium dark:text-white">{item.product?.name}</p>
                                                <div className="flex flex-wrap items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                                                    {discount > 0 && <span className="line-through">{formatCurrency(price)}</span>}
                                                    <span className="font-semibold text-black dark:text-white">{formatCurrency(discount > 0 ? discountedPrice : price)}</span>
                                                    <span>× {item.quantity}</span>
                                                </div>
                                            </div>
                                            <div className="ml-auto font-semibold dark:text-white">
                                                {formatCurrency((discount > 0 ? discountedPrice : price) * item.quantity)}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <hr className="mb-4 border-0 h-px bg-gray-300" />
                            <div className="flex justify-between mb-2"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
                            <div className="flex justify-between mb-2 text-red-600"><span>Discount</span><span>-{formatCurrency(totalDiscount)}</span></div>
                            <hr className="my-4 border-gray-300 dark:border-gray-700" />
                            <div className="flex justify-between font-bold text-lg mb-6"><span>Total</span><span>{formatCurrency(total)}</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
