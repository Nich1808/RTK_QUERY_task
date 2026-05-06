"use client";

import { useGetProductsQuery } from "@/lip/features/product/prodcuctApi";
import Link from "next/link";
import ProductCard from "../components/productCard";



export default function ProductList() {
  const { data, isLoading } = useGetProductsQuery();

  console.log(data);

  return (
    <main className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 mt-10">
      {data?.map((d) => (
        <Link href={`/products/${d.id}`}>
          <ProductCard
            key={d.id}
            images={d.images}
            title={d.title}
            description={d.description}
            price={d.price}
            category={d.category}
          />
        </Link>
      ))}
      {isLoading ? <p>loading...</p> : <p>get prduct succes</p>}
    </main>
  );
}
