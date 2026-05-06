  "use client";
import { useGetProductQuery } from "@/lip/features/product/prodcuctApi";
import { UpdateProductForm } from "@/components/forms/product-form-update";
import { useParams } from "next/navigation";
import { use } from "react";
import { ProductForm } from "@/components/forms/product-form";

export default function UpdateProductPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {

  const { id } = use(params);
  const { data: product, isLoading, error } = useGetProductQuery(id);

  console.log(id);

  if (isLoading) return <p>Loading...</p>;
  if (error || !product) return <p>Product not found</p>;
  return <ProductForm product={product} />;
}

