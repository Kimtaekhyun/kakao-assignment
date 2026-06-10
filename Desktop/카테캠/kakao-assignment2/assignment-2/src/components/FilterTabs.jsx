const FilterTabs = ({ currentFilter, onFilterChange }) => {
  const filters = [
    { id: 'all', label: '전체' },
    { id: 'active', label: '진행 중' },
    { id: 'completed', label: '완료' },
  ];

  return (
    <div className="filter-container">
      {filters.map((filter) => (
        <button
          key={filter.id}
          className={`filter-btn ${currentFilter === filter.id ? 'active' : ''}`}
          onClick={() => onFilterChange(filter.id)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default FilterTabs;
