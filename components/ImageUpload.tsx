'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Upload, X, Camera, ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  className?: string;
}

interface ErrorResponse {
  message: string;
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

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
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
        toast.success('Profile picture updated successfully');
      } catch (error) {
        const err = error as ErrorResponse;
        toast.error(err.message || "Failed to upload image");
    } finally {
        setIsUploading(false);
    }
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    },
    maxFiles: 1,
    multiple: false,
  });

  return (
    <div className={cn('space-y-4', className)}>
      {/* Current Avatar Display */}
      {value && (
        <div className="flex items-center gap-4 p-4 rounded-lg border bg-card">
          <Avatar className="h-16 w-16 border-2 border-border">
            <AvatarImage src={value} alt="Profile picture" />
            <AvatarFallback>
              <ImageIcon className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium">Current profile picture</p>
            <p className="text-xs text-muted-foreground">
              Click below to change or remove
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onChange('')}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={cn(
          'relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 transition-all hover:border-primary/50 hover:bg-accent/50',
          isDragActive && 'border-primary bg-accent',
          isUploading && 'pointer-events-none opacity-60'
        )}
      >
        <input {...getInputProps()} />

        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm font-medium">Uploading...</p>
            <p className="text-xs text-muted-foreground">Please wait</p>
                </div>
              ) : (
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="rounded-full bg-primary/10 p-3">
              {isDragActive ? (
                <Upload className="h-6 w-6 text-primary" />
              ) : (
                <Camera className="h-6 w-6 text-primary" />
              )}
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">
              {isDragActive
                  ? 'Drop your image here'
                  : value
                  ? 'Change profile picture'
                  : 'Upload profile picture'}
              </p>
              <p className="text-xs text-muted-foreground">
                Drag & drop or click to browse
            </p>
                      </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>PNG, JPG, GIF up to 5MB</span>
            </div>
                </div>
              )}
            </div>

      {/* Upload Tips */}
      {!value && (
        <div className="rounded-lg bg-muted/50 p-3">
          <div className="flex items-start gap-2">
            <ImageIcon className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">
                Tips for best results:
              </p>
              <ul className="text-xs text-muted-foreground space-y-0.5">
                <li>• Use a square image (1:1 ratio)</li>
                <li>• Minimum 200x200 pixels</li>
                <li>• Clear, well-lit photo works best</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 