export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
      {/* Animated spinner */}
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-purple-600 rounded-full animate-spin animation-delay-150"></div>
      </div>
      
      {/* Loading text with animation */}
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Loading
          <span className="inline-flex ml-1">
            <span className="animate-bounce">.</span>
            <span className="animate-bounce animation-delay-100">.</span>
            <span className="animate-bounce animation-delay-200">.</span>
          </span>
        </h2>
        <p className="text-gray-600 dark:text-gray-400">Please wait while we fetch your content</p>
      </div>

      {/* Progress bar */}
      <div className="w-64 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
} 