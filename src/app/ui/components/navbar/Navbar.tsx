import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearUser } from "../../../redux/slice/user";
import { RootState, store } from "../../../redux/store";
import styles from "./navbar.module.css";

const Navbar = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
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

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const toggleUserModal = () => {
    setShowUserModal(!showUserModal);
  };

  const closeSidebar = () => {
    setShowSidebar(false);
  };

  const closeUserModal = () => {
    setShowUserModal(false);
  };

  const dispatch = store.dispatch;
  const navigate = useNavigate();

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.navbarContainer}>
          {/* Mobile Menu Button - Only visible on tablet/mobile */}
          <button
            className={styles.mobileMenuButton}
            onClick={toggleSidebar}
            aria-label="Open menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>

          {/* Left Links - Only visible on desktop */}
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
            <a href="/">Nerve Systems Network</a>
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
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m21 21-4.34-4.34" />
                <circle cx="11" cy="11" r="8" />
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
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="8" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
              </svg>
              {cartItemCount > 0 && (
                <span className={styles.cartBadge}>{cartItemCount}</span>
              )}
            </button>
            <button
              type="button"
              className={styles.cartIcon}
              aria-label="Notifications"
            // onClick;
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M10.268 21a2 2 0 0 0 3.464 0" />
                <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />
              </svg>

              {cartItemCount > 0 && (
                <span className={styles.cartBadge}>{cartItemCount}</span>
              )}
            </button>

            {/* <button
              type="button"
              className={styles.cartIcon}
              aria-label="Notifications"
              // onClick;
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M10.268 21a2 2 0 0 0 3.464 0" />
                <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />
              </svg>

              {cartItemCount > 0 && (
                <span className={styles.cartBadge}>{cartItemCount}</span>
              )}
            </button> */}
            {/* User Icon - Desktop shows dropdown, Mobile shows modal */}
            <div className={styles.userContainer}>
              <div className={styles.userDropdown}>
                <button
                  className={styles.userButton}
                  onClick={() => {
                    // On mobile, show modal; on desktop, show dropdown
                    if (window.innerWidth <= 768) {
                      toggleUserModal();
                    } else {
                      toggleDropdown();
                    }
                  }}
                  aria-label="User menu"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={user.isLoggedIn ? "#ff6b35" : "currentColor"}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
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
                    stroke={user.isLoggedIn ? "#ff6b35" : "currentColor"}
                    className={`${styles.chevron} ${showDropdown ? styles.rotate : ""
                      } ${styles.desktopOnly}`}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Desktop Dropdown */}
                {showDropdown && (
                  <div
                    className={`${styles.dropdownMenu} ${styles.desktopOnly}`}
                  >
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
                        <Link
                          to="/notifications"
                          className={styles.dropdownItem}
                        >
                          Notifications
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

      {/* Off-canvas Sidebar for Navigation */}
      {showSidebar && (
        <>
          <div className={styles.sidebarOverlay} onClick={closeSidebar}></div>
          <div
            className={`${styles.sidebar} ${showSidebar ? styles.sidebarOpen : ""
              }`}
          >
            <div className={styles.sidebarHeader}>
              <span className={styles.sidebarTitle}>Menu</span>
              <button
                className={styles.closeSidebar}
                onClick={closeSidebar}
                aria-label="Close menu"
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
            </div>
            <div className={styles.sidebarContent}>
              <Link
                to="/products"
                className={styles.sidebarItem}
                onClick={closeSidebar}
              >
                Shop
              </Link>
              <Link
                to="/collections"
                className={styles.sidebarItem}
                onClick={closeSidebar}
              >
                Collections
              </Link>
              <Link
                to="/about"
                className={styles.sidebarItem}
                onClick={closeSidebar}
              >
                About
              </Link>
            </div>
          </div>
        </>
      )}

      {/* User Modal for Mobile */}
      {showUserModal && (
        <>
          <div className={styles.modalOverlay} onClick={closeUserModal}></div>
          <div className={styles.userModal}>
            <div className={styles.modalHeader}>
              <span className={styles.modalTitle}>Account</span>
              <button
                className={styles.closeModal}
                onClick={closeUserModal}
                aria-label="Close account menu"
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
            </div>
            <div className={styles.modalContent}>
              {user.isLoggedIn ? (
                <>
                  <div className={styles.modalWelcome}>
                    Welcome, {user.firstName}
                  </div>
                  <Link
                    to="/account"
                    className={styles.modalItem}
                    onClick={closeUserModal}
                  >
                    My Account
                  </Link>
                  <Link
                    to="/orders"
                    className={styles.modalItem}
                    onClick={closeUserModal}
                  >
                    My Orders
                  </Link>
                  <Link
                    to="/notifications"
                    className={styles.modalItem}
                    onClick={closeUserModal}
                  >
                    Notifications
                  </Link>
                  <Link
                    to="/create"
                    className={styles.modalItem}
                    onClick={closeUserModal}
                  >
                    Create Items
                  </Link>
                  <Link
                    to="/settings"
                    className={styles.modalItem}
                    onClick={closeUserModal}
                  >
                    Settings
                  </Link>
                  <button
                    className={styles.modalItem}
                    onClick={() => {
                      store.dispatch(clearUser());
                      closeUserModal();
                      navigate("/products");
                    }}
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className={styles.modalItem}
                    onClick={closeUserModal}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className={styles.modalItem}
                    onClick={closeUserModal}
                  >
                    Create Account
                  </Link>
                  <Link
                    to="/guest"
                    className={styles.modalItem}
                    onClick={closeUserModal}
                  >
                    Continue as Guest
                  </Link>
                </>
              )}
            </div>
          </div>
        </>
      )}

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
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
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
