import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setBgLightColor, selectBgLightColor } from '../../features/cars/carsSlice';
import { CheckIcon } from 'tdesign-icons-react';

const bgColors = [
  { id: 'transparent', label: 'Dark Studio', hex: '#0a0a0c' },
  { id: '#2de8cd', label: 'Cyber Teal', hex: '#2de8cd' },
  { id: '#ff4d4d', label: 'Crimson Red', hex: '#ff4d4d' },
  { id: '#4da6ff', label: 'M Blue', hex: '#4da6ff' },
  { id: '#ffb84d', label: 'Amber Gold', hex: '#ffb84d' },
  { id: '#b366ff', label: 'Electric Purple', hex: '#b366ff' },
  { id: '#ffffff', label: 'Clean White', hex: '#ffffff' },
];

const BgColorPicker = () => {
  const dispatch = useDispatch();
  const selectedColor = useSelector(selectBgLightColor);

  return (
    <div className="p-5 rounded-xl bg-bg-card/70 border border-border-subtle backdrop-blur-md mt-3">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-text-primary">Studio Ambient Lighting</h3>
          <p className="text-[0.75rem] text-text-muted">Floor reflection & volumetric key light</p>
        </div>
      </div>
      
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2.5">
          {bgColors.map(({ id: color, label, hex }) => (
            <button
              key={color}
              className={`flex items-center justify-center w-8 h-8 rounded-full cursor-pointer transition-all duration-200 relative ${
                selectedColor === color 
                  ? 'ring-2 ring-accent ring-offset-2 ring-offset-bg-primary scale-110 shadow-[0_0_12px_rgba(37,99,235,0.4)] text-white' 
                  : 'hover:scale-105 border border-white/10 text-transparent opacity-80 hover:opacity-100'
              }`}
              style={{ backgroundColor: hex }}
              onClick={() => dispatch(setBgLightColor(color))}
              aria-label={`Select background light ${label}`}
              title={label}
            >
              {selectedColor === color && <CheckIcon size="14px" className={color === '#ffffff' ? 'text-black' : 'text-white'} />}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-border-subtle pt-3 text-xs">
          <span className="text-text-muted text-[0.75rem]">Custom Hexcode</span>
          <div className="flex items-center gap-2">
            <div className="relative flex items-center">
              <span className="absolute left-2.5 text-text-muted text-xs pointer-events-none">#</span>
              <input 
                type="text" 
                value={selectedColor === 'transparent' ? '' : selectedColor.replace('#', '')} 
                onChange={(e) => dispatch(setBgLightColor(`#${e.target.value.replace('#', '')}`))} 
                maxLength={6}
                placeholder="000000"
                className="w-20 pl-6 pr-2 py-1 rounded bg-bg-input border border-border-subtle text-xs text-text-primary outline-none focus:border-accent/40 font-mono"
              />
            </div>
            <div className="relative w-7 h-7 rounded overflow-hidden border border-border-subtle cursor-pointer">
              <input
                type="color"
                value={selectedColor === 'transparent' ? '#000000' : selectedColor}
                onChange={(e) => dispatch(setBgLightColor(e.target.value))}
                className="absolute -inset-2 w-12 h-12 cursor-pointer"
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
