import React from 'react';
import {Switch, Route} from 'react-router-dom'
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import Navbar from './Components/Navbar';
import Default from './Components/Default';
import Details from './Components/Details';
import ProductList from './Components/ProductList';
import Modal from './Components/Modal';
import Cart from './Components/CartComponents/Cart';



function App() {
  return (
    <div>
      <Navbar />
      <Switch>
        <Route exact path="/" component={ProductList} />
        <Route exact path="/details" component={Details} />
        <Route exact path="/cart" component={Cart} />
        <Route component={Default} />
      </Switch>
      <Modal />
    </div>
  );
}

export default App;
