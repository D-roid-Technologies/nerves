import type React from "react";
import { useState, useRef } from "react";
import { toast } from "react-hot-toast";
import {
  Package,
  FileText,
  ImageIcon,
  Tag,
  Layers,
  Save,
  X,
  Upload,
  Eye,
  EyeOff,
  Percent,
  Box,
  Star,
  Link,
  Loader,
} from "lucide-react";
import styles from "./CreateItemPage.module.css";
import { authService } from "../../../redux/configuration/auth.service";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { Product } from "../productPage/ProductPageAlt";

interface ItemFormData {
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

const CreateItemPage = () => {
  const [formData, setFormData] = useState<ItemFormData>({
    title: "",
    description: "",
    price: 0,
    discountPercentage: 0,
    rating: 0,
    stock: 0,
    brand: "",
    category: "",
    thumbnail: "",
    images: [],
  });

  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<"url" | "file">("url");
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const user = useSelector((state: RootState) => state.user.primaryInformation);

  const categories = [
    "smartphones",
    "laptops",
    "fragrances",
    "skincare",
    "groceries",
    "home-decoration",
    "furniture",
    "tops",
    "womens-dresses",
    "womens-shoes",
    "mens-shirts",
    "mens-shoes",
    "mens-watches",
    "womens-watches",
    "womens-bags",
    "womens-jewellery",
    "sunglasses",
    "automotive",
    "motorcycle",
    "lighting",
  ];

  // Custom toast functions with colors
  const showSuccessToast = (message: string) => {
    toast.success(message, {
      style: {
        background: "#10B981",
        color: "#fff",
        fontWeight: "bold",
      },
      iconTheme: {
        primary: "#fff",
        secondary: "#10B981",
      },
    });
  };

  const showErrorToast = (message: string) => {
    toast.error(message, {
      style: {
        background: "#EF4444",
        color: "#fff",
        fontWeight: "bold",
      },
      iconTheme: {
        primary: "#fff",
        secondary: "#EF4444",
      },
    });
  };

  const showWarningToast = (message: string) => {
    toast(message, {
      icon: "⚠️",
      style: {
        background: "#F59E0B",
        color: "#fff",
        fontWeight: "bold",
      },
    });
  };

  const handleInputChange = (
    field: keyof ItemFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    const file = files[0];

    if (file.size > 2 * 1024 * 1024) {
      showErrorToast("Image is too large. Maximum 2MB allowed.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      showErrorToast("Please select a valid image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;

      if (!formData.thumbnail) {
        // Set as thumbnail if none is set
        setFormData((prev) => ({
          ...prev,
          thumbnail: dataUrl,
        }));
        showSuccessToast("Image set as thumbnail");
      } else {
        // Add to images array
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, dataUrl],
        }));
        showSuccessToast("Image added to gallery");
      }
    };
    reader.readAsDataURL(file);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAddImageUrl = () => {
    if (
      currentImageUrl.trim() &&
      !formData.images.includes(currentImageUrl.trim()) &&
      currentImageUrl.trim() !== formData.thumbnail
    ) {
      if (!formData.thumbnail) {
        // Set as thumbnail if none is set
        setFormData((prev) => ({
          ...prev,
          thumbnail: currentImageUrl.trim(),
        }));
        showSuccessToast("Image URL set as thumbnail");
      } else {
        // Add to images array
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, currentImageUrl.trim()],
        }));
        showSuccessToast("Image URL added to gallery");
      }

      setCurrentImageUrl("");
    } else if (
      formData.images.includes(currentImageUrl.trim()) ||
      currentImageUrl.trim() === formData.thumbnail
    ) {
      showWarningToast("This image is already added");
    }
  };

  const removeImage = (index: number, isThumbnail: boolean = false) => {
    if (isThumbnail) {
      setFormData((prev) => ({
        ...prev,
        thumbnail: "",
      }));
      showSuccessToast("Thumbnail removed");
    } else {
      setFormData((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
      }));
      showSuccessToast("Image removed from gallery");
    }
  };

  const setAsThumbnail = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      thumbnail: url,
      images: prev.images.filter((img) => img !== url), // Remove from images if it was there
    }));
    showSuccessToast("Set as main thumbnail");
  };

  const validateForm = () => {
    const errors = [];

    if (!formData.title.trim()) errors.push("Product title is required");
    if (!formData.description.trim()) errors.push("Description is required");
    if (formData.price <= 0) errors.push("Valid price is required");
    if (formData.discountPercentage < 0 || formData.discountPercentage > 100)
      errors.push("Discount must be between 0 and 100");
    if (formData.rating <= 0 || formData.rating > 5)
      errors.push("Rating must be between 1 and 5");
    if (formData.stock < 0) errors.push("Valid stock quantity is required");
    if (!formData.brand.trim()) errors.push("Brand name is required");
    if (!formData.category) errors.push("Category is required");
    if (!formData.thumbnail) errors.push("Thumbnail image is required");

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateForm();
    if (errors.length > 0) {
      errors.forEach((error) => showErrorToast(error));
      return;
    }

    setIsSubmitting(true);
    setShowLoadingScreen(true);

    try {
      // Prepare data for DummyJSON API
      const itemData: Product = {
        id: Date.now(),
        name: formData.title,
        description: formData.description,
        price: formData.price,
        discountPrice: formData.discountPercentage,
        rating: formData.rating,
        stock: formData.stock,
        brand: formData.brand,
        category: formData.category,
        thumbnail: formData.thumbnail,
        images: formData.images,
        sellerId: `${user?.email}`,
      };

      authService.addMyItem(itemData).then(() => {
        console.log("API Payload:", itemData);
        showSuccessToast(
          "Product created successfully! Check console for details."
        );
        setFormData({
          title: "",
          description: "",
          price: 0,
          discountPercentage: 0,
          rating: 0,
          stock: 0,
          brand: "",
          category: "",
          thumbnail: "",
          images: [],
        });
        setCurrentImageUrl("");
      })

    } catch (error) {
      showErrorToast("Failed to create product. Please try again.");
      console.error("Error creating product:", error);
    } finally {
      setIsSubmitting(false);
      setShowLoadingScreen(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Loading Screen */}
      {showLoadingScreen && (
        <div className={styles.loadingScreen}>
          <div className={styles.loadingContent}>
            <Loader className={styles.loadingSpinner} size={48} />
            <h2>Creating Product...</h2>
            <p>Please wait while we process your request</p>
          </div>
        </div>
      )}

      <div className={styles.header}>
        <div className={styles.headerContent}>
          <Package className={styles.headerIcon} />
          <div>
            <h1>Create New Product</h1>
            <p>Add a new product to your catalog</p>
          </div>
        </div>
        <button
          type="button"
          className={styles.previewBtn}
          onClick={() => setShowPreview(!showPreview)}
        >
          {showPreview ? <EyeOff /> : <Eye />}
          {showPreview ? "Hide Preview" : "Show Preview"}
        </button>
      </div>

      <div className={styles.content}>
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Basic Information */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <FileText className={styles.sectionIcon} />
              <h2>Basic Information</h2>
            </div>

            <div className={styles.formGrid}>
              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label htmlFor="title">Product Title *</label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Enter product title"
                  required
                />
              </div>

              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Describe your product in detail"
                  rows={4}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="price">Price (₦) *</label>
                <input
                  type="number"
                  id="price"
                  value={formData.price || ""}
                  onChange={(e) =>
                    handleInputChange("price", parseFloat(e.target.value) || 0)
                  }
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="discount">Discount Percentage</label>
                <input
                  type="number"
                  id="discount"
                  value={formData.discountPercentage || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "discountPercentage",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  placeholder="0"
                  step="0.1"
                  min="0"
                  max="100"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="rating">Rating (1-5) *</label>
                <input
                  type="number"
                  id="rating"
                  value={formData.rating || ""}
                  onChange={(e) =>
                    handleInputChange("rating", parseFloat(e.target.value) || 0)
                  }
                  placeholder="0.0"
                  step="0.1"
                  min="1"
                  max="5"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="stock">Stock Quantity *</label>
                <input
                  type="number"
                  id="stock"
                  value={formData.stock || ""}
                  onChange={(e) =>
                    handleInputChange("stock", parseInt(e.target.value) || 0)
                  }
                  placeholder="0"
                  min="0"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="brand">Brand *</label>
                <input
                  type="text"
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => handleInputChange("brand", e.target.value)}
                  placeholder="Brand name"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) =>
                    handleInputChange("category", e.target.value)
                  }
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() +
                        cat.slice(1).replace("-", " ")}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <ImageIcon className={styles.sectionIcon} />
              <h2>Product Images</h2>
            </div>

            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label>Add Images</label>
              <div className={styles.uploadMethodToggle}>
                <button
                  type="button"
                  className={uploadMethod === "url" ? styles.active : ""}
                  onClick={() => setUploadMethod("url")}
                >
                  <Link size={16} />
                  URL
                </button>
                <button
                  type="button"
                  className={uploadMethod === "file" ? styles.active : ""}
                  onClick={() => setUploadMethod("file")}
                >
                  <Upload size={16} />
                  Upload File
                </button>
              </div>

              {uploadMethod === "url" ? (
                <div className={styles.imageInputArea}>
                  <input
                    type="url"
                    value={currentImageUrl}
                    onChange={(e) => setCurrentImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className={styles.imageUrlInput}
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className={styles.addImageBtn}
                    disabled={!currentImageUrl.trim()}
                  >
                    Add Image
                  </button>
                </div>
              ) : (
                <div className={styles.fileUploadArea}>
                  <input
                    type="file"
                    id="file-upload"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageUpload}
                    className={styles.fileInput}
                  />
                  <label htmlFor="file-upload" className={styles.uploadLabel}>
                    <Upload size={20} />
                    <span>Choose an image file</span>
                    <small>Max 5MB, JPG, PNG, or GIF</small>
                  </label>
                </div>
              )}
            </div>

            <div className={styles.imageStatus}>
              <p>
                <strong>Thumbnail:</strong>{" "}
                {formData.thumbnail ? "✓ Set" : "✗ Not set"}
              </p>
              <p>
                <strong>Gallery images:</strong> {formData.images.length} added
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className={styles.formActions}>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isSubmitting}
            >
              <Save className={styles.btnIcon} />
              {isSubmitting ? "Creating Product..." : "Create Product"}
            </button>
          </div>
        </form>

        {/* Preview Panel */}
        {showPreview && (
          <div className={styles.previewPanel}>
            <h3>Product Preview</h3>
            <div className={styles.previewContent}>
              <div className={styles.previewImages}>
                {formData.thumbnail ? (
                  <div className={styles.previewImageContainer}>
                    <img src={formData.thumbnail} alt="Product thumbnail" />
                    <button
                      type="button"
                      className={styles.previewRemoveBtn}
                      onClick={() => removeImage(0, true)}
                      title="Remove thumbnail"
                    >
                      <X size={16} />
                    </button>
                    <span className={styles.thumbnailBadge}>Main Image</span>
                  </div>
                ) : (
                  <div className={styles.noImage}>No thumbnail set</div>
                )}

                {formData.images.length > 0 && (
                  <div className={styles.previewGallery}>
                    <h4>Gallery Images ({formData.images.length})</h4>
                    <div className={styles.galleryGrid}>
                      {formData.images.map((img, index) => (
                        <div
                          key={index}
                          className={styles.previewImageContainer}
                        >
                          <img src={img} alt={`Gallery ${index + 1}`} />
                          <button
                            type="button"
                            className={styles.previewRemoveBtn}
                            onClick={() => removeImage(index)}
                            title="Remove image"
                          >
                            <X size={14} />
                          </button>
                          <button
                            type="button"
                            className={styles.previewSetThumbnailBtn}
                            onClick={() => setAsThumbnail(img)}
                            title="Set as main image"
                          >
                            Set as Main
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className={styles.previewDetails}>
                <h4>{formData.title || "Product Title"}</h4>
                <p className={styles.previewPrice}>
                  ₦{formData.price || "0.00"}
                </p>
                {formData.discountPercentage > 0 && (
                  <p className={styles.previewDiscount}>
                    {formData.discountPercentage}% OFF
                  </p>
                )}
                <div className={styles.previewRating}>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill={
                        i < Math.floor(formData.rating) ? "#FFD700" : "none"
                      }
                      color={
                        i < Math.floor(formData.rating) ? "#FFD700" : "#ccc"
                      }
                    />
                  ))}
                  <span>({formData.rating || "0"})</span>
                </div>
                <p className={styles.previewStock}>
                  {formData.stock || "0"} in stock
                </p>
                <p className={styles.previewBrand}>
                  <strong>Brand:</strong> {formData.brand || "Not specified"}
                </p>
                <p className={styles.previewCategory}>
                  <strong>Category:</strong>{" "}
                  {formData.category
                    ? formData.category.charAt(0).toUpperCase() +
                    formData.category.slice(1).replace("-", " ")
                    : "Not specified"}
                </p>
                <p className={styles.previewDescription}>
                  {formData.description || "No description provided."}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateItemPage;
