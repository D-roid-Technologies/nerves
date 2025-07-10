import { useState, useEffect, useCallback } from "react";
import styles from "./banner.module.css";

interface BannerSlide {
  id: number;
  title: string;
  subtitle: string;
  buttonText: string;
  image: string;
  imageAlt: string;
  bgColor: string;
  layout: "left" | "right"; // Add layout property
}

const slides: BannerSlide[] = [
  {
    id: 1,
    title: "12 Year Anniversary Watch",
    subtitle:
      "Our first-ever moonphase complication, a nod to marking time and charting change.",
    buttonText: "SHOP NOW",
    image:
      "https://images.unsplash.com/photo-1622434641406-a158123450f9?q=80&w=704&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    imageAlt: "Anniversary Watch",
    bgColor: "linear-gradient(135deg, #1a2332 0%, #814e2b 40%, #814e2b 100%)",
    layout: "left",
  },
  {
    id: 2,
    title: "Classic Collection",
    subtitle:
      "Timeless elegance meets modern craftsmanship in our signature timepiece collection.",
    buttonText: "EXPLORE",
    image:
      "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8d2F0Y2h8ZW58MHx8MHx8fDA%3D",
    imageAlt: "Classic Watch",
    bgColor: "linear-gradient(135deg, #2d1b69 0%, #11998e 50%, #2d1b69 100%)",
    layout: "right",
  },
  {
    id: 3,
    title: "Limited Edition Series",
    subtitle:
      "Exclusive designs crafted for the discerning collector. Only 500 pieces available.",
    buttonText: "DISCOVER",
    image:
      "https://images.unsplash.com/photo-1620625515032-6ed0c1790c75?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    imageAlt: "Classic Watch",
    bgColor: "linear-gradient(135deg, #121212 0%, #4a2e20 50%, #d1a350 100%)",
    layout: "left",
  },
];

export default function Banner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(true);

  // Create infinite loop by duplicating slides
  const extendedSlides = [...slides, { ...slides[0], id: slides.length + 1 }];

  const nextSlide = useCallback(() => {
    setIsTransitioning(true);
    setCurrentSlide((prev) => {
      if (prev >= slides.length - 1) {
        setTimeout(() => {
          setIsTransitioning(false);
          setCurrentSlide(0);
        }, 600);
        return slides.length;
      }
      return prev + 1;
    });
  }, []);

  const prevSlide = useCallback(() => {
    setIsTransitioning(true);
    setCurrentSlide((prev) => {
      if (prev <= 0) {
        return slides.length;
      }
      return prev - 1;
    });
  }, []);

  // Auto-play with 3s interval
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextSlide, 3000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  // Touch/swipe functionality
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) =>
    setTouchStart(e.targetTouches[0].clientX);
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;
    const touchEnd = e.changedTouches[0].clientX;
    const distance = touchStart - touchEnd;
    if (Math.abs(distance) > 50) {
      distance > 0 ? nextSlide() : prevSlide();
    }
  };

  return (
    <div
      className={styles.banner}
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div
        className={styles.slidesContainer}
        style={{
          transform: `translateX(-${currentSlide * 100}%)`,
          transition: isTransitioning ? "transform 0.6s ease" : "none",
        }}
      >
        {extendedSlides.map((slide, index) => (
          <div
            key={`${slide.id}-${index}`}
            className={styles.slide}
            style={{ background: slide.bgColor }}
          >
            <div className={`${styles.content} ${styles[slide.layout]}`}>
              <div className={styles.textSection}>
                <h1 className={styles.title}>{slide.title}</h1>
                <p className={styles.subtitle}>{slide.subtitle}</p>
                <button className={styles.ctaButton}>{slide.buttonText}</button>
              </div>
              <div className={styles.imageSection}>
                <img
                  src={slide.image}
                  alt={slide.imageAlt}
                  className={styles.productImage}
                  loading={index === 0 ? "eager" : "lazy"}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        className={`${styles.navButton} ${styles.prevButton}`}
        onClick={prevSlide}
        aria-label="Previous slide"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" />
        </svg>
      </button>

      <button
        className={`${styles.navButton} ${styles.nextButton}`}
        onClick={nextSlide}
        aria-label="Next slide"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" />
        </svg>
      </button>
    </div>
  );
}
