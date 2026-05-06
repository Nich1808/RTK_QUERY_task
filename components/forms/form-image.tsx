"use client";

import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { XIcon, CloudUpload } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ImageFile {
  id: string;
  file: File;
  preview: string;
}

type ImageUploadProps = {
  images: ImageFile[];
  onImagesChange: (imgs: ImageFile[]) => void;
  maxFiles?: number;
  maxSize?: number;
  className?: string;
};

const ImageUpload = ({
  images,
  onImagesChange,
  maxFiles = 10,
  maxSize = 2 * 1024 * 1024,
  className,
}: ImageUploadProps) => {
  const handleAdd = useCallback(
    (fileList: FileList | File[]) => {
      const validImages: ImageFile[] = [];

      for (const file of Array.from(fileList)) {
        const isImage = file.type.startsWith("image/");
        const isTooLarge = file.size > maxSize;
        const isLimitReached =
          images.length + validImages.length >= maxFiles;

        if (!isImage || isTooLarge || isLimitReached) continue;

        validImages.push({
          id: crypto.randomUUID(),
          file,
          preview: URL.createObjectURL(file),
        });
      }

      if (validImages.length > 0) {
        onImagesChange([...images, ...validImages]);
      }
    },
    [images, maxFiles, maxSize, onImagesChange]
  );

  const handleRemove = (id: string) => {
    const updated = images.filter((item) => {
      if (item.id === id) {
        URL.revokeObjectURL(item.preview);
        return false;
      }
      return true;
    });

    onImagesChange(updated);
  };

  const triggerFileInput = () => {
    const inputEl = document.createElement("input");
    inputEl.type = "file";
    inputEl.multiple = true;
    inputEl.accept = "image/*";

    inputEl.addEventListener("change", (event) => {
      const target = event.target as HTMLInputElement;
      if (target.files) {
        handleAdd(target.files);
      }
    });

    inputEl.click();
  };

  const onDropHandler = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    handleAdd(event.dataTransfer.files);
  };

  return (
    <div className={cn("w-full", className)}>
      {images.length > 0 && (
        <div className="mb-4 grid grid-cols-4 gap-2">
          {images.map((item) => (
            <Card key={item.id} className="group relative">
              <img
                src={item.preview}
                alt="preview"
                className="h-24 w-full rounded-md object-cover"
              />

              <Button
                size="icon"
                variant="outline"
                onClick={() => handleRemove(item.id)}
                className="absolute right-2 top-2 opacity-0 group-hover:opacity-100"
              >
                <XIcon className="size-4" />
              </Button>
            </Card>
          ))}
        </div>
      )}

      <Card
        className="cursor-pointer border-dashed"
        onDrop={onDropHandler}
        onDragOver={(e) => e.preventDefault()}
      >
        <CardContent className="py-8 text-center">
          <CloudUpload className="mx-auto mb-3" />
          <p className="mb-3 text-sm">
            Drag & drop images or click browse
          </p>

          <Button size="sm" type="button" onClick={triggerFileInput}>
            Browse Files
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImageUpload;