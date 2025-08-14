import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import { FiSearch, FiShoppingCart, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { toggleCart } from "@/store/slice/cartSlice";
import { useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { searchProducts } from "@/services/productsService";

type NavbarProps = {
    cartItemCount?: number;
};

// debounce hook
function useDebounce<T>(value: T, delay: number) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
}

export default function Navbar({ cartItemCount = 0 }: NavbarProps) {
    const router = useRouter();
    const dispatch = useDispatch();
    const containerRef = useRef<HTMLDivElement>(null);

    const [searchOpen, setSearchOpen] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const debouncedSearch = useDebounce(searchTerm, 300);

    // React Query pakai searchProducts
    const { data: products = [], isLoading } = useQuery({
        queryKey: ["searchProducts", debouncedSearch],
        queryFn: () => searchProducts(debouncedSearch),
        enabled: !!debouncedSearch, // fetch hanya kalau ada query
        staleTime: 60_000,
    });

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    function handleSelect(slug: string) {
        setSearchTerm("");
        setShowDropdown(false);
        router.push(`/product/${slug}`);
    }

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
            setSearchOpen(false);
            setShowDropdown(false);
            setSearchTerm("");
        }
    };

    return (
        <nav className="bg-white dark:bg-gray-900 shadow-md relative z-50">
            <div className="container mx-auto flex items-center justify-between p-4 h-16">
                {/* Logo */}
                <Link href="/" className="flex-shrink-0 flex items-center h-full">
                    <Image
                        src="/images/logo/rolo_black.png"
                        alt="ROLO"
                        width={120}
                        height={40}
                        className="object-contain"
                        priority
                    />
                </Link>

                {/* Desktop Search & Cart */}
                <div
                    ref={containerRef}
                    className="hidden md:flex items-center space-x-4 flex-grow max-w-lg h-full relative"
                >
                    <form
                        onSubmit={handleSearchSubmit}
                        className="relative flex-grow h-full flex items-center"
                        autoComplete="off"
                    >
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="w-full pl-10 pr-3 py-2 rounded border border-gray-300 dark:border-gray-700 focus:outline-none dark:bg-gray-800 dark:text-white h-10"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setShowDropdown(true);
                            }}
                            onFocus={() => searchTerm.length > 0 && setShowDropdown(true)}
                        />
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />

                        {showDropdown && debouncedSearch && (
                            <>
                                <div
                                    className="fixed inset-x-0 top-16 bottom-0 bg-black opacity-50 z-40"
                                    onClick={() => setShowDropdown(false)}
                                />
                                <ul
                                    className="absolute top-full left-0 right-0 z-50 bg-white rounded shadow-lg max-h-64 overflow-auto mt-1 border border-gray-300 dark:bg-gray-800 dark:border-gray-700"
                                    onMouseDown={(e) => e.preventDefault()}
                                >
                                    {isLoading ? (
                                        Array.from({ length: 5 }).map((_, i) => (
                                            <li
                                                key={i}
                                                className="animate-pulse px-4 py-2 border-b border-gray-300 dark:border-gray-600 flex items-center space-x-3"
                                            >
                                                <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded" />
                                                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
                                            </li>
                                        ))
                                    ) : products.length > 0 ? (
                                        products.map((p, index) => (
                                            <li
                                                key={p.id}
                                                onClick={() => handleSelect(p.slug)}
                                                className={`cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-3 ${index !== products.length - 1
                                                        ? "border-b border-gray-300 dark:border-gray-600"
                                                        : ""
                                                    }`}
                                            >
                                                <Image
                                                    src={p.images[0]?.url || "/images/placeholder.png"}
                                                    alt={p.name}
                                                    width={80}
                                                    height={80}
                                                    className="w-10 h-10 object-cover rounded"
                                                    loading="lazy"
                                                />
                                                <span>{p.name}</span>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="px-4 py-2 text-gray-500 dark:text-gray-400">
                                            No products found
                                        </li>
                                    )}
                                </ul>
                            </>
                        )}
                    </form>

                    {/* Cart */}
                    <div
                        onClick={() => dispatch(toggleCart())}
                        className="relative text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center h-full cursor-pointer"
                    >
                        <FiShoppingCart className="h-6 w-6" />
                        {cartItemCount > 0 && (
                            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
                                {cartItemCount}
                            </span>
                        )}
                    </div>
                </div>

                {/* Mobile */}
                <div className="flex md:hidden items-center space-x-4 h-full">
                    <button
                        onClick={() => setSearchOpen((open) => !open)}
                        aria-label="Toggle search"
                        className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none flex items-center relative w-6 h-6"
                    >
                        <AnimatePresence initial={false} mode="wait">
                            {searchOpen ? (
                                <motion.span
                                    key="close"
                                    initial={{ rotate: -90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: 90, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="absolute inset-0 flex justify-center items-center"
                                >
                                    <FiX className="h-6 w-6" />
                                </motion.span>
                            ) : (
                                <motion.span
                                    key="search"
                                    initial={{ rotate: 90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: -90, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="absolute inset-0 flex justify-center items-center"
                                >
                                    <FiSearch className="h-6 w-6" />
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </button>

                    <div
                        onClick={() => dispatch(toggleCart())}
                        className="relative text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center h-full cursor-pointer"
                    >
                        <FiShoppingCart className="h-6 w-6" />
                        {cartItemCount > 0 && (
                            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
                                {cartItemCount}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Search */}
            <AnimatePresence>
                {searchOpen && (
                    <motion.div
                        key="mobile-search"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="md:hidden px-4 overflow-hidden border-t border-gray-300 dark:border-gray-700 z-50"
                    >
                        <div className="container mx-auto px-4 py-2">
                            <form
                                onSubmit={handleSearchSubmit}
                                className="relative py-2"
                                autoComplete="off"
                            >
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    className="w-full pl-10 pr-3 py-2 rounded border border-gray-300 dark:border-gray-700 focus:outline-none dark:bg-gray-800 dark:text-white"
                                    autoFocus
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setShowDropdown(true);
                                    }}
                                    onFocus={() => searchTerm.length > 0 && setShowDropdown(true)}
                                />
                                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            </form>

                            {showDropdown && debouncedSearch && (
                                <>
                                    <div
                                        className="fixed inset-x-0 top-16 bottom-0 bg-black opacity-50 z-40"
                                        onClick={() => setShowDropdown(false)}
                                    />
                                    <ul
                                        className="absolute top-full left-0 right-0 z-50 bg-white rounded shadow-lg max-h-64 overflow-auto mt-1 border border-gray-300 dark:bg-gray-800 dark:border-gray-700"
                                        onMouseDown={(e) => e.preventDefault()}
                                    >
                                        {isLoading ? (
                                            Array.from({ length: 5 }).map((_, i) => (
                                                <li
                                                    key={i}
                                                    className="animate-pulse px-4 py-2 border-b border-gray-300 dark:border-gray-600 flex items-center space-x-3"
                                                >
                                                    <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded" />
                                                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
                                                </li>
                                            ))
                                        ) : products.length > 0 ? (
                                            products.map((p, index) => (
                                                <li
                                                    key={p.id}
                                                    onClick={() => handleSelect(p.slug)}
                                                    className={`cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-3 ${index !== products.length - 1
                                                        ? "border-b border-gray-300 dark:border-gray-600"
                                                        : ""
                                                        }`}
                                                >
                                                    <Image
                                                        src={p.images[0]?.url || "/images/placeholder.png"}
                                                        alt={p.name}
                                                        width={80}
                                                        height={80}
                                                        className="w-10 h-10 object-cover rounded"
                                                        loading="lazy"
                                                    />
                                                    <span>{p.name}</span>
                                                </li>
                                            ))
                                        ) : (
                                            <li className="px-4 py-2 text-gray-500 dark:text-gray-400">
                                                No products found
                                            </li>
                                        )}
                                    </ul>
                                </>
                            )}

                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
