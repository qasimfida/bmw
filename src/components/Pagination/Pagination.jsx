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

  const btnClasses = "w-10 h-10 rounded-lg flex items-center justify-center bg-bg-card border border-border-subtle text-text-secondary text-sm font-semibold transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed hover:not(:disabled):border-border-accent hover:not(:disabled):text-text-primary hover:not(:disabled):bg-bg-card-hover";
  const activeBtnClasses = "!bg-bmw-blue !border-bmw-blue !text-white hover:!bg-bmw-blue-light";

  return (
    <div className="flex items-center justify-center gap-2 py-8">
      <button 
        className={btnClasses} 
        onClick={handlePrev} 
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <span className="text-[1.1rem]">‹</span>
      </button>

      {pageNumbers.map(number => (
        <button
          key={number}
          className={`${btnClasses} ${currentPage === number ? activeBtnClasses : ''}`}
          onClick={() => handlePageClick(number)}
        >
          {number}
        </button>
      ))}

      <button 
        className={btnClasses} 
        onClick={handleNext} 
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <span className="text-[1.1rem]">›</span>
      </button>
    </div>
  );
};

export default Pagination;
