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
import { OrderScreen } from '../screens/OrderScreen';
import { OrderHistoryScreen } from '../screens/OrderHistoryScreen';
import { PrivateRoute } from '../components/PrivateRoute';
import { ProfileUpdateScreen } from '../screens/ProfileUpdateScreen';
import { AdminRoute } from '../components/AdminRoute'
import { AdminProductListScreen } from '../screens/AdminProductListScreen';
import { ProductEditScreen } from '../screens/ProductEditScreen';
import { ProductCreateScreen } from '../screens/ProductCreateScreen';
import { AdminOrderListScreen } from '../screens/AdminOrderListScreen';
import { AdminUserListScreen } from '../screens/AdminUserListScreen';
import { AdminUserEdit } from '../screens/AdminUserEdit';

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
    return (
        <BrowserRouter>
            <NavBar />
            <Route exact path="/" component={HomeScreen} />
            <Route path="/cart/:id?" component={CartScreen} />
            <Route path="/about" component={AboutScreen} />
            <Route exact path="/product/:id" component={ProductDetailScreen} />
            <Route exact path="/product/:id/edit" component={ProductEditScreen} />
            <Route path="/products" component={ProductsScreen} />
            <Route path="/signin" component={SigninScreen} />
            <Route path="/register" component={RegisterScreen} />
            <Route path="/shipping" component={ShippingAddressScreen} />
            <Route path="/payment" component={PaymentMethodScreen} />
            <Route path="/placeorder" component={PlaceOrderScreen} />
            <PrivateRoute path="/order/:id" component={OrderScreen} />
            <Route path="/history" component={OrderHistoryScreen} />
            <PrivateRoute path="/profile" component={ProfileUpdateScreen} />
            <AdminRoute path="/productList" component={AdminProductListScreen} />
            <AdminRoute path="/productCreate" component={ProductCreateScreen} />
            <AdminRoute path="/orderList" component={AdminOrderListScreen} />
            <AdminRoute path="/userList" component={AdminUserListScreen} />
            <AdminRoute path="/user/:id/edit" component={AdminUserEdit} />

            <Footer />
        </BrowserRouter>
    )
}