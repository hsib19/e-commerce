import { useMutation } from "@tanstack/react-query";
import { processPayment } from "@/services/orderService";
import { extractApiErrorMessage } from "@/utils/apiErrorUtils";
import type { PaymentPayload } from "@/types/order";

export function usePayment() {
    return useMutation({
        mutationFn: (payload: PaymentPayload) => processPayment(payload),
        onError: (error: unknown) => {
            throw new Error(extractApiErrorMessage(error));
        },
    });
}
