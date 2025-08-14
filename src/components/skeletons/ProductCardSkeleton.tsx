export default function ProductCardSkeleton() {
    return (
        <span className="block rounded-md overflow-hidden animate-pulse" data-testid="loading-product-card" aria-label="Loading product">
            <div className="relative w-full h-80 border border-gray-300 rounded-md overflow-hidden bg-gray-200" />

            <div className="p-4 space-y-3">
                {/* Judul */}
                <div className="h-6 bg-gray-300 rounded w-3/4" />

                {/* Deskripsi (2 baris) */}
                <div className="space-y-2">
                    <div className="h-3 bg-gray-300 rounded w-full" />
                    <div className="h-3 bg-gray-300 rounded w-5/6" />
                </div>

                {/* Variant warna */}
                <div className="flex space-x-2 mt-3">
                    {[1, 2].map(i => (
                        <div key={i} className="w-6 h-6 rounded-full bg-gray-300 border border-gray-300" />
                    ))}
                </div>

                {/* Harga dan diskon */}
                <div className="flex items-center space-x-2 mt-2">
                    <div className="h-6 bg-gray-300 rounded w-20" />
                    <div className="h-4 bg-gray-300 rounded w-12" />
                    <div className="h-5 bg-gray-300 rounded w-10" />
                </div>
            </div>
        </span>
    );
}
