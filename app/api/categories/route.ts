import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API as string;

export const GET = async () => {
  let result;

  try {
    const response = await fetch(`${API_URL}/categories`);

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    result = await response.json();
  } catch (error) {
    return NextResponse.json(
      { error: "Unable to retrieve categories" },
      { status: 500 }
    );
  }

  return NextResponse.json(result);
};