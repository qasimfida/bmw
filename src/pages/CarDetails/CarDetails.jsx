import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  selectCarById, 
  fetchCars, 
  selectCarsStatus, 
  selectSelectedColor, 
  selectBgLightColor, 
  selectRimColor,
  setSelectedColor 
} from '../../features/cars/carsSlice';
import { addToCompare, selectIsInCompare } from '../../features/compare/compareSlice';
import Car3DViewer from '../../components/Car3DViewer/Car3DViewer';
import ColorPicker from '../../components/ColorPicker/ColorPicker';
import SecondaryColorPicker from '../../components/ColorPicker/SecondaryColorPicker';
import BgColorPicker from '../../components/ColorPicker/BgColorPicker';
import RimColorPicker from '../../components/ColorPicker/RimColorPicker';
import Loader from '../../components/Loader/Loader';
import { soundEngine } from '../../utils/audioEngine';
import { LightingCircleIcon, SettingIcon, TimeIcon, DashboardIcon, CheckIcon, AddIcon } from 'tdesign-icons-react';

const CarDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const status = useSelector(selectCarsStatus);
  const car = useSelector(selectCarById(id));
  const selectedColor = useSelector(selectSelectedColor);
  const secondaryColor = useSelector(state => state.cars.secondaryColor);
  const bgLightColor = useSelector(selectBgLightColor);
  const rimColor = useSelector(selectRimColor);
  const isInCompare = useSelector(selectIsInCompare(Number(id)));

  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeChapter, setActiveChapter] = useState(1);
  const [isFreeOrbit, setIsFreeOrbit] = useState(false);
  const [isEngineRunning, setIsEngineRunning] = useState(false);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCars());
    }
  }, [status, dispatch]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Track scroll for 3D car rotation on Car Details page
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return;
      const rect = scrollContainerRef.current.getBoundingClientRect();
      const totalH = scrollContainerRef.current.offsetHeight - window.innerHeight;
      
      if (totalH > 0) {
        const progress = Math.max(0, Math.min(1, -rect.top / totalH));
        setScrollProgress(progress);

        if (progress < 0.2) setActiveChapter(1);
        else if (progress < 0.45) setActiveChapter(2);
        else if (progress < 0.70) setActiveChapter(3);
        else if (progress < 0.90) setActiveChapter(4);
        else setActiveChapter(5);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);
  };

  const handleToggleEngine = () => {
    const engineType = (car.modelType === 'ferrari' || car.series.toLowerCase() === 'ferrari') ? 'v12' : 'v8';
    const running = soundEngine.toggleEngine(engineType);
    setIsEngineRunning(running);
  };

  const handleRevEngine = () => {
    const engineType = (car.modelType === 'ferrari' || car.series.toLowerCase() === 'ferrari') ? 'v12' : 'v8';
    soundEngine.revEngine(engineType);
    setIsEngineRunning(true);
  };

  const scrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (status === 'loading' || status === 'idle') {
    return <Loader text="Loading bespoke 3D vehicle studio..." />;
  }

  if (!car) {
    return (
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 text-center py-32 animate-[fadeIn_0.4s_ease-out]">
        <h2 className="text-xl font-bold text-white mb-2">Vehicle Not Found</h2>
        <p className="text-xs text-text-muted mb-6">The requested model is not available in our showroom inventory.</p>
        <Link to="/" className="inline-flex items-center justify-center px-6 py-3 rounded-full text-xs uppercase font-bold tracking-wider bg-accent text-white hover:bg-accent-dark transition-all">
          Return to Showroom
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full relative bg-[#060608] text-text-primary selection:bg-accent selection:text-white">
      
      {/* Top Floating Action Bar */}
      <div className="fixed top-20 left-6 md:left-12 z-40 flex items-center gap-3">
        <Link 
          to="/" 
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#08080A]/80 hover:bg-white/[0.1] border border-white/10 text-xs uppercase font-semibold tracking-wider text-text-secondary hover:text-white backdrop-blur-xl transition-all"
        >
          <span>←</span>
          <span>Showroom</span>
        </Link>

        {/* Free 3D Orbit Toggle */}
        <button
          onClick={() => setIsFreeOrbit(!isFreeOrbit)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs uppercase font-semibold tracking-wider transition-all backdrop-blur-xl cursor-pointer ${
            isFreeOrbit 
              ? 'bg-accent text-white border-accent shadow-[0_0_15px_rgba(37,99,235,0.5)]' 
              : 'bg-[#08080A]/80 text-text-secondary hover:text-white border-white/10'
          }`}
          title="Toggle Free 3D Orbit"
        >
          <span>{isFreeOrbit ? '🖐 Free Orbit Active' : '🔄 Scroll Sync Active'}</span>
        </button>
      </div>

      {/* ── SCROLL-SYNCHRONIZED 3D STORYTELLING CONTAINER ──────────────────────── */}
      <div ref={scrollContainerRef} className="relative w-full h-[460vh]">
        
        {/* Sticky Background 3D Viewport */}
        <div className="sticky top-0 left-0 w-full h-screen overflow-hidden z-0 flex items-center justify-center pointer-events-none">
          
          {/* Subtle cinematic radial vignette & depth glow */}
          <div 
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at 50% 50%, rgba(37,99,235,0.06) 0%, rgba(6,6,8,0.55) 55%, #060608 95%)",
            }}
          />

          {/* Left Timeline Indicator (01 -> 05) */}
          <div className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col items-center gap-3">
            <span className="font-mono text-xs font-semibold text-white tracking-widest">
              0{activeChapter}
            </span>
            <div className="w-[1px] h-20 bg-white/10 relative flex flex-col justify-between py-1">
              <div 
                className="w-[2px] -left-[0.5px] bg-accent rounded-full absolute transition-all duration-300 shadow-[0_0_8px_#3b82f6]"
                style={{
                  top: `${((activeChapter - 1) / 4) * 100}%`,
                  height: '18px',
                }}
              />
            </div>
            <span className="font-mono text-[0.65rem] text-text-muted tracking-widest">
              05
            </span>
          </div>

          {/* Full Screen High-Performance 3D Car Canvas */}
          <div className={`w-full h-full ${isFreeOrbit ? 'pointer-events-auto cursor-grab active:cursor-grabbing' : 'pointer-events-none'}`}>
            <Car3DViewer 
              scrollProgress={isFreeOrbit ? undefined : scrollProgress}
              color={selectedColor || car.colors[0]}
              secondaryColor={secondaryColor || '#ffffff'}
              rimColor={rimColor || '#e0e0e0'}
              bgLightColor={bgLightColor}
              modelType={car.modelType || (car.series.toLowerCase() === 'ferrari' ? 'ferrari' : 'bmw')}
              autoRotate={isFreeOrbit}
            />
          </div>
        </div>

        {/* ── OVERLAY CONTENT (5 BESPOKE CHAPTERS) ───────────────────────────── */}
        <div className="relative z-10 -mt-[100vh]">
          
          {/* ── CHAPTER 01: HERO VEHICLE INSPECTION ──────────────────────────── */}
          <section className="h-screen w-full flex items-center justify-between px-6 md:px-16 lg:px-24 pointer-events-auto relative">
            <div className="max-w-xl flex flex-col items-start justify-center animate-[fadeInUp_0.8s_ease-out] z-20">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-[0.75rem] font-bold text-accent-light mb-4 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                {car.series} SERIES · {car.bodyType}
              </div>

              <h1 className="text-[clamp(2.5rem,6vw,5rem)] font-black tracking-tight leading-[0.95] mb-3 text-white uppercase">
                {car.model}
              </h1>

              <div className="text-2xl md:text-3xl font-extrabold text-white mb-6">
                {formatPrice(car.price)}
                <span className="block text-xs font-mono font-medium text-text-muted mt-1 uppercase tracking-wider">
                  Starting MSRP · {car.year} Model
                </span>
              </div>

              <p className="text-xs md:text-sm text-text-secondary font-light max-w-md mb-8 leading-relaxed">
                {car.description}
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={() => scrollToSection('customizer-section')}
                  className="px-6 py-3 rounded-full bg-accent text-white text-xs uppercase font-bold tracking-wider hover:bg-accent-dark transition-all active:scale-[0.97] cursor-pointer shadow-lg shadow-accent/25"
                >
                  BESPOKE FINISH STUDIO
                </button>
                
                <button
                  onClick={() => dispatch(addToCompare(car))}
                  className={`px-5 py-3 rounded-full border text-xs uppercase font-semibold tracking-wider transition-all cursor-pointer backdrop-blur-md flex items-center gap-2 ${
                    isInCompare 
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' 
                      : 'bg-white/[0.04] text-text-primary border-white/15 hover:bg-white/[0.1]'
                  }`}
                >
                  {isInCompare ? <CheckIcon /> : <AddIcon />}
                  <span>{isInCompare ? 'Added to Compare' : 'Add to Compare'}</span>
                </button>
              </div>
            </div>

            {/* Quick Specs Right Card */}
            <div className="hidden lg:flex flex-col gap-5 p-6 rounded-2xl bg-[#08080A]/60 border border-white/[0.08] backdrop-blur-2xl shadow-2xl z-20 min-w-[180px] text-right">
              <div>
                <div className="text-3xl font-black text-white">{car.horsepower}</div>
                <div className="text-[0.65rem] font-mono uppercase text-text-muted tracking-widest mt-0.5">HORSEPOWER</div>
              </div>
              <div className="relative pr-3 border-r-2 border-accent">
                <div className="text-3xl font-black text-white">{car.acceleration}s</div>
                <div className="text-[0.65rem] font-mono uppercase text-text-muted tracking-widest mt-0.5">0-60 MPH</div>
              </div>
              <div>
                <div className="text-3xl font-black text-white">{car.topSpeed}</div>
                <div className="text-[0.65rem] font-mono uppercase text-text-muted tracking-widest mt-0.5">TOP SPEED (MPH)</div>
              </div>
            </div>

            {/* Bottom Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-[0.7rem] uppercase tracking-widest font-mono text-text-muted animate-bounce pointer-events-none">
              <span>SCROLL TO EXPLORE SPECS</span>
              <span>↓</span>
            </div>
          </section>

          {/* ── CHAPTER 02: POWERTRAIN & TELEMETRY ───────────────────────────── */}
          <section className="h-screen w-full flex items-center justify-end px-6 md:px-16 lg:px-24 pointer-events-auto">
            <div className="max-w-md w-full p-8 rounded-2xl bg-[#08080A]/80 border border-white/[0.08] backdrop-blur-2xl shadow-2xl animate-[fadeIn_0.5s_ease-out]">
              <span className="text-[0.7rem] uppercase font-mono tracking-widest text-accent-light font-semibold block mb-2">
                02 · MOTORSPORT TELEMETRY
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-white mb-3">
                HIGH-PRECISION BENCHMARKS
              </h2>
              <p className="text-xs text-text-secondary leading-relaxed mb-6 font-light">
                Every component is balanced for optimal weight distribution, lightning throttle response, and apex grip.
              </p>

              <div className="grid grid-cols-2 gap-4 border-t border-white/[0.08] pt-5">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <div className="text-xl font-bold text-white">{car.horsepower} HP</div>
                  <div className="text-[0.65rem] text-text-muted uppercase tracking-wider mt-0.5">Max Output</div>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <div className="text-xl font-bold text-accent-light">{car.torque} lb-ft</div>
                  <div className="text-[0.65rem] text-text-muted uppercase tracking-wider mt-0.5">Peak Torque</div>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <div className="text-xl font-bold text-white">{car.acceleration}s</div>
                  <div className="text-[0.65rem] text-text-muted uppercase tracking-wider mt-0.5">0-60 MPH Sprint</div>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <div className="text-xl font-bold text-white">{car.topSpeed} MPH</div>
                  <div className="text-[0.65rem] text-text-muted uppercase tracking-wider mt-0.5">Track Velocity</div>
                </div>
              </div>
            </div>
          </section>

          {/* ── CHAPTER 03: BESPOKE CUSTOMIZER STUDIO ────────────────────────── */}
          <section id="customizer-section" className="h-screen w-full flex items-center justify-start px-6 md:px-16 lg:px-24 pointer-events-auto">
            <div className="max-w-lg w-full p-6 sm:p-8 rounded-2xl bg-[#08080A]/85 border border-white/[0.08] backdrop-blur-2xl shadow-2xl max-h-[85vh] overflow-y-auto">
              <span className="text-[0.7rem] uppercase font-mono tracking-widest text-accent-light font-semibold block mb-1">
                03 · BESPOKE CONFIGURATOR
              </span>
              <h2 className="text-xl md:text-2xl font-extrabold uppercase tracking-tight text-white mb-2">
                CUSTOMIZE FINISH & LIGHTING
              </h2>
              <p className="text-xs text-text-secondary leading-relaxed mb-4 font-light">
                Configure your paint, secondary aerodynamic livery, alloy rims, and studio reflections in real-time.
              </p>

              <div className="space-y-3">
                <ColorPicker colors={car.colors} />
                {car.series.toLowerCase() !== 'ferrari' && <SecondaryColorPicker colors={car.colors} />}
                <RimColorPicker />
                <BgColorPicker />
              </div>
            </div>
          </section>

          {/* ── CHAPTER 04: ACOUSTIC SOUND ENGINE ────────────────────────────── */}
          <section className="h-screen w-full flex items-center justify-center px-6 pointer-events-auto">
            <div className="max-w-lg w-full text-center p-8 rounded-3xl bg-[#08080A]/85 border border-white/[0.08] backdrop-blur-2xl shadow-2xl">
              <span className="text-[0.7rem] uppercase font-mono tracking-widest text-accent-light font-semibold block mb-2">
                04 · ACOUSTIC SENSATIONS
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-white mb-3">
                LIVE EXHAUST & ENGINE SYNTHESIZER
              </h2>
              <p className="text-xs text-text-secondary leading-relaxed mb-6 font-light">
                Synthesized twin-turbo exhaust tone, starter ignition, and throttle pops via Web Audio API.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <button
                  onClick={handleToggleEngine}
                  className={`px-6 py-3 rounded-full text-xs uppercase font-bold tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                    isEngineRunning 
                      ? 'bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30' 
                      : 'bg-white/[0.05] text-white border border-white/15 hover:bg-white/[0.1]'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isEngineRunning ? 'bg-red-400 animate-ping' : 'bg-emerald-400'}`} />
                  <span>{isEngineRunning ? 'Stop Engine' : 'Ignition Start'}</span>
                </button>

                <button
                  onClick={handleRevEngine}
                  className="px-6 py-3 rounded-full bg-accent text-white text-xs uppercase font-bold tracking-wider hover:bg-accent-dark transition-all active:scale-95 cursor-pointer shadow-lg shadow-accent/25 flex items-center gap-2"
                >
                  <span>🔊</span>
                  <span>Rev Throttle</span>
                </button>
              </div>

              {isEngineRunning && (
                <div className="mt-4 text-[0.7rem] font-mono text-emerald-400 animate-pulse">
                  ● ENGINE RUNNING · 850 RPM IDLE BURBLE
                </div>
              )}
            </div>
          </section>

          {/* ── CHAPTER 05: NEXT STEPS & COMPARE ─────────────────────────────── */}
          <section className="h-screen w-full flex items-center justify-center px-6 pointer-events-auto">
            <div className="max-w-xl w-full text-center p-8 rounded-3xl bg-[#08080A]/85 border border-white/[0.08] backdrop-blur-2xl shadow-2xl">
              <span className="text-[0.7rem] uppercase font-mono tracking-widest text-accent-light font-semibold block mb-2">
                05 · NEXT STEPS
              </span>
              <h2 className="text-2xl md:text-4xl font-extrabold uppercase tracking-tight text-white mb-3">
                READY TO DRIVE?
              </h2>
              <p className="text-xs md:text-sm text-text-secondary leading-relaxed mb-8 font-light">
                Compare the {car.model} against other vehicles in the lineup or return to the fleet showroom.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  to="/compare"
                  className="px-7 py-3.5 rounded-full bg-accent text-white text-xs uppercase font-bold tracking-wider hover:bg-accent-dark transition-all active:scale-95 shadow-lg shadow-accent/30"
                >
                  View in Side-by-Side Compare
                </Link>
                <Link
                  to="/"
                  className="px-7 py-3.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 text-white text-xs uppercase font-bold tracking-wider transition-all"
                >
                  Back to Showroom
                </Link>
              </div>
            </div>
          </section>

        </div>
      </div>

    </div>
  );
};

export default CarDetails;
