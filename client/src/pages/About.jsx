import React from 'react';

const About = () => {
  return (
    <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
      <div className="grid grid-cols-2" style={{ alignItems: 'center', gap: '4rem' }}>
        <div>
          <img 
            src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
            alt="Artist at work" 
            style={{ width: '100%', borderRadius: '12px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }} 
          />
        </div>
        <div>
          <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem', color: 'var(--accent)' }}>About Naveen</h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Welcome to Naveen Art's. I am an independent artist specializing in pencil sketches, vibrant color portraits, and unique doodle art. With a passion for capturing emotions and telling stories through art, I've spent years honing my craft.
          </p>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
            Whether you're looking for a personalized custom drawing to immortalize a memory or searching for a unique piece from my art shop, my goal is to bring your vision to life with meticulous attention to detail.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
