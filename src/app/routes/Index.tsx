import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../ui/pages/home/Home";
import About from "../ui/pages/about/About";
import NotFound from "../ui/pages/notFound/NotFound";
import SignUp from "../ui/pages/signup/Signup";
import Login from "../ui/pages/login/Login";
import ProductPage from "../ui/pages/productPage/ProductPage";
import ProductDetailsPage from "../ui/components/ProductDetailsPage/ProductDetailsPage";
import Collections from "../ui/pages/collections/Collections";
import MyAccountPage from "../ui/pages/account/Account";
import Checkout from "../ui/components/checkout-alt/Checkout";
import CreateItemPage from "../ui/pages/createitemPage/CreateItemPage";
import SettingsPage from "../ui/pages/settings/SettingsPage";
import CategoriesPage from "../ui/pages/catergories/CategoriesPage";
import ProductPageAlt from "../ui/pages/productPage/ProductPageAlt";
import ScrollToTop from "../ui/components/srollToTop/ScrollToTop";
import EarlyBirdRegistration from "../ui/pages/EarlyBirdRegistration/EarlyBirdRegistration";
// import CheckoutPage from "../ui/components/checkout/Checkoutpage";

const Index: React.FunctionComponent = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<ProductPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/products" element={<ProductPageAlt />} />
        <Route path="/shop" element={<ProductPageAlt />} />
        <Route path="/guest" element={<ProductPageAlt />} />
        <Route path="/account" element={<MyAccountPage />} />
        <Route path="/create" element={<CreateItemPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/catergories" element={<CategoriesPage />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/early-bird-registration" element={<EarlyBirdRegistration />} />

        {/* <Route
        path="/products/:category/:productTitle"
        element={<ProductDetailsPage />}
      /> */}
        <Route
          path="/products/:productTitle"
          element={<ProductDetailsPage />}
        />
        {/* <Route path="/checkout" element={<Checkout />} /> */}
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/notfound" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default Index;
