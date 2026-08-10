import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar"
import Restaurant from "./pages/Restaurant"
import RestaurantDetails from "./pages/RestaurantDetails"
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import Checkout from "./pages/Checkout"
import OrderSuccess from "./pages/OrderSuccess"
import Dashboard from "./pages/Dashboard"



function App() {

  return (
    <BrowserRouter>

    <Navbar />

      <Routes>
         

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/cart" element={<Cart />} />

        <Route path="/restaurant" element={<Restaurant />} />

        <Route path="/restaurant/:id" element={<RestaurantDetails />} />

        <Route path="/profile" element={<Profile />} />

        <Route path="/checkout" element={<Checkout />} />

        <Route path="/order-success" element={<OrderSuccess />} />

         <Route path="/dashboard" element={<Dashboard />} />


      </Routes>

    </BrowserRouter>
  )
}

export default App