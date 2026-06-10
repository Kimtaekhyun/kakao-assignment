import { useState } from 'react';

const TodoInput = ({ onAdd }) => {
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) {
      onAdd(value);
      setValue('');
    } else {
      alert('할 일을 입력해주세요!');
    }
  };

  return (
    <form className="input-container" onSubmit={handleSubmit}>
      <input
        id="todo-input"
        type="text"
        placeholder="새로운 할 일을 입력하세요"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button id="add-button" type="submit">추가</button>
    </form>
  );
};

export default TodoInput;
