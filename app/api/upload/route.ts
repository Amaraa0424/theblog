import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error('Missing required Cloudinary environment variables');
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    // Verify Cloudinary configuration
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      console.error('Cloudinary cloud_name is not configured');
      return new NextResponse('Server configuration error', { status: 500 });
    }

    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new NextResponse('No file provided', { status: 400 });
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileBase64 = `data:${file.type};base64,${buffer.toString('base64')}`;

    try {
      // Upload to Cloudinary with optimizations
      const result = await cloudinary.uploader.upload(fileBase64, {
        folder: 'blog-avatars',
        allowed_formats: ['jpg', 'png', 'gif', 'webp'],
        transformation: [
          { width: 400, height: 400, crop: 'fill' },
          { quality: 'auto' },
          { fetch_format: 'auto' },
        ],
      });

      return NextResponse.json({ url: result.secure_url });
    } catch (uploadError: any) {
      console.error('[CLOUDINARY_UPLOAD_ERROR]', uploadError);
      return new NextResponse(
        `Failed to upload image: ${uploadError.message}`,
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('[UPLOAD_ERROR]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
} 