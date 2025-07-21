import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../redux/store";
import { toggleCart } from "../../../redux/slice/cart";
import styles from "./Overlay.module.css";

const Overlay = () => {
  const dispatch = useDispatch();
  const { isOpen } = useSelector((state: RootState) => state.cart);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={() => dispatch(toggleCart())} />
  );
};

export default Overlay;
