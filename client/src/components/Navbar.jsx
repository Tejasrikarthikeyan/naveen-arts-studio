import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Palette, ShoppingCart, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="container nav-content">
        <Link to="/" className="nav-logo" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Palette size={24} />
          Naveen Ink Studio
        </Link>
        
        <button className="mobile-menu-btn" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className={`nav-links ${isOpen ? 'mobile-open' : ''}`}>
          <Link to="/" className="nav-link" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/about" className="nav-link" onClick={() => setIsOpen(false)}>About</Link>
          <Link to="/shop" className="nav-link" onClick={() => setIsOpen(false)}>Art Shop</Link>
          <Link to="/commission" className="nav-link" style={{ color: 'var(--accent)' }} onClick={() => setIsOpen(false)}>Custom Drawing</Link>
          <Link to="/cart" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} onClick={() => setIsOpen(false)}>
            <ShoppingCart size={20} />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
