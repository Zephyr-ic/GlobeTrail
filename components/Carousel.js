import React, { useEffect, useState } from "react";
import "./Carousel.css";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth"; // Import the auth hook

const Carousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { isAuthenticated } = useAuth(); // Use authentication status

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [images.length, currentIndex]);

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div
      className="carousel"
      style={{ backgroundImage: `url(${images[currentIndex]})` }}
    >
      <div className="overlay-text">
        <h1 className="title">Master Every Journey with Ease</h1>
        <p className="subtitle">
          From creating itineraries to tracking tasks, we've got every step of
          your journey covered.
        </p>
        {/* Redirect based on authentication status */}
        <Link
          to={isAuthenticated() ? "/cabinet" : "/login"}
          className="cta"
        >
          Create a Trip
        </Link>
      </div>
      <div className="dots">
        {images.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentIndex ? "active" : ""}`}
            onClick={() => handleDotClick(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Carousel;