import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setRimColor, selectRimColor } from '../../features/cars/carsSlice';
import { CheckIcon } from 'tdesign-icons-react';

const rimColors = [
  { id: '#e0e0e0', label: 'Silver' },
  { id: '#333333', label: 'Anthracite' },
  { id: '#111111', label: 'Jet Black' },
  { id: '#b8860b', label: 'Frozen Gold' },
  { id: '#8c2424', label: 'M Red' },
  { id: '#ffffff', label: 'Pure White' },
];

const RimColorPicker = () => {
  const dispatch = useDispatch();
  const selectedColor = useSelector(selectRimColor);

  return (
    <div className="p-5 rounded-xl bg-bg-card/70 border border-border-subtle backdrop-blur-md mt-3">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-text-primary">Forged Wheel Rims</h3>
          <p className="text-[0.75rem] text-text-muted">M Performance alloy styling</p>
        </div>
        <span className="text-[0.7rem] font-mono uppercase text-accent-light px-2 py-0.5 rounded bg-accent/10 border border-accent/20">
          {rimColors.find(r => r.id.toLowerCase() === selectedColor?.toLowerCase())?.label || selectedColor}
        </span>
      </div>
      
      <div className="flex flex-wrap gap-2.5">
        {rimColors.map(({ id: color, label }) => (
          <button
            key={color}
            className={`flex items-center justify-center w-8 h-8 rounded-full cursor-pointer transition-all duration-200 relative ${
              selectedColor?.toLowerCase() === color.toLowerCase()
                ? 'ring-2 ring-accent ring-offset-2 ring-offset-bg-primary scale-110 shadow-[0_0_12px_rgba(37,99,235,0.4)] text-white' 
                : 'hover:scale-105 border border-white/10 text-transparent opacity-80 hover:opacity-100'
            }`}
            style={{ backgroundColor: color }}
            onClick={() => dispatch(setRimColor(color))}
            aria-label={`Select rim color ${label}`}
            title={`Select rim color ${label}`}
          >
            {selectedColor?.toLowerCase() === color.toLowerCase() && <CheckIcon size="14px" />}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RimColorPicker;
