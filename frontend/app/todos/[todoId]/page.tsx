import { notFound } from 'next/navigation';
import Link from 'next/link';
import EditTodoFormClient from './EditTodoFormClient';
import { getTodos, Todo } from '../../actions';

interface PageProps {
  params: Promise<{ todoId: string }>;
}

async function getTodo(todoId: string): Promise<Todo> {
  const todos = await getTodos();
  const todo = todos.find((t) => t.id === parseInt(todoId, 10));
  if (!todo) {
    notFound();
  }
  return todo;
}

export default async function EditTodoPage({ params }: PageProps) {

  const { todoId } = await params;

  const todo = await getTodo(todoId);

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
        <h1 className="text-3xl font-extrabold text-gray-900 mt-4 dark:text-white">할 일 수정</h1>
        <p className="text-gray-500 mt-1 dark:text-zinc-450">할 일의 상세 내용을 수정합니다.</p>
      </div>

      <EditTodoFormClient todo={todo} />
    </div>
  );
}
