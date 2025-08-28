import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../redux/store";
import {
  removeFromCart,
  updateQuantity,
  toggleCart,
  clearCart,
} from "../../../redux/slice/cart";
import styles from "./CartDrawer.module.css";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CartDrawer: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const { items, isOpen } = useSelector((state: RootState) => state.cart);
  const isUserLoggedIn = useSelector(
    (state: RootState) => state.user.isLoggedIn
  );
  const navigate = useNavigate();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const totalPrice = items.reduce((sum, item) => {
    // Ensure we're working with numbers and handle precision
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

  return (
    <>
      {/* Always render Toaster so toast can show anytime */}
      <Toaster position="top-center" reverseOrder={false} />

      {/* Only show the drawer if open */}
      {isOpen && (
        <div className={styles.cartDrawer}>
          <div className={styles.cartHeader}>
            <h2>Your Cart</h2>
            <button
              className={styles.closeButton}
              onClick={() => dispatch(toggleCart())}
            >
              &times;
            </button>
          </div>

          <div className={styles.cartItems}>
            {items.length === 0 ? (
              <p className={styles.emptyCart}>Your cart is empty</p>
            ) : (
              items.map((item) => (
                <div key={item.product.id} className={styles.cartItem}>
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className={styles.productImage}
                  />
                  <div className={styles.productInfo}>
                    <h3>{item.product.name}</h3>
                    <div className="price-display">
                      {item.product.discountPrice ? (
                        <>
                          <span className="discounted-price">
                            {formatPrice(item.product.discountPrice)}
                          </span>
                          <span
                            className="original-price"
                            style={{
                              textDecoration: "line-through",
                              fontSize: "0.9em",
                              color: "#999",
                              marginLeft: "8px",
                            }}
                          >
                            {formatPrice(item.product.price)}
                          </span>
                        </>
                      ) : (
                        <p>{formatPrice(item.product.price)}</p>
                      )}
                    </div>
                    <div className={styles.quantityControls}>
                      <button
                        onClick={() =>
                          dispatch(
                            updateQuantity({
                              id: item.product.id,
                              quantity: item.quantity - 1,
                            })
                          )
                        }
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() =>
                          dispatch(
                            updateQuantity({
                              id: item.product.id,
                              quantity: item.quantity + 1,
                            })
                          )
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    className={styles.removeButton}
                    onClick={() => dispatch(removeFromCart(item.product.id))}
                  >
                    &times;
                  </button>
                </div>
              ))
            )}
          </div>

          {items.length > 0 && (
            <div className={styles.cartFooter}>
              <div className={styles.total}>
                <span>Total:</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <button
                className={styles.checkoutButton}
                onClick={() => {
                  if (isUserLoggedIn === true) {
                    toast.success("Proceeding to checkout", {
                      style: { background: "#4BB543", color: "#fff" },
                    });
                    dispatch(toggleCart());
                    navigate("/checkout");
                  } else {
                    toast.error("Please log in to your account.", {
                      style: { background: "red", color: "#fff" },
                    });
                    dispatch(toggleCart());
                    navigate("/login");
                  }
                }}
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default CartDrawer;
