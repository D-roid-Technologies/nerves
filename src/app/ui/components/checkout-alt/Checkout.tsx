"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../../redux/store";
import { clearCart } from "../../../redux/slice/cart";
import {
  CreditCard,
  Truck,
  MapPin,
  User,
  Mail,
  Phone,
  Lock,
} from "lucide-react";
import "./checkout.css";

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
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}

const Checkout = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state: RootState) => state.cart);

  const [currentStep, setCurrentStep] = useState(1);
  const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  });

  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  });

  const [shippingMethod, setShippingMethod] = useState("standard");
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shippingCost =
    shippingMethod === "express"
      ? 15.99
      : shippingMethod === "overnight"
      ? 29.99
      : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shippingCost + tax;

  const handleShippingChange = (
    field: keyof ShippingDetails,
    value: string
  ) => {
    setShippingDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handlePaymentChange = (field: keyof PaymentDetails, value: string) => {
    setPaymentDetails((prev) => ({ ...prev, [field]: value }));
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const handleCardNumberChange = (value: string) => {
    const formatted = formatCardNumber(value);
    if (formatted.replace(/\s/g, "").length <= 16) {
      handlePaymentChange("cardNumber", formatted);
    }
  };

  const handleExpiryChange = (value: string) => {
    const v = value.replace(/\D/g, "");
    if (v.length >= 2) {
      const formatted = v.substring(0, 2) + "/" + v.substring(2, 4);
      handlePaymentChange("expiryDate", formatted);
    } else {
      handlePaymentChange("expiryDate", v);
    }
  };

  const validateStep = (step: number) => {
    if (step === 1) {
      return Object.values(shippingDetails).every(
        (value) => value.trim() !== ""
      );
    }
    if (step === 2) {
      return Object.values(paymentDetails).every(
        (value) => value.trim() !== ""
      );
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    alert("Order placed successfully!");
    dispatch(clearCart());
    setIsProcessing(false);

    // Redirect to success page or reset form
    setCurrentStep(1);
    setShippingDetails({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States",
    });
    setPaymentDetails({
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      cardholderName: "",
    });
  };

  if (items.length === 0) {
    return (
      <div className="checkout-container">
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <p>Add some items to your cart before checking out.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <h1>Checkout</h1>
        <div className="step-indicator">
          <div className={`step ${currentStep >= 1 ? "active" : ""}`}>
            <div className="step-number">1</div>
            <span>Shipping</span>
          </div>
          <div className={`step ${currentStep >= 2 ? "active" : ""}`}>
            <div className="step-number">2</div>
            <span>Payment</span>
          </div>
          <div className={`step ${currentStep >= 3 ? "active" : ""}`}>
            <div className="step-number">3</div>
            <span>Review</span>
          </div>
        </div>
      </div>

      <div className="checkout-content">
        <div className="checkout-main">
          {currentStep === 1 && (
            <div className="shipping-section">
              <div className="section-header">
                <Truck className="section-icon" />
                <h2>Shipping Information</h2>
              </div>

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
                        placeholder="John"
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
                        placeholder="Doe"
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
                        placeholder="john.doe@example.com"
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
                        placeholder="(555) 123-4567"
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
                      placeholder="New York"
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
                      placeholder="NY"
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
                      placeholder="10001"
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
                        <span className="option-name">Standard Shipping</span>
                        <span className="option-time">5-7 business days</span>
                        <span className="option-price">$5.99</span>
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
                        <span className="option-name">Express Shipping</span>
                        <span className="option-time">2-3 business days</span>
                        <span className="option-price">$15.99</span>
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
                        <span className="option-name">Overnight Shipping</span>
                        <span className="option-time">Next business day</span>
                        <span className="option-price">$29.99</span>
                      </div>
                    </label>
                  </div>
                </div>
              </form>
            </div>
          )}

          {currentStep === 2 && (
            <div className="payment-section">
              <div className="section-header">
                <CreditCard className="section-icon" />
                <h2>Payment Information</h2>
              </div>

              <form className="payment-form">
                <div className="form-group">
                  <label htmlFor="cardholderName">Cardholder Name</label>
                  <div className="input-wrapper">
                    <User className="input-icon" />
                    <input
                      type="text"
                      id="cardholderName"
                      value={paymentDetails.cardholderName}
                      onChange={(e) =>
                        handlePaymentChange("cardholderName", e.target.value)
                      }
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="cardNumber">Card Number</label>
                  <div className="input-wrapper">
                    <CreditCard className="input-icon" />
                    <input
                      type="text"
                      id="cardNumber"
                      value={paymentDetails.cardNumber}
                      onChange={(e) => handleCardNumberChange(e.target.value)}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="expiryDate">Expiry Date</label>
                    <input
                      type="text"
                      id="expiryDate"
                      value={paymentDetails.expiryDate}
                      onChange={(e) => handleExpiryChange(e.target.value)}
                      placeholder="MM/YY"
                      maxLength={5}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="cvv">CVV</label>
                    <div className="input-wrapper">
                      <Lock className="input-icon" />
                      <input
                        type="text"
                        id="cvv"
                        value={paymentDetails.cvv}
                        onChange={(e) =>
                          handlePaymentChange(
                            "cvv",
                            e.target.value.replace(/\D/g, "").slice(0, 4)
                          )
                        }
                        placeholder="123"
                        maxLength={4}
                        required
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>
          )}

          {currentStep === 3 && (
            <div className="review-section">
              <div className="section-header">
                <h2>Order Review</h2>
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
                  <p>**** **** **** {paymentDetails.cardNumber.slice(-4)}</p>
                  <p>{paymentDetails.cardholderName}</p>
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

          <div className="checkout-actions">
            {currentStep > 1 && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                Back
              </button>
            )}

            {currentStep < 3 ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!validateStep(currentStep)}
              >
                Continue
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
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="summary-totals">
              <div className="total-row">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Shipping:</span>
                <span>${shippingCost.toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Tax:</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="total-row total-final">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
