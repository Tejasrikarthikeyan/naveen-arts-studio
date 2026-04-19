import React, { useEffect, useState, useRef } from 'react';

const Cursor = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isPointer, setIsPointer] = useState(false);
  const trailRef = useRef(Array.from({ length: 20 }, () => ({ x: -100, y: -100 })));
  const [trail, setTrail] = useState(trailRef.current);
  const requestRef = useRef();
  const targetPos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const updatePosition = (e) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e) => {
      if (e.target.tagName.toLowerCase() === 'a' || 
          e.target.tagName.toLowerCase() === 'button' ||
          e.target.closest('a') ||
          e.target.closest('button')) {
        setIsPointer(true);
      } else {
        setIsPointer(false);
      }
    };

    const animateTrail = () => {
      let pts = [...trailRef.current];
      
      pts[0] = {
        x: pts[0].x + (targetPos.current.x - pts[0].x) * 0.4,
        y: pts[0].y + (targetPos.current.y - pts[0].y) * 0.4
      };

      for (let i = 1; i < pts.length; i++) {
        pts[i] = {
          x: pts[i].x + (pts[i - 1].x - pts[i].x) * 0.4,
          y: pts[i].y + (pts[i - 1].y - pts[i].y) * 0.4
        };
      }
      
      trailRef.current = pts;
      setTrail(pts);
      requestRef.current = requestAnimationFrame(animateTrail);
    };

    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mouseover', handleMouseOver);
    requestRef.current = requestAnimationFrame(animateTrail);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <>
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9" result="goo" />
          <feComposite in="SourceGraphic" in2="goo" operator="atop"/>
        </filter>
      </svg>
      <div className="cursor-goo-container">
        {trail.map((pt, index) => (
          <div
            key={index}
            className="goo-tail"
            style={{
              left: `${pt.x}px`,
              top: `${pt.y}px`,
              transform: `translate(-50%, -50%) scale(${1 - index / trail.length})`,
            }}
          />
        ))}
        <div 
          className={`cursor-dot ${isPointer ? 'active' : ''}`} 
          style={{ left: `${position.x}px`, top: `${position.y}px` }}
        />
      </div>
    </>
  );
};

export default Cursor;
