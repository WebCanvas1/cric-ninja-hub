import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles.css";

import RootLayout from "./routes/__root";
import Home from "./routes/index";
import Shop from "./routes/shop";
import About from "./routes/about";
import Contact from "./routes/contact";
import Cart from "./routes/cart";
import Checkout from "./routes/checkout";
import Admin from "./routes/admin";
import ProductPage from "./routes/product.$id";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/product/:id" element={<ProductPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
