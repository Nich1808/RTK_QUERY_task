"use client";

import * as React from "react";
import * as z from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupTextarea,
  InputGroupText,
} from "@/components/ui/input-group";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import {
  useAddProductsMutation,
  useUpdateProductMutation,
} from "@/lip/features/product/prodcuctApi";
import { useGetCategoriesQuery } from "@/lip/features/product/categoryApi";
import uploadFile from "@/lip/features/product/imagApi";
import ImageUpload, { ImageFile } from "./form-image";

import {
  productRequst,
  productResponse,
} from "@/lip/types/productType";

const schema = z.object({
  title: z.string().min(5).max(32),
  description: z.string().min(10).max(100),
  price: z.coerce.number().positive(),
  categoryId: z.string().min(1),
  images: z
    .array(
      z.object({
        id: z.string(),
        file: z.instanceof(File).optional(),
        preview: z.string(),
      })
    )
    .min(1, "At least one image is required"),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  product?: productResponse;
};

const ProductForm = ({ product }: Props) => {
  const { data: categoryList } = useGetCategoriesQuery();
  const [createProduct, addState] = useAddProductsMutation();
  const [editProduct, updateState] = useUpdateProductMutation();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: product?.title ?? "",
      description: product?.description ?? "",
      price: product?.price ?? 0,
      categoryId: product?.category?.id?.toString() ?? "",
      images:
        product?.images?.map((url, i) => ({
          id: `img-${i}`,
          preview: url,
          file: undefined,
        })) ?? [],
    },
  });

  const isLoading = addState.isLoading || updateState.isLoading;

  const handleSubmit = async (values: FormValues) => {
    try {
      const uploadedImages = await Promise.all(
        values.images.map(async (img) => {
          if (img.file) {
            const fd = new FormData();
            fd.append("file", img.file);
            const res = await uploadFile(fd);
            return res.location;
          }
          return img.preview;
        })
      );

      const payload: productRequst = {
        title: values.title,
        description: values.description,
        price: Number(values.price),
        categoryId: Number(values.categoryId),
        images: uploadedImages,
      };

      if (product) {
        await editProduct({ id: product.id, data: payload }).unwrap();
        toast.success("Updated successfully");
      } else {
        await createProduct(payload).unwrap();
        toast.success("Created successfully");
        form.reset();
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "Error occurred");
    }
  };

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>
          {product ? "Edit Product" : "Create Product"}
        </CardTitle>
        {!product && (
          <CardDescription>
            Enter product information below
          </CardDescription>
        )}
      </CardHeader>

      <CardContent>
        <form onSubmit={form.handleSubmit(handleSubmit)} id="form-product">
          <FieldGroup>
        
            <Controller
              control={form.control}
              name="title"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Title</FieldLabel>
                  <Input {...field} placeholder="Enter title" />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

           
            <Controller
              control={form.control}
              name="price"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Price</FieldLabel>
                  <Input type="number" {...field} />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="description"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Description</FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea {...field} rows={4} />
                    <InputGroupAddon align="block-end">
                      <InputGroupText>
                        {field.value.length}/100
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* category */}
            <Controller
              control={form.control}
              name="categoryId"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Category</FieldLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryList?.map((c) => (
                        <SelectItem
                          key={c.id}
                          value={String(c.id)}
                        >
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* images */}
            <Controller
              control={form.control}
              name="images"
              render={({ field }) => (
                <Field>
                  <FieldLabel>Images</FieldLabel>
                  <ImageUpload
                    images={field.value}
                    onImagesChange={field.onChange}
                  />
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter>
        <Button
          form="form-product"
          type="submit"
          disabled={isLoading}
        >
          {isLoading
            ? product
              ? "Updating..."
              : "Creating..."
            : product
            ? "Update"
            : "Create"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductForm;