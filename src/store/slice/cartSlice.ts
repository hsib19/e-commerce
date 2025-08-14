import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AddToCartPayload, CartItem } from "@/types/cart";

export interface CartState {
    id: string;
    items: CartItem[];
    isOpen: boolean;
}

const initialState: CartState = {
    id: '',
    items: [],
    isOpen: false,
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (
            state,
            action: PayloadAction<AddToCartPayload>
        ) => {
            const { product, variant } = action.payload;

            const itemId = variant ? `${product.id}-${variant}` : product.id.toString();

            const existingItem = state.items.find(item => item.id === itemId);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.items.push({
                    id: itemId,
                    product,
                    variant,
                    quantity: 1,
                });
            }
        },
        increaseQuantity: (state, action: PayloadAction<string>) => {
            const item = state.items.find(i => i.id === action.payload);
            if (item) {
                item.quantity += 1;
            }
        },
        decreaseQuantity: (state, action: PayloadAction<string>) => {
            const item = state.items.find(i => i.id === action.payload);
            console.log(action.payload)
            console.log(state.items)
            if (item && item.quantity > 1) {
                item.quantity -= 1;
            } else if (item) {
                state.items = state.items.filter(i => i.id !== action.payload);
            }
        },
        removeFromCart: (state, action: PayloadAction<string>) => {
            const itemId = action.payload; 
            state.items = state.items.filter(item => item.id !== itemId);
        },
        toggleCart(state) {
            state.isOpen = !state.isOpen;
        },
        resetCart(state) {
            state.items = [];
        },
    },
});

export const { addToCart, removeFromCart, toggleCart, decreaseQuantity, increaseQuantity, resetCart } = cartSlice.actions;
export default cartSlice.reducer;
