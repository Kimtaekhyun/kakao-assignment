import './App.css';
import { useCalendar } from './hooks/useCalendar';
import { useTodos } from './hooks/useTodos';
import WeeklyCalendar from './components/WeeklyCalendar';
import TodoInput from './components/TodoInput';
import FilterTabs from './components/FilterTabs';
import TodoList from './components/TodoList';

function App() {
  const {
    selectedDate,
    setSelectedDate,
    handleWeekChange,
    goToToday,
    getWeekDates,
    getMonthDisplay,
  } = useCalendar();

  const {
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
  } = useTodos(selectedDate);

  const formatDate = (dateStr) => {
    const today = new Date().toISOString().split('T')[0];
    if (dateStr === today) return '오늘';
    
    const date = new Date(dateStr);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short',
    });
  };

  return (
    <div className="app-container">
      <header>
        <h1>Todo List</h1>
        <button className="action-btn" onClick={goToToday} style={{ backgroundColor: 'var(--main-bg)', color: 'var(--main-color)' }}>
          오늘로 이동
        </button>
      </header>

      <WeeklyCalendar 
        selectedDate={selectedDate}
        handleWeekChange={handleWeekChange}
        getMonthDisplay={getMonthDisplay}
        getWeekDates={getWeekDates}
        getTodoCountForDate={getTodoCountForDate}
        setSelectedDate={setSelectedDate}
        goToToday={goToToday}
      />

      <div className="date-display">
        {formatDate(selectedDate)}
      </div>
      
      <TodoInput onAdd={addTodo} />

      <FilterTabs 
        currentFilter={filter}
        onFilterChange={setFilter}
      />

      <TodoList 
        todos={filteredTodos}
        filter={filter}
        onToggle={toggleComplete}
        onDelete={deleteTodo}
        onStartEdit={startEdit}
        onCancelEdit={cancelEdit}
        onSaveEdit={saveEdit}
        onUpdateEditText={updateEditText}
      />
    </div>
  );
}

export default App;
