import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSecondaryColor, selectSecondaryColor } from '../../features/cars/carsSlice';
import { CheckIcon } from 'tdesign-icons-react';

const SecondaryColorPicker = ({ colors }) => {
  const dispatch = useDispatch();
  const selectedColor = useSelector(selectSecondaryColor);

  if (!colors || colors.length === 0) return null;

  return (
    <div className="p-5 rounded-xl bg-bg-card/70 border border-border-subtle backdrop-blur-md mt-3">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-text-primary">Secondary Livery</h3>
          <p className="text-[0.75rem] text-text-muted">Aero panels & roof accents</p>
        </div>
        <span className="text-[0.7rem] font-mono uppercase text-accent-light px-2 py-0.5 rounded bg-accent/10 border border-accent/20">
          {selectedColor}
        </span>
      </div>
      
      <div className="flex flex-wrap gap-2.5">
        {colors.map((color) => (
          <button
            key={`sec-${color}`}
            className={`flex items-center justify-center w-8 h-8 rounded-full cursor-pointer transition-all duration-200 relative ${
              selectedColor === color 
                ? 'ring-2 ring-accent ring-offset-2 ring-offset-bg-primary scale-110 shadow-[0_0_12px_rgba(37,99,235,0.4)] text-white' 
                : 'hover:scale-105 border border-white/10 text-transparent opacity-80 hover:opacity-100'
            }`}
            style={{ backgroundColor: color }}
            onClick={() => dispatch(setSecondaryColor(color))}
            aria-label={`Select secondary color ${color}`}
            title={`Select secondary color ${color}`}
          >
            {selectedColor === color && <CheckIcon size="14px" />}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SecondaryColorPicker;
