'use client';

import { useTransition } from 'react';
import Link from 'next/link';
import { deleteTodoAction, toggleTodoAction } from '../actions';

interface Todo {
  id: number;
  title: string;
  content: string | null;
  is_completed: boolean;
  created_at: string;
}

export default function TodoItemClient({ todo }: { todo: Todo }) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      try {
        await toggleTodoAction(todo.id, todo.title, todo.content, todo.is_completed);
      } catch (err: any) {
        alert(err.message || 'Failed to toggle status');
      }
    });
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this todo?')) {
      startTransition(async () => {
        try {
          await deleteTodoAction(todo.id);
        } catch (err: any) {
          alert(err.message || 'Failed to delete todo');
        }
      });
    }
  };

  return (
    <div
      className={`group flex items-center justify-between p-4 bg-white border rounded-2xl transition-all duration-300 shadow-sm hover:shadow dark:bg-zinc-900 ${
        todo.is_completed
          ? 'border-gray-150 bg-gray-50/50 dark:border-zinc-800/50 opacity-75'
          : 'border-gray-200 dark:border-zinc-800'
      } ${isPending ? 'opacity-50 pointer-events-none' : ''}`}
    >
      <div className="flex items-start space-x-3.5 flex-1 min-w-0 mr-4">
        <button
          onClick={handleToggle}
          disabled={isPending}
          className={`mt-0.5 flex-shrink-0 w-5.5 h-5.5 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
            todo.is_completed
              ? 'bg-indigo-600 border-indigo-600 text-white'
              : 'border-gray-300 hover:border-indigo-500 dark:border-zinc-700'
          }`}
        >
          {todo.is_completed && (
            <svg className="w-3.5 h-3.5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        <div className="flex-1 min-w-0">
          <h3
            className={`text-base font-semibold truncate ${
              todo.is_completed
                ? 'line-through text-gray-400 dark:text-zinc-500'
                : 'text-gray-900 dark:text-white'
            }`}
            title={todo.title}
          >
            {todo.title}
          </h3>
          {todo.content && (
            <p
              className={`mt-1 text-sm ${
                todo.is_completed
                  ? 'line-through text-gray-400 dark:text-zinc-650'
                  : 'text-gray-600 dark:text-zinc-400'
              }`}
              title={todo.content}
            >
              {todo.content}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <Link
          href={`/todos/${todo.id}`}
          className="p-1.5 text-gray-450 hover:text-indigo-600 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          title="Edit Task"
        >
          <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="18" height="18">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </Link>
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="p-1.5 text-gray-450 hover:text-red-650 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          title="Delete Task"
        >
          <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="18" height="18">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
