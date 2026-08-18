import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPage, selectCurrentPage, selectTotalPages } from '../../features/cars/carsSlice';

const Pagination = () => {
  const dispatch = useDispatch();
  const currentPage = useSelector(selectCurrentPage);
  const totalPages = useSelector(selectTotalPages);

  if (totalPages <= 1) return null;

  const handlePrev = () => {
    if (currentPage > 1) {
      dispatch(setPage(currentPage - 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      dispatch(setPage(currentPage + 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePageClick = (page) => {
    dispatch(setPage(page));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-1.5 py-8">
      <button 
        className="w-9 h-9 rounded-lg flex items-center justify-center text-text-muted text-sm transition-all duration-200 disabled:opacity-20 disabled:cursor-not-allowed hover:text-text-primary hover:bg-white/[0.04]" 
        onClick={handlePrev} 
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        ‹
      </button>

      {pageNumbers.map(number => (
        <button
          key={number}
          className={`w-9 h-9 rounded-lg flex items-center justify-center text-[0.8125rem] font-medium transition-all duration-200 ${
            currentPage === number 
              ? 'bg-accent text-white' 
              : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.04]'
          }`}
          onClick={() => handlePageClick(number)}
        >
          {number}
        </button>
      ))}

      <button 
        className="w-9 h-9 rounded-lg flex items-center justify-center text-text-muted text-sm transition-all duration-200 disabled:opacity-20 disabled:cursor-not-allowed hover:text-text-primary hover:bg-white/[0.04]" 
        onClick={handleNext} 
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        ›
      </button>
    </div>
  );
};

export default Pagination;
