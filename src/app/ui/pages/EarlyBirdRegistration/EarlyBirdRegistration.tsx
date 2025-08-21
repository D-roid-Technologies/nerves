import React, { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./EarlyBirdRegistration.module.css";

interface ItemImage {
  file: File;
  preview: string;
  title: string;
}

const EarlyBirdRegistration: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
  });

  const [images, setImages] = useState<ItemImage[]>([]);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Countdown timer
  useEffect(() => {
    const countDownDate = new Date();
    countDownDate.setDate(countDownDate.getDate() + 7);

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = countDownDate.getTime() - now;

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });

      if (distance < 0) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle image upload
  const handleImagesChange = (files: FileList | null) => {
    if (!files) return;
    const newImages: ItemImage[] = [];

    Array.from(files).forEach(file => {
      if (!file.type.match("image.*")) {
        toast.error("Please select only images (JPEG, PNG)");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, { file, preview: reader.result as string, title: "" }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleTitleChange = (index: number, title: string) => {
    setImages(prev => prev.map((img, i) => (i === index ? { ...img, title } : img)));
  };

  // Drag-and-drop handlers
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleImagesChange(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // Form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.firstName || !formData.lastName) {
      toast.error("Please enter your full name");
      setIsLoading(false);
      return;
    }
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      setIsLoading(false);
      return;
    }
    if (images.length === 0) {
      toast.error("Please upload at least one item image");
      setIsLoading(false);
      return;
    }

    // Simulate form submission
    setTimeout(() => {
      console.log("Form data:", { ...formData, images });
      toast.success("Early bird registration successful!");
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className={styles["registration-background"]}>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar theme="colored" />

      <div className={styles["registration-container"]}>
        <div className={styles["header-section"]}>
          <h1 className={styles["title"]}>Early Bird Registration</h1>
          <p className={styles["subtitle"]}>Limited time offer - Register now to secure your spot</p>
        </div>

        <div className={styles["countdown-section"]}>
          <div className={styles["countdown-title"]}>Offer Ends In:</div>
          <div className={styles["countdown-timer"]}>
            {["days", "hours", "minutes", "seconds"].map((unit, idx) => (
              <React.Fragment key={unit}>
                <div className={styles["countdown-item"]}>
                  <span className={styles["countdown-value"]}>{(timeLeft as any)[unit]}</span>
                  <span className={styles["countdown-label"]}>{unit.charAt(0).toUpperCase() + unit.slice(1)}</span>
                </div>
                {idx < 3 && <div className={styles["countdown-separator"]}>:</div>}
              </React.Fragment>
            ))}
          </div>
        </div>

        <form className={styles["registration-form"]} onSubmit={handleSubmit}>
          {/* Image Upload Section */}
          <div className={styles["form-group"]}>
            <label className={styles["form-label"]}>Item Images</label>
            <div
              className={styles["upload-area"]}
              onClick={triggerFileInput}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <span className={styles["upload-text"]}>Drag & drop images here or click to upload</span>
              <span className={styles["upload-hint"]}>JPEG or PNG, max 2MB each</span>
              <input
                type="file"
                ref={fileInputRef}
                onChange={e => handleImagesChange(e.target.files)}
                accept="image/*"
                multiple
                className={styles["file-input"]}
              />
            </div>

            <div className={styles["image-preview-grid"]}>
              {images.map((img, index) => (
                <div key={index} className={styles["image-preview-container"]}>
                  <img src={img.preview} alt={`Preview ${index}`} className={styles["image-preview"]} />
                  <input
                    type="text"
                    placeholder="Image title"
                    value={img.title}
                    onChange={e => handleTitleChange(index, e.target.value)}
                    className={styles["image-title-input"]}
                  />
                  <button type="button" className={styles["remove-image-button"]} onClick={() => removeImage(index)}>
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* User Info Fields */}
          <div className={styles["form-row"]}>
            <div className={styles["form-group"]}>
              <label htmlFor="firstName" className={styles["form-label"]}>First Name</label>
              <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} className={styles["form-input"]} required />
            </div>
            <div className={styles["form-group"]}>
              <label htmlFor="lastName" className={styles["form-label"]}>Last Name</label>
              <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} className={styles["form-input"]} required />
            </div>
          </div>

          <div className={styles["form-group"]}>
            <label htmlFor="email" className={styles["form-label"]}>Email</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={styles["form-input"]} required />
          </div>

          <div className={styles["form-row"]}>
            <div className={styles["form-group"]}>
              <label htmlFor="phone" className={styles["form-label"]}>Phone</label>
              <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className={styles["form-input"]} />
            </div>
            <div className={styles["form-group"]}>
              <label htmlFor="company" className={styles["form-label"]}>Company</label>
              <input type="text" id="company" name="company" value={formData.company} onChange={handleChange} className={styles["form-input"]} />
            </div>
          </div>

          <button type="submit" className={`${styles["submit-button"]} ${isLoading ? styles["loading"] : ""}`} disabled={isLoading}>
            {isLoading ? "Processing..." : "Register Now & Save 20%"}
          </button>
        </form>

        <div className={styles["footer-section"]}>
          <p className={styles["footer-text"]}>Limited spots available. Offer ends when timer reaches zero.</p>
        </div>
      </div>
    </div>
  );
};

export default EarlyBirdRegistration;