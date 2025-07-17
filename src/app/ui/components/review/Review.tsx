import React, { useState, useEffect } from "react";
import styles from "./review.module.css";

function Review() {
  const [count, setCount] = useState<number>(10376);
  const targetCount = 95000;
  const updateInterval = 2000; // Update every 2 seconds

  useEffect(() => {
    if (count >= targetCount) return;

    const intervalId = setInterval(() => {
      setCount((prevCount) => {
        if (prevCount < targetCount) {
          return prevCount + 1;
        }
        return prevCount;
      });
    }, updateInterval);

    return () => clearInterval(intervalId);
  }, [count, targetCount, updateInterval]);

  // Format number with commas
  const formattedCount = count.toLocaleString();

  return (
    <div className={styles.reviewContainer}>
      <div className={styles.svgSection}>
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
          </svg>
        ))}
      </div>
      <p>Over {formattedCount} five star reviews and counting!</p>
    </div>
  );
}

export default Review;
