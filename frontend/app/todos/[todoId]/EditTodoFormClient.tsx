'use client';

import { useTransition, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { updateTodoAction } from '../../actions';

interface Todo {
  id: number;
  title: string;
  content: string | null;
  is_completed: boolean;
  target_date: string;
  created_at: string;
}

export default function EditTodoFormClient({ todo }: { todo: Todo }) {
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState(todo.title);
  const [content, setContent] = useState(todo.content || '');
  const [isCompleted, setIsCompleted] = useState(todo.is_completed);
  const [targetDate, setTargetDate] = useState(todo.target_date || '');
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    startTransition(async () => {
      const res = await updateTodoAction(todo.id, title, content, isCompleted, targetDate);
      if (res?.error) {
        alert(res.error);
      } else if (res?.success) {
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
          id="title"
          required
          disabled={isPending}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:ring-indigo-555 outline-none transition-all"
        />
      </div>

      <div>
        <label htmlFor="target_date" className="block text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-2">
          목표일 <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          id="target_date"
          required
          disabled={isPending}
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:ring-indigo-555 outline-none transition-all"
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-2">
          상세 내용
        </label>
        <textarea
          id="content"
          rows={4}
          disabled={isPending}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:ring-indigo-555 outline-none transition-all resize-none"
        />
      </div>

      <div className="flex items-center space-x-3">
        <button
          type="button"
          disabled={isPending}
          onClick={() => setIsCompleted(!isCompleted)}
          className={`flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
            isCompleted
              ? 'bg-indigo-600 border-indigo-600 text-white'
              : 'border-gray-300 hover:border-indigo-500 dark:border-zinc-700'
          }`}
        >
          {isCompleted && (
            <svg className="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>
        <span
          className="text-sm font-medium text-gray-750 dark:text-zinc-300 select-none cursor-pointer"
          onClick={() => setIsCompleted(!isCompleted)}
        >
          완료 상태로 표시
        </span>
      </div>

      <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100 dark:border-zinc-800">
        <Link
          href="/todos"
          className="px-5 py-2.5 text-sm font-semibold text-gray-755 bg-gray-100 rounded-xl hover:bg-gray-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-750 transition-colors"
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
              저장 중...
            </>
          ) : (
            '변경사항 저장'
          )}
        </button>
      </div>
    </form>
  );
}
