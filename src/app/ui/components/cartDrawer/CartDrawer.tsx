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

  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

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
                    <p>${item.product.price}</p>
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
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <button
                className={styles.checkoutButton}
                onClick={() => {
                  if (isUserLoggedIn === true) {
                    toast.success("Proceeding to checkout", {
                      style: { background: "#4BB543", color: "#fff" },
                    });
                    dispatch(toggleCart());
                    navigate("/checkout"); // Add this line to navigate to checkout
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
