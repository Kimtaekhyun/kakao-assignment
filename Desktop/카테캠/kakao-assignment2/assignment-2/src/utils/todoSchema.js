/**
 * Todo 데이터 무결성을 보장하기 위한 팩토리 함수 (Pydantic 컨셉 적용)
 * @param {string} text - 할 일 내용
 * @param {string} date - 할 일 날짜 (YYYY-MM-DD)
 * @returns {Object} 검증된 Todo 객체
 */
export const createTodo = (text, date) => {
  if (!text || text.trim() === '') {
    throw new Error('할 일 내용은 비어있을 수 없습니다.');
  }
  
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error('유효하지 않은 날짜 형식입니다.');
  }

  return {
    id: Date.now(),
    text: text.trim(),
    completed: false,
    date: date,
    isEditing: false,
    editText: text.trim(),
  };
};

/**
 * 기존 Todo 객체의 업데이트 시 유효성 검사
 * @param {Object} todo - 업데이트할 Todo 객체
 * @returns {Object} 검증된 Todo 객체
 */
export const validateTodo = (todo) => {
  const requiredFields = ['id', 'text', 'completed', 'date'];
  for (const field of requiredFields) {
    if (!(field in todo)) {
      throw new Error(`필수 필드인 ${field}가 누락되었습니다.`);
    }
  }
  return todo;
};
