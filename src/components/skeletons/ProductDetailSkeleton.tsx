export default function ProductDetailSkeleton() {
    return (
        <div className="container mx-auto px-4 py-8 animate-pulse" aria-label="Loading product detail">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Left side: image area */}
                <div className="md:w-2/5 w-full space-y-4">
                    <div className="w-full h-[400px] bg-gray-300 rounded-md" />
                    <div className="flex space-x-3 overflow-x-auto">
                        {[1, 2, 3, 4].map((_, i) => (
                            <div key={i} className="w-20 h-20 bg-gray-300 rounded-sm border border-gray-300" />
                        ))}
                    </div>
                </div>

                {/* Right side: details */}
                <div className="md:w-3/5 w-full space-y-6">
                    <nav className="h-5 bg-gray-300 rounded w-48" />

                    <div className="h-10 bg-gray-300 rounded w-3/4" />

                    <div className="flex space-x-2">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-5 bg-gray-300 rounded w-20" />
                        ))}
                    </div>

                    <div className="flex items-center justify-between space-x-3">
                        <div className="h-10 bg-gray-300 rounded w-32" />
                        <div className="h-6 bg-gray-300 rounded w-32" />
                    </div>

                    <hr className="border-0 h-px bg-gray-300" />

                    <div className="h-6 bg-gray-300 rounded w-20" />

                    <div className="flex space-x-3 items-center">
                        {[1, 2].map((_, i) => (
                            <div key={i} className="w-8 h-8 rounded-full bg-gray-300 border border-gray-300" />
                        ))}
                        <div className="h-6 bg-gray-300 rounded w-24 ml-auto" />
                    </div>

                    <hr className="border-0 h-px bg-gray-300" />

                    <div className="space-y-2">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-4 bg-gray-300 rounded w-full max-w-[600px]" />
                        ))}
                    </div>

                    <hr className="border-0 h-px bg-gray-300" />

                    <section>
                        <h3 className="h-6 bg-gray-300 rounded w-48 mb-2" />
                        <ul className="list-disc list-inside space-y-1">
                            {[...Array(5)].map((_, i) => (
                                <li key={i} className="h-4 bg-gray-300 rounded w-full max-w-[400px]" />
                            ))}
                        </ul>
                    </section>
                </div>
            </div>

            {/* Bottom navbar */}
            <div className="fixed bottom-0 left-0 w-full bg-white border-t border-t-gray-300 shadow-md flex items-center justify-between px-4 py-5 z-50">
                <div className="flex items-center space-x-2">
                    <div className="h-6 w-20 bg-gray-300 rounded" />
                </div>
                <div className="flex items-center space-x-4">
                    <div className="h-8 w-20 bg-gray-300 rounded" />
                    <div className="h-10 w-32 bg-gray-300 rounded" />
                </div>
            </div>
        </div>
    );
}
