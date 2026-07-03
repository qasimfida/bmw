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
      <div className="max-w-[1320px] mx-auto px-5 md:px-8 xl:px-10 py-10 pb-16 animate-[fadeIn_0.4s_ease-out]">
        <div className="text-center py-20 px-5 animate-[fadeInUp_0.5s_ease-out]">
          <div className="text-[4rem] mb-4 opacity-50 flex justify-center"><ChartBubbleIcon size="64px" /></div>
          <h2 className="text-[1.125rem] text-text-secondary mb-2">No vehicles selected for comparison.</h2>
          <p className="text-[0.875rem] text-text-muted mb-6">Browse the showroom and select up to 2 vehicles to compare them side-by-side.</p>
          <Button as={Link} to="/" variant="primary" className="mt-5">Go to Showroom</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1320px] mx-auto px-5 md:px-8 xl:px-10 py-10 pb-16 animate-[fadeIn_0.4s_ease-out]">
      <h1 className="text-[clamp(1.5rem,3vw,2rem)] font-extrabold tracking-tight mb-2">Compare Vehicles</h1>
      <p className="text-base text-text-secondary mb-10">Side-by-side spec comparison</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {compareList.map((car, index) => (
          <div key={car.id} className="bg-bg-card rounded-2xl border border-border-subtle overflow-hidden animate-[fadeInUp_0.5s_ease-out]" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="h-[280px] relative">
              <Car3DViewer color={car.colors[0]} autoRotate={true} />
            </div>
            <div className="p-6">
              <span className="text-[0.875rem] text-bmw-blue-light mb-4 block">{car.series}</span>
              <h2 className="text-xl font-bold mb-1">{car.model}</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-4 -ml-3"
                onClick={() => handleRemove(car.id)}
              >
                Remove from compare
              </Button>
            </div>
          </div>
        ))}

        {compareList.length === 1 && (
          <div className="bg-bg-card rounded-2xl border border-dashed border-border-subtle flex flex-col items-center justify-center min-h-[300px] p-6 animate-[fadeInUp_0.5s_ease-out_0.1s]">
            <div className="text-[2rem] mb-4 opacity-50 flex justify-center"><AddIcon size="48px" /></div>
            <h3 className="mb-4 text-lg font-semibold">Add a second vehicle</h3>
            <Button as={Link} to="/" variant="secondary">Browse Models</Button>
          </div>
        )}
      </div>

      {compareList.length > 0 && (
        <div className="mt-10 rounded-2xl overflow-hidden border border-border-subtle animate-[fadeInUp_0.5s_ease-out_0.2s_both]">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-4 md:px-6 bg-bg-elevated text-[0.8125rem] font-semibold text-text-muted uppercase tracking-wider text-left border-b border-border-subtle">Specification</th>
                  {compareList.map(car => (
                    <th key={`th-${car.id}`} className="p-4 md:px-6 bg-bg-elevated text-[0.8125rem] font-semibold text-text-muted uppercase tracking-wider text-left border-b border-border-subtle min-w-[150px]">{car.model}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-bg-card">
                {[
                  { label: 'Starting MSRP', key: 'price', format: formatPrice, highlight: true },
                  { label: 'Body Type', key: 'bodyType' },
                  { label: 'Fuel Type', key: 'fuelType' },
                  { label: 'Horsepower', key: 'horsepower', suffix: ' hp' },
                  { label: 'Torque', key: 'torque', suffix: ' lb-ft' },
                  { label: '0-60 MPH', key: 'acceleration', suffix: ' sec' },
                  { label: 'Top Speed', key: 'topSpeed', suffix: ' mph' },
                ].map((row, i, arr) => (
                  <tr key={row.label}>
                    <td className={`p-4 md:px-6 text-[0.9375rem] font-medium ${i !== arr.length - 1 ? 'border-b border-border-subtle' : ''}`}>{row.label}</td>
                    {compareList.map(car => (
                      <td key={`${row.label}-${car.id}`} className={`p-4 md:px-6 text-[0.9375rem] font-medium ${i !== arr.length - 1 ? 'border-b border-border-subtle' : ''} ${row.highlight ? 'text-bmw-blue-light font-bold' : ''}`}>
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
