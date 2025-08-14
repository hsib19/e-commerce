/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CartSidebar from "../CartSidebar";
import { configureStore, EnhancedStore } from "@reduxjs/toolkit";
import cartReducer, { CartState } from "@/store/slice/cartSlice";
import { Provider } from "react-redux";

// Enable fake timers for useEffect setTimeout tests
jest.useFakeTimers();

interface RenderWithStoreOptions {
    preloadedState?: { cart: Partial<CartState> };
    store?: EnhancedStore<{ cart: CartState }>;
}

// Default complete cart state with all required properties
const defaultCartState: CartState = {
    id: "",
    items: [],
    isOpen: false,
};

function renderWithStore(
    ui: React.ReactElement,
    { preloadedState, store }: RenderWithStoreOptions = {}
) {
    if (!store) {
        store = configureStore({
            reducer: { cart: cartReducer },
            preloadedState: {
                cart: {
                    ...defaultCartState,
                    ...preloadedState?.cart,
                },
            },
        });
    }
    return {
        store,
        ...render(<Provider store={store}>{ui}</Provider>),
    };
}

describe("CartSidebar", () => {
    const baseItem = {
        id: "1",
        product: {
            id: 101,
            name: "Product A",
            price: 100,
            discount: 10,
            slug: "product-a",
            tags: ["tag1", "tag2"],
            images: [
                { url: "/img1.jpg", color: "red", main: true },
                { url: "/img2.jpg", color: "blue", main: false },
            ],
        },
        variant: "red",
        quantity: 2,
    };

    it("renders empty cart message", () => {
        renderWithStore(<CartSidebar />, {
            preloadedState: { cart: { items: [], isOpen: true } },
        });
        jest.advanceTimersByTime(0);

        expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
    });

    it("renders correctly when product images missing or variant image missing", () => {
        const itemNoImages = {
            ...baseItem,
            product: { ...baseItem.product, images: [] },
        };
        renderWithStore(<CartSidebar />, {
            preloadedState: { cart: { items: [itemNoImages], isOpen: true } },
        });
        jest.advanceTimersByTime(0);

        expect(screen.queryByRole("img")).toBeNull();
        expect(screen.getByText(/Product A/i)).toBeInTheDocument();
    });

    it("renders correctly when discount is zero", () => {
        const itemNoDiscount = {
            ...baseItem,
            product: { ...baseItem.product, discount: 0 },
        };
        renderWithStore(<CartSidebar />, {
            preloadedState: { cart: { items: [itemNoDiscount], isOpen: true } },
        });
        jest.advanceTimersByTime(0);

        expect(screen.getByText("$100.00")).toBeInTheDocument();
    });

});
