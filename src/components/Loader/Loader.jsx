import React from 'react';

const Loader = ({ text = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-5 gap-6 animate-[fadeIn_0.3s_ease-out]">
      <div className="w-12 h-12 rounded-full border-[3px] border-border-subtle border-t-bmw-blue animate-[spin_0.8s_linear_infinite]"></div>
      <div className="text-[0.9375rem] text-text-muted">{text}</div>
    </div>
  );
};

export default Loader;
