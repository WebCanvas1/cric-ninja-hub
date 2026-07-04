import { BrowserRouter, Routes, Route } from "react-router-dom";

import RootLayout from "./routes/__root";
import Index from "./routes/index";
import Shop from "./routes/shop";
import ProductPage from "./routes/product.$id";
import CartPage from "./routes/cart";
import Checkout from "./routes/checkout";
import About from "./routes/about";
import Contact from "./routes/contact";
import Admin from "./routes/admin";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<Index />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
