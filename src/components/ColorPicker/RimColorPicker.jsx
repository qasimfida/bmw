import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setRimColor, selectRimColor } from '../../features/cars/carsSlice';
import { CheckIcon } from 'tdesign-icons-react';

const rimColors = ['#e0e0e0', '#333333', '#111111', '#b8860b', '#8c2424', '#ffffff'];

const RimColorPicker = () => {
  const dispatch = useDispatch();
  const selectedColor = useSelector(selectRimColor);

  return (
    <div className="p-6 rounded-2xl bg-bg-card border border-border-subtle mt-4">
      <h3 className="text-base font-bold mb-1">Wheel Rims</h3>
      <p className="text-[0.8125rem] text-text-muted mb-4">Choose your wheel finish</p>
      
      <div className="flex flex-wrap gap-3">
        {rimColors.map((color) => (
          <button
            key={color}
            className={`flex items-center justify-center w-11 h-11 rounded-full border-2 cursor-pointer transition-all duration-150 relative hover:scale-110 ${
              selectedColor === color 
                ? 'border-bmw-blue-light shadow-[0_0_0_3px_var(--color-bmw-blue-glow)] animate-pulse-glow text-white drop-shadow-md' 
                : 'border-transparent text-transparent'
            }`}
            style={{ backgroundColor: color }}
            onClick={() => dispatch(setRimColor(color))}
            aria-label={`Select rim color ${color}`}
            title={`Select rim color ${color}`}
          >
            {selectedColor === color && <CheckIcon size="20px" />}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RimColorPicker;
