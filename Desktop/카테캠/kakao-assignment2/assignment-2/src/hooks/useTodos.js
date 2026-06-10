import { useState, useEffect, useMemo } from 'react';
import { createTodo } from '../utils/todoSchema';

export const useTodos = (selectedDate) => {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('react-todos');
    return saved ? JSON.parse(saved) : [];
  });
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    localStorage.setItem('react-todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text) => {
    try {
      const newTodo = createTodo(text, selectedDate);
      setTodos((prev) => [...prev, newTodo]);
    } catch (error) {
      alert(error.message);
    }
  };

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const toggleComplete = (id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const startEdit = (id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, isEditing: true, editText: todo.text } : todo
      )
    );
  };

  const cancelEdit = (id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, isEditing: false } : todo
      )
    );
  };

  const saveEdit = (id) => {
    setTodos((prev) =>
      prev.map((todo) => {
        if (todo.id === id) {
          if (todo.editText.trim() === '') {
            alert('할 일을 입력해주세요!');
            return todo;
          }
          return { ...todo, text: todo.editText, isEditing: false };
        }
        return todo;
      })
    );
  };

  const updateEditText = (id, value) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, editText: value } : todo
      )
    );
  };

  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      if (todo.date !== selectedDate) return false;
      if (filter === 'active') return !todo.completed;
      if (filter === 'completed') return todo.completed;
      return true;
    });
  }, [todos, selectedDate, filter]);

  const getTodoCountForDate = (date) => {
    return todos.filter((todo) => todo.date === date).length;
  };

  return {
    todos,
    filter,
    setFilter,
    addTodo,
    deleteTodo,
    toggleComplete,
    startEdit,
    cancelEdit,
    saveEdit,
    updateEditText,
    filteredTodos,
    getTodoCountForDate,
  };
};
