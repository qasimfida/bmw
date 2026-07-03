import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchTerm, selectSearchTerm } from '../../features/cars/carsSlice';
import { SearchIcon } from 'tdesign-icons-react';

const SearchBar = () => {
  const dispatch = useDispatch();
  const searchTerm = useSelector(selectSearchTerm);

  const handleChange = (e) => {
    dispatch(setSearchTerm(e.target.value));
  };

  return (
    <div className="relative w-full max-w-[480px]">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-[1.1rem] pointer-events-none transition-colors duration-150 peer-focus:text-bmw-blue-light z-10">
        <SearchIcon size="20px" />
      </span>
      <input 
        type="text" 
        className="peer w-full py-3.5 pl-11 pr-4 rounded-xl glass-panel text-text-primary text-[0.9375rem] outline-none transition-all duration-150 placeholder:text-text-muted focus:border-bmw-blue focus:shadow-[0_0_0_3px_var(--color-bmw-blue-glow)]" 
        placeholder="Search models or series..." 
        value={searchTerm}
        onChange={handleChange}
      />
    </div>
  );
};

export default SearchBar;
