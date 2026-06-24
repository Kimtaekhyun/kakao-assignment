'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export default function TodoSearchInput() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();


  const [value, setValue] = useState(searchParams.get('search') || '');

  useEffect(() => {

    const handler = setTimeout(() => {
      const currentParams = new URLSearchParams(searchParams.toString());
      if (value) {
        currentParams.set('search', value);
      } else {
        currentParams.delete('search');
      }


      router.push(`${pathname}?${currentParams.toString()}`);
    }, 400);


    return () => clearTimeout(handler);
  }, [value, pathname, router, searchParams]);


  const currentSearch = searchParams.get('search') || '';
  useEffect(() => {
    setValue(currentSearch);
  }, [currentSearch]);

  return (
    <div className="relative mb-6">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg
          className="h-5 w-5 text-gray-400 dark:text-zinc-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="검색어를 입력하세요 (제목 또는 내용)..."
        className="w-full pl-10 pr-10 py-3 border border-gray-250 border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all dark:bg-zinc-900 dark:border-zinc-800 dark:text-white"
      />
      {value && (
        <button
          onClick={() => setValue('')}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:text-zinc-550 dark:hover:text-zinc-350"
          title="검색어 지우기"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
