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
        {/* Lorem ipsum dolor, sit amet consectetur adipisicing elit. Harum
        accusantium saepe laboriosam! Ullam cum incidunt quisquam quaerat
        officiis at, eos dolorum doloribus odit itaque fuga magni maxime fugit,
        porro et cumque nulla iusto optio vitae ipsam facere consequatur
        voluptates nihil!
        <User /> */}
      </div>
    </>
  );
}

export default Home;
