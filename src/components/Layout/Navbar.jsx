import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCompareList } from '../../features/compare/compareSlice';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const compareList = useSelector(selectCompareList);

  const toggleMenu = () => setIsOpen(!isOpen);
  const isActive = (path) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 h-[72px] z-50 glass-panel transition-colors duration-250">
      <div className="flex items-center justify-between h-full max-w-[1320px] mx-auto px-5 md:px-8 xl:px-10">
        <Link to="/" className="flex items-center gap-2.5 font-extrabold text-xl tracking-tight text-text-primary hover:opacity-85 transition-opacity duration-150">
          <img src="./logo.png" alt="BMW Logo" className="w-10 h-10 object-contain" onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }} />
          <span>Machine</span>
        </Link>
        
        <button className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg text-text-primary text-2xl hover:bg-white/10 transition-colors duration-150" onClick={toggleMenu}>
          ☰
        </button>

        <nav className={`md:flex items-center gap-2 ${isOpen ? 'flex flex-col absolute top-[72px] left-0 right-0 glass-panel p-4 gap-1' : 'hidden'}`}>
          <Link 
            to="/" 
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 relative w-full md:w-auto text-center ${
              isActive('/') 
                ? 'text-text-primary bg-bmw-blue-subtle after:content-[""] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-5 after:h-0.5 after:bg-bmw-blue after:rounded-sm' 
                : 'text-text-secondary hover:text-text-primary hover:bg-white/10'
            }`}
            onClick={() => setIsOpen(false)}
          >
            Models
          </Link>
          <Link 
            to="/compare" 
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 relative w-full md:w-auto text-center flex items-center justify-center gap-1 ${
              isActive('/compare') 
                ? 'text-text-primary bg-bmw-blue-subtle after:content-[""] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-5 after:h-0.5 after:bg-bmw-blue after:rounded-sm' 
                : 'text-text-secondary hover:text-text-primary hover:bg-white/10'
            }`}
            onClick={() => setIsOpen(false)}
          >
            Compare
            {compareList.length > 0 && (
              <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-bmw-blue text-white text-[0.7rem] font-bold leading-none">
                {compareList.length}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
