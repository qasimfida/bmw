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
  
  const selectClasses = "appearance-none py-2.5 pl-3.5 pr-8 rounded-lg bg-bg-input border border-border-subtle text-text-primary text-[0.8125rem] font-medium outline-none cursor-pointer transition-all duration-200 min-w-[130px] hover:border-border-light focus:border-accent/40 focus:ring-1 focus:ring-accent/20";
  const optionClasses = "bg-bg-elevated text-text-primary";
  const wrapperClasses = "relative";
  const chevronClasses = "absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted text-[0.6rem] pointer-events-none";

  return (
    <div className="flex flex-wrap items-center gap-2.5">
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
          className="py-2 px-3.5 rounded-lg bg-transparent border border-transparent text-text-muted text-[0.8125rem] font-medium transition-all duration-200 hover:text-red-400 hover:bg-red-500/[0.06]" 
          onClick={handleClear}
        >
          Clear
        </button>
      )}
    </div>
  );
};

export default FilterBar;
