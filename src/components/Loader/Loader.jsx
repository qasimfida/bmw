import React from 'react';

const Loader = ({ text = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-5 gap-5 animate-[fadeIn_0.3s_ease-out]">
      <div className="w-8 h-8 rounded-full border-2 border-border-light border-t-accent animate-[spin_0.7s_linear_infinite]"></div>
      <div className="text-[0.8125rem] text-text-muted">{text}</div>
    </div>
  );
};

export default Loader;
