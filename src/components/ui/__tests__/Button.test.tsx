import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Button from "../Button";
import '@testing-library/jest-dom';

describe("Button component", () => {
    it("renders button by default", () => {
        render(<Button>Click me</Button>);
        const btn = screen.getByRole("button", { name: /click me/i });
        expect(btn).toBeInTheDocument();
        expect(btn).not.toBeDisabled();
    });

    it("renders button with start and end icons", () => {
        render(
            <Button startIcon={<span data-testid="start-icon">S</span>} endIcon={<span data-testid="end-icon">E</span>}>
                Button with icons
            </Button>
        );
        expect(screen.getByTestId("start-icon")).toBeInTheDocument();
        expect(screen.getByTestId("end-icon")).toBeInTheDocument();
    });

    it("calls onClick when clicked and not disabled", () => {
        const handleClick = jest.fn();
        render(<Button onClick={handleClick}>Click me</Button>);
        fireEvent.click(screen.getByRole("button"));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("does not call onClick when disabled", () => {
        const handleClick = jest.fn();
        render(
            <Button onClick={handleClick} disabled>
                Disabled Button
            </Button>
        );
        const btn = screen.getByRole("button");
        expect(btn).toBeDisabled();
        fireEvent.click(btn);
        expect(handleClick).not.toHaveBeenCalled();
    });

    it("renders Link type button with href", () => {
        render(
            <Button type="link" href="/about">
                Link Button
            </Button>
        );
        const link = screen.getByRole("link", { name: /link button/i });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute("href", "/about");
    });

    it("renders null and warns if type=link but href missing", () => {
        const consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation(() => { });
        const { container } = render(<Button type="link">Missing href</Button>);
        expect(container.firstChild).toBeNull();
        expect(consoleWarnSpy).toHaveBeenCalledWith("Button of type 'link' requires an href prop");
        consoleWarnSpy.mockRestore();
    });

    it("renders disabled span instead of Link when disabled", () => {
        render(
            <Button type="link" href="/disabled" disabled>
                Disabled Link
            </Button>
        );
        const span = screen.getByText(/disabled link/i);
        expect(span.tagName).toBe("SPAN");
        const spanWithAriaDisabled = document.querySelector('span[aria-disabled="true"]');
        expect(spanWithAriaDisabled).toBeInTheDocument();
        expect(spanWithAriaDisabled?.textContent).toContain("Disabled Link");
    });


    it("applies disabled styles when disabled", () => {
        render(<Button disabled>Disabled Button</Button>);
        const btn = screen.getByRole("button", { name: /disabled button/i });
        expect(btn).toHaveClass("bg-gray-400");
        expect(btn).toHaveClass("cursor-not-allowed");

    });
});
