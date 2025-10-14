"use client";

import {
  ImageCropper,
  ImageCropperFileSelector,
  ImageCropperPreview,
} from "@/registry/blocks/image-cropper";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { useState } from "react";

export default function Preview() {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  return (
    <div>
      <ImageCropperFileSelector
        onFileSelect={(file) => {
          setFile(file);
          setOpen(true);
        }}
        className="w-40 aspect-square"
      >
        {preview && (
          <ImageCropperPreview src={preview} onRemove={() => setPreview("")} />
        )}
      </ImageCropperFileSelector>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTitle className="sr-only">画像をクロップ</DialogTitle>
        <DialogContent className="max-w-md">
          {file && (
            <ImageCropper
              image={file}
              canvasWidth={400}
              aspectRatio={1}
              resultWidth={600}
              onCrop={(dataUrl, blob) => {
                setPreview(dataUrl);
                setOpen(false);
                console.log("クロップ完了:", {
                  dataUrl: dataUrl.substring(0, 50) + "...",
                  blobSize: blob.size,
                });
              }}
              onCancel={() => setOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
