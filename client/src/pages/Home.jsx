import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Home = () => {
  return (
    <div>
      <section className="hero">
        <div className="hero-content">
          <h1>Immortalize Your Moments at Naveen Art's</h1>
          <p>Bespoke pencil sketches, vibrant color portraits, and unique doodle art tailored just for you.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
            <Link to="/commission" className="btn-primary">
              Commission a Piece <ArrowRight size={18} />
            </Link>
            <a href="#gallery" className="btn-outline">View Gallery</a>
          </div>
        </div>
      </section>
      
      <section id="gallery" className="container" style={{ padding: '4rem 2rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '2.5rem' }}>Selected Works</h2>
        <div className="grid grid-cols-3">
          {/* 
            To add your own artwork:
            1. Put your image files (e.g. art1.jpg) in the 'client/public' folder.
            2. Change the 'image' property below to '/art1.jpg'
            OR
            Use external image URLs like 'https://example.com/image.jpg'
          */}
          {[
            { id: 1, title: 'Artwork 1', image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=500' },
            { id: 2, title: 'Artwork 2', image: 'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=500' },
            { id: 3, title: 'Artwork 3', image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500' },
            { id: 4, title: 'Artwork 4', image: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=500' },
            { id: 5, title: 'Artwork 5', image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500' },
            { id: 6, title: 'Artwork 6', image: 'https://images.unsplash.com/photo-1580136579312-94651dfd596d?w=500' }
          ].map((art) => (
            <div key={art.id} className="card" style={{ padding: '0', overflow: 'hidden', height: '300px', display: 'flex', flexDirection: 'column', backgroundColor: '#1f1f1f' }}>
              <img src={art.image} alt={art.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }} className="gallery-img" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
