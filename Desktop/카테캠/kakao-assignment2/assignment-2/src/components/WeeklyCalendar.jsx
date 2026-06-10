const WeeklyCalendar = ({ 
  selectedDate, 
  handleWeekChange, 
  getMonthDisplay, 
  getWeekDates, 
  getTodoCountForDate, 
  setSelectedDate,
  goToToday
}) => {
  return (
    <div className="weekly-calendar">
      <div className="calendar-header">
        <button className="nav-btn" onClick={() => handleWeekChange(-1)}>&lt;</button>
        <span id="current-month-display" onClick={goToToday} style={{ cursor: 'pointer' }}>
          {getMonthDisplay()}
        </span>
        <button className="nav-btn" onClick={() => handleWeekChange(1)}>&gt;</button>
      </div>
      <div className="week-days">
        {getWeekDates().map((date) => {
          const d = new Date(date);
          const isToday = date === new Date().toISOString().split('T')[0];
          const isSelected = date === selectedDate;
          const count = getTodoCountForDate(date);
          
          return (
            <div 
              key={date} 
              className={`day-item ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
              onClick={() => setSelectedDate(date)}
            >
              <span className="day-name">{['일', '월', '화', '수', '목', '금', '토'][d.getDay()]}</span>
              <span className="day-number">{d.getDate()}</span>
              {count > 0 && <span className="todo-count">{count}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklyCalendar;
