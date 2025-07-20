import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import { store } from "./app/redux/store";
import Index from "./app/routes/Index";
import Navbar from "./app/ui/components/navbar/Navbar";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Navbar />
        <Index />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
