import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';


export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get('filter');
    const search = searchParams.get('search');
    const week = searchParams.get('week');

    const params = new URLSearchParams();
    if (filter) params.append('filter', filter);
    if (search) params.append('search', search);
    if (week) params.append('week', week);

    const queryString = params.toString();
    const url = queryString ? `${BACKEND_URL}/todos?${queryString}` : `${BACKEND_URL}/todos`;

    const res = await fetch(url, {
      cache: 'no-store',
    });
    if (!res.ok) {
      throw new Error(`Backend error: ${res.statusText}`);
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const res = await fetch(`${BACKEND_URL}/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json({ error: errorText }, { status: res.status });
    }

    const newTodo = await res.json();


    revalidatePath('/todos');

    return NextResponse.json(newTodo, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}


export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required as a query parameter (?id=...)' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const res = await fetch(`${BACKEND_URL}/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json({ error: errorText }, { status: res.status });
    }

    const updatedTodo = await res.json();


    revalidatePath('/todos');

    return NextResponse.json(updatedTodo);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}


export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required as a query parameter (?id=...)' },
        { status: 400 }
      );
    }

    const res = await fetch(`${BACKEND_URL}/todos/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json({ error: errorText }, { status: res.status });
    }


    revalidatePath('/todos');

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
