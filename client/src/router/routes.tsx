import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { ProductDetailScreen } from '../screens/ProductDetailScreen';
import { ProductsScreen } from '../screens/ProductsScreen';
import { CartScreen } from '../screens/CartScreen';
import { SigninScreen } from '../screens/SigninScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { NavBar } from '../components/NavBar';
import { Footer } from '../components/Footer';
import { AboutScreen } from '../screens/AboutScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { ShippingAddressScreen } from '../screens/ShippingAddress';
import { PaymentMethodScreen } from '../screens/PaymentMethodScreen';
import { PlaceOrderScreen } from '../screens/PlaceOrderScreen';

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
    return (
        <BrowserRouter>
            <NavBar />
            <Route exact path="/" component={HomeScreen} />
            <Route path="/cart/:id?" component={CartScreen} />
            <Route path="/about" component={AboutScreen} />
            <Route path="/product/:id" component={ProductDetailScreen} />
            <Route path="/products" component={ProductsScreen} />
            <Route path="/signin" component={SigninScreen} />
            <Route path="/register" component={RegisterScreen} />
            <Route path="/shipping" component={ShippingAddressScreen} />
            <Route path="/payment" component={PaymentMethodScreen} />
            <Route path="/placeorder" component={PlaceOrderScreen} />
            <Footer />
        </BrowserRouter>
    )
}