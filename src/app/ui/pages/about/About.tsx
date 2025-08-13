import React from "react";
import "./AboutUs.css";

const AboutUs: React.FunctionComponent = () => {
  return (
    <div className="about-page">
      <div className="about-hero">
        <h1>About NSN</h1>
        <p>Discover our story, mission, and vision for the future.</p>
      </div>

      <div className="about-content">
        <section className="about-section">
          <h2>Our Story</h2>
          <p>
            Founded in 2020, our brand was born from a simple idea: to bring
            high-quality, beautifully designed products to people who value
            style and functionality. From humble beginnings, we have grown into
            a trusted destination for premium lifestyle goods.
          </p>
        </section>

        <section className="about-section">
          <h2>Our Mission</h2>
          <p>
            We are on a mission to make everyday life a little more special.
            Every product we design is carefully crafted to combine innovation,
            sustainability, and timeless style. We believe in quality over
            quantity and strive to create products that last.
          </p>
        </section>

        <section className="about-section">
          <h2>Our Values</h2>
          <ul>
            <li>🌿 Sustainability</li>
            <li>🎨 Quality Design</li>
            <li>🤝 Customer Commitment</li>
            <li>✨ Innovation</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>Meet Our Team</h2>
          <p>
            Our passionate team of designers, creators, and customer champions
            work hard every day to ensure our products exceed your
            expectations. We are proud to be a diverse, inclusive, and driven
            company.
          </p>
        </section>

        <section className="about-section">
          <h2>Join Our Journey</h2>
          <p>
            We’re excited for what’s ahead and invite you to be part of our
            journey. Thank you for supporting us and for being part of our
            growing community.
          </p>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;