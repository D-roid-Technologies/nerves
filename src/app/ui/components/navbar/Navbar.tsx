import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearUser } from "../../../redux/slice/user";
import { RootState, store } from "../../../redux/store";
import styles from "./navbar.module.css";

const Navbar = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const user = useSelector((state: RootState) => state.user);
  const cart = useSelector((state: RootState) => state.cart);

  const cartItemCount = cart.items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
    setShowSearch(false);
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    setSearchQuery("");
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const dispatch = store.dispatch;
  function toggleCart() {
    dispatch({ type: "cart/toggleCart" });
  }

  const navigate = useNavigate();

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.navbarContainer}>
          {/* Left Links */}
          <ul className={styles.navLinks}>
            <li>
              <Link to="/products">Shop</Link>
            </li>
            <li>
              <Link to="/collections">Collections</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
          </ul>

          {/* Logo */}
          <div className={styles.logo}>
            <Link to="/">NERVES</Link>
          </div>

          {/* Right Actions */}
          <div className={styles.actions}>
            {/* Search Icon */}
            <button
              className={styles.searchIcon}
              onClick={toggleSearch}
              aria-label="Search"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={styles.searchIcon}
              >
                <path d="m21 21-4.34-4.34" />
                <circle cx="11" cy="11" r="8" />
              </svg>
            </button>
            <button className={styles.searchIcon}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10.268 21a2 2 0 0 0 3.464 0" />
                <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />
              </svg>
            </button>
            {/* Cart Icon */}
            <button
              type="button"
              className={styles.cartIcon}
              aria-label="Cart"
              onClick={() => dispatch({ type: "cart/toggleCart" })}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={styles.cartIcon}
              >
                <circle cx="8" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
              </svg>
              {cartItemCount > 0 && (
                <span className={styles.cartBadge}>{cartItemCount}</span>
              )}
            </button>
            {/* User Dropdown */}
            <div className={styles.userContainer}>
              <div className={styles.userDropdown}>
                <button
                  className={styles.userButton}
                  onClick={toggleDropdown}
                  aria-label="User menu"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={user.isLoggedIn ? "orange" : "currentColor"}
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={styles.userIcon}
                  >
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="none"
                    viewBox="0 0 24 24"
                      stroke={user.isLoggedIn ? "orange" : "currentColor"}
                    className={`${styles.chevron} ${
                      showDropdown ? styles.rotate : ""
                    }`}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {showDropdown && (
                  <div className={styles.dropdownMenu}>
                    {user.isLoggedIn ? (
                      <>
                        <div className={styles.dropdownHeader}>
                          Welcome, {user.firstName}
                        </div>
                        <Link to="/account" className={styles.dropdownItem}>
                          My Account
                        </Link>
                        <Link to="/orders" className={styles.dropdownItem}>
                          My Orders
                        </Link>
                        <Link to="/create" className={styles.dropdownItem}>
                          Create Items
                        </Link>
                        <Link to="/settings" className={styles.dropdownItem}>
                          Settings
                        </Link>
                        <button
                          className={styles.dropdownItem}
                          onClick={() => {
                            store.dispatch(clearUser());
                            setShowDropdown(false);
                            navigate("/products");
                          }}
                        >
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <Link to="/login" className={styles.dropdownItem}>
                          Sign In
                        </Link>
                        <Link to="/register" className={styles.dropdownItem}>
                          Create Account
                        </Link>
                        <Link to="/guest" className={styles.dropdownItem}>
                          Continue as Guest
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Search Overlay */}
      {showSearch && (
        <div className={styles.searchOverlay}>
          <div className={styles.searchContainer}>
            <button
              className={styles.closeSearch}
              onClick={toggleSearch}
              aria-label="Close search"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <form onSubmit={handleSearch} className={styles.searchForm}>
              <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className={styles.searchInput}
              />
              <button
                type="submit"
                className={styles.searchSubmit}
                aria-label="Submit search"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="50"
                  height="50"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={styles.searchIcon}
                >
                  <path d="m21 21-4.34-4.34" />
                  <circle cx="11" cy="11" r="8" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
