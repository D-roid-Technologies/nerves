// Create DeleteProductButton.tsx
import React, { useState } from "react";
import { Trash2, Loader } from "lucide-react";
import { authService } from "../../../redux/configuration/auth.service";
import "./DeleteProductButton.css";

interface DeleteProductButtonProps {
  productId: string | number;
  productName: string;
  onDeleteSuccess?: () => void;
}

const DeleteProductButton: React.FC<DeleteProductButtonProps> = ({
  productId,
  productName,
  onDeleteSuccess,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const success = await authService.deleteMyItem(productId);
      if (success && onDeleteSuccess) {
        onDeleteSuccess();
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="delete-confirmation">
        <p>Delete "{productName}"?</p>
        <div className="confirmation-buttons">
          <button
            className="confirm-delete-btn"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader size={16} className="spinner" />
            ) : (
              "Yes, Delete"
            )}
          </button>
          <button
            className="cancel-delete-btn"
            onClick={() => setShowConfirm(false)}
            disabled={isDeleting}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      className="delete-product-btn"
      onClick={() => setShowConfirm(true)}
      disabled={isDeleting}
      title={`Delete ${productName}`}
    >
      <Trash2 size={16} />
      {isDeleting ? "Deleting..." : "Delete"}
    </button>
  );
};

export default DeleteProductButton;
