import React from "react";
import Link from "next/link";

type ButtonProps = {
    type?: "button" | "link";
    href?: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
    children: React.ReactNode;
    className?: string;
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
    disabled?: boolean;  // tambahkan prop disabled
};

export default function Button({
    type = "button",
    href,
    onClick,
    children,
    className = "",
    startIcon,
    endIcon,
    disabled = false,
}: ButtonProps) {
    const baseStyleNoIcon =
        "block w-full text-center bg-black text-white py-2 rounded cursor-pointer font-semibold";
    const baseStyleWithIcon =
        "flex items-center space-x-2 bg-black text-white font-semibold px-4 py-2 rounded cursor-pointer";

    // Style saat disabled
    const disabledStyle = "bg-gray-400 cursor-not-allowed hover:bg-gray-400";

    const classNames = (startIcon || endIcon ? baseStyleWithIcon : baseStyleNoIcon) +
        " " + (disabled ? disabledStyle : "hover:bg-gray-700");

    if (type === "link") {
        if (!href) {
            console.warn("Button of type 'link' requires an href prop");
            return null;
        }
        return disabled ? (
            // Jika disabled, render <span> agar tidak clickable
            <span className={`${classNames} ${className}`} aria-disabled="true">
                {startIcon && <span>{startIcon}</span>}
                <span>{children}</span>
                {endIcon && <span>{endIcon}</span>}
            </span>
        ) : (
            <Link href={href} className={`${classNames} ${className}`} onClick={onClick}>
                {startIcon && <span>{startIcon}</span>}
                <span>{children}</span>
                {endIcon && <span>{endIcon}</span>}
            </Link>
        );
    }

    return (
        <button
            type="button"
            className={`${classNames} ${className}`}
            onClick={disabled ? undefined : onClick}
            disabled={disabled}
        >
            {startIcon && <span>{startIcon}</span>}
            <span>{children}</span>
            {endIcon && <span>{endIcon}</span>}
        </button>
    );
}
