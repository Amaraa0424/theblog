'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Loader2, Upload } from 'lucide-react';

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function ImageUpload({ value, onChange, className }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      if (!file) {
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
      return;
    }

    try {
        setIsUploading(true);

        // Create a FormData instance
        const formData = new FormData();
        formData.append('file', file);

        // Upload to your server/cloud storage
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to upload image');
      }

        const data = await response.json();
        onChange(data.url);
        toast.success('Image uploaded successfully');
      } catch (error: any) {
        toast.error(error.message || 'Failed to upload image');
    } finally {
        setIsUploading(false);
    }
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
    },
    maxFiles: 1,
    multiple: false,
  });

  return (
    <div className={cn('flex flex-col items-center gap-4', className)}>
      <div
        {...getRootProps()}
        className={cn(
          'relative flex aspect-square w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 transition hover:bg-accent/50',
          isDragActive && 'border-primary bg-accent',
          value && 'aspect-square'
        )}
      >
        <input {...getInputProps()} />

        {value ? (
          <div className="relative aspect-square h-full w-full">
                  <Image
              src={value}
              alt="Uploaded image"
              className="rounded-lg object-cover"
                    fill
                  />
                </div>
              ) : (
          <div className="flex flex-col items-center justify-center gap-2 p-4 text-center">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {isDragActive
                ? 'Drop the image here'
                : 'Drag & drop an image here, or click to select'}
            </p>
                      </div>
                  )}

        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-background/80">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              )}
            </div>

      {value && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onChange('')}
        >
          Remove Image
        </Button>
      )}
    </div>
  );
} 