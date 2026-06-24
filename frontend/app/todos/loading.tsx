export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
      <div className="flex justify-between items-center mb-8">
        <div>
          <div className="h-8 bg-gray-200 rounded-lg w-48 dark:bg-zinc-800"></div>
          <div className="h-4 bg-gray-105 rounded-lg w-64 mt-2 dark:bg-zinc-900"></div>
        </div>
        <div className="h-10 bg-gray-200 rounded-xl w-36 dark:bg-zinc-800"></div>
      </div>

      <div className="space-y-4">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="flex items-center justify-between p-5 bg-gray-50/50 border border-gray-100 rounded-2xl dark:bg-zinc-900/50 dark:border-zinc-800/50"
          >
            <div className="flex items-start space-x-4 flex-1">
              <div className="w-6 h-6 rounded-lg bg-gray-200 dark:bg-zinc-800 mt-1"></div>
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-gray-200 rounded-md w-1/3 dark:bg-zinc-800"></div>
                <div className="h-4 bg-gray-105 rounded-md w-1/2 dark:bg-zinc-900"></div>
                <div className="h-3 bg-gray-105 rounded-md w-20 mt-1 dark:bg-zinc-900"></div>
              </div>
            </div>
            <div className="flex space-x-2">
              <div className="w-9 h-9 rounded-xl bg-gray-200 dark:bg-zinc-800"></div>
              <div className="w-9 h-9 rounded-xl bg-gray-200 dark:bg-zinc-800"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
