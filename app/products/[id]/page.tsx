"use client";

import ProductCard from "@/app/component/productCard";
import { useGetProductQuery } from "@/lip/features/product/prodcuctApi";
import { use } from "react";

export default function ProductDetail({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = use(params);
  console.log(id);

  const { data, isLoading } = useGetProductQuery(id);

  if (isLoading) return <p>Loading...</p>;

  return (
    <section className="max-h-full flex justify-center items-center mt-20">
      <h1>{data?.title}</h1>
    </section>
  );
}
