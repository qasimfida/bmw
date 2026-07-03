import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  setFilters, 
  clearFilters, 
  selectFilters, 
  selectUniqueSeries, 
  selectUniqueBodyTypes, 
  selectUniqueFuelTypes 
} from '../../features/cars/carsSlice';

const FilterBar = () => {
  const dispatch = useDispatch();
  const filters = useSelector(selectFilters);
  const uniqueSeries = useSelector(selectUniqueSeries);
  const uniqueBodyTypes = useSelector(selectUniqueBodyTypes);
  const uniqueFuelTypes = useSelector(selectUniqueFuelTypes);

  const handleFilterChange = (filterType, value) => {
    dispatch(setFilters({ [filterType]: value }));
  };

  const handleClear = () => {
    dispatch(clearFilters());
  };

  const hasActiveFilters = filters.series || filters.bodyType || filters.fuelType;
  
  const selectClasses = "appearance-none py-2.5 pl-3.5 pr-9 rounded-lg glass-panel text-text-primary text-sm font-medium outline-none cursor-pointer transition-all duration-150 min-w-[140px] hover:border-border-accent hover:bg-white/5 focus:border-bmw-blue focus:shadow-[0_0_0_3px_var(--color-bmw-blue-glow)]";
  const optionClasses = "bg-bg-elevated text-text-primary";
  const wrapperClasses = "relative";
  const chevronClasses = "absolute right-3 top-1/2 -translate-y-1/2 text-text-muted text-xs pointer-events-none";

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className={wrapperClasses}>
        <select 
          className={selectClasses} 
          value={filters.series} 
          onChange={(e) => handleFilterChange('series', e.target.value)}
        >
          <option value="" className={optionClasses}>All Series</option>
          {uniqueSeries.map(series => (
            <option key={series} value={series} className={optionClasses}>{series}</option>
          ))}
        </select>
        <span className={chevronClasses}>▼</span>
      </div>

      <div className={wrapperClasses}>
        <select 
          className={selectClasses} 
          value={filters.bodyType} 
          onChange={(e) => handleFilterChange('bodyType', e.target.value)}
        >
          <option value="" className={optionClasses}>All Body Types</option>
          {uniqueBodyTypes.map(bodyType => (
            <option key={bodyType} value={bodyType} className={optionClasses}>{bodyType}</option>
          ))}
        </select>
        <span className={chevronClasses}>▼</span>
      </div>

      <div className={wrapperClasses}>
        <select 
          className={selectClasses} 
          value={filters.fuelType} 
          onChange={(e) => handleFilterChange('fuelType', e.target.value)}
        >
          <option value="" className={optionClasses}>All Fuel Types</option>
          {uniqueFuelTypes.map(fuelType => (
            <option key={fuelType} value={fuelType} className={optionClasses}>{fuelType}</option>
          ))}
        </select>
        <span className={chevronClasses}>▼</span>
      </div>

      {hasActiveFilters && (
        <button 
          className="py-2.5 px-4.5 rounded-lg bg-transparent border border-border-light text-text-secondary text-sm font-medium transition-all duration-150 hover:border-red-500 hover:text-red-500 hover:bg-red-500/10" 
          onClick={handleClear}
        >
          Clear All
        </button>
      )}
    </div>
  );
};

export default FilterBar;
