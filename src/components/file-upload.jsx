"use client";
import { UploadDropzone } from "@uploadthing/react";
import Image from "next/image";
import { useToast } from "./ui/use-toast";
import { useEffect, useState } from "react";
import { AlertModal } from "./ui/alert-modal";

const IMG_MAX_LIMIT = 1;

export default function FileUpload({ images, setImages, handleRemoveImage }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setloading] = useState(false);

  const onConfirm = () => {
    handleRemoveImage();
  };

  return (
    <div>
      <div className="mb-4 flex items-center gap-4 w-full h-full mt-2">
        {images.length > 0 &&
          images.map((item, index) => (
            <div key={index} className="relative overflow-hidden rounded-md">
              <Image width={400} height={50} alt="Imagen" src={item.url} />
              <div
                className="absolute bottom-2 transition-all left-1/2 transform -translate-x-1/2 bg-red-500 text-sm text-white font-semibold w-11/12 flex py-2 rounded-md hover:cursor-pointer hover:bg-red-700 justify-center items-center"
                onClick={() => setOpen(true)}
              >
                <p>Delete</p>
              </div>
              <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onConfirm}
                loading={loading}
              />
            </div>
          ))}
      </div>

      {images.length < IMG_MAX_LIMIT && (
        <UploadDropzone
          className="ut-label:text-sm ut-allowed-content:ut-uploading:text-red-300 py-2 bg-transparent hover:bg-[#222831]/50 w-[400px] h-[400px] hover:cursor-pointer transition-all"
          endpoint="imageUploader"
          config={{ mode: "auto" }}
          content={{
            allowedContent({ isUploading }) {
              if (isUploading)
                return (
                  <p className="mt-2 animate-pulse text-sm text-slate-400">
                    Image uploading...
                  </p>
                );
            },
          }}
          onClientUploadComplete={(res) => {
            const data = res;
            if (data) {
              setImages((prevImages) => [...prevImages, ...data]);
            }
          }}
          onUploadError={(error) => {
            toast({
              title: "Error",
              variant: "destructive",
              description: error.message,
            });
          }}
        />
      )}
    </div>
  );
}
