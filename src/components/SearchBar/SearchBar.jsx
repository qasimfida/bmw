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
    <div className="relative w-full max-w-[420px]">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none z-10">
        <SearchIcon size="18px" />
      </span>
      <input 
        type="text" 
        className="w-full py-2.5 pl-10 pr-4 rounded-lg bg-bg-input border border-border-subtle text-text-primary text-[0.8125rem] outline-none transition-all duration-200 placeholder:text-text-muted focus:border-accent/40 focus:ring-1 focus:ring-accent/20" 
        placeholder="Search models..." 
        value={searchTerm}
        onChange={handleChange}
      />
    </div>
  );
};

export default SearchBar;
