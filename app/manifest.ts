import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'OurLab.fun - Where Ideas Come to Life',
    short_name: 'OurLab.fun',
    description: 'A modern blog platform where ideas come to life. Share your thoughts, connect with others, and be part of a community that values authentic expression.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    orientation: 'portrait-primary',
    scope: '/',
    lang: 'en',
    categories: ['productivity', 'social', 'education'],
    icons: [
      {
        src: 'https://res.cloudinary.com/dolfbqzp3/image/upload/v1749923735/ourlabfun-high-resolution-logo-grayscale-transparent_bzoebw.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: 'https://res.cloudinary.com/dolfbqzp3/image/upload/v1749923735/ourlabfun-high-resolution-logo-grayscale-transparent_bzoebw.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: 'https://res.cloudinary.com/dolfbqzp3/image/upload/v1749923694/ourlabfun-high-resolution-logo_yodtqj.png',
        sizes: '1024x1024',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    screenshots: [
      {
        src: 'https://res.cloudinary.com/dolfbqzp3/image/upload/v1749923694/ourlabfun-high-resolution-logo_yodtqj.png',
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide',
        label: 'OurLab.fun Homepage',
      },
    ],
    shortcuts: [
      {
        name: 'Write New Post',
        short_name: 'New Post',
        description: 'Create a new blog post',
        url: '/posts/new',
        icons: [
          {
            src: 'https://res.cloudinary.com/dolfbqzp3/image/upload/v1749923735/ourlabfun-high-resolution-logo-grayscale-transparent_bzoebw.png',
            sizes: '96x96',
            type: 'image/png',
          },
        ],
      },
      {
        name: 'Dashboard',
        short_name: 'Dashboard',
        description: 'View your dashboard',
        url: '/dashboard',
        icons: [
          {
            src: 'https://res.cloudinary.com/dolfbqzp3/image/upload/v1749923735/ourlabfun-high-resolution-logo-grayscale-transparent_bzoebw.png',
            sizes: '96x96',
            type: 'image/png',
          },
        ],
      },
    ],
  };
} 