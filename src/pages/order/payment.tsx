import React, { useEffect, useMemo, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useAppSelector } from "@/store/hooks";
import { formatCurrency } from "@/utils/currency";
import MainLayout from "@/layouts/MainLayout";
import Breadcrumb from "@/components/common/Breadcrumb";
import Button from "@/components/ui/Button";
import { useRouter } from "next/router";
import { PaymentPayload } from "@/types/order";
import { processPayment } from "@/services/orderService";
import { extractApiErrorMessage } from "@/utils/apiErrorUtils";
import Image from "next/image";
import Head from "next/head";
import { useMutation } from "@tanstack/react-query";
import { useCartCalculations } from "@/hooks/useCartCalculations";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function CheckoutForm() {
    const router = useRouter();
    const stripe = useStripe();
    const elements = useElements();

    const items = useAppSelector((state) => state.cart?.items ?? []);
    const clientSecret = useAppSelector((state) => state.checkout.clientSecret);
    const customer = useAppSelector((state) => state.checkout.customer);

    const { total } = useCartCalculations();

    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const paymentMutation = useMutation({
        mutationFn: (payload: PaymentPayload) => processPayment(payload),
        onSuccess: (data) => {
            router.push(`/order/success?orderId=${data.orderId}&token=${data.token}`);
        },
        onError: (error: unknown) => {
            const msg = extractApiErrorMessage(error);
            setErrorMsg(msg);
        },
        onSettled: () => {
            setIsProcessing(false);
        },
    });

    const handleClick = async () => {
        setErrorMsg(null);
        setIsProcessing(true);

        if (!stripe || !elements) {
            setErrorMsg("Stripe.js is not ready.");
            setIsProcessing(false);
            return;
        }

        if (!clientSecret) {
            setErrorMsg("Client secret is not available.");
            setIsProcessing(false);
            return;
        }

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: window.location.href,
                payment_method_data: {
                    billing_details: {
                        name: customer.name,
                        email: customer.email,
                        address: {
                            line1: customer.streetAddress,
                            postal_code: customer.postalCode.toString(),
                        },
                    },
                },
            },
            redirect: "if_required",
        });

        if (error) {
            setErrorMsg(error.message ?? "Payment failed.");
            setIsProcessing(false);
            return;
        }

        if (paymentIntent && paymentIntent.status === "succeeded") {
            const paymentMethodStripe = paymentIntent.payment_method_types?.[0];

            const payload: PaymentPayload = {
                customer: {
                    name: customer.name,
                    email: customer.email,
                    streetAddress: customer.streetAddress,
                    unitNumber: customer.unitNumber ?? "",
                    postalCode: customer.postalCode,
                },
                items: items.map((item) => ({
                    id: (item.product?.id ?? "").toString(),
                    name: item.product?.name ?? "",
                    variant: item.variant,
                    quantity: item.quantity,
                    price: item.product?.price ?? 0,
                    discount: item.product?.discount,
                })),
                paymentMethod: paymentMethodStripe === "card" ? "credit_card" : paymentMethodStripe,
                paymentStatus: paymentIntent.status,
            };

            paymentMutation.mutate(payload);
        } else {
            setErrorMsg("Payment failed, invalid status.");
            setIsProcessing(false);
        }
    };

    if (items.length === 0) {
        return <p className="text-center py-4 text-gray-500">Cart is empty</p>;
    }

    return (
        <div className="space-y-4 max-w-full">
            <div>
                <label className="block font-medium mb-2">Payment Method</label>
                <div className="rounded bg-white dark:bg-gray-800">
                    <PaymentElement />
                    {errorMsg && <p className="text-red-600 font-semibold mt-2">{errorMsg}</p>}

                    <hr className="my-4 border-0 h-px bg-gray-300" />

                    <Button
                        type="button"
                        disabled={!stripe || isProcessing || !clientSecret}
                        onClick={handleClick}
                    >
                        {isProcessing ? "Processing..." : `Pay ${formatCurrency(total)}`}
                    </Button>
                </div>
            </div>
        </div>
    );
}


export default function Payment() {
    const router = useRouter();
    const items = useAppSelector((state) => state.cart?.items ?? []);
    const clientSecret = useAppSelector((state) => state.checkout.clientSecret);

    useEffect(() => {
        if (!clientSecret) {
            router.replace("/order/checkout");
        }
    }, [clientSecret, router]);

    const { subtotal, totalDiscount, total } = useCartCalculations();

    return (
        <MainLayout>
            <Head>
                <title>Payment | ROLO</title>
            </Head>

            <div className="grid grid-cols-1 md:grid-cols-12">
                <div className="md:col-start-3 md:col-span-8 px-4 sm:px-6">
                    <h2 className="text-2xl font-bold mt-8 mb-5 text-center md:text-left">Payment</h2>
                    <Breadcrumb
                        items={[
                            { label: "Home", href: "/" },
                            { label: "Checkout", href: "/order/checkout" },
                            { label: "Payment" },
                        ]}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                        <div className="md:col-span-7 overflow-x-auto bg-white dark:bg-gray-900 p-6 rounded-md shadow-md">
                            {!clientSecret ? (
                                <p>Loading payment...</p>
                            ) : (
                                <Elements stripe={stripePromise} options={{ clientSecret }}>
                                    <CheckoutForm />
                                </Elements>
                            )}
                        </div>

                        <div className="md:col-span-5">
                            <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-md shadow-md h-fit">
                                <h3 className="text-lg font-semibold mb-4">Payment Summary</h3>
                                <hr className="mb-4 border-0 h-px bg-gray-300" />

                                <div className="mb-6 max-h-48 overflow-y-auto">
                                    {items.map((item, index) => {
                                        if (!item.product) return null;
                                        const price = item.product.price ?? 0;
                                        const discount = item.product.discount ?? 0;
                                        const discountedPrice = price * (1 - discount / 100);
                                        const variantImage = item.product.images?.find((img) => img.color === item.variant) ?? item.product.images?.[0];
                                        const isLast = index === items.length - 1;

                                        return (
                                            <div key={item.id} className={`flex items-center ${!isLast ? "border-b border-b-gray-300 mb-3 pb-3" : ""}`}>
                                                {variantImage && (
                                                    <Image src={variantImage.url} width={200} height={200} alt={item.product.name} className="w-12 h-12 object-cover rounded mr-3" loading="lazy" />
                                                )}
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium dark:text-white">{item.product.name}</p>
                                                    <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
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

                                <div className="flex justify-between mb-2">
                                    <span>Subtotal</span>
                                    <span>{formatCurrency(subtotal)}</span>
                                </div>
                                <div className="flex justify-between mb-2 text-red-600">
                                    <span>Discount</span>
                                    <span>-{formatCurrency(totalDiscount)}</span>
                                </div>
                                <hr className="my-4 border-gray-300 dark:border-gray-700" />
                                <div className="flex justify-between font-bold text-lg mb-6">
                                    <span>Total</span>
                                    <span>{formatCurrency(total)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
