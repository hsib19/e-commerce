import createWebStorage from "redux-persist/lib/storage/createWebStorage";

export const createNoopStorage = () => {
    return {
        getItem(): Promise<string | null> {
            return Promise.resolve(null);
        },
        setItem(value: string): Promise<string> {
            return Promise.resolve(value);
        },
        removeItem(): Promise<void> {
            return Promise.resolve();
        },
    };
};


const storage = typeof window !== "undefined" ? createWebStorage("local") : createNoopStorage();

export default storage;
