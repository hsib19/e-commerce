import api from "@/lib/apiClient";
import { AxiosError } from "axios";
import {
    CheckoutPayload,
    CheckoutResponse,
    OrderDetail,
    PaymentPayload,
    PaymentResponse,
} from "@/types/order";

// Error classes
export class OrderServiceError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "OrderServiceError";
    }
}

// ===== Checkout =====
export async function createCheckoutSession(
    payload: CheckoutPayload
): Promise<CheckoutResponse> {
    try {
        const res: CheckoutResponse = await api.post("/orders/checkout", payload);
        return res;
    } catch (error) {
        console.error("API ERROR:", error);
        throw error;
    }
}


// ===== Payment =====
export async function processPayment(
    payload: PaymentPayload
): Promise<PaymentResponse> {
    try {
        const response: PaymentResponse = await api.post(
            "/orders/payment",
            payload
        );
        return response;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new OrderServiceError(
                error.response?.data?.error ?? error.message
            );
        }
        throw new OrderServiceError("Unexpected error occurred");
    }
}

// ===== Order Detail =====
export async function fetchOrderDetail(
    orderId: string,
    token: string
): Promise<OrderDetail> {
    try {
        const response: OrderDetail = await api.get(
            `/orders/${orderId}`,
            {
                params: { token },
            }
        );
        return response;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new OrderServiceError(
                error.response?.data?.error ?? error.message
            );
        }
        throw new OrderServiceError("Unexpected error occurred");
    }
}
