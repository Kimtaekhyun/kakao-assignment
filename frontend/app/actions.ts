'use server';

import { revalidatePath } from 'next/cache';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export interface Todo {
  id: number;
  title: string;
  content: string | null;
  is_completed: boolean;
  target_date: string;
  created_at: string;
}


export async function getTodos(filter?: string, search?: string, week?: string): Promise<Todo[]> {
  try {
    const params = new URLSearchParams();
    if (filter && filter !== 'all') params.append('filter', filter);
    if (search) params.append('search', search);
    if (week) params.append('week', week);

    const queryString = params.toString();
    const url = queryString ? `${BACKEND_URL}/todos?${queryString}` : `${BACKEND_URL}/todos`;

    const res = await fetch(url, {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch todos from backend: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error('Error fetching todos in getTodos:', error);
    throw error;
  }
}


export async function createTodoAction(formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string || '';
  const target_date = formData.get('target_date') as string || null;

  if (!title) {
    return { error: 'Title is required' };
  }

  try {
    const res = await fetch(`${BACKEND_URL}/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        content,
        target_date: target_date || null
      }),
    });

    if (!res.ok) {
      return { error: 'Failed to create todo' };
    }
  } catch (e: any) {
    return { error: 'Failed to connect to backend server' };
  }

  revalidatePath('/todos');
  return { success: true };
}


export async function toggleTodoAction(
  id: number,
  currentTitle: string,
  currentContent: string | null,
  isCompleted: boolean
) {
  try {
    const res = await fetch(`${BACKEND_URL}/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: currentTitle,
        content: currentContent,
        is_completed: !isCompleted,
      }),
    });

    if (!res.ok) {
      throw new Error('Failed to toggle status');
    }
  } catch (e: any) {
    console.error('Error toggling status:', e);
    throw e;
  }

  revalidatePath('/todos');
}


export async function updateTodoAction(
  id: number,
  title: string,
  content: string | null,
  isCompleted: boolean,
  targetDate?: string
) {
  if (!title) {
    return { error: 'Title is required' };
  }

  try {
    const res = await fetch(`${BACKEND_URL}/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        content: content || null,
        is_completed: isCompleted,
        target_date: targetDate || null
      }),
    });

    if (!res.ok) {
      return { error: 'Failed to update todo' };
    }
  } catch (e: any) {
    return { error: 'Failed to connect to backend server' };
  }

  revalidatePath('/todos');
  return { success: true };
}


export async function deleteTodoAction(id: number) {
  try {
    const res = await fetch(`${BACKEND_URL}/todos/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      throw new Error('Failed to delete todo');
    }
  } catch (e: any) {
    console.error('Error deleting todo:', e);
    throw e;
  }

  revalidatePath('/todos');
}
