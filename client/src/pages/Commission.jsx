import React, { useState } from 'react';
import { submitCommission } from '../api';
import { UploadCloud, CheckCircle } from 'lucide-react';

const Commission = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    address: '',
    paperSize: 'A4',
    portraitType: 'Pencil Sketch',
    description: '',
  });
  const [images, setImages] = useState([]);
  const [status, setStatus] = useState('idle'); // idle, submitting, success, error

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const validFiles = selectedFiles.filter(file => {
        const isValidType = ['image/jpeg', 'image/png'].includes(file.type);
        const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
        if (!isValidType) alert(`Invalid file type: ${file.name}. Only JPEG/PNG allowed.`);
        if (!isValidSize) alert(`File too large: ${file.name}. Max size is 5MB.`);
        return isValidType && isValidSize;
      });
      setImages(validFiles);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');

    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    images.forEach(img => data.append('referenceImages', img));

    try {
      await submitCommission(data);
      setStatus('success');
      setFormData({
        customerName: '', customerEmail: '', customerPhone: '', address: '',
        paperSize: 'A4', portraitType: 'Solo', description: ''
      });
      setImages([]);
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="container" style={{ paddingTop: '6rem', textAlign: 'center', minHeight: '60vh' }}>
        <CheckCircle size={80} color="var(--accent)" style={{ margin: '0 auto 2rem' }} />
        <h1>Commission Received!</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '1rem', fontSize: '1.2rem' }}>
          Thank you for choosing my art. I will review your request and get back to you shortly.
        </p>
        <button onClick={() => setStatus('idle')} className="btn-primary" style={{ marginTop: '3rem' }}>
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '1rem', fontSize: '3rem' }}>Request a Portrait</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem', fontSize: '1.1rem' }}>
          Please provide details about the piece you have in mind. Upload high-quality reference pictures for the best results.
        </p>

        <form onSubmit={handleSubmit} className="card">
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent)', fontSize: '1.5rem' }}>Your Details</h3>
          <div className="grid grid-cols-2">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" name="customerName" value={formData.customerName} onChange={handleChange} required className="form-input" placeholder="John Doe" />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" name="customerEmail" value={formData.customerEmail} onChange={handleChange} required className="form-input" placeholder="john@example.com" />
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div className="form-group">
              <label className="form-label">Phone Number (Optional)</label>
              <input type="tel" name="customerPhone" value={formData.customerPhone} onChange={handleChange} className="form-input" placeholder="+1 234 567 8900" />
            </div>
            <div className="form-group">
              <label className="form-label">Shipping Address</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} required className="form-input" placeholder="123 Main St, City, Country" />
            </div>
          </div>

          <h3 style={{ margin: '2rem 0 1.5rem', color: 'var(--accent)', fontSize: '1.5rem' }}>Artwork Details</h3>
          <div className="grid grid-cols-2">
            <div className="form-group">
              <label className="form-label">Paper Size</label>
              <select name="paperSize" value={formData.paperSize} onChange={handleChange} className="form-select">
                <option value="A4">A4 (8.3 x 11.7 in) - Standard</option>
                <option value="A3">A3 (11.7 x 16.5 in) - Large</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Drawing Type</label>
              <select name="portraitType" value={formData.portraitType} onChange={handleChange} className="form-select">
                <option value="Pencil Sketch">Pencil Sketch</option>
                <option value="Color Portrait">Color Portrait</option>
                <option value="Doodle Art">Doodle Art</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Additional Instructions / Vision</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="form-textarea" rows="4" placeholder="Describe any specific details, mood, or background elements you want..." />
          </div>

          <div className="form-group" style={{ marginTop: '2rem' }}>
            <label className="form-label" style={{ marginBottom: '1rem' }}>Reference Images</label>
            <div className="file-input-wrapper">
              <div className="file-drop-area">
                <UploadCloud size={48} color="var(--accent)" style={{ marginBottom: '1rem' }} />
                <h4>Click or drag images here</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Up to 5 images (JPEG, PNG). High resolution preferred.</p>
                {images.length > 0 && (
                  <p style={{ color: 'var(--accent)', marginTop: '1rem', fontWeight: 'bold' }}>
                    {images.length} file(s) selected
                  </p>
                )}
              </div>
              <input type="file" multiple accept="image/*" onChange={handleImageChange} className="file-input" />
            </div>
          </div>

          {status === 'error' && (
            <div style={{ color: '#ef4444', marginBottom: '1rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
              There was an error submitting your request. Please try again.
            </div>
          )}

          <div style={{ textAlign: 'right', marginTop: '2rem' }}>
            <button type="submit" disabled={status === 'submitting'} className="btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}>
              {status === 'submitting' ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Commission;
