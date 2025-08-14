import React from "react";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider, useTheme } from "../ThemeContext";

function TestComponent() {
    const { theme, toggleTheme } = useTheme();
    return (
        <>
            <div>Current theme: {theme}</div>
            <button onClick={toggleTheme}>Toggle Theme</button>
        </>
    );
}

describe("ThemeContext", () => {
    beforeEach(() => {
        localStorage.clear();
        document.documentElement.classList.remove("dark");
    });

    it("provides default theme 'light'", () => {
        render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        );
        expect(screen.getByText(/Current theme:/).textContent).toBe("Current theme: light");
        expect(document.documentElement.classList.contains("dark")).toBe(false);
    });

    it("reads saved theme from localStorage on mount", () => {
        localStorage.setItem("theme", "dark");
        render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        );
        expect(screen.getByText(/Current theme:/).textContent).toBe("Current theme: dark");
        expect(document.documentElement.classList.contains("dark")).toBe(true);
    });

    it("toggles theme and updates localStorage and html class", async () => {
        render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        );
        const button = screen.getByRole("button", { name: /toggle theme/i });

        expect(localStorage.getItem("theme")).toBe("light");
        expect(document.documentElement.classList.contains("dark")).toBe(false);

        await act(async () => {
            await userEvent.click(button);
        });

        expect(screen.getByText(/Current theme:/).textContent).toBe("Current theme: dark");
        expect(localStorage.getItem("theme")).toBe("dark");
        expect(document.documentElement.classList.contains("dark")).toBe(true);

        await act(async () => {
            await userEvent.click(button);
        });

        expect(screen.getByText(/Current theme:/).textContent).toBe("Current theme: light");
        expect(localStorage.getItem("theme")).toBe("light");
        expect(document.documentElement.classList.contains("dark")).toBe(false);
    });

    it("useTheme throws error when used outside ThemeProvider", () => {
        const consoleError = jest.spyOn(console, "error").mockImplementation(() => { }); // suppress error logs
        function Component() {
            useTheme();
            return null;
        }
        expect(() => render(<Component />)).toThrow("useTheme must be used within a ThemeProvider");
        consoleError.mockRestore();
    });
});
