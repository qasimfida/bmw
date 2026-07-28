import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setBgLightColor, selectBgLightColor } from '../../features/cars/carsSlice';
import { CheckIcon } from 'tdesign-icons-react';

const bgColors = ['transparent', '#2de8cd', '#ff4d4d', '#4da6ff', '#ffb84d', '#b366ff', '#ffffff'];

const BgColorPicker = () => {
  const dispatch = useDispatch();
  const selectedColor = useSelector(selectBgLightColor);

  return (
    <div className="p-6 rounded-2xl bg-bg-card border border-border-subtle mt-4">
      <h3 className="text-base font-bold mb-1">Background Light</h3>
      <p className="text-[0.8125rem] text-text-muted mb-4">Set the studio environment</p>
      
      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap gap-3">
          {bgColors.map((color) => (
            <button
              key={color}
              className={`flex items-center justify-center w-11 h-11 rounded-full border-2 cursor-pointer transition-all duration-150 relative hover:scale-110 ${
                selectedColor === color 
                  ? 'border-bmw-blue-light shadow-[0_0_0_3px_var(--color-bmw-blue-glow)] animate-pulse-glow text-white drop-shadow-md' 
                  : 'border-transparent text-transparent'
              }`}
              style={{ backgroundColor: color }}
              onClick={() => dispatch(setBgLightColor(color))}
              aria-label={`Select background color ${color}`}
              title={`Select background color ${color}`}
            >
              {selectedColor === color && <CheckIcon size="20px" />}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-2 border-t border-border-subtle pt-4 mt-1">
          <label className="text-[0.8125rem] text-text-secondary font-medium">Custom Color Code</label>
          <div className="flex items-center gap-3">
            <div className="relative flex items-center">
              <span className="absolute left-3 text-text-muted text-sm font-semibold pointer-events-none">#</span>
              <input 
                type="text" 
                value={selectedColor.replace('#', '')} 
                onChange={(e) => dispatch(setBgLightColor(`#${e.target.value.replace('#', '')}`))} 
                maxLength={6}
                placeholder="HEXCODE"
                className="w-28 pl-7 pr-3 py-2 rounded-lg bg-bg-secondary border border-border-subtle text-sm text-text-primary outline-none focus:border-bmw-blue focus:shadow-[0_0_0_2px_var(--color-bmw-blue-glow)] transition-all"
              />
            </div>
            <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-border-subtle hover:border-bmw-blue transition-colors">
              <input
                type="color"
                value={selectedColor}
                onChange={(e) => dispatch(setBgLightColor(e.target.value))}
                className="absolute -inset-2 w-14 h-14 cursor-pointer"
                title="Choose custom color"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BgColorPicker;
