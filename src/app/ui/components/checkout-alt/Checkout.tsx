import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../../redux/store";
import {
  removeFromCart,
  updateQuantity,
  clearCart,
} from "../../../redux/slice/cart";
import { addNotification } from "../../../redux/slice/notification";
import {
  addPaidOrder,
  PaidOrder,
  PaidOrderItem,
} from "../../../redux/slice/paidOrders";
import { useNavigate } from "react-router-dom";
import {
  CreditCard,
  Truck,
  MapPin,
  User,
  Mail,
  Phone,
  Lock,
  ArrowLeft,
  ShoppingBag,
} from "lucide-react";
import "./checkout.css";
import PayStackPop from "@paystack/inline-js";
import toast from "react-hot-toast";
import { processOrderAndCreateSales } from "../../../utils/orderProcessor";
import { salesService } from "../../../redux/configuration/sales.service";

interface ShippingDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface PaymentDetails {
  firstName: string;
  lastName: string;
  email: string;
  amount: string;
}

// Extended product interface to include seller information
interface ExtendedProduct {
  id: number;
  name: string;
  price: number;
  discountPrice?: number;
  image?: string;
  sellerId?: string;
  sellerEmail?: string;
  // Add other product properties as needed
  category?: string;
  description?: string;
  rating?: number;
  reviewCount?: number;
  isNew?: boolean;
  slug?: string;
  stock?: number;
  brand?: string;
  thumbnail?: string;
  images?: string[];
}

interface CartItem {
  product: ExtendedProduct;
  quantity: number;
}

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((state: RootState) => state.cart);
  // Get user data from Redux store
  const user = useSelector((state: RootState) => state.user);

  const [currentStep, setCurrentStep] = useState(1);

  // Helper function to get initial shipping details from user data
  const getInitialShippingDetails = (): ShippingDetails => {
    if (user.isLoggedIn && user.primaryInformation && user.location) {
      return {
        firstName: user.primaryInformation.firstName || "",
        lastName: user.primaryInformation.lastName || "",
        email: user.primaryInformation.email || "",
        phone: user.primaryInformation.phone || "",
        address: `${user.location.streetNumber || ""} ${
          user.location.streetName || ""
        }`.trim(),
        city: user.location.city || "",
        state: user.location.state || "",
        zipCode: user.location.postalCode || "",
        country: user.location.country || "Nigeria",
      };
    }
    return {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "Nigeria",
    };
  };

  // Helper function to get initial payment details from user data
  const getInitialPaymentDetails = (): PaymentDetails => {
    if (user.isLoggedIn && user.primaryInformation) {
      return {
        firstName: user.primaryInformation.firstName || "",
        lastName: user.primaryInformation.lastName || "",
        email: user.primaryInformation.email || "",
        amount: "",
      };
    }
    return {
      firstName: "",
      lastName: "",
      email: "",
      amount: "",
    };
  };

  const [shippingDetails, setShippingDetails] = useState<ShippingDetails>(
    getInitialShippingDetails()
  );
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>(
    getInitialPaymentDetails()
  );

  const [shippingMethod, setShippingMethod] = useState("standard");
  const [isProcessing, setIsProcessing] = useState(false);

  // Function to check if user profile is complete
  const checkProfileCompletion = () => {
    if (!user.isLoggedIn || !user.primaryInformation || !user.location) {
      return {
        isComplete: false,
        missingFields: ["Please sign in to continue"],
      };
    }

    const missingFields: string[] = [];
    const { primaryInformation, location } = user;

    // Check required primary information fields
    if (!primaryInformation.firstName?.trim()) missingFields.push("First Name");
    if (!primaryInformation.lastName?.trim()) missingFields.push("Last Name");
    if (!primaryInformation.email?.trim()) missingFields.push("Email");
    if (!primaryInformation.phone?.trim()) missingFields.push("Phone Number");

    // Check required location fields
    if (!location.streetName?.trim() && !location.streetNumber?.trim()) {
      missingFields.push("Address");
    }
    if (!location.city?.trim()) missingFields.push("City");
    if (!location.state?.trim()) missingFields.push("State");
    if (!location.postalCode?.trim()) missingFields.push("ZIP/Postal Code");

    return {
      isComplete: missingFields.length === 0,
      missingFields,
    };
  };

  const profileCompletion = checkProfileCompletion();

  // Update forms when user data changes
  useEffect(() => {
    if (user.isLoggedIn && user.primaryInformation) {
      setShippingDetails(getInitialShippingDetails());
      setPaymentDetails((prev) => ({
        ...getInitialPaymentDetails(),
        amount: prev.amount, // Keep the calculated amount
      }));
    }
  }, [user.isLoggedIn, user.primaryInformation, user.location]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const subtotal = items.reduce((sum, item) => {
    const regularPrice = Number(item.product.price) || 0;
    const discountPrice = item.product.discountPrice
      ? Number(item.product.discountPrice)
      : null;

    const itemPrice = discountPrice || regularPrice;

    // Use cents-based calculation for precision
    const itemPriceInCents = Math.round(itemPrice * 100);
    const itemTotalInCents = itemPriceInCents * item.quantity;
    const itemTotal = itemTotalInCents / 100;

    return sum + itemTotal;
  }, 0);

  const shippingCost =
    shippingMethod === "express"
      ? 1599
      : shippingMethod === "overnight"
      ? 2999
      : 599;
  const tax = subtotal * 0.08;
  const total = subtotal + shippingCost + tax;

  // Update payment amount whenever total changes
  useEffect(() => {
    setPaymentDetails((prev) => ({
      ...prev,
      amount: Math.round(total).toString(),
    }));
  }, [total]);

  const handleRemoveFromCart = (itemId: number) => {
    dispatch(removeFromCart(itemId));
  };

  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      dispatch(removeFromCart(itemId));
    } else {
      dispatch(updateQuantity({ id: itemId, quantity: newQuantity }));
    }
  };

  const handleShippingChange = (
    field: keyof ShippingDetails,
    value: string
  ) => {
    setShippingDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handlePaymentChange = (field: keyof PaymentDetails, value: string) => {
    setPaymentDetails((prev) => ({
      ...prev,
      [field]: field === "amount" ? value.replace(/\D/g, "") : value,
    }));
  };

  const validateStep = (step: number) => {
    if (step === 1) {
      return items.length > 0;
    }
    if (step === 2) {
      return Object.values(shippingDetails).every(
        (value) => value.trim() !== ""
      );
    }
    if (step === 3) {
      return Object.values(paymentDetails).every(
        (value) => value.trim() !== ""
      );
    }
    return true;
  };

  // Helper function to generate unique order ID
  const generateOrderId = () => {
    const timestamp = new Date().getTime();
    const randomNum = Math.floor(Math.random() * 1000);
    return `ORD-${timestamp}-${randomNum}`;
  };

  const handlePlaceOrder = async (e: any) => {
    e.preventDefault();
    setIsProcessing(true);

    const payStack = new PayStackPop();
    payStack.newTransaction({
      key: "pk_test_db0145199289f83c428d57cf70755142bb0b8b28",
      email: paymentDetails.email,
      amount: Number(paymentDetails.amount) * 100,
      onSuccess: async (res) => {
        setIsProcessing(false);

        // Generate unique order ID
        const orderId = generateOrderId();
        const currentDate = new Date().toISOString();

        // Transform cart items to paid order items
        const paidOrderItems: PaidOrderItem[] = items.map((item) => ({
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          discountPrice: item.product.discountPrice,
          image: item.product.image,
          quantity: item.quantity,
          total:
            (item.product.discountPrice || item.product.price) * item.quantity,
          // Add seller information if available - use type assertion to avoid TypeScript errors
          sellerId: (item.product as any).sellerId,
          sellerEmail: (item.product as any).sellerEmail,
        }));

        // Create paid order object
        const paidOrder: PaidOrder = {
          id: res.reference || orderId,
          orderId: orderId,
          items: paidOrderItems,
          shippingDetails: { ...shippingDetails },
          paymentDetails: {
            ...paymentDetails,
            reference: res.reference || orderId,
            transactionDate: currentDate,
          },
          shippingMethod,
          shippingCost,
          tax,
          subtotal,
          total,
          status: "paid",
          createdAt: currentDate,
          updatedAt: currentDate,
        };

        // Add to paid orders slice
        dispatch(addPaidOrder(paidOrder));

        // 🆕 CREATE SALES RECORDS FOR SELLERS
        try {
          await processOrderAndCreateSales(paidOrder);
          console.log("✅ Sales records created for order:", orderId);

          // Show success message for sellers
          toast.success("Sales records created for sellers!", {
            duration: 3000,
          });
        } catch (error) {
          console.error("❌ Failed to create sales records:", error);
          // Don't block the user flow if sales creation fails
          toast.error(
            "Failed to create sales records, but your order was successful",
            {
              duration: 3000,
            }
          );
        }

        // Create success notification for the entire order
        dispatch(
          addNotification(
            "success",
            "Order Successful!",
            `Your order #${orderId} has been placed successfully. Total: ${formatPrice(
              total
            )}`,
            { isPersistent: true }
          )
        );

        // Clear cart after successful payment
        dispatch(clearCart());

        // Navigate to success page with order details
        navigate("/order-status", {
          state: {
            status: "success",
            orderId: orderId,
            amount: total,
            email: paymentDetails.email,
            transactionRef: res.reference,
          },
          replace: true,
        });
      },
      onCancel: () => {
        setIsProcessing(false);
        console.log(`Payment cancelled`);

        // Create cancellation notification
        dispatch(
          addNotification(
            "warning",
            "Payment Cancelled",
            "Your payment was cancelled. Your cart items have been preserved.",
            { isPersistent: false }
          )
        );

        // Navigate to cancelled status page
        navigate("/order-status", {
          state: {
            status: "cancelled",
            orderId: generateOrderId(),
            amount: total,
            email: paymentDetails.email,
          },
          replace: true,
        });

        toast("Payment was cancelled", {
          style: {
            background: "#f59e0b",
            color: "#fff",
            border: "1px solid #d97706",
          },
          icon: "⚠️",
          duration: 3000,
        });
      },
      onError: (error) => {
        setIsProcessing(false);
        console.log(`Payment error: ${error.message}`);

        // Create error notification
        dispatch(
          addNotification(
            "error",
            "Payment Failed",
            "There was an error processing your payment. Please try again.",
            { isPersistent: true }
          )
        );

        // Navigate to failed status page
        navigate("/order-status", {
          state: {
            status: "failed",
            orderId: generateOrderId(),
            amount: total,
            email: paymentDetails.email,
            error: error.message,
          },
          replace: true,
        });

        toast.error(`Payment failed: ${error.message}`, {
          style: {
            background: "#ef4444",
            color: "#fff",
            border: "1px solid #dc2626",
          },
          icon: "❌",
          duration: 3000,
        });
      },
    });
  };

  const nextStep = () => {
    // Check profile completion when trying to proceed from step 2
    if (currentStep === 2 && user.isLoggedIn && !profileCompletion.isComplete) {
      toast.error("Please complete your profile information before proceeding");
      return;
    }

    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Add temporary test sales button (remove in production)
  const addTestSales = () => {
    salesService.addTestSales();
    toast.success("Test sales added! Check your sales page.");
  };

  // Helper function to safely get seller information
  const getSellerInfo = (product: ExtendedProduct) => {
    const sellerId = (product as any).sellerId;
    const sellerEmail = (product as any).sellerEmail;

    if (sellerId || sellerEmail) {
      return {
        sellerId,
        sellerEmail,
        displayName: sellerEmail
          ? sellerEmail.split("@")[0]
          : sellerId || "Unknown Seller",
      };
    }
    return null;
  };

  // Count unique sellers in the cart
  const uniqueSellersCount = new Set(
    items.map((item) => getSellerInfo(item.product)?.sellerId).filter(Boolean)
  ).size;

  if (items.length === 0) {
    return (
      <div className="checkout-container">
        <div className="empty-cart">
          <ShoppingBag className="empty-cart-icon" />
          <h2>Your cart is empty</h2>
          <p>Add some items to your cart before checking out.</p>
          <button className="btn btn-primary" onClick={() => navigate("/")}>
            Start Shopping
          </button>

          {/* Temporary test button - remove in production */}
          <div
            style={{
              marginTop: "20px",
              padding: "10px",
              background: "#f3f4f6",
              borderRadius: "8px",
            }}
          >
            <p
              style={{
                fontSize: "14px",
                color: "#6b7280",
                marginBottom: "10px",
              }}
            >
              <strong>Developer Note:</strong> Sales tracking is now integrated.
              When customers purchase items, sales will automatically be created
              for sellers.
            </p>
            <button
              onClick={addTestSales}
              style={{
                padding: "8px 16px",
                background: "#f59e0b",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              Add Test Sales Data
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <h1>Checkout</h1>
        <button className="back-to-products-btn" onClick={() => navigate("/")}>
          <ArrowLeft className="back-icon" />
          Continue Shopping
        </button>

        <div className="step-indicator">
          <div className={`step ${currentStep >= 1 ? "active" : ""}`}>
            <div className="step-number">1</div>
            <span>Review</span>
          </div>
          <div className={`step ${currentStep >= 2 ? "active" : ""}`}>
            <div className="step-number">2</div>
            <span>Shipping</span>
          </div>
          <div className={`step ${currentStep >= 3 ? "active" : ""}`}>
            <div className="step-number">3</div>
            <span>Payment</span>
          </div>
          <div className={`step ${currentStep >= 4 ? "active" : ""}`}>
            <div className="step-number">4</div>
            <span>Review</span>
          </div>
        </div>
      </div>

      <div className="checkout-content">
        <div className="checkout-main">
          <div className="step-content-wrapper">
            <div
              className={`step-content ${currentStep === 1 ? "active" : ""}`}
            >
              {currentStep === 1 && (
                <div className="cart-review-section">
                  <div className="section-header">
                    <ShoppingBag className="section-icon" />
                    <h2>Review Your Order</h2>
                  </div>

                  <div className="cart-items-list">
                    {items.map((item) => {
                      const sellerInfo = getSellerInfo(item.product);
                      return (
                        <div key={item.product.id} className="cart-item">
                          <img
                            src={item.product.image || "/placeholder.svg"}
                            alt={item.product.name}
                            className="cart-item-image"
                          />
                          <div className="cart-item-details">
                            <h3>{item.product.name}</h3>
                            <p className="item-price">
                              {formatPrice(
                                item.product.discountPrice || item.product.price
                              )}
                            </p>
                            {sellerInfo && (
                              <p
                                className="item-seller"
                                style={{ fontSize: "12px", color: "#6b7280" }}
                              >
                                Sold by: {sellerInfo.displayName}
                              </p>
                            )}
                            <div className="quantity-controls">
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    item.product.id,
                                    item.quantity - 1
                                  )
                                }
                                disabled={item.quantity <= 1}
                              >
                                -
                              </button>
                              <span>{item.quantity}</span>
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    item.product.id,
                                    item.quantity + 1
                                  )
                                }
                              >
                                +
                              </button>
                            </div>
                          </div>
                          <button
                            className="remove-button"
                            onClick={() =>
                              handleRemoveFromCart(item.product.id)
                            }
                          >
                            ×
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Sales Integration Notice */}
                  <div className="integration-notice">
                    <div className="notice-content">
                      <h4>🎯 Sales Tracking Enabled</h4>
                      <p>
                        When you complete this purchase, sales records will
                        automatically be created for each seller. Sellers can
                        view their sales in the "My Sales" section of their
                        account.
                      </p>
                      {uniqueSellersCount > 0 && (
                        <p className="sellers-count">
                          This order contains items from{" "}
                          <strong>{uniqueSellersCount}</strong> unique seller
                          {uniqueSellersCount !== 1 ? "s" : ""}.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div
              className={`step-content ${currentStep === 2 ? "active" : ""}`}
            >
              {currentStep === 2 && (
                <div className="shipping-section">
                  <div className="section-header">
                    <Truck className="section-icon" />
                    <h2>Shipping Information</h2>
                  </div>

                  {/* Show profile completion warning for logged in users with incomplete profiles */}
                  {user.isLoggedIn && !profileCompletion.isComplete && (
                    <div className="profile-warning">
                      <div className="warning-content">
                        <div className="warning-header">
                          <User className="warning-icon" />
                          <h3>Complete Your Profile</h3>
                        </div>
                        <div className="warning-body">
                          <p>
                            Some required information is missing from your
                            profile. Please complete it to proceed with
                            checkout.
                          </p>
                          <div className="missing-fields-list">
                            <strong>Missing Information:</strong>
                            <ul>
                              {profileCompletion.missingFields.map(
                                (field, index) => (
                                  <li key={index}>{field}</li>
                                )
                              )}
                            </ul>
                          </div>
                        </div>
                        <div className="warning-actions">
                          <button
                            className="btn btn-warning"
                            onClick={() => navigate("/settings")}
                          >
                            Complete Profile Now
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <form className="shipping-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="firstName">First Name</label>
                        <div className="input-wrapper">
                          <User className="input-icon" />
                          <input
                            type="text"
                            id="firstName"
                            value={shippingDetails.firstName}
                            onChange={(e) =>
                              handleShippingChange("firstName", e.target.value)
                            }
                            placeholder="Onyekachi"
                            required
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label htmlFor="lastName">Last Name</label>
                        <div className="input-wrapper">
                          <User className="input-icon" />
                          <input
                            type="text"
                            id="lastName"
                            value={shippingDetails.lastName}
                            onChange={(e) =>
                              handleShippingChange("lastName", e.target.value)
                            }
                            placeholder="Godswill"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <div className="input-wrapper">
                          <Mail className="input-icon" />
                          <input
                            type="email"
                            id="email"
                            value={shippingDetails.email}
                            onChange={(e) =>
                              handleShippingChange("email", e.target.value)
                            }
                            placeholder="onyekachi.godswill@example.com"
                            required
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label htmlFor="phone">Phone</label>
                        <div className="input-wrapper">
                          <Phone className="input-icon" />
                          <input
                            type="tel"
                            id="phone"
                            value={shippingDetails.phone}
                            onChange={(e) =>
                              handleShippingChange("phone", e.target.value)
                            }
                            placeholder="(234) 123-4567"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="address">Address</label>
                      <div className="input-wrapper">
                        <MapPin className="input-icon" />
                        <input
                          type="text"
                          id="address"
                          value={shippingDetails.address}
                          onChange={(e) =>
                            handleShippingChange("address", e.target.value)
                          }
                          placeholder="123 Main Street"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="city">City</label>
                        <input
                          type="text"
                          id="city"
                          value={shippingDetails.city}
                          onChange={(e) =>
                            handleShippingChange("city", e.target.value)
                          }
                          placeholder="Lagos"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="state">State</label>
                        <input
                          type="text"
                          id="state"
                          value={shippingDetails.state}
                          onChange={(e) =>
                            handleShippingChange("state", e.target.value)
                          }
                          placeholder="Lagos"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="zipCode">ZIP Code</label>
                        <input
                          type="text"
                          id="zipCode"
                          value={shippingDetails.zipCode}
                          onChange={(e) =>
                            handleShippingChange("zipCode", e.target.value)
                          }
                          placeholder="100001"
                          required
                        />
                      </div>
                    </div>

                    <div className="shipping-methods">
                      <h3>Shipping Method</h3>
                      <div className="shipping-options">
                        <label className="shipping-option">
                          <input
                            type="radio"
                            name="shipping"
                            value="standard"
                            checked={shippingMethod === "standard"}
                            onChange={(e) => setShippingMethod(e.target.value)}
                          />
                          <div className="option-content">
                            <span className="option-name">
                              Standard Shipping
                            </span>
                            <span className="option-time">
                              5-7 business days
                            </span>
                            <span className="option-price">₦599</span>
                          </div>
                        </label>
                        <label className="shipping-option">
                          <input
                            type="radio"
                            name="shipping"
                            value="express"
                            checked={shippingMethod === "express"}
                            onChange={(e) => setShippingMethod(e.target.value)}
                          />
                          <div className="option-content">
                            <span className="option-name">
                              Express Shipping
                            </span>
                            <span className="option-time">
                              2-3 business days
                            </span>
                            <span className="option-price">₦1,599</span>
                          </div>
                        </label>
                        <label className="shipping-option">
                          <input
                            type="radio"
                            name="shipping"
                            value="overnight"
                            checked={shippingMethod === "overnight"}
                            onChange={(e) => setShippingMethod(e.target.value)}
                          />
                          <div className="option-content">
                            <span className="option-name">
                              Overnight Shipping
                            </span>
                            <span className="option-time">
                              Next business day
                            </span>
                            <span className="option-price">₦2,999</span>
                          </div>
                        </label>
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </div>

            <div
              className={`step-content ${currentStep === 3 ? "active" : ""}`}
            >
              {currentStep === 3 && (
                <div className="payment-section">
                  <div className="section-header">
                    <CreditCard className="section-icon" />
                    <h2>Payment Information</h2>
                  </div>

                  <form className="payment-form">
                    <div className="form-group">
                      <label htmlFor="firstName">First Name</label>
                      <div className="input-wrapper">
                        <User className="input-icon" />
                        <input
                          type="text"
                          id="firstName"
                          value={paymentDetails.firstName}
                          onChange={(e) =>
                            handlePaymentChange("firstName", e.target.value)
                          }
                          placeholder="Richard"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="lastName">Last Name</label>
                      <div className="input-wrapper">
                        <User className="input-icon" />
                        <input
                          type="text"
                          id="lastName"
                          value={paymentDetails.lastName}
                          onChange={(e) =>
                            handlePaymentChange("lastName", e.target.value)
                          }
                          placeholder="Onyekachi"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="email">Email</label>
                      <div className="input-wrapper">
                        <Mail className="input-icon" />
                        <input
                          type="email"
                          id="email"
                          value={paymentDetails.email}
                          onChange={(e) =>
                            handlePaymentChange("email", e.target.value)
                          }
                          placeholder="example@email.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="amount">
                        Amount (Auto-calculated from total)
                      </label>
                      <div className="input-wrapper">
                        <CreditCard className="input-icon" />
                        <input
                          type="text"
                          id="amount"
                          value={formatPrice(total)}
                          readOnly
                          className="readonly-input"
                        />
                      </div>
                    </div>

                    <div className="payment-security">
                      <div className="security-badge">
                        <Lock size={16} />
                        <span>Secure Payment</span>
                      </div>
                      <p className="security-note">
                        Your payment is processed securely through Paystack. We
                        do not store your payment details.
                      </p>
                    </div>
                  </form>
                </div>
              )}
            </div>

            <div
              className={`step-content ${currentStep === 4 ? "active" : ""}`}
            >
              {currentStep === 4 && (
                <div className="review-section">
                  <div className="section-header">
                    <h2>Final Review</h2>
                  </div>

                  <div className="review-content">
                    <div className="review-shipping">
                      <h3>Shipping Address</h3>
                      <p>
                        {shippingDetails.firstName} {shippingDetails.lastName}
                      </p>
                      <p>{shippingDetails.address}</p>
                      <p>
                        {shippingDetails.city}, {shippingDetails.state}{" "}
                        {shippingDetails.zipCode}
                      </p>
                      <p>{shippingDetails.email}</p>
                      <p>{shippingDetails.phone}</p>
                    </div>

                    <div className="review-payment">
                      <h3>Payment Method</h3>
                      <p>
                        {paymentDetails.firstName} {paymentDetails.lastName}
                      </p>
                      <p>{paymentDetails.email}</p>
                      <p>
                        Amount: {formatPrice(Number(paymentDetails.amount))}
                      </p>
                    </div>

                    <div className="review-shipping-method">
                      <h3>Shipping Method</h3>
                      <p>
                        {shippingMethod === "standard" &&
                          "Standard Shipping (5-7 business days)"}
                        {shippingMethod === "express" &&
                          "Express Shipping (2-3 business days)"}
                        {shippingMethod === "overnight" &&
                          "Overnight Shipping (Next business day)"}
                      </p>
                    </div>

                    <div className="sales-notice">
                      <div className="notice-icon">🎯</div>
                      <div className="notice-text">
                        <h4>Sales Tracking</h4>
                        <p>
                          After payment, sales records will be automatically
                          created for each seller. Sellers will be able to track
                          their sales in their account dashboard.
                        </p>
                        {uniqueSellersCount > 0 && (
                          <p className="sellers-count-review">
                            This order will create sales records for{" "}
                            <strong>{uniqueSellersCount}</strong> seller
                            {uniqueSellersCount !== 1 ? "s" : ""}.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="checkout-actions">
            {currentStep > 1 && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={prevStep}
              >
                Back
              </button>
            )}

            {currentStep < 4 ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={nextStep}
                disabled={
                  !validateStep(currentStep) ||
                  (currentStep === 2 &&
                    user.isLoggedIn &&
                    !profileCompletion.isComplete)
                }
              >
                {currentStep === 2 &&
                user.isLoggedIn &&
                !profileCompletion.isComplete
                  ? "Complete Profile First"
                  : "Continue"}
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-primary"
                onClick={handlePlaceOrder}
                disabled={isProcessing}
              >
                {isProcessing ? <>Processing...</> : "Place Order & Pay"}
              </button>
            )}
          </div>
        </div>

        <div className="order-summary">
          <div className="summary-card">
            <h3>Order Summary</h3>

            <div className="summary-items">
              {items.map((item) => {
                const sellerInfo = getSellerInfo(item.product);
                return (
                  <div key={item.product.id} className="summary-item">
                    <img
                      src={item.product.image || "/placeholder.svg"}
                      alt={item.product.name}
                    />
                    <div className="item-details">
                      <span className="item-name">{item.product.name}</span>
                      <span className="item-quantity">
                        Qty: {item.quantity}
                      </span>
                      {sellerInfo && (
                        <span className="item-seller">
                          Seller: {sellerInfo.displayName}
                        </span>
                      )}
                    </div>
                    <span className="item-price">
                      {formatPrice(
                        (item.product.discountPrice || item.product.price) *
                          item.quantity
                      )}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="summary-totals">
              <div className="total-row">
                <span>Subtotal:</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="total-row">
                <span>Shipping:</span>
                <span>{formatPrice(shippingCost)}</span>
              </div>
              <div className="total-row">
                <span>Tax:</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <div className="total-row total-final">
                <span>Total:</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <div className="sales-integration-info">
              <div className="integration-badge">
                <span>🎯 Sales Tracking Active</span>
              </div>
              <p className="integration-description">
                This purchase will create sales records for{" "}
                <strong>{uniqueSellersCount}</strong> seller
                {uniqueSellersCount !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {/* Temporary test section - remove in production */}
          <div className="test-section">
            <div className="test-card">
              <h4>🧪 Developer Tools</h4>
              <p>Test the sales tracking system:</p>
              <button onClick={addTestSales} className="btn-test-sales">
                Add Test Sales Data
              </button>
              <p className="test-note">
                This adds sample sales data to see how the sales tracking works.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
