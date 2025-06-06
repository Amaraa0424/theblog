import { Suspense } from 'react';
import { use } from 'react';
import { EditPostContent } from './EditPostContent';

export default function EditPostPage({
  params,
}: {
  params: { id: string };
}) {
  const resolvedParams = use(Promise.resolve(params));

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Edit Post</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <EditPostContent id={resolvedParams.id} />
      </Suspense>
    </div>
  );
} 