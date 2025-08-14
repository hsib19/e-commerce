import { useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { useRouter } from "next/router";
import { useAppSelector } from "@/store/hooks";
import { usePayment } from "@/hooks/usePayment";
import Button from "@/components/ui/Button";
import { formatCurrency } from "@/utils/currency";
import { useCartCalculations } from "@/hooks/useCartCalculations";

export function CheckoutForm() {
    const stripe = useStripe();
    const elements = useElements();
    const router = useRouter();

    const items = useAppSelector((s) => s.cart.items ?? []);
    const clientSecret = useAppSelector((s) => s.checkout.clientSecret);
    const customer = useAppSelector((s) => s.checkout.customer);

    const { total } = useCartCalculations();

    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const paymentMutation = usePayment();

    const handlePayment = async () => {
        setErrorMsg(null);

        if (!stripe || !elements) {
            setErrorMsg("Stripe belum siap, coba lagi.");
            return;
        }
        if (!clientSecret) {
            setErrorMsg("Client secret tidak tersedia, silakan ulang checkout.");
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
            setErrorMsg(error.message ?? "Pembayaran gagal.");
            return;
        }

        if (paymentIntent?.status === "succeeded") {
            const payload = {
                customer,
                items: items.map((item) => ({
                    id: String(item.product?.id ?? ""),
                    name: item.product?.name ?? "",
                    variant: item.variant,
                    quantity: item.quantity,
                    price: item.product?.price ?? 0,
                    discount: item.product?.discount,
                })),
                paymentMethod:
                    paymentIntent.payment_method_types?.[0] === "card"
                        ? "credit_card"
                        : paymentIntent.payment_method_types?.[0],
                paymentStatus: paymentIntent.status,
            };

            try {
                const res = await paymentMutation.mutateAsync(payload);
                router.push(`/order/success?orderId=${res.orderId}&token=${res.token}`);
            } catch (err) {
                setErrorMsg((err as Error).message);
            }
        } else {
            setErrorMsg("Status pembayaran tidak valid.");
        }
    };

    return (
        <div>
            <PaymentElement />
            {errorMsg && <p className="text-red-600 font-semibold mt-2">{errorMsg}</p>}
            <Button
                type="button"
                disabled={!stripe || paymentMutation.isPending || !clientSecret}
                onClick={handlePayment}
            >
                {paymentMutation.isPending ? "Processing..." : `Pay ${formatCurrency(total)}`}
            </Button>
        </div>
    );
}
