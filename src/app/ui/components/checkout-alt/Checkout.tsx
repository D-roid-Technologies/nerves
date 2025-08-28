import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../../redux/store";
import {
  removeFromCart,
  updateQuantity,
  clearCart,
} from "../../../redux/slice/cart";
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
    // if (!location.country?.trim()) missingFields.push("Country");

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

  const handlePlaceOrder = async (e: any) => {
    e.preventDefault();
    const payStack = new PayStackPop();
    payStack.newTransaction({
      key: "pk_test_db0145199289f83c428d57cf70755142bb0b8b28",
      email: paymentDetails.email,
      amount: Number(paymentDetails.amount) * 100,
      onSuccess: (res) => {
        toast.success(`Payment success: ${res.message}`, {
          style: { background: "#4BB543", color: "#fff" },
          duration: 3000, // Show for 3 seconds
        });

        setTimeout(() => {
          dispatch(clearCart());
          navigate("/");
        }, 3000); // Match the toast duration
      },
      onCancel: () => {
        console.log(`Payment cancelled`);
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

                  {/* Show login prompt if not logged in */}
                  {/* {!user.isLoggedIn && renderLoginPrompt()} */}

                  <div className="cart-items-list">
                    {items.map((item) => (
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
                          onClick={() => handleRemoveFromCart(item.product.id)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
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
                    {user.isLoggedIn && (
                      <span className="auto-filled-notice">
                        ✓ Information auto-filled from your profile
                      </span>
                    )}
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
                    {user.isLoggedIn && (
                      <span className="auto-filled-notice">
                        ✓ Information auto-filled from your profile
                      </span>
                    )}
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
                          placeholder="Oyekachi"
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
                          type="number"
                          id="amount"
                          value={paymentDetails.amount}
                          onChange={(e) =>
                            handlePaymentChange("amount", e.target.value)
                          }
                          placeholder={Math.round(total).toString()}
                          min="1"
                          required
                          readOnly
                        />
                      </div>
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
                {isProcessing ? "Processing..." : "Place Order"}
              </button>
            )}
          </div>
        </div>

        <div className="order-summary">
          <div className="summary-card">
            <h3>Order Summary</h3>

            <div className="summary-items">
              {items.map((item) => (
                <div key={item.product.id} className="summary-item">
                  <img
                    src={item.product.image || "/placeholder.svg"}
                    alt={item.product.name}
                  />
                  <div className="item-details">
                    <span className="item-name">{item.product.name}</span>
                    <span className="item-quantity">Qty: {item.quantity}</span>
                  </div>
                  <span className="item-price">
                    {formatPrice(
                      (item.product.discountPrice || item.product.price) *
                        item.quantity
                    )}
                  </span>
                </div>
              ))}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
