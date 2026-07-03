import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCompare, removeFromCompare, selectIsInCompare, selectCompareList } from '../../features/compare/compareSlice';
import Button from '../Button/Button';
import { CheckIcon, AddIcon } from 'tdesign-icons-react';

const CarCard = ({ car }) => {
  const dispatch = useDispatch();
  const isInCompare = useSelector(selectIsInCompare(car.id));
  const compareList = useSelector(selectCompareList);

  const handleCompareClick = (e) => {
    e.preventDefault(); 
    if (isInCompare) {
      dispatch(removeFromCompare(car.id));
    } else {
      if (compareList.length < 2) {
        dispatch(addToCompare(car));
      } else {
        alert("You can only compare up to 2 cars at a time.");
      }
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);
  };

  const getFuelTypeBadgeClass = (type) => {
    switch (type.toLowerCase()) {
      case 'electric': return 'bg-indigo-500/85 text-white';
      case 'hybrid': return 'bg-amber-500/85 text-white';
      default: return 'bg-emerald-500/85 text-white';
    }
  };

  return (
    <div className="group relative bg-bg-card rounded-2xl border border-border-subtle overflow-hidden transition-all duration-250 animate-[fadeInUp_0.5s_ease-out_both] hover:-translate-y-1.5 hover:border-border-accent hover:shadow-[0_8px_40px_rgba(0,0,0,0.5),0_0_40px_rgba(27,105,212,0.1)]">
      <Link to={`/car/${car.id}`} className="absolute inset-0 z-0" aria-label={`View details for ${car.model}`}></Link>
      
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-bg-secondary to-bg-elevated">
        <img src={car.image} alt={car.model} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
        
        <div className="absolute top-3 left-3 flex gap-1.5 z-10">
          <span className="px-2.5 py-1 rounded-full text-[0.7rem] font-semibold uppercase tracking-wider backdrop-blur-md bg-bmw-blue/85 text-white">
            {car.series}
          </span>
          <span className={`px-2.5 py-1 rounded-full text-[0.7rem] font-semibold uppercase tracking-wider backdrop-blur-md ${getFuelTypeBadgeClass(car.fuelType)}`}>
            {car.fuelType}
          </span>
        </div>

        <button 
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md border text-base transition-all duration-150 z-20 ${
            isInCompare 
              ? 'bg-bmw-blue text-white border-bmw-blue' 
              : 'bg-black/50 text-text-secondary border-white/15 hover:bg-bmw-blue hover:text-white hover:border-bmw-blue hover:scale-110'
          }`}
          onClick={handleCompareClick}
          title={isInCompare ? "Remove from Compare" : "Add to Compare"}
        >
          {isInCompare ? <CheckIcon /> : <AddIcon />}
        </button>
      </div>

      <div className="p-5 relative z-10">
        <h3 className="text-[1.125rem] font-bold mb-1 tracking-tight">{car.model}</h3>
        <p className="text-[0.8125rem] text-text-muted mb-3">{car.year} • {car.bodyType}</p>

        <div className="flex gap-4 mb-4 pb-4 border-b border-border-subtle">
          <div className="flex flex-col gap-0.5">
            <span className="text-[0.9375rem] font-semibold text-text-primary">{car.horsepower}</span>
            <span className="text-[0.7rem] text-text-muted uppercase tracking-wider">HP</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[0.9375rem] font-semibold text-text-primary">{car.acceleration}s</span>
            <span className="text-[0.7rem] text-text-muted uppercase tracking-wider">0-60 MPH</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="block text-[0.875rem] font-medium text-text-muted">Starting at</span>
            <span className="text-xl font-extrabold text-text-primary">{formatPrice(car.price)}</span>
          </div>
          
          <Button variant="primary" size="sm" as={Link} to={`/car/${car.id}`} className="relative z-20">
            Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
