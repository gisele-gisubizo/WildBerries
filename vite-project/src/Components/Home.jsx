import React, { useEffect, useState } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import clothes1 from '../assets/images/clothes1.jpg';
import clothes2 from '../assets/images/clothes2.jpg';
import clothes3 from '../assets/images/clothes3.jpg';
import clothes4 from '../assets/images/clothes4.jpg';
import clothes5 from '../assets/images/clothes5.jpg';
import clothes6 from '../assets/images/clothes6.jpg';
import '../Styles/home.css';

const Home = () => {
  const images = [clothes1, clothes2, clothes3, clothes4, clothes5, clothes6];
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const slide = () => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    };

    const interval = setInterval(slide, 10000); // Change slide every 10 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [images.length]);

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
    const slider = document.querySelector('.slider');
    slider.style.transition = 'none'; // Disable transition for instant change
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
    const slider = document.querySelector('.slider');
    slider.style.transition = 'none'; // Disable transition for instant change
  };

  return (
    <div className="home">
      <div className="slider-container">
        <div className="slider">
          {images.map((image, index) => (
            <div
              className={`slide ${index === currentSlide ? 'active' : ''}`}
              key={index}
            >
              <img src={image} alt={`Slide ${index + 1}`} />
              <div className="overlay"></div>
            </div>
          ))}
        </div>
        <button className="arrow prev" onClick={goToPrevious}>
          <FaArrowLeft />
        </button>
        <button className="arrow next" onClick={goToNext}>
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default Home;