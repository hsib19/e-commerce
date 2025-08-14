import cartReducer, {
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    toggleCart,
    resetCart,
} from "@/store/slice/cartSlice";

describe("cartSlice reducer", () => {
    const productMock = {
        "id": 1,
        "name": "the Barista Express",
        "slug": "the-barista-express",
        "price": 798,
        "discount": 10,
        "description": "<p>One of the world’s popular and well-recommended espresso machines for home use, the Barista Express is perfect for anyone wanting to get into coffee.</p><p>This semi-automatic machine balances simplicity and flexibility. With automated, low pressure pre-infusion and shot timers, you can pull espresso at just the press of a button. Hone your skills tamping, and experimenting with various beans, doses and grind sizes.</p><p>With an in-built grinder and steam wand, this all-in-one setup is all you need — just add freshly roasted coffee beans and a weighing scale — to take your espresso to the next level and make cafe-level, specialty coffee at home.</p>",
        "tags": ["espresso", "semi-automatic", "home use", "coffee grinder", "steam wand"],
        "images": [
            { "url": "/images/products/barista_express_main.png", "color": "Silver", "main": true },
            { "url": "/images/products/barista_express_main_black.png", "color": "Black", "main": false },
            { "url": "/images/products/barista_express_1.png", "color": "Silver", "main": false },
            { "url": "/images/products/barista_express_2.png", "color": "Silver", "main": false },
            { "url": "/images/products/barista_express_3.jpg", "color": "Silver", "main": false }
        ],
        "variants": [
            { "color": "Silver" },
            { "color": "Black" }
        ],
        "whatsInTheBox": [
            "54mm Portafilter, stainless steel with double spout",
            "4 Espresso Filter Baskets – 9g & 18g pressurised, 9g & 18g unpressurised",
            "Integrated, Magnetic Tamper",
            "480ml (16oz) Thermal Milk Jug",
            "Dosing Funnel",
            "Leveling Tool",
            "Water Filter",
            "Maintenance Kit – cleaning brush, Allen key, cleaning disc, steam wand pin",
            "1 Descaling Dose, and 2 Cleaning Tablets"
        ]
    }
    const variantMock = "Silver";

    const initialState = {
        id: "",
        items: [],
        isOpen: false,
    };

    it("should handle initial state", () => {
        expect(cartReducer(undefined, { type: "unknown" })).toEqual(initialState);
    });

    describe("addToCart", () => {
        it("adds new item if not existing", () => {
            const action = addToCart({ product: productMock, variant: variantMock });
            const state = cartReducer(initialState, action);

            expect(state.items.length).toBe(1);
            expect(state.items[0]).toEqual({
                id: `${productMock.id}-${variantMock}`,
                product: productMock,
                variant: variantMock,
                quantity: 1,
            });
        });

        it("increments quantity if item exists", () => {
            const existingState = {
                ...initialState,
                items: [
                    {
                        id: `${productMock.id}-${variantMock}`,
                        product: productMock,
                        variant: variantMock,
                        quantity: 1,
                    },
                ],
            };

            const action = addToCart({ product: productMock, variant: variantMock });
            const state = cartReducer(existingState, action);

            expect(state.items.length).toBe(1);
            expect(state.items[0].quantity).toBe(2);
        });

        it("adds item without variant", () => {
            const action = addToCart({ product: productMock, variant: undefined });
            const state = cartReducer(initialState, action);

            expect(state.items[0].id).toBe(productMock.id.toString());
            expect(state.items[0].variant).toBeUndefined();
        });
    });

    describe("increaseQuantity", () => {
        it("increases quantity of existing item", () => {
            const existingState = {
                ...initialState,
                items: [
                    { id: "1", product: productMock, variant: undefined, quantity: 1 },
                ],
            };
            const action = increaseQuantity("1");
            const state = cartReducer(existingState, action);

            expect(state.items[0].quantity).toBe(2);
        });

        it("does nothing if item not found", () => {
            const state = cartReducer(initialState, increaseQuantity("nonexistent"));
            expect(state.items.length).toBe(0);
        });
    });

    describe("decreaseQuantity", () => {
        it("decreases quantity if greater than 1", () => {
            const existingState = {
                ...initialState,
                items: [
                    { id: "1", product: productMock, variant: undefined, quantity: 3 },
                ],
            };
            const action = decreaseQuantity("1");
            const state = cartReducer(existingState, action);

            expect(state.items[0].quantity).toBe(2);
        });

        it("removes item if quantity is 1", () => {
            const existingState = {
                ...initialState,
                items: [
                    { id: "1", product: productMock, variant: undefined, quantity: 1 },
                ],
            };
            const action = decreaseQuantity("1");
            const state = cartReducer(existingState, action);

            expect(state.items.length).toBe(0);
        });

        it("does nothing if item not found", () => {
            const state = cartReducer(initialState, decreaseQuantity("nonexistent"));
            expect(state.items.length).toBe(0);
        });
    });

    describe("removeFromCart", () => {
        it("removes item by id", () => {
            const existingState = {
                ...initialState,
                items: [
                    { id: "1", product: productMock, variant: undefined, quantity: 2 },
                    { id: "2", product: productMock, variant: undefined, quantity: 1 },
                ],
            };
            const action = removeFromCart("1");
            const state = cartReducer(existingState, action);

            expect(state.items.length).toBe(1);
            expect(state.items[0].id).toBe("2");
        });
    });

    describe("toggleCart", () => {
        it("toggles isOpen state", () => {
            const stateOpen = cartReducer(initialState, toggleCart());
            expect(stateOpen.isOpen).toBe(true);

            const stateClose = cartReducer(stateOpen, toggleCart());
            expect(stateClose.isOpen).toBe(false);
        });
    });

    describe("resetCart", () => {
        it("clears all items", () => {
            const existingState = {
                ...initialState,
                items: [
                    { id: "1", product: productMock, variant: undefined, quantity: 2 },
                ],
            };
            const state = cartReducer(existingState, resetCart());
            expect(state.items.length).toBe(0);
        });
    });
});
