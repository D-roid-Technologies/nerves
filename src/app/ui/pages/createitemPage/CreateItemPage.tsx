import type React from "react";

import { useState } from "react";
import { toast } from "react-hot-toast";
import {
  Package,
  DollarSign,
  FileText,
  ImageIcon,
  Tag,
  Layers,
  Save,
  X,
  Upload,
  Eye,
  EyeOff,
} from "lucide-react";
import "./create-item.css";

interface ItemFormData {
  name: string;
  description: string;
  price: string;
  category: string;
  brand: string;
  sku: string;
  stock: string;
  images: File[];
  tags: string[];
  specifications: { key: string; value: string }[];
  isActive: boolean;
  isFeatured: boolean;
}

const CreateItemPage = () => {
  const [formData, setFormData] = useState<ItemFormData>({
    name: "",
    description: "",
    price: "",
    category: "",
    brand: "",
    sku: "",
    stock: "",
    images: [],
    tags: [],
    specifications: [{ key: "", value: "" }],
    isActive: true,
    isFeatured: false,
  });

  const [currentTag, setCurrentTag] = useState("");
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const categories = [
    "Electronics",
    "Clothing",
    "Home & Garden",
    "Sports & Outdoors",
    "Books",
    "Toys & Games",
    "Health & Beauty",
    "Automotive",
    "Food & Beverages",
    "Other",
  ];

  const handleInputChange = (
    field: keyof ItemFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length + formData.images.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }

    const validFiles = files.filter((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Maximum 5MB per image.`);
        return false;
      }
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not a valid image file.`);
        return false;
      }
      return true;
    });

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...validFiles],
    }));

    // Create preview URLs
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview((prev) => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });

    toast.success(`${validFiles.length} image(s) uploaded successfully`);
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setImagePreview((prev) => prev.filter((_, i) => i !== index));
    toast.success("Image removed");
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()],
      }));
      setCurrentTag("");
      toast.success("Tag added");
    } else if (formData.tags.includes(currentTag.trim())) {
      toast.error("Tag already exists");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
    toast.success("Tag removed");
  };

  const addSpecification = () => {
    setFormData((prev) => ({
      ...prev,
      specifications: [...prev.specifications, { key: "", value: "" }],
    }));
  };

  const updateSpecification = (
    index: number,
    field: "key" | "value",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      specifications: prev.specifications.map((spec, i) =>
        i === index ? { ...spec, [field]: value } : spec
      ),
    }));
  };

  const removeSpecification = (index: number) => {
    if (formData.specifications.length > 1) {
      setFormData((prev) => ({
        ...prev,
        specifications: prev.specifications.filter((_, i) => i !== index),
      }));
      toast.success("Specification removed");
    }
  };

  const validateForm = () => {
    const errors = [];

    if (!formData.name.trim()) errors.push("Product name is required");
    if (!formData.description.trim()) errors.push("Description is required");
    if (!formData.price || Number.parseFloat(formData.price) <= 0)
      errors.push("Valid price is required");
    if (!formData.category) errors.push("Category is required");
    if (!formData.stock || Number.parseInt(formData.stock) < 0)
      errors.push("Valid stock quantity is required");
    if (formData.images.length === 0)
      errors.push("At least one image is required");

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateForm();
    if (errors.length > 0) {
      errors.forEach((error) => toast.error(error));
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Basic Info:", {
        name: formData.name,
        description: formData.description,
        price: Number.parseFloat(formData.price),
        category: formData.category,
        brand: formData.brand,
        sku: formData.sku,
        stock: Number.parseInt(formData.stock),
        isActive: formData.isActive,
        isFeatured: formData.isFeatured,
        tags: formData.tags,
        specification: formData.specifications.filter((spec) => spec.key && spec.value),
        images: formData.images.map((img) => ({
          name: img.name,
          size: img.size,
          type: img.type,
        }))
      });

      toast.success("Item created successfully! Check console for details.");

      // Reset form
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        brand: "",
        sku: "",
        stock: "",
        images: [],
        tags: [],
        specifications: [{ key: "", value: "" }],
        isActive: true,
        isFeatured: false,
      });
      setImagePreview([]);
      setCurrentTag("");
    } catch (error) {
      toast.error("Failed to create item. Please try again.");
      console.error("Error creating item:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-item-container">
      <div className="create-item-header">
        <div className="header-content">
          <Package className="header-icon" />
          <div>
            <h1>Create New Item</h1>
            <p>Add a new product to your inventory</p>
          </div>
        </div>
        <button
          type="button"
          className="preview-btn"
          onClick={() => setShowPreview(!showPreview)}
        >
          {showPreview ? <EyeOff /> : <Eye />}
          {showPreview ? "Hide Preview" : "Show Preview"}
        </button>
      </div>

      <div className="create-item-content">
        <form onSubmit={handleSubmit} className="item-form">
          {/* Basic Information */}
          <div className="form-section">
            <div className="section-header">
              <FileText className="section-icon" />
              <h2>Basic Information</h2>
            </div>

            <div className="form-grid">
              <div className="form-group full-width">
                <label htmlFor="name">Product Name *</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div className="form-group full-width">
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

              <div className="form-group">
                <label htmlFor="price">Price *</label>
                <div className="input-wrapper">
                  <DollarSign className="input-icon" />
                  <input
                    type="number"
                    id="price"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
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
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="brand">Brand</label>
                <input
                  type="text"
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => handleInputChange("brand", e.target.value)}
                  placeholder="Brand name"
                />
              </div>

              {/* <div className="form-group">
                <label htmlFor="sku">SKU</label>
                <input
                  type="text"
                  id="sku"
                  value={formData.sku}
                  onChange={(e) => handleInputChange("sku", e.target.value)}
                  placeholder="Stock Keeping Unit"
                />
              </div> */}

              <div className="form-group">
                <label htmlFor="stock">Stock Quantity *</label>
                <input
                  type="number"
                  id="stock"
                  value={formData.stock}
                  onChange={(e) => handleInputChange("stock", e.target.value)}
                  placeholder="0"
                  min="0"
                  required
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="form-section">
            <div className="section-header">
              <ImageIcon className="section-icon" />
              <h2>Product Images</h2>
            </div>

            <div className="image-upload-area">
              <input
                type="file"
                id="images"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="file-input"
              />
              <label htmlFor="images" className="upload-label">
                <Upload className="upload-icon" />
                <span>Click to upload images</span>
                <small>Maximum 5 images, 5MB each</small>
              </label>
            </div>

            {imagePreview.length > 0 && (
              <div className="image-preview-grid">
                {imagePreview.map((preview, index) => (
                  <div key={index} className="image-preview-item">
                    <img
                      src={preview || "/placeholder.svg"}
                      alt={`Preview ${index + 1}`}
                    />
                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={() => removeImage(index)}
                    >
                      <X />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="form-section">
            <div className="section-header">
              <Tag className="section-icon" />
              <h2>Tags</h2>
            </div>

            <div className="tag-input-area">
              <div className="tag-input-wrapper">
                <input
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  placeholder="Add a tag"
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addTag())
                  }
                />
                <button type="button" onClick={addTag} className="add-tag-btn">
                  Add
                </button>
              </div>

              {formData.tags.length > 0 && (
                <div className="tags-list">
                  {formData.tags.map((tag, index) => (
                    <span key={index} className="tag-item">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="remove-tag-btn"
                      >
                        <X />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Specifications */}
          <div className="form-section">
            <div className="section-header">
              <Layers className="section-icon" />
              <h2>Specifications</h2>
            </div>

            <div className="specifications-list">
              {formData.specifications.map((spec, index) => (
                <div key={index} className="specification-item">
                  <input
                    type="text"
                    value={spec.key}
                    onChange={(e) =>
                      updateSpecification(index, "key", e.target.value)
                    }
                    placeholder="Property name"
                  />
                  <input
                    type="text"
                    value={spec.value}
                    onChange={(e) =>
                      updateSpecification(index, "value", e.target.value)
                    }
                    placeholder="Property value"
                  />
                  {formData.specifications.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSpecification(index)}
                      className="remove-spec-btn"
                    >
                      <X />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addSpecification}
                className="add-spec-btn"
              >
                Add Specification
              </button>
            </div>
          </div>

          {/* Settings */}
          <div className="form-section">
            <div className="section-header">
              <h2>Settings</h2>
            </div>

            <div className="settings-grid">
              <label className="checkbox-wrapper">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) =>
                    handleInputChange("isActive", e.target.checked)
                  }
                />
                <span className="checkbox-label">Active Product</span>
                <small>Product will be visible to customers</small>
              </label>

              <label className="checkbox-wrapper">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) =>
                    handleInputChange("isFeatured", e.target.checked)
                  }
                />
                <span className="checkbox-label">Featured Product</span>
                <small>Product will appear in featured sections</small>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="form-actions">
            <button
              type="submit"
              className="submit-btn"
              disabled={isSubmitting}
            >
              <Save className="btn-icon" />
              {isSubmitting ? "Creating Item..." : "Create Item"}
            </button>
          </div>
        </form>

        {/* Preview Panel */}
        {showPreview && (
          <div className="preview-panel">
            <h3>Preview</h3>
            <div className="preview-content">
              <div className="preview-images">
                {imagePreview.length > 0 ? (
                  <img
                    src={imagePreview[0] || "/placeholder.svg"}
                    alt="Main preview"
                  />
                ) : (
                  <div className="no-image">No image</div>
                )}
              </div>
              <div className="preview-details">
                <h4>{formData.name || "Product Name"}</h4>
                <p className="preview-price">${formData.price || "0.00"}</p>
                <p className="preview-description">
                  {formData.description ||
                    "Product description will appear here..."}
                </p>
                <div className="preview-tags">
                  {formData.tags.map((tag, index) => (
                    <span key={index} className="preview-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

};

export default CreateItemPage;
