import { CheckoutState, Customer } from "@/types/order";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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

const checkoutSlice = createSlice({
    name: "checkout",
    initialState,
    reducers: {
        setCustomer(state, action: PayloadAction<Customer>) {
            state.customer = action.payload;
        },
        setClientSecret(state, action: PayloadAction<string>) {
            state.clientSecret = action.payload;
        },
        startCheckout(state) {
            state.status = "loading";
            state.error = undefined;
        },
        checkoutSuccess(state) {
            state.status = "success";
            state.error = undefined;
        },
        checkoutError(state, action: PayloadAction<string>) {
            state.status = "error";
            state.error = action.payload;
        },
        resetCheckout(state) {
            state.status = "idle";
            state.error = undefined;
            state.customer = initialState.customer;
            state.clientSecret = null;
        },
    },
});

export const {
    setCustomer,
    setClientSecret,
    startCheckout,
    checkoutSuccess,
    checkoutError,
    resetCheckout,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
