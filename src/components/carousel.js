import React, { useState } from 'react';

export default function Carousel() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      console.log('Search for:', searchTerm);
      // You can add navigation or filtering logic here
    }
  };

  return (
    <div>
      <div
        id="carouselExampleCaptions"
        className="carousel slide"
        data-bs-ride="carousel"
        style={{ height: "400px", objectFit: "cover" }}
      >

        {/* Indicators */}
        <div className="carousel-indicators">
          <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" className="active"></button>
          <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1"></button>
          <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2"></button>
        </div>

        {/* Slides */}
        <div className="carousel-inner" id="carousel">

          {/* Slide 1 */}
          <div className="carousel-item active" style={{ height: "400px" }}>
            <img
              src="https://images.unsplash.com/photo-1550547660-d9450f859349"
              className="d-block w-100 h-100"
              style={{ filter: "brightness(30%)", objectFit: "cover" }}
              alt="burger"
            />

            <div className="carousel-caption d-none d-md-block" style={{ zIndex: "10" }}>
              
          
            </div>
          </div>

          {/* Slide 2 */}
          <div className="carousel-item" style={{ height: "400px" }}>
            <img
               src="https://img.freepik.com/free-photo/pizza-pizza-filled-with-tomatoes-salami-olives_140725-1200.jpg"
                className="d-block w-100 h-100"
              style={{ filter: "brightness(30%)", objectFit: "cover" }}
              alt="pizza"
            />
            <div className="carousel-caption d-none d-md-block"></div>
          </div>

          {/* Slide 3 */}
          <div className="carousel-item" style={{ height: "400px" }}>
            <img
              src="https://images.unsplash.com/photo-1525755662778-989d0524087e"
              className="d-block w-100 h-100"
              style={{ filter: "brightness(30%)", objectFit: "cover" }}
              alt="pasta"
            />
            <div className="carousel-caption d-none d-md-block"></div>
          </div>

        </div>

        {/* Controls */}
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon"></span>
        </button>

        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon"></span>
        </button>

      </div>
    </div>
  );
}