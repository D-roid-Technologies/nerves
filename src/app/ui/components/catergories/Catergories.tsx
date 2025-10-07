import React from "react";
import "./catergories.css";
import { Link } from "react-router-dom";

const Categories: React.FunctionComponent = () => {
  return (
    <div className="grid-main-container">
      <h1>Surf our Ecosystem</h1>
      <div className="grid-container">
        <div className="grid-item item-1">
          <Link to="/catergories" className="item-link">
            Shop Now
          </Link>
          <div className="item-content">
            <h2 className="item-title">Products</h2>
            {/* <p className="item-subtitle">
              Timeless elegance for every occasion
            </p> */}
          </div>
        </div>

        <div className="grid-item item-2">
          <Link to="/catergories" className="item-link">
            Shop Now
          </Link>
          <div className="item-content">
            <h2 className="item-title">Service</h2>
            {/* <p className="item-subtitle">Immersive sound experience</p> */}
          </div>
        </div>

        <div className="grid-item item-3">
          <Link to="/catergories" className="item-link">
            Shop Now
          </Link>
          <div className="item-content">
            <h2 className="item-title">Transportation</h2>
            {/* <p className="item-subtitle">See the world in style</p> */}
          </div>
        </div>

        <div className="grid-item item-4">
          <Link to="/catergories" className="item-link">
            Shop Now
          </Link>
          <div className="item-content">
            <h2 className="item-title">Community</h2>
            {/* <p className="item-subtitle">Capture your perfect moments</p> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
