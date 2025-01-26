import React, { useEffect, useRef } from 'react';
import './Overlay.css';
import { Link } from 'react-router-dom';

const Overlay = ({ overlayOpen, toggleOverlay, customStyleOverlay }) => {
  const overlayRef = useRef(null);

  

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (overlayRef.current && !overlayRef.current.contains(event.target)) {
        toggleOverlay();
      }
    };

    if (overlayOpen) { 
      document.addEventListener('mousedown', handleClickOutside);
      document.body.classList.add('overlay-active');
    } else {
      document.body.classList.remove('overlay-active');
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [overlayOpen, toggleOverlay]);

  return (
    customStyleOverlay && (
      <div className={`overlay ${overlayOpen ? 'active' : ''}`} ref={overlayRef}>
        <div className="overlay-content">
          <p>Overlay Content</p>
          <Link to='/cabinet'>Cabinet</Link>
        </div>
      </div>
    )
  );
};

export default Overlay;