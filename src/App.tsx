import React from "react";
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import Index from "./app/routes/Index";
import Navbar from "./app/ui/components/navbar/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Navbar
        isLoggedIn={true}
        username="Onyekachi"
        cartItemCount={0}
        onLogout={() => {}}
      />

      <Index />
    </BrowserRouter>
  );
}

export default App;
