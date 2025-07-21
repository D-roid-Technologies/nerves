import { useState } from "react";
import { useSelector } from "react-redux";
import { clearUser } from "../../../redux/slice/user";
import { RootState, store } from "../../../redux/store";
import styles from "./navbar.module.css";

// Optional: If using Icon wrapper
// import { Icon } from "../Icon";

interface NavbarProps {
  isLoggedIn: boolean;
  username?: string;
  cartItemCount: number;
  onLogout: () => void;
}

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

  // Toggles the cart open/close state in Redux
  const dispatch = store.dispatch;
  function toggleCart() {
    dispatch({ type: "cart/toggleCart" });
  }

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.navbarContainer}>
          {/* Left Links */}
          <ul className={styles.navLinks}>
            <li>
              <a href="/shop">Shop</a>
            </li>
            <li>
              <a href="/collections">Collections</a>
            </li>
            <li>
              <a href="/about">About</a>
            </li>
          </ul>

          {/* Logo */}
          <div className={styles.logo}>
            <a href="/">NERVES</a>
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
                stroke-width="1"
                stroke-linecap="round"
                stroke-linejoin="round"
                //   class="lucide lucide-search-icon lucide-search"
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
                stroke-width="1 "
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M10.268 21a2 2 0 0 0 3.464 0" />
                <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />
              </svg>
            </button>
            {/* Cart Icon */}
            {/* Update the cart icon part in your Navbar component */}
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
                    stroke="currentColor"
                    stroke-width="1"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    // class="lucide lucide-user-icon lucide-user"
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
                    stroke="currentColor"
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
                        <a href="/account" className={styles.dropdownItem}>
                          My Account
                        </a>
                        <a href="/orders" className={styles.dropdownItem}>
                          My Orders
                        </a>
                        <a
                          className={styles.dropdownItem}
                          onClick={() => {
                            store.dispatch(clearUser());
                            // onLogout();
                            setShowDropdown(false);
                          }}
                        >
                          Sign Out
                        </a>
                      </>
                    ) : (
                      <>
                        <a href="/login" className={styles.dropdownItem}>
                          Sign In
                        </a>
                        <a href="/register" className={styles.dropdownItem}>
                          Create Account
                        </a>
                        <a href="/guest" className={styles.dropdownItem}>
                          Continue as Guest
                        </a>
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
                  stroke-width="1"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  //   class="lucide lucide-search-icon lucide-search"
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
