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
import PaidOrders from "../ui/pages/orderPages/PaidOrders";
import SealedOrders from "../ui/pages/orderPages/SealedOrders";
import DispatchedOrders from "../ui/pages/orderPages/DispatchedOrders";
import ArrivedOrders from "../ui/pages/orderPages/ArrivedOrders";
import ConfirmedOrders from "../ui/pages/orderPages/ConfirmedOrders";
import ReturnedOrders from "../ui/pages/orderPages/ReturnedOrders";
import ReviewedOrders from "../ui/pages/orderPages/ReviewedOrders";
import ViewAllOrders from "../ui/pages/orderPages/ViewAllOrders";
import NotificationsPage from "../ui/pages/notification/NotificationsPage";
import AllReviewsPage from "../ui/pages/allReviews/AllReviewsPage";
import AllSalesPage from "../ui/pages/allSales/AllSalesPage";
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
        <Route
          path="/early-bird-registration"
          element={<EarlyBirdRegistration />}
        />
        {/* oreder pages  */}
        <Route path="/orders/paid" element={<PaidOrders />} />
        <Route path="/orders/sealed" element={<SealedOrders />} />
        <Route path="/orders/dispatched" element={<DispatchedOrders />} />
        <Route path="/orders/arrived" element={<ArrivedOrders />} />
        <Route path="/orders/confirmed" element={<ConfirmedOrders />} />
        <Route path="/orders/returned" element={<ReturnedOrders />} />
        <Route path="/orders/reviewed" element={<ReviewedOrders />} />
        <Route path="/orders/all" element={<ViewAllOrders />} />
        {/* review page */}
        <Route path="/reviews/all" element={<AllReviewsPage />} />
        {/* sales page */}
        <Route path="/sales/all" element={<AllSalesPage />} />
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
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/notfound" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default Index;
