import ProductForm from "@/components/forms/product-form";


export default function insertProduct() {
  return (
    <div className=" flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="w-full max-w-md">
        <ProductForm />
      </div>
    </div>
  );
}