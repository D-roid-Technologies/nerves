import React from "react";
import "./catergories.css";

const Categories: React.FunctionComponent = () => {
  return (
    <div className="grid-main-container">
      <h1>Shop By Categories</h1>
      <div className="grid-container">
        <div className="grid-item item-1">
          <a href="/watches" className="item-link">
            Shop Now
          </a>
          <div className="item-content">
            <h2 className="item-title">Watches</h2>
            {/* <p className="item-subtitle">
              Timeless elegance for every occasion
            </p> */}
          </div>
        </div>

        <div className="grid-item item-2">
          <a href="/headphones" className="item-link">
            View All
          </a>
          <div className="item-content">
            <h2 className="item-title">Sunglasses</h2>
            {/* <p className="item-subtitle">Immersive sound experience</p> */}
          </div>
        </div>

        <div className="grid-item item-3">
          <a href="/sunglasses" className="item-link">
            Bracelets
          </a>
          <div className="item-content">
            <h2 className="item-title">Men Watches</h2>
            {/* <p className="item-subtitle">See the world in style</p> */}
          </div>
        </div>

        <div className="grid-item item-4">
          <a href="/cameras" className="item-link">
            Necklaces
          </a>
          <div className="item-content">
            <h2 className="item-title">Professional Cameras</h2>
            {/* <p className="item-subtitle">Capture your perfect moments</p> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Categories;
