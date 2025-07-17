import React, { useState, useEffect, useRef } from "react";
import styles from "./NewProduct.module.css";

const images = [
  "https://images.unsplash.com/photo-1519125323398-675f0ddb6308",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
  "https://images.unsplash.com/photo-1465101046530-73398c7f28ca",
];

function NewProduct() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Clone first image to the end for seamless loop
  const extendedImages = [...images, images[0]];

  useEffect(() => {
    const slider = setInterval(() => {
      setCurrent((prev) => prev + 1);
      setIsTransitioning(true);
    }, 4500);

    return () => clearInterval(slider);
  }, []);

  useEffect(() => {
    // When reaching the cloned slide, reset to first slide without transition
    if (current === images.length) {
      const timeout = setTimeout(() => {
        setIsTransitioning(false);
        setCurrent(0);
      }, 700); // match transition duration in CSS
      return () => clearTimeout(timeout);
    } else {
      setIsTransitioning(true);
    }
  }, [current, images.length]);

  return (
    <>
      <section>
        <div className={styles.container}>
          <div className={styles.item1}>
            <h1>flash sale</h1>
            <p>Get the best deals on our latest products!</p>
            <a href="#" className={styles.button}>
              Shop Now
            </a>
          </div>
          <div className={styles.sliderWrapper}>
            <div
              ref={sliderRef}
              className={styles.slider}
              style={{
                transform: `translateX(-${current * 100}%)`,
                transition: isTransitioning
                  ? "transform 0.7s cubic-bezier(0.77,0,0.175,1)"
                  : "none",
              }}
            >
              {extendedImages.map((img, idx) => (
                <div
                  key={idx}
                  className={styles.slide}
                  style={{
                    backgroundImage: `url(${img})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default NewProduct;
