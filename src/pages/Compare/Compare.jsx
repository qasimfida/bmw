import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectCompareList, removeFromCompare } from '../../features/compare/compareSlice';
import Car3DViewer from '../../components/Car3DViewer/Car3DViewer';
import Button from '../../components/Button/Button';
import { ChartBubbleIcon, AddIcon } from 'tdesign-icons-react';

const Compare = () => {
  const compareList = useSelector(selectCompareList);
  const dispatch = useDispatch();

  const handleRemove = (id) => {
    dispatch(removeFromCompare(id));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);
  };

  if (compareList.length === 0) {
    return (
      <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-16 animate-[fadeIn_0.4s_ease-out]">
        <div className="text-center py-20 px-5 max-w-md mx-auto">
          <div className="text-4xl mb-4 opacity-25 flex justify-center text-text-muted"><ChartBubbleIcon size="48px" /></div>
          <h2 className="text-base font-semibold text-text-primary mb-2">No vehicles in comparison</h2>
          <p className="text-xs text-text-muted mb-6 leading-relaxed">Select up to 2 vehicles from the showroom to compare specifications side-by-side.</p>
          <Button as={Link} to="/" variant="primary" size="md">Browse Showroom</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-10 pb-20 animate-[fadeIn_0.4s_ease-out]">
      <div className="mb-8">
        <h1 className="text-[clamp(1.5rem,3vw,2rem)] font-bold tracking-tight mb-1 text-text-primary">Side-by-Side Comparison</h1>
        <p className="text-xs text-text-muted">Technical telemetry and performance benchmarks</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        {compareList.map((car, index) => (
          <div key={car.id} className="bg-bg-card/70 rounded-2xl border border-border-subtle overflow-hidden animate-[fadeInUp_0.4s_ease-out]" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="h-[260px] relative bg-bg-secondary/50">
              <Car3DViewer color={car.colors[0]} autoRotate={true} modelType={car.modelType || (car.series.toLowerCase() === 'ferrari' ? 'ferrari' : 'bmw')} />
            </div>
            <div className="p-5 flex items-center justify-between">
              <div>
                <span className="text-[0.7rem] uppercase tracking-wider text-accent-light font-mono block mb-1">{car.series}</span>
                <h2 className="text-lg font-bold text-text-primary">{car.model}</h2>
              </div>
              <button 
                className="text-xs text-text-muted hover:text-red-400 transition-colors px-3 py-1.5 rounded bg-white/[0.03] hover:bg-red-500/10 cursor-pointer"
                onClick={() => handleRemove(car.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}

        {compareList.length === 1 && (
          <div className="bg-bg-card/30 rounded-2xl border border-dashed border-border-subtle flex flex-col items-center justify-center min-h-[260px] p-6 text-center">
            <div className="text-2xl mb-3 opacity-30 flex justify-center text-text-muted"><AddIcon size="32px" /></div>
            <h3 className="text-sm font-medium text-text-secondary mb-3">Add a second vehicle</h3>
            <Button as={Link} to="/" variant="secondary" size="sm">Select Model</Button>
          </div>
        )}
      </div>

      {compareList.length > 0 && (
        <div className="rounded-xl overflow-hidden border border-border-subtle bg-bg-card/50">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-border-subtle bg-bg-elevated/40">
                  <th className="p-4 text-[0.75rem] font-semibold text-text-muted uppercase tracking-wider">Specification</th>
                  {compareList.map(car => (
                    <th key={`th-${car.id}`} className="p-4 text-[0.75rem] font-semibold text-text-primary uppercase tracking-wider min-w-[140px]">{car.model}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle text-xs">
                {[
                  { label: 'Starting MSRP', key: 'price', format: formatPrice, highlight: true },
                  { label: 'Body Type', key: 'bodyType' },
                  { label: 'Fuel Type', key: 'fuelType' },
                  { label: 'Horsepower', key: 'horsepower', suffix: ' hp' },
                  { label: 'Torque', key: 'torque', suffix: ' lb-ft' },
                  { label: '0-60 MPH', key: 'acceleration', suffix: ' sec' },
                  { label: 'Top Speed', key: 'topSpeed', suffix: ' mph' },
                ].map((row) => (
                  <tr key={row.label} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 font-medium text-text-secondary">{row.label}</td>
                    {compareList.map(car => (
                      <td key={`${row.label}-${car.id}`} className={`p-4 font-medium ${row.highlight ? 'text-accent-light font-bold text-sm' : 'text-text-primary'}`}>
                        {row.format ? row.format(car[row.key]) : car[row.key]}{row.suffix || ''}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Compare;
