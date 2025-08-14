import MainLayout from "@/layouts/MainLayout";
import ProductList from "@/components/catalogue/ProductList";
import ProductCardSkeleton from "@/components/skeletons/ProductCardSkeleton";
import { Product } from "@/types/product";
import Head from "next/head";
import { getProducts } from "@/services/productsService";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const { data: products, isLoading, isError, error } = useQuery<Product[], Error>({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  return (
    <MainLayout>
      <Head>
        <title>ROLO | Ecommerce</title>
      </Head>

      <h2 className="text-2xl font-bold mb-8 text-center md:text-left">Breville</h2>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
        </div>
      )}

      {isError && <p className="text-red-500">Error: {error?.message}</p>}

      {!isLoading && !isError && products && (
        <ProductList products={products} />
      )}
    </MainLayout>
  );
}
