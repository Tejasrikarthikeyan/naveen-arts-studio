import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrders, updateOrderStatus, updateAdminCredentials, deleteOrder } from '../api';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [updateMessage, setUpdateMessage] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchOrders();
  }, [token, navigate]);

  const fetchOrders = async () => {
    try {
      const data = await getOrders(token);
      setOrders(data);
    } catch (error) {
      console.error(error);
      if (error.error === 'Invalid Token' || error.error === 'Access Denied') {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateOrderStatus(id, newStatus, token);
      setOrders(orders.map(o => o._id === id ? { ...o, status: newStatus } : o));
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const handleDeleteOrder = async (id) => {
    if (!window.confirm('Are you sure you want to delete this request?')) return;
    try {
      await deleteOrder(id, token);
      setOrders(orders.filter(o => o._id !== id));
    } catch (error) {
      alert('Failed to delete order');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const handleUpdateCredentials = async (e) => {
    e.preventDefault();
    if (!newEmail && !newPassword) return;
    try {
      await updateAdminCredentials({ email: newEmail, password: newPassword }, token);
      setUpdateMessage('Credentials updated successfully!');
      setNewEmail('');
      setNewPassword('');
      setTimeout(() => setUpdateMessage(''), 3000);
    } catch (error) {
      setUpdateMessage('Failed to update credentials.');
    }
  };

  if (loading) return <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>Loading dashboard...</div>;

  return (
    <div className="container" style={{ padding: '4rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: 'var(--accent)' }}>Admin Dashboard</h1>
        <button onClick={handleLogout} className="btn-outline">Logout</button>
      </div>

      <div className="card" style={{ overflowX: 'auto', padding: '1rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
              <th style={{ padding: '1rem' }}>Date</th>
              <th style={{ padding: '1rem' }}>Customer</th>
              <th style={{ padding: '1rem' }}>Type</th>
              <th style={{ padding: '1rem' }}>Details</th>
              <th style={{ padding: '1rem' }}>Total</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: '2rem', textAlign: 'center' }}>No orders found.</td>
              </tr>
            ) : (
              orders.map(order => (
                <tr key={order._id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem' }}>
                    <div>{order.customerName}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{order.customerEmail}</div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '4px', 
                      fontSize: '0.85rem',
                      backgroundColor: order.orderType === 'shop' ? 'rgba(14, 165, 233, 0.2)' : 'rgba(139, 92, 246, 0.2)',
                      color: order.orderType === 'shop' ? '#38bdf8' : '#a78bfa'
                    }}>
                      {order.orderType === 'shop' ? 'Shop Order' : 'Commission'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', maxWidth: '300px' }}>
                    {order.orderType === 'commission' ? (
                      <div>
                        {order.portraitType} ({order.paperSize})
                        {order.referenceImages?.length > 0 && <div><a href={`http://localhost:5000${order.referenceImages[0]}`} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>View Ref Image</a></div>}
                      </div>
                    ) : (
                      <div style={{ fontSize: '0.9rem' }}>
                        {order.items?.map(i => i.name).join(', ')}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '1rem' }}>${order.total || 'N/A'}</td>
                  <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <select 
                      value={order.status} 
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="form-select"
                      style={{ padding: '0.5rem', width: 'auto' }}
                    >
                      <option value="pending">Pending</option>
                      <option value="accepted">Accepted</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <button 
                      onClick={() => handleDeleteOrder(order._id)}
                      style={{ 
                        backgroundColor: '#ef4444', 
                        color: '#fff', 
                        border: 'none', 
                        padding: '0.5rem 0.8rem', 
                        borderRadius: '4px', 
                        cursor: 'pointer',
                        fontSize: '0.85rem'
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h2 style={{ color: 'var(--accent)', marginBottom: '1.5rem', fontSize: '1.5rem' }}>Update Admin Credentials</h2>
        <form onSubmit={handleUpdateCredentials}>
          <div className="grid grid-cols-2" style={{ gap: '1rem', marginBottom: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">New Email Address</label>
              <input 
                type="email" 
                className="form-input" 
                value={newEmail} 
                onChange={(e) => setNewEmail(e.target.value)} 
                placeholder="Leave blank to keep current" 
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">New Password</label>
              <input 
                type="password" 
                className="form-input" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
                placeholder="Leave blank to keep current" 
              />
            </div>
          </div>
          <button type="submit" className="btn-primary" disabled={!newEmail && !newPassword}>
            Update Credentials
          </button>
          {updateMessage && <p style={{ marginTop: '1rem', color: 'var(--accent)', fontWeight: 'bold' }}>{updateMessage}</p>}
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;
