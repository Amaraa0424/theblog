import { Suspense } from 'react';
import { EditPostContent } from './EditPostContent';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({
  params,
}: PageProps) {
  const resolvedParams = await params;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Edit Post</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <EditPostContent id={resolvedParams.id} />
      </Suspense>
    </div>
  );
} 