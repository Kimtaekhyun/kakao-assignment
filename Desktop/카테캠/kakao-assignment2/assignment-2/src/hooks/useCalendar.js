import { useState, useEffect } from 'react';

export const useCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [weekStartDate, setWeekStartDate] = useState(() => {
    const saved = localStorage.getItem('react-week-start');
    if (saved) return saved;
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(now.setDate(diff)).toISOString().split('T')[0];
  });

  useEffect(() => {
    localStorage.setItem('react-week-start', weekStartDate);
  }, [weekStartDate]);

  const handleDateChange = (days) => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + days);
    const newDate = current.toISOString().split('T')[0];
    setSelectedDate(newDate);

    // Sync week view if out of range
    const weekStart = new Date(weekStartDate);
    const weekEnd = new Date(weekStartDate);
    weekEnd.setDate(weekEnd.getDate() + 6);

    const currentDate = new Date(newDate);
    if (currentDate < weekStart || currentDate > weekEnd) {
      const day = currentDate.getDay();
      const diff = currentDate.getDate() - day + (day === 0 ? -6 : 1);
      setWeekStartDate(new Date(currentDate.setDate(diff)).toISOString().split('T')[0]);
    }
  };

  const handleWeekChange = (weeks) => {
    const current = new Date(weekStartDate);
    current.setDate(current.getDate() + weeks * 7);
    setWeekStartDate(current.toISOString().split('T')[0]);
  };

  const goToToday = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    setSelectedDate(todayStr);

    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    setWeekStartDate(new Date(now.setDate(diff)).toISOString().split('T')[0]);
  };

  const getWeekDates = () => {
    const dates = [];
    const start = new Date(weekStartDate);
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const getMonthDisplay = () => {
    const date = new Date(weekStartDate);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
  };

  return {
    selectedDate,
    setSelectedDate,
    weekStartDate,
    handleDateChange,
    handleWeekChange,
    goToToday,
    getWeekDates,
    getMonthDisplay,
  };
};
