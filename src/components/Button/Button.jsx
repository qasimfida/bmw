import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  icon,
  as: Component = 'button',
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center gap-2 rounded-lg font-semibold border-none cursor-pointer transition-all duration-150 leading-tight whitespace-nowrap decoration-none";
  
  const variants = {
    primary: "bg-gradient-to-br from-bmw-blue to-bmw-blue-light text-white shadow-[0_2px_10px_rgba(27,105,212,0.3)] hover:shadow-[0_4px_20px_rgba(27,105,212,0.5)] hover:-translate-y-px active:translate-y-0",
    secondary: "glass-panel text-text-primary hover:border-border-accent hover:bg-white/10",
    ghost: "bg-transparent text-text-secondary hover:text-text-primary hover:bg-white/10 px-3 py-2",
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-[0.8125rem]",
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3.5 text-base",
  };

  const classes = `${baseStyles} ${variants[variant]} ${variant !== 'ghost' ? sizes[size] : ''} ${className}`;

  return (
    <Component className={classes} {...props}>
      {icon && <span>{icon}</span>}
      {children}
    </Component>
  );
};

export default Button;
