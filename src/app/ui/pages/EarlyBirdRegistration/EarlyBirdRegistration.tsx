import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./EarlyBirdRegistration.module.css";

const EarlyBirdRegistration: React.FunctionComponent = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    profilePicture: null as File | null,
  });

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const countDownDate = new Date();
    countDownDate.setDate(countDownDate.getDate() + 7);

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = countDownDate.getTime() - now;

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });

      if (distance < 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (!file.type.match("image.*")) {
        toast.error("Please select an image file (JPEG, PNG)");
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        return;
      }

      setFormData((prev) => ({ ...prev, profilePicture: file }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, profilePicture: null }));
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

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

    // Simulate form submission with image upload
    setTimeout(() => {
      console.log("Form data with image:", {
        ...formData,
        profilePicture: formData.profilePicture?.name,
      });
      toast.success("Early bird registration successful!");
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className={styles["registration-background"]}>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        theme="colored"
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className={styles["registration-container"]}>
        <div className={styles["header-section"]}>
          <h1 className={styles["title"]}>Early Bird Registration</h1>
          <p className={styles["subtitle"]}>
            Limited time offer - Register now to secure your spot
          </p>
        </div>

        <div className={styles["countdown-section"]}>
          <div className={styles["countdown-title"]}>Offer Ends In:</div>
          <div className={styles["countdown-timer"]}>
            <div className={styles["countdown-item"]}>
              <span className={styles["countdown-value"]}>{timeLeft.days}</span>
              <span className={styles["countdown-label"]}>Days</span>
            </div>
            <div className={styles["countdown-separator"]}>:</div>
            <div className={styles["countdown-item"]}>
              <span className={styles["countdown-value"]}>
                {timeLeft.hours}
              </span>
              <span className={styles["countdown-label"]}>Hours</span>
            </div>
            <div className={styles["countdown-separator"]}>:</div>
            <div className={styles["countdown-item"]}>
              <span className={styles["countdown-value"]}>
                {timeLeft.minutes}
              </span>
              <span className={styles["countdown-label"]}>Minutes</span>
            </div>
            <div className={styles["countdown-separator"]}>:</div>
            <div className={styles["countdown-item"]}>
              <span className={styles["countdown-value"]}>
                {timeLeft.seconds}
              </span>
              <span className={styles["countdown-label"]}>Seconds</span>
            </div>
          </div>
        </div>

        <div className={styles["benefits-section"]}>
          <h2 className={styles["benefits-title"]}>Early Bird Benefits</h2>
          <ul className={styles["benefits-list"]}>
            <li className={styles["benefit-item"]}>
              20% discount on registration
            </li>
            <li className={styles["benefit-item"]}>
              Exclusive access to premium content
            </li>
            <li className={styles["benefit-item"]}>
              Priority seating at events
            </li>
            <li className={styles["benefit-item"]}>Free bonus materials</li>
          </ul>
        </div>

        <form className={styles["registration-form"]} onSubmit={handleSubmit}>
          {/* Profile Picture Upload */}
          <div className={styles["form-group"]}>
            <label className={styles["form-label"]}>Profile Picture</label>
            <div className={styles["image-upload-container"]}>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className={styles["file-input"]}
                required
              />

              {previewImage ? (
                <div className={styles["image-preview-container"]}>
                  <img
                    src={previewImage}
                    alt="Preview"
                    className={styles["image-preview"]}
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className={styles["remove-image-button"]}
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div
                  className={styles["upload-area"]}
                  onClick={triggerFileInput}
                >
                  <span className={styles["upload-icon"]}>+</span>
                  <span className={styles["upload-text"]}>
                    Click to upload profile picture
                  </span>
                  <span className={styles["upload-hint"]}>
                    JPEG or PNG, max 2MB
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className={styles["form-row"]}>
            <div className={styles["form-group"]}>
              <label htmlFor="firstName" className={styles["form-label"]}>
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={styles["form-input"]}
                placeholder="Enter your first name"
                required
              />
            </div>
            <div className={styles["form-group"]}>
              <label htmlFor="lastName" className={styles["form-label"]}>
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={styles["form-input"]}
                placeholder="Enter your last name"
                required
              />
            </div>
          </div>

          <div className={styles["form-group"]}>
            <label htmlFor="email" className={styles["form-label"]}>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={styles["form-input"]}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className={styles["form-row"]}>
            <div className={styles["form-group"]}>
              <label htmlFor="phone" className={styles["form-label"]}>
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={styles["form-input"]}
                placeholder="Enter your phone"
              />
            </div>
            <div className={styles["form-group"]}>
              <label htmlFor="company" className={styles["form-label"]}>
                Company Name
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className={styles["form-input"]}
                placeholder="Enter your company name"
              />
            </div>
          </div>

          <button
            type="submit"
            className={`${styles["submit-button"]} ${
              isLoading ? styles["loading"] : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className={styles["spinner"]}></span>
                Processing...
              </>
            ) : (
              "Register Now & Save 20%"
            )}
          </button>
        </form>

        <div className={styles["footer-section"]}>
          <p className={styles["footer-text"]}>
            Limited spots available. Offer ends when timer reaches zero.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EarlyBirdRegistration;
