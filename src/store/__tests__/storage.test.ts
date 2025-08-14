import { createNoopStorage } from "../storage";

jest.mock("redux-persist/lib/storage/createWebStorage");

describe("createNoopStorage", () => {
    const storage = createNoopStorage();

    it("getItem returns null", async () => {
        await expect(storage.getItem("key")).resolves.toBeNull();
    });

    it("setItem returns the value", async () => {
        await expect(storage.setItem("key", "value")).resolves.toBe("value");
    });

    it("removeItem resolves", async () => {
        await expect(storage.removeItem("key")).resolves.toBeUndefined();
    });
});
