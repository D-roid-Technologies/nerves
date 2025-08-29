import React from "react";
import "./AboutUs.css";

const AboutUs: React.FunctionComponent = () => {
  return (
    <div className="about-page">
      <div className="about-hero">
        <h1>About NSN</h1>
        <p>At Nerve Systems Network, we are redefining the way people shop and move goods. As a fast-growing E-commerce and transport company, our mission is to make shopping easier, faster, and more reliable while building a seamless logistics network that connects businesses and customers everywhere.</p>
      </div>

      <div className="about-content">
        <section className="about-section">
          <h2>Our Story</h2>
          <p>
            At Nerve Systems Network, we were founded with a bold vision: to create a true all-in-one digital marketplace where shopping meets innovation. Our platform brings customers a world of choice, from everyday essentials to exclusive premium products, all just a click away. But we didn’t stop there we built a powerful transport and delivery system designed to move every order swiftly, securely, and reliably. With every purchase and every delivery, we’re not just connecting products to people, we’re connecting people to possibilities.
          </p>
        </section>

        <section className="about-section">
          <h2>Our Mission</h2>
          <p>
            To empower individuals and businesses with convenient online shopping and efficient logistics solutions, driven by technology, trust, and customer satisfaction. We are committed to delivering value, convenience, and reliability in every order and shipment.
          </p>
        </section>
        <section className="about-section">
          <h2>Our Vision</h2>
          <p>
            To become a leading force in global E-commerce and transport, offering a platform where shopping and logistics work hand-in-hand to create a smarter, faster, and more connected future.
          </p>
        </section>

        <section className="about-section">
          <h2>Our Values</h2>
          <p>To become a leading force in global E-commerce and transport, offering a platform where shopping and logistics work hand-in-hand to create a smarter, faster, and more connected future.</p>
        </section>

        {/* <section className="about-section">
          <h2>Meet Our Team</h2>
          <p>
            Our passionate team of designers, creators, and customer champions
            work hard every day to ensure our products exceed your
            expectations. We are proud to be a diverse, inclusive, and driven
            company.
          </p>
        </section> */}

        <section className="about-section">
          <h2>What We Do</h2>
          <ul>
            <li>E-Commerce Marketplace: A wide selection of products with secure payment options.</li>
            <li>Transport & Logistics: Reliable shipping, delivery, and courier services.</li>
            <li>Customer-Centric Solutions: Technology-driven platforms for easy tracking, safe payments, and smooth shopping.</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;