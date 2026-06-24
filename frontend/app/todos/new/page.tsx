'use client';

import { useTransition } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createTodoAction } from '../../actions';

export default function NewTodoPage() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();


  const defaultDate = searchParams.get('date') || new Date().toISOString().split('T')[0];

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const res = await createTodoAction(formData);
      if (res?.error) {
        alert(res.error);
      } else if (res?.success) {
        const targetDate = formData.get('target_date') as string;
        if (targetDate) {

          const dateObj = new Date(targetDate);
          const tempDate = new Date(dateObj.getTime());
          tempDate.setDate(tempDate.getDate() + 3 - (tempDate.getDay() + 6) % 7);
          const week1 = new Date(tempDate.getFullYear(), 0, 4);
          const weekNum = 1 + Math.round(((tempDate.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
          const formattedWeek = `${tempDate.getFullYear()}-W${String(weekNum).padStart(2, '0')}`;

          router.push(`/todos?week=${formattedWeek}&date=${targetDate}`);
        } else {
          router.push('/todos');
        }
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-8">
        <Link
          href="/todos"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-indigo-650 dark:text-zinc-400 dark:hover:text-indigo-400 transition-colors"
        >
          <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          목록으로 돌아가기
        </Link>
        <h1 className="text-3xl font-extrabold text-gray-900 mt-4 dark:text-white">새 할 일 등록</h1>
        <p className="text-gray-500 mt-1 dark:text-zinc-450">나의 할 일 목록에 새로운 일정을 추가합니다.</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm dark:bg-zinc-900 dark:border-zinc-800 space-y-6"
      >
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-2">
            제목 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            id="title"
            required
            disabled={isPending}
            placeholder="예: 과제 제출 완료하기"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:ring-indigo-550 outline-none transition-all"
          />
        </div>

        <div>
          <label htmlFor="target_date" className="block text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-2">
            목표일 <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="target_date"
            id="target_date"
            required
            disabled={isPending}
            defaultValue={defaultDate}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:ring-indigo-550 outline-none transition-all"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-2">
            상세 내용
          </label>
          <textarea
            name="content"
            id="content"
            rows={4}
            disabled={isPending}
            placeholder="할 일에 대한 상세 내용을 입력하세요..."
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:ring-indigo-550 outline-none transition-all resize-none"
          />
        </div>

        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100 dark:border-zinc-800">
          <Link
            href="/todos"
            className="px-5 py-2.5 text-sm font-semibold text-gray-750 bg-gray-100 rounded-xl hover:bg-gray-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-750 transition-colors"
          >
            취소
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-500 transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]"
          >
            {isPending ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                등록 중...
              </>
            ) : (
              '저장하기'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
