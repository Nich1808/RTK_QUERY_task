"use client";

import { useAddProductsMutation } from "@/lip/features/product/prodcuctApi";
import { productRequst } from "@/lip/types/productType";

const AddProduct = () => {
  const [createProduct, result] = useAddProductsMutation();
  const { isLoading, data, error } = result;

  const sampleProduct: productRequst = {
    title: "Nike100",
    price: 30,
    description:
      "Nike Sportswearf DUNK NEXT NATURE - Trainers - white/black",
    categoryId: 4,
    images: ["https://api.escuelajs.co/api/v1/files/9061.webp"],
  };

  const handleClick = async () => {
    try {
      const response = await createProduct(sampleProduct);
      console.log(response);
    } catch (err) {
      console.error("Failed to add product:", err);
    }
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className="p-3 font-semibold text-white bg-gray-600 rounded-xl"
        disabled={isLoading}
      >
        {isLoading ? "Adding..." : "Click To Add Product"}
      </button>
    </div>
  );
};

export default AddProduct;