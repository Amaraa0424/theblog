export default function Loading() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center">
      <div className="loading loading-spinner loading-lg"></div>
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  );
} 