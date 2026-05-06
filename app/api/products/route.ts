import { NextRequest, NextResponse } from "next/server";

const API = process.env.NEXT_PUBLIC_API as string;

// GET all products
export const GET = async () => {
  try {
    const response = await fetch(`${API}/products`);
    const products = await response.json();

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching products" },
      { status: 500 }
    );
  }
};

// CREATE product
export const POST = async (request: NextRequest) => {
  try {
    const payload = await request.json();

    const response = await fetch(`${API}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const createdProduct = await response.json();

    return NextResponse.json(createdProduct);
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating product" },
      { status: 500 }
    );
  }
};