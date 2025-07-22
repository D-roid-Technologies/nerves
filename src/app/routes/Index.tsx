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

const Index: React.FunctionComponent = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/register" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/products" element={<ProductPage />} />
      <Route path="/shop" element={<ProductPage />} />
      <Route path="/guest" element={<ProductPage />} />
      <Route path="/collections" element={<Collections />} />
      <Route
        path="/products/:category/:productTitle"
        element={<ProductDetailsPage />}
      />
      <Route path="/notfound" element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Index;
