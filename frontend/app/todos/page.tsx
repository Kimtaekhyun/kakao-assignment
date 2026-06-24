import Link from 'next/link';
import TodoItemClient from './TodoItemClient';
import TodoSearchInput from './TodoSearchInput';
import { getTodos, Todo } from '../actions';

interface PageProps {
  searchParams: Promise<{ filter?: string; search?: string; week?: string; date?: string }>;
}


function formatDateString(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}


function getISOWeekString(d: Date): string {
  const date = new Date(d.getTime());
  date.setHours(0, 0, 0, 0);

  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
  const week1 = new Date(date.getFullYear(), 0, 4);
  const weekNum = 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
  return `${date.getFullYear()}-W${String(weekNum).padStart(2, '0')}`;
}


function getMondayOfISOWeek(weekStr: string): Date {
  const [yearStr, weekNumStr] = weekStr.split('-W');
  const year = parseInt(yearStr, 10);
  const weekNum = parseInt(weekNumStr, 10);

  const simple = new Date(year, 0, 4);
  const dayOfWeek = simple.getDay();
  const dayOffset = (dayOfWeek === 0 ? 7 : dayOfWeek) - 1;
  const mondayOfW1 = new Date(simple.getTime() - dayOffset * 86400000);

  return new Date(mondayOfW1.getTime() + (weekNum - 1) * 7 * 86400000);
}

export default async function TodosPage({ searchParams }: PageProps) {

  const { filter, search, week, date } = await searchParams;

  const currentFilter = filter || 'all';
  const currentSearch = search || '';


  let currentDate = date || '';
  let currentWeek = week || '';

  if (!currentDate && !currentWeek) {
    const today = new Date();
    currentDate = formatDateString(today);
    currentWeek = getISOWeekString(today);
  } else if (currentDate && !currentWeek) {
    currentWeek = getISOWeekString(new Date(currentDate));
  } else if (!currentDate && currentWeek) {
    const mondayOfSelectedWeek = getMondayOfISOWeek(currentWeek);
    currentDate = formatDateString(mondayOfSelectedWeek);
  }


  const todos = await getTodos(currentFilter, currentSearch, currentWeek);


  const dayTodos = todos.filter((todo) => todo.target_date === currentDate);

  const monday = getMondayOfISOWeek(currentWeek);
  const sunday = new Date(monday.getTime() + 6 * 86400000);

  const mondayLabel = `${monday.getMonth() + 1}/${monday.getDate()}`;
  const sundayLabel = `${sunday.getMonth() + 1}/${sunday.getDate()}`;


  const prevWeekDate = new Date(monday.getTime() - 7 * 86400000);
  const nextWeekDate = new Date(monday.getTime() + 7 * 86400000);
  const prevWeek = getISOWeekString(prevWeekDate);
  const nextWeek = getISOWeekString(nextWeekDate);


  const buildNavUrl = (targetWeek: string) => {
    const params = new URLSearchParams();
    if (currentFilter && currentFilter !== 'all') params.set('filter', currentFilter);
    if (currentSearch) params.set('search', currentSearch);
    params.set('week', targetWeek);

    const mondayOfTarget = getMondayOfISOWeek(targetWeek);
    params.set('date', formatDateString(mondayOfTarget));
    return `/todos?${params.toString()}`;
  };

  const buildDateUrl = (targetDate: string) => {
    const params = new URLSearchParams();
    if (currentFilter && currentFilter !== 'all') params.set('filter', currentFilter);
    if (currentSearch) params.set('search', currentSearch);
    params.set('week', currentWeek);
    params.set('date', targetDate);
    return `/todos?${params.toString()}`;
  };

  const buildTabUrl = (targetFilter: string) => {
    const params = new URLSearchParams();
    if (targetFilter !== 'all') params.set('filter', targetFilter);
    if (currentSearch) params.set('search', currentSearch);
    params.set('week', currentWeek);
    params.set('date', currentDate);
    return `/todos?${params.toString()}`;
  };

  const tabs = [
    { name: '전체', value: 'all', href: buildTabUrl('all') },
    { name: '진행 중', value: 'active', href: buildTabUrl('active') },
    { name: '완료', value: 'completed', href: buildTabUrl('completed') },
  ];


  const weekdayNames = ['월', '화', '수', '목', '금', '토', '일'];
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday.getTime() + i * 86400000);
    const dateStr = formatDateString(d);
    return {
      name: weekdayNames[i],
      dayLabel: String(d.getDate()),
      dateStr,
    };
  });


  const activeWeekdayLongNames = ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'];
  const activeDayIndex = weekDays.findIndex((d) => d.dateStr === currentDate);
  const activeDayName = activeDayIndex !== -1 ? activeWeekdayLongNames[activeDayIndex] : '';
  const activeDateObj = new Date(currentDate);
  const activeDateLabel = `${activeDateObj.getMonth() + 1}월 ${activeDateObj.getDate()}일`;


  const searchTodosByDate: Record<string, Todo[]> = {};
  if (currentSearch) {
    todos.forEach((todo) => {
      if (!searchTodosByDate[todo.target_date]) {
        searchTodosByDate[todo.target_date] = [];
      }
      searchTodosByDate[todo.target_date].push(todo);
    });
  }
  const matchDates = Object.keys(searchTodosByDate).sort();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight dark:text-white font-sans">
            Todo List
          </h1>
        </div>
        <Link
          href={`/todos/new?date=${currentDate}`}
          className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-500 transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 active:scale-[0.98]"
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          새 할 일 추가
        </Link>
      </div>

      {}
      <div className="flex items-center justify-between bg-white border border-gray-200 p-4 rounded-2xl shadow-sm mb-4 dark:bg-zinc-900 dark:border-zinc-800 gap-4">
        <Link
          href={buildNavUrl(prevWeek)}
          className="inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-350 dark:hover:bg-zinc-750 transition-colors flex-shrink-0"
        >
          ← 이전 주
        </Link>
        <div className="text-center min-w-[120px]">
          <span className="text-lg font-extrabold text-gray-900 dark:text-white">
            {currentWeek}
          </span>
          <p className="text-xs text-gray-500 mt-0.5 font-medium dark:text-zinc-450 whitespace-nowrap">
            ({mondayLabel} ~ {sundayLabel})
          </p>
        </div>
        <Link
          href={buildNavUrl(nextWeek)}
          className="inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-350 dark:hover:bg-zinc-750 transition-colors flex-shrink-0"
        >
          다음 주 →
        </Link>
      </div>

      {}
      <div className="grid grid-cols-7 gap-2 mb-6 bg-gray-50/50 p-2 rounded-2xl border border-gray-150 dark:bg-zinc-900/40 dark:border-zinc-850">
        {weekDays.map((day) => {
          const isActive = day.dateStr === currentDate;
          return (
            <Link
              key={day.dateStr}
              href={buildDateUrl(day.dateStr)}
              className={`flex flex-col items-center py-2.5 px-1 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow shadow-indigo-200 dark:shadow-none font-bold scale-[1.02]'
                  : 'text-gray-600 hover:bg-gray-150/70 hover:text-gray-900 dark:text-zinc-350 dark:hover:bg-zinc-800 dark:hover:text-white'
              }`}
            >
              <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">{day.name}</span>
              <span className="text-base font-extrabold mt-0.5">{day.dayLabel}</span>
            </Link>
          );
        })}
      </div>

      {}
      <TodoSearchInput />

      {}
      <div className="border-b border-gray-200 dark:border-zinc-800 mb-6">
        <nav className="flex space-x-6" aria-label="Tabs">
          {tabs.map((tab) => {
            const isActive = currentFilter === tab.value;
            return (
              <Link
                key={tab.value}
                href={tab.href}
                className={`pb-4 px-1 border-b-2 font-medium text-sm transition-all duration-250 ${
                  isActive
                    ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 font-bold'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-zinc-400 dark:hover:text-zinc-300'
                }`}
              >
                {tab.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
        {currentSearch ? (

          <div>
            <div className="border-b border-gray-150 pb-3 mb-5 dark:border-zinc-850">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                &ldquo;{currentSearch}&rdquo; 검색 결과
              </h2>
              <p className="text-xs text-gray-500 mt-1 dark:text-zinc-450">
                이번 주에서 검색어와 일치하는 일자별 목록입니다.
              </p>
            </div>

            {matchDates.length === 0 ? (
              <p className="text-sm text-gray-400 italic py-8 text-center dark:text-zinc-600">
                검색어와 일치하는 할 일이 없습니다.
              </p>
            ) : (
              <div className="space-y-6">
                {matchDates.map((dateStr) => {
                  const dateTodos = searchTodosByDate[dateStr];
                  const dObj = new Date(dateStr);

                  const weekdayLabels = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
                  const wDayName = weekdayLabels[dObj.getDay()];
                  const dLabel = `${dObj.getMonth() + 1}월 ${dObj.getDate()}일 ${wDayName}`;

                  return (
                    <div key={dateStr} className="space-y-3">
                      <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                        {dLabel}
                      </h3>
                      <div className="grid gap-3">
                        {dateTodos.map((todo) => (
                          <TodoItemClient key={todo.id} todo={todo} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (

          <div>
            <div className="flex items-center justify-between border-b border-gray-150 pb-3 mb-5 dark:border-zinc-850">
              <div className="flex items-baseline space-x-2">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  {activeDayName}의 할 일
                </h2>
                <span className="text-sm font-semibold text-gray-500">
                  ({activeDateLabel})
                </span>
              </div>
              <Link
                href={`/todos/new?date=${currentDate}`}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 bg-indigo-50 px-3 py-1.5 rounded-lg dark:bg-indigo-950/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50 transition-colors"
              >
                + 할 일 추가
              </Link>
            </div>

            {dayTodos.length === 0 ? (
              <p className="text-sm text-gray-400 italic py-6 text-center dark:text-zinc-600">
                이날 계획된 할 일이 없습니다.
              </p>
            ) : (
              <div className="grid gap-3">
                {dayTodos.map((todo) => (
                  <TodoItemClient key={todo.id} todo={todo} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
