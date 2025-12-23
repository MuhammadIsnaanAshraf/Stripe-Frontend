import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider, useSelector } from "react-redux";
import { store } from "./store/store";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import MyCart from "./Pages/MyCart";
import Checkout from "./Pages/Checkout";
import Orders from "./Pages/Orders";
import AddProduct from "./Pages/AddProduct";
import { Navigate } from "react-router-dom";

const App = () => {
  const user = useSelector((state) => state.auth.user);
  console.log("Current User:", user);
  const token = useSelector((state) => state.auth.token);
  console.log("Current Token:", token);
  
  // Mock admin check - in real app, check user role from Redux state
  const isAdmin = user?.role === 'admin' || true; // Set to true for testing
  
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={token ? <Home /> : <Navigate to="/login" />} />
        <Route path="/login" element={!token ? <Login /> : <Navigate to="/" />} />
        <Route path="/my-cart" element={token ? <MyCart /> : <Navigate to="/login" />} />
        <Route path="/checkout" element={token ? <Checkout /> : <Navigate to="/login" />} />
        <Route path="/orders" element={token ? <Orders /> : <Navigate to="/login" />} />
        
        {/* Admin Routes */}
        <Route 
          path="/add-product" 
          element={token && isAdmin ? <AddProduct /> : <Navigate to="/login" />} 
        />
      </Routes>
    </div>
  );
};

export default App;
