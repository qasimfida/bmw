import React from 'react';

const Footer = () => {
  return (
    <footer className="border-t border-border-subtle py-8 mt-auto bg-bg-secondary">
      <div className="max-w-[1320px] mx-auto px-5 md:px-8 xl:px-10 flex flex-wrap items-center justify-between gap-4">
        <div className="text-[0.8125rem] text-text-muted">
          &copy; {new Date().getFullYear()} <span className="text-bmw-blue-light font-semibold">BMW Showroom</span>. All rights reserved.
        </div>
        <div className="flex gap-5">
          <a href="#" className="text-[0.8125rem] text-text-muted hover:text-text-primary transition-colors duration-150">Privacy Policy</a>
          <a href="#" className="text-[0.8125rem] text-text-muted hover:text-text-primary transition-colors duration-150">Terms of Service</a>
          <a href="#" className="text-[0.8125rem] text-text-muted hover:text-text-primary transition-colors duration-150">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
