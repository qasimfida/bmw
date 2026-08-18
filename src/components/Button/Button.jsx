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
  const baseStyles = "inline-flex items-center justify-center gap-2 rounded-lg font-medium border cursor-pointer transition-all duration-200 leading-tight whitespace-nowrap decoration-none active:scale-[0.97]";
  
  const variants = {
    primary: "bg-accent text-white border-accent/80 hover:bg-accent-dark shadow-sm",
    secondary: "bg-transparent text-text-primary border-border-light hover:border-text-muted hover:bg-white/[0.04]",
    ghost: "bg-transparent border-transparent text-text-secondary hover:text-text-primary",
  };
  
  const sizes = {
    sm: "px-3.5 py-1.5 text-[0.8rem]",
    md: "px-5 py-2.5 text-[0.8125rem]",
    lg: "px-7 py-3 text-[0.875rem]",
  };

  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <Component className={classes} {...props}>
      {icon && <span className="flex items-center">{icon}</span>}
      {children}
    </Component>
  );
};

export default Button;
