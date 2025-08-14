import checkoutReducer, {
    setCustomer,
    setClientSecret,
    startCheckout,
    checkoutSuccess,
    checkoutError,
    resetCheckout,
} from "@/store/slice/checkoutSlice";
import { CheckoutState } from "@/types/order";

describe("checkoutSlice reducer", () => {
    const initialState: CheckoutState = {
        customer: {
            name: "",
            email: "",
            streetAddress: "",
            unitNumber: "",
            postalCode: "",
        },
        clientSecret: null,
        status: "idle",
        error: undefined,
    };

    const customerMock = {
        name: "John Doe",
        email: "john@example.com",
        streetAddress: "123 Main St",
        unitNumber: "4B",
        postalCode: "12345",
    };

    it("should handle initial state", () => {
        expect(checkoutReducer(undefined, { type: "unknown" })).toEqual(initialState);
    });

    it("should handle setCustomer", () => {
        const nextState = checkoutReducer(initialState, setCustomer(customerMock));
        expect(nextState.customer).toEqual(customerMock);
    });

    it("should handle setClientSecret", () => {
        const clientSecret = "secret_123";
        const nextState = checkoutReducer(initialState, setClientSecret(clientSecret));
        expect(nextState.clientSecret).toBe(clientSecret);
    });

    it("should handle startCheckout", () => {
        const nextState = checkoutReducer(initialState, startCheckout());
        expect(nextState.status).toBe("loading");
        expect(nextState.error).toBeUndefined();
    });

    it("should handle checkoutSuccess", () => {
        const loadingState: CheckoutState = { ...initialState, status: "loading" };
        const nextState = checkoutReducer(loadingState, checkoutSuccess());
        expect(nextState.status).toBe("success");
        expect(nextState.error).toBeUndefined();
    });

    it("should handle checkoutError", () => {
        const errorMsg = "Payment failed";
        const nextState = checkoutReducer(initialState, checkoutError(errorMsg));
        expect(nextState.status).toBe("error");
        expect(nextState.error).toBe(errorMsg);
    });

    it("should handle resetCheckout", () => {
        const modifiedState: CheckoutState = {
            customer: customerMock,
            clientSecret: "secret_123",
            status: "success",
            error: "Some error",
        };
        const nextState = checkoutReducer(modifiedState, resetCheckout());
        expect(nextState).toEqual(initialState);
    });
});
