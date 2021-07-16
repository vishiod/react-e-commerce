import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { commerce } from './lib/commerce';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
// import Products from './components/Products.jsx';
// import Navbar   from './components/Navbar/Navbar';

import { Products, Navbar, Cart, Checkout } from './components/index.js';

function App() {
  const [ products, setProducts ] = useState([]);
  const [ cart, setCart] = useState({});
  const [ order, setOrder] = useState({});
  const [ errorMessage, setErrorMessage] = useState('');
  // console.log(cart);

  function fetchProducts() {
    commerce.products.list().then((products) => {
      setProducts(products.data);
    }).catch((error) => {
      console.log('There was an error fetching the products', error);
    });
  }

  const fetchCart = async () => {
    const tempCart = await commerce.cart.retrieve();
    setCart(tempCart);
  }

  const handleAddToCart = async(productId, quantity) => {
    const item = await commerce.cart.add(productId, quantity);
    setCart(item.cart);
  }

  const handlUpdateCartQuantity = async (productId, quantity) => {
      const response = await commerce.cart.update(productId, { quantity });
      setCart(response.cart);
  }

  const handleRemoveFromCart = async(productId) => {
    const response = await commerce.cart.remove(productId);
    setCart(response.cart);
  }

  const handleEmptyCart = async() => {
    const response = await commerce.cart.empty();
    setCart(response.cart);
  }

  const refreshCart = async () => {
    const newCart = await commerce.cart.refresh();
    setCart(newCart);
  }

  const handleCaptureCheckout = async (checkOutToken, newOrder) => {
    try{
      const incomingOrder = await commerce.checkout.capture(checkOutToken);
      setOrder(incomingOrder);
      refreshCart();
    }catch(error){
      setErrorMessage(error.data.error.message);
    }
  }

  useEffect(()=>{
    fetchProducts();
    fetchCart();
  },[]);

  // console.log(cart);

  return (
    <Router>
      <div className="App">
        <Navbar totalItems = {cart.total_items}/>
        <Switch>
          <Route exact path="/">
            <Products products={products} onAddToCart = {handleAddToCart}/>
          </Route>

          <Route exact path="/cart">
            <Cart cart={cart} handlUpdateCartQuantity={handlUpdateCartQuantity} handleEmptyCart={handleEmptyCart} handleRemoveFromCart={handleRemoveFromCart}/>
          </Route>

          <Route exact path="/checkout">
            <Checkout cart={cart} order={order} handleCaptureCheckout={handleCaptureCheckout} error={errorMessage}/>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
