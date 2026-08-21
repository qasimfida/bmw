import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
      case 'electric': return 'bg-indigo-500/20 text-indigo-300';
      case 'hybrid': return 'bg-amber-500/20 text-amber-300';
      default: return 'bg-emerald-500/15 text-emerald-400';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 100, damping: 20 }}
      className="group relative bg-bg-card rounded-2xl border border-border-subtle overflow-hidden transition-all duration-300 hover:border-border-light hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
    >
      <Link to={`/model/${car.id}`} className="absolute inset-0 z-0" aria-label={`View details for ${car.model}`}></Link>
      
      <div className="relative aspect-[16/10] overflow-hidden bg-bg-secondary">
        <img src={car.image} alt={car.model} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" loading="lazy" />
        
        <div className="absolute top-3 left-3 flex gap-1.5 z-10">
          <span className="px-2 py-0.5 rounded-md text-[0.65rem] font-semibold uppercase tracking-wider bg-white/10 backdrop-blur-sm text-white/90">
            {car.series}
          </span>
          <span className={`px-2 py-0.5 rounded-md text-[0.65rem] font-semibold uppercase tracking-wider ${getFuelTypeBadgeClass(car.fuelType)}`}>
            {car.fuelType}
          </span>
        </div>

        <button 
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm border text-sm transition-all duration-200 z-20 ${
            isInCompare 
              ? 'bg-accent text-white border-accent' 
              : 'bg-black/40 text-white/60 border-white/10 hover:bg-accent hover:text-white hover:border-accent'
          }`}
          onClick={handleCompareClick}
          title={isInCompare ? "Remove from Compare" : "Add to Compare"}
        >
          {isInCompare ? <CheckIcon size="14px" /> : <AddIcon size="14px" />}
        </button>
      </div>

      <div className="p-5 relative z-10">
        <h3 className="text-[1rem] font-semibold mb-1 tracking-tight text-text-primary">{car.model}</h3>
        <p className="text-[0.75rem] text-text-muted mb-4">{car.year} · {car.bodyType}</p>

        <div className="flex gap-5 mb-4 pb-4 border-b border-border-subtle">
          <div className="flex flex-col">
            <span className="text-[0.875rem] font-semibold text-text-primary">{car.horsepower}</span>
            <span className="text-[0.65rem] text-text-muted uppercase tracking-wider mt-0.5">HP</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[0.875rem] font-semibold text-text-primary">{car.acceleration}s</span>
            <span className="text-[0.65rem] text-text-muted uppercase tracking-wider mt-0.5">0-60</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[0.875rem] font-semibold text-text-primary">{car.topSpeed}</span>
            <span className="text-[0.65rem] text-text-muted uppercase tracking-wider mt-0.5">MPH</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="block text-[0.7rem] text-text-muted mb-0.5">From</span>
            <span className="text-lg font-bold text-text-primary">{formatPrice(car.price)}</span>
          </div>
          
          <Button variant="secondary" size="sm" as={Link} to={`/model/${car.id}`} className="relative z-20">
            Explore
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default CarCard;
