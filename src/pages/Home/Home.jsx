import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCars, selectPaginatedCars, selectCarsStatus } from '../../features/cars/carsSlice';
import SearchBar from '../../components/SearchBar/SearchBar';
import FilterBar from '../../components/FilterBar/FilterBar';
import CarCard from '../../components/CarCard/CarCard';
import Pagination from '../../components/Pagination/Pagination';
import Loader from '../../components/Loader/Loader';
import Car3DViewer from '../../components/Car3DViewer/Car3DViewer';
import { SearchIcon, ErrorCircleIcon } from 'tdesign-icons-react';

const Home = () => {
  const dispatch = useDispatch();
  const paginatedCars = useSelector(selectPaginatedCars);
  const status = useSelector(selectCarsStatus);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCars());
    }
  }, [status, dispatch]);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden min-h-[500px] flex items-center">
        {/* Background Gradients */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_50%_0%,rgba(27,105,212,0.15)_0%,transparent_70%),radial-gradient(ellipse_at_80%_50%,rgba(27,105,212,0.08)_0%,transparent_50%)]"></div>
        
        <div className="max-w-[1320px] mx-auto px-5 md:px-8 xl:px-10 w-full relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            
            {/* Left Content */}
            <div className="text-center lg:text-left flex-1 animate-[fadeInUp_0.8s_ease-out]">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-bmw-blue-subtle border border-border-accent text-[0.8125rem] font-medium text-bmw-blue-light mb-6 animate-[fadeInDown_0.6s_ease-out_0.2s_both]">
                <span className="w-1.5 h-1.5 rounded-full bg-bmw-blue animate-pulse"></span>
                2026 Collection Available
              </div>
              <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-extrabold tracking-tight leading-tight mb-4 text-gradient">
                The Ultimate <br />
                <span className="text-white">Driving Machine</span>
              </h1>
              <p className="text-[clamp(1rem,2vw,1.25rem)] text-text-secondary max-w-[600px] mx-auto lg:mx-0 mb-10 leading-relaxed">
                Discover the perfect blend of performance, luxury, and innovation. Browse our latest lineup and find your next BMW.
              </p>
            </div>

            {/* Right Content - 3D Car */}
            <div className="flex-1 w-full h-[400px] lg:h-[500px] animate-[scaleIn_0.8s_ease-out]">
              <Car3DViewer color="#1B69D4" autoRotate={true} autoRotateSpeed={2} className="cursor-grab active:cursor-grabbing" />
            </div>

          </div>
        </div>
      </section>

      {/* Controls & Grid Section */}
      <section className="max-w-[1320px] mx-auto px-5 md:px-8 xl:px-10 pb-20">
        <div className="flex flex-col gap-5 mb-10 p-6 rounded-2xl glass-panel animate-[fadeIn_0.5s_ease-out]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <SearchBar />
            <FilterBar />
          </div>
        </div>

        {status === 'loading' && <Loader text="Loading showroom..." />}
        
        {status === 'succeeded' && paginatedCars.length === 0 && (
          <div className="text-center py-16 px-5 animate-[fadeIn_0.4s_ease-out]">
            <div className="text-5xl mb-4 opacity-50 flex justify-center"><SearchIcon size="48px" /></div>
            <h3 className="text-xl font-semibold mb-2">No models found</h3>
            <p className="text-[0.9375rem] text-text-secondary">Try adjusting your search or filters to find what you're looking for.</p>
          </div>
        )}

        {status === 'succeeded' && paginatedCars.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {paginatedCars.map(car => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
            <Pagination />
          </>
        )}

        {status === 'failed' && (
          <div className="text-center py-16 px-5 animate-[fadeIn_0.4s_ease-out]">
            <div className="text-5xl mb-4 flex justify-center text-red-500"><ErrorCircleIcon size="48px" /></div>
            <h3 className="text-lg text-text-secondary mb-5">Failed to load showroom data.</h3>
            <button className="btn btn--primary" onClick={() => dispatch(fetchCars())}>Try Again</button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
