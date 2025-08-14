import Link from "next/link";
import { FiChevronRight } from "react-icons/fi";

interface BreadcrumbProps {
    items: { label: string; href?: string }[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
    return (
        <nav className="text-sm text-gray-600 dark:text-gray-400 mb-5" aria-label="Breadcrumb">
            <ol className="list-reset flex items-center space-x-1">
                {items.map((item, idx) => {
                    const isLast = idx === items.length - 1;
                    return (
                        <li key={idx} className="flex items-center">
                            {!isLast && item.href ? (
                                <>
                                    <Link href={item.href} className="hover:underline text-blue-600 dark:text-blue-400">
                                        {item.label}
                                    </Link>
                                    <FiChevronRight className="mx-1 text-gray-400 dark:text-gray-600" />
                                </>
                            ) : (
                                <span className="font-semibold">{item.label}</span>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
