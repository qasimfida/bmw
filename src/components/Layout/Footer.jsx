import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-white/[0.06] py-10 bg-[#050507] text-text-secondary">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={scrollToTop}>
          <div className="w-7 h-7 rounded-full border border-white/20 p-0.5 flex items-center justify-center bg-white/[0.03]">
            <img 
              src="/logo.png" 
              alt="BMW Logo" 
              className="w-full h-full object-contain" 
              onError={(e) => { 
                e.target.onerror = null; 
                e.target.style.display = 'none'; 
              }} 
            />
          </div>
          <span className="font-extrabold text-base tracking-[0.2em] text-white uppercase">
            MACHINE
          </span>
        </div>

        {/* Center: Clean Navigation Links & Newsletter */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 flex-1">
          <div className="flex flex-wrap items-center justify-center gap-8 text-[0.8125rem] font-medium tracking-wider uppercase text-text-muted">
            <a href="/#showroom-section" className="hover:text-white transition-colors">Models</a>
            <a href="/#tech-section" className="hover:text-white transition-colors">Technology</a>
            <a href="/#experience-section" className="hover:text-white transition-colors">Experience</a>
            <Link to="/compare" className="hover:text-white transition-colors">Compare</Link>
          </div>
          
          <div className="flex items-center gap-3">
            <input type="email" placeholder="Subscribe to Newsletter" className="bg-[#0f0f13] border border-white/10 text-white text-xs px-4 py-2 rounded-full focus:outline-none focus:border-accent w-[200px]" />
            <button className="bg-accent hover:bg-accent-dark text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer">
              Join
            </button>
          </div>
        </div>

        {/* Right: Social Icons */}
        <div className="flex items-center gap-4 text-xs">
          <span className="text-text-muted text-[0.75rem] uppercase tracking-wider">Follow Us</span>
          <div className="flex items-center gap-3 text-text-secondary">
            {/* Instagram */}
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:border-accent hover:text-white transition-colors">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            {/* YouTube */}
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:border-accent hover:text-white transition-colors">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
            {/* Facebook */}
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:border-accent hover:text-white transition-colors">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.667 5H18V0h-3.889C10.667 0 9 1.667 9 4.667V8z"/>
              </svg>
            </a>
          </div>
        </div>

      </div>
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 mt-8 pt-6 border-t border-white/[0.04] flex flex-col md:flex-row items-center justify-between text-[0.65rem] text-text-muted">
        <p>&copy; {new Date().getFullYear()} Machine Motors. All rights reserved.</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Legal</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
