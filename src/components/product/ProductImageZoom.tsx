import { useState } from "react";
import Image from "next/image";

export default function ProductImageZoom({ src, alt }: { src: string; alt: string }) {
    const [zoom, setZoom] = useState(false);
    const [origin, setOrigin] = useState("center center");

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.pageX - left) / width) * 100;
        const y = ((e.pageY - top) / height) * 100;
        setOrigin(`${x}% ${y}%`);
    };

    return (
        <div
            className="relative w-full h-[400px] overflow-hidden rounded-md bg-gray-100 cursor-zoom-in"
            onMouseEnter={() => setZoom(true)}
            onMouseLeave={() => setZoom(false)}
            onMouseMove={handleMouseMove}
        >
            <Image
                src={src}
                alt={alt}
                fill
                className={`object-contain transition-transform duration-200`}
                style={{
                    transformOrigin: origin,
                    transform: zoom ? "scale(2)" : "scale(1)",
                }}
            />
        </div>
    );
}
