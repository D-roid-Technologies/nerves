import React, { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import styles from "./shared.module.css";

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
    alert("Thank you for your message! We will get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <Mail size={32} />
        <h1 className={styles.pageH1}>Contact Us</h1>
      </div>

      <div className={styles.pageSection}>
        <h2 className={styles.pageH2}>Get in Touch</h2>
        <p className={styles.contentText}>
          Have questions or need assistance? We're here to help! Reach out to us
          through any of the following methods.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "2rem",
            margin: "2rem 0",
          }}
        >
          <div style={{ textAlign: "center", padding: "1.5rem" }}>
            <Phone size={48} color="#000" style={{ marginBottom: "1rem" }} />
            <h3 style={{ marginBottom: "0.5rem" }}>Phone</h3>
            <p style={{ color: "#6b7280" }}>+234-XXX-XXXX</p>
            <p style={{ color: "#6b7280" }}>Mon-Fri: 9AM-6PM</p>
          </div>

          <div style={{ textAlign: "center", padding: "1.5rem" }}>
            <Mail size={48} color="#000" style={{ marginBottom: "1rem" }} />
            <h3 style={{ marginBottom: "0.5rem" }}>Email</h3>
            <p style={{ color: "#6b7280" }}>support@nervesystemsnetwork.com</p>
            <p style={{ color: "#6b7280" }}>We respond within 24 hours</p>
          </div>

          <div style={{ textAlign: "center", padding: "1.5rem" }}>
            <MapPin size={48} color="#000" style={{ marginBottom: "1rem" }} />
            <h3 style={{ marginBottom: "0.5rem" }}>Office</h3>
            <p style={{ color: "#6b7280" }}>Nerve Systems Network Ltd</p>
            <p style={{ color: "#6b7280" }}>Lagos, Nigeria</p>
          </div>
        </div>
      </div>

      <div className={styles.pageSection}>
        <h2 className={styles.pageH2}>Send us a Message</h2>
        <form onSubmit={handleSubmit} className={styles.contactForm}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1.5rem",
            }}
          >
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.formLabel}>
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={styles.formInput}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.formLabel}>
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={styles.formInput}
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="subject" className={styles.formLabel}>
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className={styles.formInput}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="message" className={styles.formLabel}>
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className={styles.formTextarea}
              required
            />
          </div>

          <button type="submit" className={styles.submitButton}>
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
