import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectCarById, fetchCars, selectCarsStatus, selectSelectedColor, selectBgLightColor, selectRimColor } from '../../features/cars/carsSlice';
import Car3DViewer from '../../components/Car3DViewer/Car3DViewer';
import ColorPicker from '../../components/ColorPicker/ColorPicker';
import SecondaryColorPicker from '../../components/ColorPicker/SecondaryColorPicker';
import BgColorPicker from '../../components/ColorPicker/BgColorPicker';
import RimColorPicker from '../../components/ColorPicker/RimColorPicker';
import Loader from '../../components/Loader/Loader';
import { LightingCircleIcon, SettingIcon, TimeIcon, DashboardIcon } from 'tdesign-icons-react';

const CarDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const status = useSelector(selectCarsStatus);
  const car = useSelector(selectCarById(id));
  const selectedColor = useSelector(selectSelectedColor);
  const secondaryColor = useSelector(state => state.cars.secondaryColor);
  const bgLightColor = useSelector(selectBgLightColor);
  const rimColor = useSelector(selectRimColor);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCars());
    }
  }, [status, dispatch]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);
  };

  if (status === 'loading' || status === 'idle') {
    return <Loader text="Loading vehicle details..." />;
  }

  if (!car) {
    return (
      <div className="max-w-[1320px] mx-auto px-5 md:px-8 xl:px-10 text-center py-[100px] animate-[fadeIn_0.4s_ease-out]">
        <h2 className="text-[1.125rem] text-text-secondary mb-5">Vehicle not found</h2>
        <Link to="/" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg font-semibold bg-gradient-to-br from-bmw-blue to-bmw-blue-light text-white shadow-[0_2px_10px_rgba(27,105,212,0.3)] transition-all hover:shadow-[0_4px_20px_rgba(27,105,212,0.5)] hover:-translate-y-px">Back to Showroom</Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1320px] mx-auto px-5 md:px-8 xl:px-10 py-10 pb-16 animate-[fadeIn_0.4s_ease-out]">
      <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-text-secondary text-[0.875rem] font-medium mb-8 transition-all duration-150 border border-transparent hover:text-text-primary hover:bg-white/5 hover:border-border-light">
        <span>←</span> Back to Showroom
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-10 lg:gap-12">
        <div className="w-full">
          <div className="relative rounded-2xl overflow-hidden bg-bg-card border border-border-subtle min-h-[400px] lg:min-h-[500px] lg:sticky lg:top-[92px] animate-[scaleIn_0.5s_ease-out]">
            <Car3DViewer className="absolute inset-0" color={selectedColor || car.colors[0]} secondaryColor={secondaryColor} bgLightColor={bgLightColor} rimColor={rimColor} autoRotate={true} modelType={car.series.toLowerCase() === 'ferrari' ? 'ferrari' : 'bmw'} />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-[0.75rem] text-text-secondary z-10 pointer-events-none animate-[fadeIn_1s_ease-out_1s_both]">
              Drag to rotate • Scroll to zoom
            </div>
          </div>
        </div>

        <div className="animate-[slideInRight_0.6s_ease-out]">
          <span className="inline-block px-3 py-1 rounded-full bg-bmw-blue-subtle border border-border-accent text-[0.8125rem] font-semibold text-bmw-blue-light mb-3">
            {car.series}
          </span>
          <h1 className="text-[clamp(1.75rem,4vw,2.5rem)] font-extrabold tracking-tight leading-tight mb-2">{car.model}</h1>
          <p className="text-base text-text-secondary mb-6">{car.year} • {car.bodyType}</p>
          
          <div className="text-[2rem] font-extrabold mb-8 text-gradient">
            {formatPrice(car.price)}
            <span className="block text-[0.8125rem] font-medium text-text-muted mt-1" style={{WebkitTextFillColor: 'var(--color-text-muted)'}}>Starting MSRP</span>
          </div>

          <p className="text-base text-text-secondary leading-relaxed mb-8">{car.description}</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-9">
            <div className="p-4 rounded-xl bg-bg-card border border-border-subtle text-center transition-all duration-150 hover:border-border-accent hover:-translate-y-0.5">
              <div className="text-2xl mb-2 flex justify-center text-bmw-blue-light"><LightingCircleIcon /></div>
              <div className="text-xl font-bold mb-0.5">{car.horsepower}</div>
              <div className="text-[0.75rem] text-text-muted uppercase tracking-wider">Horsepower</div>
            </div>
            <div className="p-4 rounded-xl bg-bg-card border border-border-subtle text-center transition-all duration-150 hover:border-border-accent hover:-translate-y-0.5">
              <div className="text-2xl mb-2 flex justify-center text-bmw-blue-light"><SettingIcon /></div>
              <div className="text-xl font-bold mb-0.5">{car.torque}</div>
              <div className="text-[0.75rem] text-text-muted uppercase tracking-wider">lb-ft Torque</div>
            </div>
            <div className="p-4 rounded-xl bg-bg-card border border-border-subtle text-center transition-all duration-150 hover:border-border-accent hover:-translate-y-0.5">
              <div className="text-2xl mb-2 flex justify-center text-bmw-blue-light"><TimeIcon /></div>
              <div className="text-xl font-bold mb-0.5">{car.acceleration}s</div>
              <div className="text-[0.75rem] text-text-muted uppercase tracking-wider">0-60 MPH</div>
            </div>
            <div className="p-4 rounded-xl bg-bg-card border border-border-subtle text-center transition-all duration-150 hover:border-border-accent hover:-translate-y-0.5">
              <div className="text-2xl mb-2 flex justify-center text-bmw-blue-light"><DashboardIcon /></div>
              <div className="text-xl font-bold mb-0.5">{car.topSpeed}</div>
              <div className="text-[0.75rem] text-text-muted uppercase tracking-wider">Top Speed (MPH)</div>
            </div>
          </div>

          <ColorPicker colors={car.colors} />
          {car.series.toLowerCase() !== 'ferrari' && <SecondaryColorPicker colors={car.colors} />}
          <RimColorPicker />
          <BgColorPicker />
        </div>
      </div>
    </div>
  );
};

export default CarDetails;
