'use client';

import { CldUploadWidget } from 'next-cloudinary';
import type { CloudinaryUploadWidgetResults } from 'next-cloudinary';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import { ImagePlus } from 'lucide-react';
import { cloudinary } from '@/lib/cloudinary';

interface ImageUploadProps {
  onChange: (value: string) => void;
  value: string;
}

export function ImageUpload({ onChange, value }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(value);

  const handleUpload = useCallback((results: CloudinaryUploadWidgetResults) => {
    console.log('Upload callback triggered');
    console.log('Full results:', results);

    if (!results.info || typeof results.info === 'string') {
      console.log('No upload info available');
      return;
    }

    try {
      // Get the URL from the upload result
      const url = results.info.secure_url;
      if (!url) {
        throw new Error('No URL received from upload');
      }

      console.log('Upload URL:', url);
      setImageUrl(url);
      onChange(url);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please try again.');
      setImageUrl('');
    } finally {
      setUploading(false);
    }
  }, [onChange]);

  return (
    <div className="space-y-2">
      <CldUploadWidget
        onSuccess={handleUpload}
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
        options={{
          maxFiles: 1,
          resourceType: "image",
          showAdvancedOptions: false,
          multiple: false,
        }}
      >
        {({ open }) => {
          return (
            <div
              onClick={() => !uploading && open?.()}
              className="relative cursor-pointer hover:opacity-70 border-dashed border-2 border-primary/20 flex flex-col justify-center items-center h-60 transition"
            >
              {imageUrl ? (
                <div className="absolute inset-0 w-full h-full">
                  <Image
                    fill
                    style={{ objectFit: 'cover' }}
                    src={imageUrl}
                    alt="Upload"
                    className="rounded-md"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-4">
                  {uploading ? (
                    <div className="text-sm text-muted-foreground">
                      Uploading image...
                    </div>
                  ) : (
                    <>
                      <ImagePlus className="h-10 w-10 text-primary/50" />
                      <div className="text-sm text-muted-foreground">
                        Click to upload an image or paste a URL
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        }}
      </CldUploadWidget>
      {imageUrl && (
        <p className="text-sm text-muted-foreground">
          Image uploaded successfully
        </p>
      )}
    </div>
  );
} 