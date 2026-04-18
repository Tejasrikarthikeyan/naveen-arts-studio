import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingCart } from 'lucide-react';

const Shop = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // In a real app, fetch from /api/products
    // For now, simulating some shop products
    setProducts([
      { _id: '1', name: 'Abstract Thoughts', price: 150, image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=500', description: 'Original abstract doodle' },
      { _id: '2', name: 'City Lights', price: 200, image: 'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=500', description: 'Acrylic cityscape' },
      { _id: '3', name: 'Serenity Sketch', price: 85, image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500', description: 'Charcoal pencil sketch' },
    ]);
  }, []);

  const addToCart = (product) => {
    const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
    const updatedCart = [...existingCart, product];
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    alert(`${product.name} added to cart!`);
    // In a real app, use Context/Redux to update the cart count globally
    window.dispatchEvent(new Event('cart-updated'));
  };

  return (
    <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '3rem' }}>Art Shop</h1>
      <div className="grid grid-cols-3">
        {products.map(product => (
          <div key={product._id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
            <img src={product.image} alt={product.name} style={{ width: '100%', height: '250px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{product.name}</h3>
            <p style={{ color: 'var(--text-secondary)', flexGrow: 1, marginBottom: '1rem' }}>{product.description}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--accent)' }}>${product.price}</span>
              <button onClick={() => addToCart(product)} className="btn-primary" style={{ padding: '0.5rem 1rem' }}>
                <ShoppingCart size={18} /> Add
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;
