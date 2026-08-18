import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCompareList } from '../../features/compare/compareSlice';
import { soundEngine } from '../../utils/audioEngine';
import { SearchIcon } from 'tdesign-icons-react';

const Navbar = () => {
  const [isEngineRunning, setIsEngineRunning] = useState(false);
  const [isRevving, setIsRevving] = useState(false);
  const location = useLocation();
  const compareList = useSelector(selectCompareList);

  const scrollToSection = (id) => {
    if (location.pathname !== '/') {
      window.location.href = `/#${id}`;
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleEngineClick = () => {
    if (!isEngineRunning) {
      soundEngine.startEngine();
      setIsEngineRunning(true);
    } else {
      // If already running, rev up loudly with exhaust pops
      setIsRevving(true);
      soundEngine.revEngine();
      setTimeout(() => setIsRevving(false), 900);
    }
  };

  const handleEngineStop = (e) => {
    e.stopPropagation();
    soundEngine.stopEngine();
    setIsEngineRunning(false);
    setIsRevving(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-[72px] z-50 bg-[#060608]/85 backdrop-blur-xl border-b border-white/[0.06] transition-all duration-300">
      <div className="flex items-center justify-between h-full max-w-[1440px] mx-auto px-6 md:px-12">
        
        {/* Left: Official Brand Logo & Wordmark */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-full border border-white/20 p-0.5 flex items-center justify-center bg-white/[0.03] group-hover:border-accent transition-colors">
            <img 
              src="/logo.png" 
              alt="BMW Logo" 
              className="w-full h-full object-contain" 
              onError={(e) => { 
                e.target.onerror = null; 
                e.target.style.display = 'none'; 
              }} 
            />
          </div>
          <span className="font-extrabold text-lg tracking-[0.2em] text-white uppercase group-hover:text-accent-light transition-colors">
            MACHINE
          </span>
        </Link>
        
        {/* Center: Navigation Links with dropdown chevrons */}
        <nav className="hidden md:flex items-center gap-8 text-[0.8125rem] font-medium tracking-wider text-text-secondary uppercase">
          <button 
            onClick={() => scrollToSection('showroom-section')} 
            className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
          >
            <span>Models</span>
            <span className="text-[0.6rem] opacity-60">▾</span>
          </button>

          <button 
            onClick={() => scrollToSection('tech-section')} 
            className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
          >
            <span>Technology</span>
            <span className="text-[0.6rem] opacity-60">▾</span>
          </button>

          <button 
            onClick={() => scrollToSection('experience-section')} 
            className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
          >
            <span>Experience</span>
            <span className="text-[0.6rem] opacity-60">▾</span>
          </button>
        </nav>

        {/* Right: Actions (Compare, Search, and START ENGINE Ignition Button) */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Link 
            to="/compare" 
            className="hidden sm:flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-text-secondary hover:text-white transition-colors"
          >
            <span>Compare</span>
            {compareList.length > 0 && (
              <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-accent text-white text-[0.65rem] font-bold leading-none">
                {compareList.length}
              </span>
            )}
          </Link>

          <button 
            onClick={() => scrollToSection('showroom-section')}
            className="text-text-secondary hover:text-white transition-colors p-1 cursor-pointer"
            title="Search fleet"
          >
            <SearchIcon size="18px" />
          </button>

          {/* ── M START / STOP ENGINE BUTTON ─────────────────────────────────── */}
          <div className="flex items-center gap-1.5">
            <button
              id="btn-nav-start-engine"
              onClick={handleEngineClick}
              className={`group relative flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer active:scale-95 shadow-lg ${
                isEngineRunning
                  ? isRevving
                    ? 'bg-red-600 text-white border-red-400 shadow-[0_0_25px_rgba(239,68,68,0.8)] scale-105 animate-pulse'
                    : 'bg-red-500/20 text-red-400 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                  : 'bg-gradient-to-r from-red-600/90 to-red-700 text-white border-red-500/60 hover:from-red-500 hover:to-red-600 shadow-[0_0_15px_rgba(239,68,68,0.35)]'
              }`}
              title={isEngineRunning ? 'Click to Rev Throttle' : 'Ignite Twin-Turbo V8 Engine'}
            >
              {/* Pulsing Ignition Core */}
              <span className="relative flex h-2.5 w-2.5">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isEngineRunning ? 'bg-emerald-400' : 'bg-white'}`} />
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isEngineRunning ? 'bg-emerald-400' : 'bg-white'}`} />
              </span>

              <span className="tracking-widest">
                {isEngineRunning ? (isRevving ? 'REVVING V8!' : 'REV THROTTLE') : 'START ENGINE'}
              </span>
            </button>

            {/* Quick Stop Button (Visible when engine is active) */}
            {isEngineRunning && (
              <button
                onClick={handleEngineStop}
                className="px-2.5 py-2 rounded-full bg-white/[0.05] hover:bg-red-500/20 border border-white/10 hover:border-red-500/40 text-[0.65rem] font-bold uppercase text-text-muted hover:text-red-400 transition-all cursor-pointer"
                title="Stop Engine"
              >
                OFF
              </button>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};

export default Navbar;
