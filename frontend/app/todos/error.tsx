'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="max-w-md mx-auto text-center px-4 py-16">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 text-red-500 mb-6 dark:bg-red-950/30 dark:text-red-400">
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Something went wrong!</h2>
      <p className="mt-2 text-sm text-gray-500 dark:text-zinc-450">
        An error occurred while fetching the todo data. Please make sure the FastAPI server is running.
      </p>
      <div className="mt-8 flex items-center justify-center space-x-4">
        <button
          onClick={() => reset()}
          className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-500 transition-colors shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 active:scale-[0.98]"
        >
          Try again
        </button>
        <Link
          href="/todos"
          className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-750 transition-colors"
        >
          Return to list
        </Link>
      </div>
    </div>
  );
}
