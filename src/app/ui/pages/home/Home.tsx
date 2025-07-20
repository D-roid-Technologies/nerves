import React from "react";
import { User } from "lucide-react";
import Banner from "../../components/banner/Banner";
import Homecard from "../../components/home-card/Homecard";
import Catergories from "../../components/catergories/Catergories";
import NewProduct from "../../components/newProduct/NewProduct";
import Review from "../../components/review/Review";
import Footer from "../../components/footer/Footer";

function Home() {
  return (
    <>
      <div>
        <Banner />
        <Homecard />
        <Catergories />
        <Review />
        <NewProduct />
        <br />
        <br />
        <br />
        <Footer />
      </div>
    </>
  );
}

export default Home;
