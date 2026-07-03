import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedColor, selectSelectedColor } from '../../features/cars/carsSlice';

import { CheckIcon } from 'tdesign-icons-react';

const ColorPicker = ({ colors }) => {
  const dispatch = useDispatch();
  const selectedColor = useSelector(selectSelectedColor);

  React.useEffect(() => {
    if (!selectedColor && colors && colors.length > 0) {
      dispatch(setSelectedColor(colors[0]));
    }
  }, [colors, selectedColor, dispatch]);

  if (!colors || colors.length === 0) return null;

  return (
    <div className="p-6 rounded-2xl bg-bg-card border border-border-subtle">
      <h3 className="text-base font-bold mb-1">Exterior Color</h3>
      <p className="text-[0.8125rem] text-text-muted mb-4">Customize your finish</p>
      
      <div className="flex flex-wrap gap-3">
        {colors.map((color) => (
          <button
            key={color}
            className={`flex items-center justify-center w-11 h-11 rounded-full border-2 cursor-pointer transition-all duration-150 relative hover:scale-110 ${
              selectedColor === color 
                ? 'border-bmw-blue-light shadow-[0_0_0_3px_var(--color-bmw-blue-glow)] animate-pulse-glow text-white drop-shadow-md' 
                : 'border-transparent text-transparent'
            }`}
            style={{ backgroundColor: color }}
            onClick={() => dispatch(setSelectedColor(color))}
            aria-label={`Select color ${color}`}
            title={`Select color ${color}`}
          >
            {selectedColor === color && <CheckIcon size="20px" />}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ColorPicker;
