import { combineReducers, configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slice/cartSlice";
import checkoutReducer from "./slice/checkoutSlice";
import storage from "./storage";
import { persistReducer, persistStore } from "redux-persist";

const persistConfig = {
    key: "root",
    storage,
    whitelist: ["cart"], // cuma cart yang di-persist
};

const rootReducer = combineReducers({
    cart: cartReducer,
    checkout: checkoutReducer,
});

// Tipe RootState diambil dari rootReducer, bukan store.getState (biar persistReducer bisa dikasih generic)
export type RootState = ReturnType<typeof rootReducer>;

// Gunakan generic di persistReducer untuk menghindari error type
const persistedReducer = persistReducer<RootState>(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, 
        }),
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
