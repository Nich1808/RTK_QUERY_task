import { NextResponse } from "next/server";
import { writeFile as saveFile } from "fs/promises";
import { join } from "path";

export const runtime = "nodejs";

export const POST = async (req: Request) => {
  try {
    const form = await req.formData();
    const uploadedFile: any = form.get("file");

    if (!uploadedFile) {
      return NextResponse.json(
        { error: "File is missing" },
        { status: 400 }
      );
    }

    const bytes = await uploadedFile.arrayBuffer();
    const fileBuffer = Buffer.from(bytes);

    const uniqueName = `${Date.now()}_${uploadedFile.name}`;
    const uploadDir = join(process.cwd(), "public", "uploads");
    const fullPath = join(uploadDir, uniqueName);

    await saveFile(fullPath, fileBuffer);

    return NextResponse.json({
      location: `/uploads/${uniqueName}`,
    });
  } catch (error: any) {
    console.error("File upload failed:", error);

    return NextResponse.json(
      { error: error?.message || "Upload error" },
      { status: 500 }
    );
  }
};