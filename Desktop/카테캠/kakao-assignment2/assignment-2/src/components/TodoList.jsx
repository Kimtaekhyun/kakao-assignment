const TodoItem = ({ 
  todo, 
  onToggle, 
  onDelete, 
  onStartEdit, 
  onCancelEdit, 
  onSaveEdit, 
  onUpdateEditText 
}) => {
  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      {todo.isEditing ? (
        <>
          <input
            className="edit-input"
            type="text"
            value={todo.editText}
            onChange={(e) => onUpdateEditText(todo.id, e.target.value)}
            autoFocus
          />
          <div className="button-group">
            <button className="action-btn edit-btn" onClick={() => onSaveEdit(todo.id)}>저장</button>
            <button className="action-btn" onClick={() => onCancelEdit(todo.id)}>취소</button>
          </div>
        </>
      ) : (
        <>
          <span className="todo-text">{todo.text}</span>
          <div className="button-group">
            <button 
              className="action-btn complete-btn" 
              onClick={() => onToggle(todo.id)}
            >
              {todo.completed ? '취소' : '완료'}
            </button>
            <button className="action-btn edit-btn" onClick={() => onStartEdit(todo.id)}>수정</button>
            <button className="action-btn delete-btn" onClick={() => onDelete(todo.id)}>삭제</button>
          </div>
        </>
      )}
    </li>
  );
};

const TodoList = ({ 
  todos, 
  filter, 
  onToggle, 
  onDelete, 
  onStartEdit, 
  onCancelEdit, 
  onSaveEdit, 
  onUpdateEditText 
}) => {
  if (todos.length === 0) {
    const emptyMessages = {
      all: '할 일이 없습니다. 새로운 할 일을 추가해보세요!',
      active: '진행 중인 할 일이 없습니다.',
      completed: '완료된 할 일이 없습니다.'
    };
    return <p className="empty-message">{emptyMessages[filter]}</p>;
  }

  return (
    <ul id="todo-list">
      {todos.map((todo) => (
        <TodoItem 
          key={todo.id} 
          todo={todo} 
          onToggle={onToggle}
          onDelete={onDelete}
          onStartEdit={onStartEdit}
          onCancelEdit={onCancelEdit}
          onSaveEdit={onSaveEdit}
          onUpdateEditText={onUpdateEditText}
        />
      ))}
    </ul>
  );
};

export default TodoList;
