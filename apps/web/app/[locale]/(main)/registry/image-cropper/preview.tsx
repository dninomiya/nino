"use client";

import { useState } from "react";
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
import { Label } from "@workspace/ui/components/label";

export default function Preview() {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  return (
    <div className="flex flex-col gap-3 max-w-[240px]">
      <Label htmlFor="profile-image">プロフィール画像</Label>

      <ImageCropperFileSelector
        onFileSelect={(file) => {
          setFile(file);
          setOpen(true);
        }}
        className="w-[240px] aspect-square"
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
