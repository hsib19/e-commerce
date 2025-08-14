import { useEffect } from "react";
import { useRouter } from "next/router";
import MainLayout from "@/layouts/MainLayout";
import { fetchOrderDetail } from "@/services/orderService";
import { resetCheckout } from "@/store/slice/checkoutSlice";
import { resetCart } from "@/store/slice/cartSlice";
import { useAppDispatch } from "@/store/hooks";
import Head from "next/head";
import { useQuery } from "@tanstack/react-query";

export default function OrderSuccess() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { orderId, token } = router.query;

    useEffect(() => {
        dispatch(resetCheckout());
        dispatch(resetCart());
    }, [dispatch]);

    const enabled = typeof orderId === "string" && typeof token === "string";

    const { data: order, error, isLoading } = useQuery({
        queryKey: ["orderDetail", orderId, token],
        queryFn: () => fetchOrderDetail(orderId as string, token as string),
        enabled, 
        retry: 1,
        staleTime: 1000 * 60 * 2,
    });

    if (!enabled) {
        return <p className="text-center mt-10">Invalid order parameters</p>;
    }

    if (isLoading) {
        return (
            <MainLayout>
                <p className="text-center mt-10">Loading order data...</p>
            </MainLayout>
        );
    }

    if (error instanceof Error) {
        return (
            <MainLayout>
                <p className="text-center text-red-600 mt-10">{error.message}</p>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <Head>
                <title>Payment Success | ROLO</title>
            </Head>

            <div className="max-w-2xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-4">Thank you for your order!</h1>
                <p>Order ID: {order?.orderId}</p>
                <p>Name: {order?.customerName}</p>
                <p className="capitalize">Payment Status: {order?.paymentStatus}</p>
                <p>Total: SGD ${order?.totalAmount}</p>
            </div>
        </MainLayout>
    );
}
