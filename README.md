# TheBlog - Modern Blogging Platform

A full-featured blogging platform built with Next.js, GraphQL, and Prisma. This application provides a modern, responsive interface for creating, managing, and sharing blog posts with features like rich text editing, image uploads, categories, and social interactions.

## Features

- 🔐 User authentication with NextAuth.js
- 📝 Rich text editor with TipTap
- 🖼️ Image upload support with Cloudinary
- 🏷️ Category management for posts
- 👍 Social features (likes, comments, shares)
- 🎨 Beautiful UI with Tailwind CSS and shadcn/ui
- 🌓 Dark/Light mode support
- 🚀 GraphQL API with Pothos and Apollo
- 📱 Fully responsive design

## Tech Stack

- **Frontend:**
  - Next.js 15
  - React 19
  - Apollo Client
  - TipTap Editor
  - Tailwind CSS
  - shadcn/ui components

- **Backend:**
  - GraphQL with Apollo Server
  - Pothos GraphQL Schema Builder
  - Prisma ORM
  - NextAuth.js for authentication

- **Database:**
  - PostgreSQL (via Prisma)

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/theblog.git
cd theblog
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a .env file in the root directory with the following variables:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/theblog"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

- `/app` - Next.js app router pages and layouts
- `/components` - Reusable React components
- `/graphql` - GraphQL schema, resolvers, and types
- `/lib` - Utility functions and configurations
- `/prisma` - Database schema and migrations
- `/public` - Static assets
- `/types` - TypeScript type definitions

## Available Scripts

- `npm run dev` - Run development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code linting

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Apollo GraphQL](https://www.apollographql.com/)
- [Prisma](https://www.prisma.io/)
- [TipTap](https://tiptap.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
