import React, { ReactNode } from 'react';
import Navbar from '@/components/navbar/Navbar';
import { useAppSelector } from '@/store/hooks';

type Props = { children: ReactNode };

export default function MainLayout({ children }: Props) {

    const cart = useAppSelector((state) => state.cart.items);

    return (
        <div className="min-h-screen bg-white flex flex-col dark:bg-gray-900 text-black dark:text-white transition-colors duration-300">
            <Navbar cartItemCount={cart.length} />
            <main className="container mx-auto p-4">{children}</main>
            <footer className="container mx-auto text-start p-4">© 2025 ROLO</footer>
        </div>
    );
}
