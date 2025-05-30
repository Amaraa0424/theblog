'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body text-center">
          <h2 className="card-title justify-center text-2xl mb-4">Something went wrong!</h2>
          <p className="text-error mb-4">{error.message}</p>
          <div className="card-actions justify-center">
            <button onClick={() => reset()} className="btn btn-primary">
              Try again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 