// components/CartDrawer/CartDrawer.tsx
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

const CartDrawer = () => {
  const dispatch = useDispatch();
  const { items, isOpen } = useSelector((state: RootState) => state.cart);

  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  if (!isOpen) return null;

  return (
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
              // Handle checkout logic
              alert("Proceeding to checkout!");
              dispatch(clearCart());
              dispatch(toggleCart());
            }}
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default CartDrawer;
