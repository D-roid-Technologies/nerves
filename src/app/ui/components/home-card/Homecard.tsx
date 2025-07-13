import React from "react";
import Card from "../Card";
import "./homecard.css";

function Homecard() {
  return (
    <>
      <div className="parent">
        <Card
          image="https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          title="Your Title"
          description="Your description text"
          buttons={[
            { text: "SHOP NOW", onClick: () => console.log("Shop clicked") },
          ]}
          alt="Description for screen readers"
        />
        <Card
          image="https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          title="Your Title"
          description="Your description text"
          buttons={[
            { text: "SHOP NOW", onClick: () => console.log("Shop clicked") },
            {
              text: "LEARN MORE",
              onClick: () => console.log("Learn more clicked"),
            },
          ]}
          alt="Description for screen readers"
        />
        <Card
          image="https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          title="Your Title"
          description="Your description text"
          buttons={[
            { text: "SHOP NOW", onClick: () => console.log("Shop clicked") },
            {
              text: "LEARN MORE",
              onClick: () => console.log("Learn more clicked"),
            },
          ]}
          alt="Description for screen readers"
        />
      </div>
    </>
  );
}

export default Homecard;
