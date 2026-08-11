import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PageTransition from "./PageTransition";

import Restaurant from "../pages/Restaurant"
import RestaurantDetails from "../pages/RestaurantDetails"
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AdminLogin from "../pages/AdminLogin";
import Cart from "../pages/Cart";
import Profile from "../pages/Profile";
import Checkout from "../pages/Checkout"
import OrderSuccess from "../pages/OrderSuccess"
import UserDashboard from "../pages/UserDashboard"
import AdminDashboard from "../pages/AdminDashboard"
import ProtectedRoute from "./ProtectedRoute"
import AdminRoute from "./AdminRoute"

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
        <Route path="/admin/login" element={<PageTransition><AdminLogin /></PageTransition>} />
        
        <Route path="/restaurant" element={<PageTransition><Restaurant /></PageTransition>} />
        <Route path="/restaurant/:id" element={<PageTransition><RestaurantDetails /></PageTransition>} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/cart" element={<PageTransition><Cart /></PageTransition>} />
          <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
          <Route path="/checkout" element={<PageTransition><Checkout /></PageTransition>} />
          <Route path="/order-success" element={<PageTransition><OrderSuccess /></PageTransition>} />
          <Route path="/dashboard" element={<PageTransition><UserDashboard /></PageTransition>} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<PageTransition><AdminDashboard /></PageTransition>} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;
