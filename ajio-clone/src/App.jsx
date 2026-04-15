import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sheader from './Homeheader.jsx'
import Login from './Login.jsx'
import Home from './Home.jsx'
import Men from './Men.jsx'
import Women from './Women.jsx'
import Kids from './Kids.jsx'
import Beauty from './Beauty.jsx'
import Admin from './Admin.jsx'
import AddProduct from './AddProduct.jsx';
import ManageProduct from './ManageProduct.jsx';
import EditProduct from './EditProduct.jsx'; 
import ProductDetails from './ProductDetail.jsx';
import Cart from './Cart.jsx';
import Checkout from './Checkout.jsx';
import ManageOrders from './ManageOrders.jsx';
import ManageUser from './ManageUser.jsx';
import Success from './Success.jsx';

function App() {
  const [userId, setUserId] = React.useState(null);
  const [userRole, setUserRole] = React.useState(localStorage.getItem("role")); 

  return (
    <BrowserRouter>
     {userRole !== "admin" && (
  <Sheader userId={userId} setUserId={setUserId} userRole={userRole}/>
)}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setUserId={setUserId} setUserRole={setUserRole} />} />
        <Route path="/men" element={<Men />} />
        <Route path="/women" element={<Women />} />
        <Route path="/kids" element={<Kids />} />
        <Route path="/beauty" element={<Beauty />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/manage-products" element={<ManageProduct />} />
        <Route path="/edit-product/:id" element={<EditProduct />} />
        <Route path="/product/:id" element={<ProductDetails userId={userId} />} />
        <Route path="/cart" element={<Cart userId={userId} />} />
        <Route path="/checkout" element={<Checkout userId={userId} />} />
        <Route path="/manage-orders" element={<ManageOrders />} />
        <Route path="/manage-users" element={<ManageUser />} />
        <Route path="/success" element={<Success />} />
        </Routes>
    </BrowserRouter>
  )
}

export default App;