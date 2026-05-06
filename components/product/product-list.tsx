"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MoreHorizontalIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from "@/lip/features/product/prodcuctApi";

import ProductDeleteItem from "@/app/dashboard/deleteProduct/page";

const ProductlistClient = () => {
  const router = useRouter();

  const { data: products, isLoading } = useGetProductsQuery();
  const [removeProduct] = useDeleteProductMutation();

  const handleRemove = async (id: number) => {
    try {
      const res = await removeProduct(id).unwrap();

      if (res) {
        toast.success("Product deleted successfully");
      } else {
        toast.error("Delete failed");
      }
    } catch (error: any) {
      console.error("Delete error:", error);
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  const handleEdit = (id: number) => {
    router.push(`/dashboard/updateProduct/${id}`);
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Category</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {products?.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">
              {item.title}
            </TableCell>

            <TableCell>${item.price}</TableCell>

            <TableCell>{item.category?.name}</TableCell>

            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="ghost">
                    <MoreHorizontalIcon />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => handleEdit(item.id)}
                  >
                    Edit
                  </DropdownMenuItem>

                  <DropdownMenuItem>Duplicate</DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <ProductDeleteItem
                    productId={item.id}
                    onDelete={handleRemove}
                  />
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ProductlistClient;