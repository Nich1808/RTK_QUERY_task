"use client";

import ProductForm from "@/components/forms/product-form";
import { useGetProductQuery } from "@/lip/features/product/prodcuctApi";
import { use } from "react";

export default function UpdateProductPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = use(params);
  const { data: product, isLoading, error } = useGetProductQuery(id);

  if (isLoading) return <p>Loading...</p>;
  if (error || !product) return <p>Product not found</p>;

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <ProductForm product={product} />
    </div>
  );
}