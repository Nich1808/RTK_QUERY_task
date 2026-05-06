"use client";
import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import { useAddProductsMutation, useUpdateProductMutation } from "@/lip/features/product/prodcuctApi";
import { useGetCategoriesQuery } from "@/lip/features/product/categoryApi";
import UploadFile from "@/lip/features/product/imagApi";
import ImageUpload, { ImageFile } from "./image-form";

import { productRequst, productResponse } from "@/lip/types/productType";

const productSchema = z.object({
  title: z.string().min(5).max(32),
  description: z.string().min(10).max(100),
  price: z.coerce.number().positive(),
  categoryId: z.string().min(1),
  images: z.array(
    z.object({
      id: z.string(),
      file: z.instanceof(File).optional(),
      preview: z.string(),
    })
  ).nonempty("Must provide at least one image"),
});

type ProductFormProps = {
  product?: productResponse;
};

export function ProductForm({ product }: ProductFormProps) {
  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: product?.title || "",
      description: product?.description || "",
      price: product?.price || 0,
      categoryId: product?.category.id.toString() || "",
      images: product?.images.map((url, index) => ({
        id: `img-${index}`,
        file: undefined,
        preview: url,
      })) || [],
    },
  });

  const { data: categories } = useGetCategoriesQuery();
  const [addProduct, { isLoading: isAdding }] = useAddProductsMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const onSubmit = async (data: z.infer<typeof productSchema>) => {
    try {
   
      const imageUrls = await Promise.all(
        data.images.map(async (img) => {
          if (img.file) {
            const formData = new FormData();
            formData.append("file", img.file);
            const res = await UploadFile(formData);
            return res.location;
          }
          return img.preview; 
        })
      );

      const payload: productRequst = {
        title: data.title,
        description: data.description,
        price: Number(data.price),
        categoryId: Number(data.categoryId),
        images: imageUrls,
      };

      if (product) {
      
        await updateProduct({ id: product.id, data: payload }).unwrap();
        toast.success("Product updated successfully!");
      } else {
     
        await addProduct(payload).unwrap();
        toast.success("Product created successfully!");
        form.reset();
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Something went wrong");
    }
  };

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>{product ? "Edit Product" : "Add Product"}</CardTitle>
        {!product && <CardDescription>Fill out the details below to add a new product.</CardDescription>}
      </CardHeader>

      <CardContent>
        <form id="product-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            {/* Title */}
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="title">Title</FieldLabel>
                  <Input {...field} id="title" placeholder="Product title" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="price"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="price">Price</FieldLabel>
                  <Input {...field} id="price" type="number" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

   
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="description">Description</FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea {...field} id="description" rows={5} />
                    <InputGroupAddon align="block-end">
                      <InputGroupText>{field.value.length}/100</InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

        
            <Controller
              name="categoryId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Category</FieldLabel>
                  <Select value={field.value || ""} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((cate) => (
                        <SelectItem key={cate.id} value={String(cate.id)}>
                          {cate.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

 
            <Controller
              name="images"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Images</FieldLabel>
                  <ImageUpload
                    images={field.value}
                    onImagesChange={(imgs) => field.onChange(imgs)}
                  />
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter>
        <Button type="submit" form="product-form" disabled={isAdding || isUpdating}>
          {isAdding || isUpdating
            ? product
              ? "Updating..."
              : "Submitting..."
            : product
            ? "Update Product"
            : "Create Product"}
        </Button>
      </CardFooter>
    </Card>
  );
}