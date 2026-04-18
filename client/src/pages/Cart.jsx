import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import axios from 'axios';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(items);
  }, []);

  const removeFromCart = (indexToRemove) => {
    const newCart = cartItems.filter((_, index) => index !== indexToRemove);
    setCartItems(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('cart-updated'));
  };

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    setStatus('submitting');
    try {
      const orderData = {
        customerName: 'Guest User', // In real app, prompt for these or get from state
        customerEmail: 'guest@example.com',
        items: cartItems,
        total: total
      };
      await axios.post('http://localhost:5000/api/orders/shop', orderData);
      setStatus('success');
      setCartItems([]);
      localStorage.removeItem('cart');
      window.dispatchEvent(new Event('cart-updated'));
    } catch (error) {
      console.error('Checkout failed', error);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="container" style={{ textAlign: 'center', paddingTop: '6rem', minHeight: '60vh' }}>
        <h1 style={{ color: 'var(--accent)' }}>Order Placed!</h1>
        <p>Thank you for your purchase.</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem', minHeight: '70vh' }}>
      <h1 style={{ marginBottom: '2rem' }}>Your Cart</h1>
      
      {cartItems.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)' }}>Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-3" style={{ gap: '2rem' }}>
          <div style={{ gridColumn: 'span 2' }}>
            {cartItems.map((item, idx) => (
              <div key={idx} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1rem', padding: '1rem' }}>
                <img src={item.image} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
                <div style={{ flexGrow: 1 }}>
                  <h4>{item.name}</h4>
                  <p style={{ color: 'var(--text-secondary)' }}>${item.price}</p>
                </div>
                <button onClick={() => removeFromCart(idx)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
          
          <div>
            <div className="card">
              <h3 style={{ marginBottom: '1.5rem' }}>Order Summary</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span>Subtotal ({cartItems.length} items)</span>
                <span>${total}</span>
              </div>
              <hr style={{ borderColor: 'var(--border)', margin: '1rem 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', fontSize: '1.25rem', fontWeight: 'bold' }}>
                <span>Total</span>
                <span style={{ color: 'var(--accent)' }}>${total}</span>
              </div>
              <button onClick={handleCheckout} disabled={status === 'submitting'} className="btn-primary" style={{ width: '100%' }}>
                {status === 'submitting' ? 'Processing...' : 'Simulate Checkout'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
