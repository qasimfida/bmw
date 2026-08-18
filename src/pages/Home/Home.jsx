import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  fetchCars, 
  selectPaginatedCars, 
  selectCarsStatus,
  selectSelectedColor,
  selectSecondaryColor,
  selectRimColor,
  selectBgLightColor,
  setSelectedColor
} from '../../features/cars/carsSlice';
import SearchBar from '../../components/SearchBar/SearchBar';
import FilterBar from '../../components/FilterBar/FilterBar';
import CarCard from '../../components/CarCard/CarCard';
import Pagination from '../../components/Pagination/Pagination';
import Loader from '../../components/Loader/Loader';
import Car3DViewer from '../../components/Car3DViewer/Car3DViewer';
import { soundEngine } from '../../utils/audioEngine';
import { SearchIcon, ErrorCircleIcon } from 'tdesign-icons-react';

const SHOWROOM_MODELS = [
  { 
    id: 1, 
    name: 'M4', 
    sub: 'Competition', 
    hp: '503 HP', 
    price: '$82,000', 
    img: '/images/coupe-1.png', 
    modelType: 'bmw',
    hex: '#0047b3',
    glowColor: '#3b82f6',
    bgGradient: 'from-[#002b66]/40 via-[#06152d]/60 to-[#060608]',
    borderHover: 'hover:border-blue-500/60'
  },
  { 
    id: 3, 
    name: 'M5', 
    sub: 'Competition', 
    hp: '617 HP', 
    price: '$107,900', 
    img: '/images/card-m5.jpg', 
    modelType: 'ferrari',
    hex: '#0e3a2f',
    glowColor: '#10b981',
    bgGradient: 'from-[#0a3528]/45 via-[#061f18]/65 to-[#060608]',
    borderHover: 'hover:border-emerald-500/60'
  },
  { 
    id: 2, 
    name: 'M8', 
    sub: 'Competition', 
    hp: '625 HP', 
    price: '$138,800', 
    img: '/images/card-m8.jpg', 
    modelType: 'bmw',
    hex: '#101114',
    glowColor: '#00e5ff',
    bgGradient: 'from-[#0e223d]/50 via-[#071120]/75 to-[#060608]',
    borderHover: 'hover:border-accent'
  },
  { 
    id: 4, 
    name: 'i7', 
    sub: 'eDrive M70', 
    hp: '650 HP', 
    price: '$168,500', 
    img: '/images/electric-1.png', 
    modelType: 'bmw',
    hex: '#e2e8f0',
    glowColor: '#e2e8f0',
    bgGradient: 'from-[#334155]/40 via-[#172033]/60 to-[#060608]',
    borderHover: 'hover:border-slate-400/60'
  },
  { 
    id: 5, 
    name: 'XM', 
    sub: 'Label Red', 
    hp: '738 HP', 
    price: '$185,000', 
    img: '/images/suv-1.png', 
    modelType: 'ferrari',
    hex: '#8b0e14',
    glowColor: '#ef4444',
    bgGradient: 'from-[#4a0808]/45 via-[#210505]/65 to-[#060608]',
    borderHover: 'hover:border-red-500/60'
  },
  { 
    id: 6, 
    name: 'VISION', 
    sub: 'Neue Klasse', 
    hp: 'Electric Concept', 
    price: 'Concept', 
    img: '/images/sedan-1.png', 
    modelType: 'ferrari',
    hex: '#e6d622',
    glowColor: '#f59e0b',
    bgGradient: 'from-[#382606]/40 via-[#1a1203]/60 to-[#060608]',
    borderHover: 'hover:border-amber-500/60'
  },
];

const TECH_CARDS = [
  { id: 'engineering', title: 'ENGINEERING', desc: 'M TwinPower Turbo high-revving powertrain architecture.', img: '/images/tech-engineering.jpg' },
  { id: 'aerodynamics', title: 'AERODYNAMICS', desc: 'Active air curtains, carbon diffuser, and optimized downforce.', img: '/images/tech-aerodynamics.jpg' },
  { id: 'chassis', title: 'CHASSIS', desc: 'Adaptive M suspension and lightweight carbon-ceramic brakes.', img: '/images/tech-chassis.jpg' },
  { id: 'electrification', title: 'ELECTRIFICATION', desc: 'Next-gen high-voltage modular battery and eDrive dual motors.', img: '/images/tech-electrification.jpg' },
];

const Home = () => {
  const dispatch = useDispatch();
  const paginatedCars = useSelector(selectPaginatedCars);
  const status = useSelector(selectCarsStatus);
  const selectedColor = useSelector(selectSelectedColor);
  const secondaryColor = useSelector(selectSecondaryColor);
  const rimColor = useSelector(selectRimColor);
  const bgLightColor = useSelector(selectBgLightColor);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeChapter, setActiveChapter] = useState(1);
  const [selectedModelIdx, setSelectedModelIdx] = useState(2); // M8 default
  const [activeTechModal, setActiveTechModal] = useState(null);
  const [isEngineRunning, setIsEngineRunning] = useState(false);

  const scrollContainerRef = useRef(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCars());
    }
  }, [status, dispatch]);

  // Track scroll for 3D car rotation and chapters
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return;
      const rect = scrollContainerRef.current.getBoundingClientRect();
      const totalH = scrollContainerRef.current.offsetHeight - window.innerHeight;
      
      if (totalH > 0) {
        const progress = Math.max(0, Math.min(1, -rect.top / totalH));
        setScrollProgress(progress);

        if (progress < 0.15) setActiveChapter(1);
        else if (progress < 0.50) setActiveChapter(2);
        else if (progress < 0.72) setActiveChapter(3);
        else if (progress < 0.88) setActiveChapter(4);
        else setActiveChapter(5);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleShowroomSelect = (idx) => {
    setSelectedModelIdx(idx);
    const model = SHOWROOM_MODELS[idx];
    if (model.id === 6) {
      dispatch(setSelectedColor('#b71c1c'));
    } else if (model.id === 3) {
      dispatch(setSelectedColor('#0e3a2f'));
    } else if (model.id === 2) {
      dispatch(setSelectedColor('#101114'));
    } else {
      dispatch(setSelectedColor('#1B69D4'));
    }
  };

  const handleToggleEngine = () => {
    const engineType = currentCarModel === 'ferrari' ? 'v12' : 'v8';
    const running = soundEngine.toggleEngine(engineType);
    setIsEngineRunning(running);
  };

  const handleRevEngine = () => {
    const engineType = currentCarModel === 'ferrari' ? 'v12' : 'v8';
    soundEngine.revEngine(engineType);
    setIsEngineRunning(true);
  };

  const currentCarModel = SHOWROOM_MODELS[selectedModelIdx]?.modelType || 'bmw';

  return (
    <div className="w-full relative bg-[#060608] text-text-primary selection:bg-accent selection:text-white">
      
      {/* ── CINEMATIC 3D SCROLL STORYTELLING CONTAINER ────────────────────────── */}
      <div ref={scrollContainerRef} className="relative w-full h-[620vh]">
        
        {/* Sticky Background 3D Viewport — The car rotates seamlessly in place */}
        <div className="sticky top-0 left-0 w-full h-screen overflow-hidden pointer-events-none z-0 flex items-center justify-center">
          
          {/* Subtle cinematic radial vignette & depth glow */}
          <div 
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at 50% 50%, rgba(37,99,235,0.05) 0%, rgba(6,6,8,0.55) 55%, #060608 95%)",
            }}
          />

          {/* Left Timeline Indicator (01 -> 05) */}
          <div className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col items-center gap-3">
            <span className="font-mono text-xs font-semibold text-white tracking-widest">
              0{activeChapter}
            </span>
            <div className="w-[1px] h-24 bg-white/10 relative flex flex-col justify-between py-1">
              <div 
                className="w-[2px] -left-[0.5px] bg-accent rounded-full absolute transition-all duration-300 shadow-[0_0_8px_#3b82f6]"
                style={{
                  top: `${((activeChapter - 1) / 4) * 100}%`,
                  height: '20px',
                }}
              />
            </div>
            <span className="font-mono text-[0.65rem] text-text-muted tracking-widest">
              05
            </span>
          </div>

          {/* Full Screen High-Performance 3D Car Canvas */}
          <div className="w-full h-full">
            <Car3DViewer 
              scrollProgress={scrollProgress}
              color={selectedColor || '#1B69D4'}
              secondaryColor={secondaryColor || '#ffffff'}
              rimColor={rimColor || '#e0e0e0'}
              bgLightColor={bgLightColor}
              modelType={currentCarModel}
            />
          </div>
        </div>

        {/* ── OVERLAY CONTENT (INTEGRATED CHOOSE YOUR MACHINE & DIGITAL SHOWROOM) ── */}
        <div className="relative z-10 -mt-[100vh]">
          
          {/* ── SECTION 01: HERO (FRONT 3/4 VIEW) ────────────────────────────── */}
          <section className="h-screen w-full flex items-center justify-between px-6 md:px-16 lg:px-24 pointer-events-auto relative">
            
            {/* Left Hero Text Block */}
            <div className="max-w-xl flex flex-col items-start justify-center animate-[fadeInUp_0.8s_ease-out] z-20">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-[0.75rem] font-bold text-accent-light mb-6 tracking-wider uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                2026 COLLECTION
              </div>

              <h1 className="text-[clamp(2.75rem,7vw,5.5rem)] font-extrabold tracking-tight leading-[0.95] mb-5 text-white uppercase">
                THE ULTIMATE <br />
                DRIVING <br />
                <span className="text-gradient drop-shadow-[0_0_35px_rgba(37,99,235,0.4)]">
                  MACHINE
                </span>
              </h1>

              <p className="text-sm md:text-base text-text-secondary font-light max-w-md mb-8 leading-relaxed">
                Discover the perfect blend of performance, luxury, and innovation. Engineered for those who demand more.
              </p>

              <div className="flex items-center gap-4">
                <button
                  id="btn-hero-explore"
                  onClick={() => scrollToSection('showroom-section')}
                  className="group flex items-center gap-3 px-6 py-3.5 rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-white/15 text-xs uppercase font-semibold tracking-wider text-white transition-all active:scale-[0.97] cursor-pointer backdrop-blur-md hover:border-accent"
                >
                  <span>EXPLORE MODELS</span>
                  <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-accent transition-colors">
                    →
                  </span>
                </button>
              </div>
            </div>

            {/* Right Hero Specs HUD Card */}
            <div className="hidden lg:flex flex-col gap-6 p-6 rounded-2xl bg-[#08080A]/60 border border-white/[0.08] backdrop-blur-2xl shadow-2xl z-20 min-w-[170px] text-right">
              <div>
                <div className="text-3xl font-black text-white tracking-tight">503</div>
                <div className="text-[0.65rem] font-mono uppercase text-text-muted tracking-widest mt-0.5">HP</div>
              </div>

              <div className="relative pr-3 border-r-2 border-accent">
                <div className="text-3xl font-black text-white tracking-tight">3.4s</div>
                <div className="text-[0.65rem] font-mono uppercase text-text-muted tracking-widest mt-0.5">0-60 MPH</div>
              </div>

              <div>
                <div className="text-3xl font-black text-white tracking-tight">155</div>
                <div className="text-[0.65rem] font-mono uppercase text-text-muted tracking-widest mt-0.5">TOP SPEED</div>
              </div>
            </div>

            {/* Bottom Hero HUD Elements */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-[0.7rem] uppercase tracking-widest font-mono text-text-muted animate-bounce pointer-events-none">
              <span>SCROLL</span>
              <span>↓</span>
            </div>

            <div className="absolute bottom-8 right-6 md:right-16 flex items-center gap-3 font-mono text-xs text-text-muted">
              <span className="text-white font-semibold">01</span>
              <span>/</span>
              <span>05</span>
              <div className="w-12 h-[2px] bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-accent w-1/5" />
              </div>
            </div>
          </section>

          {/* ── SECTION 02: CHOOSE YOUR MACHINE + DIGITAL SHOWROOM & CONFIGURATOR ── */}
          <section id="showroom-section" className="min-h-screen w-full flex flex-col justify-center px-6 md:px-16 py-20 pointer-events-auto">
            <div className={`max-w-[1400px] w-full mx-auto flex flex-col justify-center transition-all duration-1000 transform ${activeChapter >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
              
              {/* Header: Choose Your Machine */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono font-semibold text-accent-light uppercase tracking-widest mb-1">
                    <span>02</span>
                    <span>·</span>
                    <span>SHOWROOM & CONFIGURATOR</span>
                  </div>
                  <h2 className="text-2xl md:text-4xl font-extrabold uppercase tracking-tight text-white">
                    CHOOSE YOUR MACHINE
                  </h2>
                  <p className="text-xs text-text-secondary font-light mt-1">
                    A lineup built for every driver. Click any model to switch the live 3D showcase.
                  </p>
                </div>

                {/* 3D Real-time Paint Switcher */}
                <div className="p-3 rounded-xl bg-[#09090c]/90 border border-white/[0.08] backdrop-blur-md flex items-center gap-3">
                  <span className="text-[0.7rem] uppercase font-mono text-text-muted">Finish:</span>
                  <div className="flex items-center gap-1.5">
                    {['#1B69D4', '#2f426f', '#1c1c1c', '#ffffff', '#0e3a2f', '#a82b2b', '#b71c1c'].map((hex) => (
                      <button
                        key={hex}
                        onClick={() => dispatch(setSelectedColor(hex))}
                        className={`w-5 h-5 rounded-full transition-all cursor-pointer ${
                          selectedColor === hex ? 'ring-2 ring-accent ring-offset-1 ring-offset-bg-primary scale-110' : 'hover:scale-105 opacity-75'
                        }`}
                        style={{ backgroundColor: hex }}
                        title={`Apply finish ${hex}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Horizontal Slider Cards for Fast Selection */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3.5 w-full mb-10">
                {SHOWROOM_MODELS.map((item, idx) => {
                  const isSelected = selectedModelIdx === idx;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleShowroomSelect(idx)}
                      className={`group relative rounded-xl overflow-hidden transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                        isSelected 
                          ? 'border-2 border-accent shadow-[0_0_30px_rgba(37,99,235,0.45)] bg-gradient-to-b from-[#0e223d]/60 via-[#071120]/80 to-[#060608]' 
                          : `border border-white/[0.08] ${item.borderHover} bg-gradient-to-b ${item.bgGradient}`
                      }`}
                      style={{ height: '310px' }}
                    >
                      {/* Ambient Headlight Glow in card background */}
                      <div 
                        className="absolute top-0 inset-x-0 h-32 opacity-25 group-hover:opacity-45 pointer-events-none transition-opacity blur-xl"
                        style={{ background: `radial-gradient(circle at 50% 30%, ${item.glowColor}, transparent 70%)` }}
                      />

                      {/* Image Preview */}
                      <div className="w-full h-[62%] relative overflow-hidden p-2 flex items-center justify-center">
                        <img 
                          src={item.img} 
                          alt={item.name} 
                          className="w-full h-full object-cover rounded-lg transition-transform duration-500 group-hover:scale-105" 
                        />
                      </div>

                      {/* Card Info */}
                      <div className="p-3.5 relative z-10 border-t border-white/[0.06] bg-[#060608]/70 backdrop-blur-md flex flex-col justify-between flex-1">
                        <div>
                          <div className="text-base font-extrabold text-white tracking-tight uppercase flex items-center justify-between">
                            <span>{item.name}</span>
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.glowColor, boxShadow: `0 0 6px ${item.glowColor}` }} />
                          </div>
                          <div className="text-[0.7rem] text-text-muted">{item.sub}</div>
                        </div>

                        {isSelected ? (
                          <Link 
                            to={`/model/${item.id}`}
                            className="mt-2 flex items-center justify-between text-[0.65rem] font-bold uppercase tracking-wider text-accent-light hover:underline"
                          >
                            <span>INSPECT 3D</span>
                            <span>→</span>
                          </Link>
                        ) : (
                          <div className="text-[0.65rem] font-mono text-text-muted mt-2 flex items-center justify-between">
                            <span>{item.hp}</span>
                            <span className="text-[0.6rem] opacity-60">SELECT</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Integrated Digital Fleet Catalog (Search, Filter, Cards Grid) */}
              <div className="border-t border-white/[0.08] pt-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-lg font-bold uppercase tracking-tight text-white">Full Digital Fleet Inventory</h3>
                    <p className="text-xs text-text-muted">Filter by series, body type, or fuel specification</p>
                  </div>
                </div>

                <div className="flex flex-col gap-4 mb-6 p-4 rounded-xl bg-[#09090c]/80 border border-white/[0.06] backdrop-blur-md">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <SearchBar />
                    <FilterBar />
                  </div>
                </div>

                {status === 'loading' && <Loader text="Loading vehicle fleet..." />}

                {status === 'succeeded' && paginatedCars.length === 0 && (
                  <div className="text-center py-16 px-5">
                    <div className="text-3xl mb-3 opacity-30 flex justify-center text-text-muted"><SearchIcon size="36px" /></div>
                    <h4 className="text-sm font-semibold mb-1 text-text-secondary">No matching models</h4>
                    <p className="text-xs text-text-muted">Try resetting your search query or filters.</p>
                  </div>
                )}

                {status === 'succeeded' && paginatedCars.length > 0 && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
                      {paginatedCars.map(car => (
                        <CarCard key={car.id} car={car} />
                      ))}
                    </div>
                    <Pagination />
                  </>
                )}

                {status === 'failed' && (
                  <div className="text-center py-12 px-5">
                    <div className="text-3xl mb-3 flex justify-center text-red-400/60"><ErrorCircleIcon size="36px" /></div>
                    <h4 className="text-sm text-text-secondary mb-3">Unable to load showroom fleet.</h4>
                    <button className="px-5 py-2 rounded-lg bg-accent text-white text-xs font-medium" onClick={() => dispatch(fetchCars())}>
                      Retry
                    </button>
                  </div>
                )}
              </div>

            </div>
          </section>

          {/* ── SECTION 03: PERFORMANCE ("POWER REDEFINED") ──────────────────── */}
          <section id="perf-section" className="h-screen w-full flex flex-col justify-between py-20 px-6 md:px-16 pointer-events-auto">
            
            <div className={`max-w-md transition-all duration-1000 delay-100 transform ${activeChapter >= 3 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
              <div className="flex items-center gap-2 text-xs font-mono font-semibold text-accent-light uppercase tracking-widest mb-1">
                <span>03</span>
                <span>·</span>
                <span>PERFORMANCE</span>
              </div>
              <h2 className="text-2xl md:text-4xl font-extrabold uppercase tracking-tight text-white mb-2">
                POWER REDEFINED
              </h2>
              <p className="text-xs text-text-secondary font-light leading-relaxed mb-4">
                Unleashing precision engineering and motorsport DNA in every drive.
              </p>
              <button 
                onClick={() => scrollToSection('tech-section')}
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-secondary hover:text-white transition-colors cursor-pointer"
              >
                <span>LEARN MORE</span>
                <span className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center text-[0.65rem]">→</span>
              </button>
            </div>

            {/* Bottom Floating Stats Bar */}
            <div className={`w-full max-w-5xl mx-auto rounded-2xl bg-[#08080A]/75 border border-white/[0.08] backdrop-blur-2xl p-6 shadow-2xl transition-all duration-1000 delay-300 transform ${activeChapter >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.08] text-center">
                <div className="flex flex-col items-center">
                  <div className="text-2xl md:text-3xl font-extrabold text-white">503</div>
                  <div className="text-[0.65rem] uppercase font-mono tracking-widest text-text-muted mt-0.5">HP</div>
                </div>
                <div className="flex flex-col items-center pt-3 sm:pt-0">
                  <div className="text-2xl md:text-3xl font-extrabold text-white">3.4s</div>
                  <div className="text-[0.65rem] uppercase font-mono tracking-widest text-text-muted mt-0.5">0-60 MPH</div>
                </div>
                <div className="flex flex-col items-center pt-3 sm:pt-0">
                  <div className="text-2xl md:text-3xl font-extrabold text-accent-light">4WD</div>
                  <div className="text-[0.65rem] uppercase font-mono tracking-widest text-text-muted mt-0.5">M xDrive</div>
                </div>
                <div className="flex flex-col items-center pt-3 sm:pt-0">
                  <div className="text-2xl md:text-3xl font-extrabold text-white">6</div>
                  <div className="text-[0.65rem] uppercase font-mono tracking-widest text-text-muted mt-0.5">CYLINDERS</div>
                </div>
                <div className="flex flex-col items-center pt-3 sm:pt-0">
                  <div className="text-2xl md:text-3xl font-extrabold text-white">155</div>
                  <div className="text-[0.65rem] uppercase font-mono tracking-widest text-text-muted mt-0.5">MPH</div>
                </div>
              </div>
            </div>

          </section>

          {/* ── SECTION 04: TECHNOLOGY ("BUILT WITH INTELLIGENCE") ────────────── */}
          <section id="tech-section" className="h-screen w-full flex items-center justify-center px-6 md:px-16 pointer-events-auto">
            <div className={`max-w-[1400px] w-full mx-auto flex flex-col justify-center transition-all duration-1000 transform ${activeChapter >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
              
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono font-semibold text-accent-light uppercase tracking-widest mb-1">
                    <span>04</span>
                    <span>·</span>
                    <span>TECHNOLOGY</span>
                  </div>
                  <h2 className="text-2xl md:text-4xl font-extrabold uppercase tracking-tight text-white">
                    BUILT WITH INTELLIGENCE
                  </h2>
                  <p className="text-xs text-text-secondary font-light mt-1">
                    Advanced technology that enhances every mile, every moment.
                  </p>
                </div>

                <button 
                  onClick={() => scrollToSection('experience-section')}
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-secondary hover:text-white transition-colors cursor-pointer"
                >
                  <span>EXPLORE TECHNOLOGY</span>
                  <span className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center text-[0.65rem]">→</span>
                </button>
              </div>

              {/* 4 Tech Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {TECH_CARDS.map((card) => (
                  <div
                    key={card.id}
                    className="group relative rounded-xl overflow-hidden border border-white/[0.08] bg-[#09090c] hover:border-accent/60 transition-all duration-300 cursor-pointer shadow-xl flex flex-col justify-between"
                    style={{ height: '260px' }}
                    onClick={() => setActiveTechModal(card)}
                  >
                    <img 
                      src={card.img} 
                      alt={card.title} 
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#08080A] via-transparent to-black/30 pointer-events-none" />
                    <div className="absolute top-4 left-4 z-10">
                      <div className="text-xs font-mono font-bold tracking-widest text-white uppercase">
                        {card.title}
                      </div>
                    </div>
                    <div className="absolute bottom-4 right-4 z-10">
                      <div className="w-7 h-7 rounded-full bg-black/60 border border-white/20 group-hover:border-accent group-hover:bg-accent flex items-center justify-center text-white text-xs font-bold transition-all shadow-md">
                        +
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </section>

          {/* ── SECTION 05: THE MACHINE ("THE MACHINE IS YOURS.") ─────────────── */}
          <section id="experience-section" className="h-screen w-full flex items-center justify-between px-6 md:px-16 lg:px-24 pointer-events-auto">
            <div className={`max-w-xl z-20 transition-all duration-1000 transform ${activeChapter >= 5 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
              <div className="flex items-center gap-2 text-xs font-mono font-semibold text-accent-light uppercase tracking-widest mb-2">
                <span>05</span>
                <span>·</span>
                <span>THE MACHINE</span>
              </div>
              <h2 className="text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold uppercase tracking-tight text-white leading-none mb-4">
                THE MACHINE <br />
                IS YOURS.
              </h2>
              <p className="text-sm md:text-base text-text-secondary font-light mb-8 max-w-md">
                Take the wheel. Feel the power. Live the experience.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  id="btn-exp-explore"
                  onClick={() => scrollToSection('showroom-section')}
                  className="flex items-center gap-3.5 px-6 py-3.5 rounded-full bg-accent text-white text-xs uppercase font-bold tracking-wider hover:bg-accent-dark transition-all active:scale-95 cursor-pointer shadow-lg shadow-accent/30"
                >
                  <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs">→</span>
                  <span>EXPLORE MODELS</span>
                </button>

                {/* V8 Engine Sound rev button */}
                <button
                  id="btn-exp-rev"
                  onClick={handleRevEngine}
                  className={`flex items-center gap-2.5 px-5 py-3.5 rounded-full ${isEngineRunning ? 'bg-accent/20 border-accent text-accent-light' : 'bg-white/[0.04] hover:bg-white/[0.09] border-white/15 text-white'} border text-xs uppercase font-semibold transition-all cursor-pointer backdrop-blur-md`}
                  title="Rev Twin-Turbo V8"
                >
                  <span>🔊</span>
                  <span>{isEngineRunning ? 'ENGINE RUNNING' : 'START ENGINE'}</span>
                </button>
              </div>
            </div>
          </section>

        </div>
      </div>

      {/* ── TECHNICAL MODAL PREVIEW ─────────────────────────────────────────── */}
      {activeTechModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-[fadeIn_0.2s_ease-out]"
          onClick={() => setActiveTechModal(null)}
        >
          <div 
            className="max-w-xl w-full rounded-2xl bg-[#09090d] border border-white/20 p-6 overflow-hidden shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="aspect-video w-full rounded-lg overflow-hidden mb-4">
              <img src={activeTechModal.img} alt={activeTechModal.title} className="w-full h-full object-cover" />
            </div>
            <h3 className="text-lg font-bold text-white uppercase font-mono mb-2">{activeTechModal.title}</h3>
            <p className="text-xs text-text-secondary leading-relaxed mb-6 font-light">{activeTechModal.desc}</p>
            <button 
              onClick={() => setActiveTechModal(null)}
              className="px-5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white uppercase tracking-wider transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Home;
