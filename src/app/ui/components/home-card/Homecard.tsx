import React from "react";
import Card from "../Card";
import "./homecard.css";

function Homecard() {
  // Define an array of products with image, title, description, buttons, and alt text
  const products = [
    {
      image:
        "https://www.newforestclothing.co.uk/cdn/shop/files/deerhunter-lady-northward-padded-jacket-rifle-green-8-insulated-325.webp?v=1724793650&width=1000",
      title: "Cozy Winter Jacket",
      description:
        "Stay warm and stylish this winter with our premium insulated jackets.",
      buttons: [
        { text: "SHOP NOW", onClick: () => console.log("Shop Winter Jackets") },
        // { text: "LEARN MORE", onClick: () => console.log("Learn More Winter Jackets") },
      ],
      alt: "Cozy winter jacket on a model",
    },
    {
      image:
        "https://www.chairoffice.co.uk/media/18259/aura-black.jpg?width=400",
      title: "Modern Office Chair",
      description:
        "Ergonomic and sleek office chairs designed for comfort and productivity.",
      buttons: [{ text: "SHOP NOW", onClick: () => console.log("Shop Office Chairs") }],
      alt: "Modern ergonomic office chair",
    },
    {
      image:
        "https://media.very.co.uk/i/very/VH4IV_SQ1_0000000004_BLACK_SLf?$pdp_576x768_x2$&fmt=webp&$roundel_very$&p1_img=insurance_available",
      title: "Wireless Headphones",
      description:
        "Experience crystal clear sound with noise-cancelling wireless headphones.",
      buttons: [
        { text: "SHOP NOW", onClick: () => console.log("Shop Headphones") },
        // { text: "LEARN MORE", onClick: () => console.log("Learn More Headphones") },
      ],
      alt: "Wireless headphones with sleek design",
    },
  ];

  return (
    <div className="parent">
      {products.map((product, index) => (
        <Card
          key={index}
          image={product.image}
          title={product.title}
          description={product.description}
          buttons={product.buttons}
          alt={product.alt}
        />
      ))}
    </div>
  );
}

export default Homecard;
