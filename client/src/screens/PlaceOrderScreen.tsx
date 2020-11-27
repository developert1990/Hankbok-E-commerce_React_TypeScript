import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { initialAppStateType } from '../store';
import { Link, useHistory } from 'react-router-dom';
import { createOrder } from '../actions/orderAction';
import { ORDER_CREATE_RESET } from '../constants/orderConstant';
import { LoadingBox } from '../components/LoadingBox';
import { MessageBox } from '../components/MessageBox';

export const PlaceOrderScreen = () => {
    const cart = useSelector((state: initialAppStateType) => state.cartStore);
    const history = useHistory();
    const dispatch = useDispatch();
    const { cartItems, paymentMethod, shippingAddress } = cart;
    if (!paymentMethod) {
        history.push('/payment')
    }
    const orderCreate = useSelector((state: initialAppStateType) => state.orderStore);
    const { loading, success, error, order } = orderCreate;


    const toPrice = (num: number) => Number(num.toFixed(2)); // 5.123 => "5.12" => 5.12
    let itemsPrice = toPrice(cartItems.reduce((a, c) => a + c.qty * c.price, 0))  // c: current 값을 의미한다
    let shippingPrice = itemsPrice > 100 ? toPrice(0) : toPrice(10);
    let taxPrice = toPrice(0.15 * itemsPrice);
    let totalPrice = itemsPrice + shippingPrice + taxPrice;
    const placeOrderHandler = () => {
        dispatch(createOrder({ ...cart, orderItems: cartItems, itemsPrice: itemsPrice, shippingPrice: shippingPrice, shippingAddress: shippingAddress, taxPrice: taxPrice, totalPrice: totalPrice }));
    }

    useEffect(() => {
        if (success) {
            history.push(`/order/${order._id}`);
            dispatch({ type: ORDER_CREATE_RESET });
        }
    }, [dispatch, history, order, success])

    return (
        <div>
            <div className="row top">
                <div className="col-2">
                    <ul>
                        <li>
                            <div className="card card-body">
                                <h2>Shipping</h2>
                                <p>
                                    <strong>Name:</strong>{shippingAddress.fullName} <br />
                                    <strong>Address:</strong>{shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postalCode}, {shippingAddress.country}
                                </p>
                            </div>
                        </li>
                        <li>
                            <div className="card card-body">
                                <h2>Payment</h2>
                                <p>
                                    <strong>Method:</strong>{paymentMethod} <br />
                                </p>
                            </div>
                        </li>
                        <li>
                            <div className="card card-body">
                                <h2>Order Items</h2>
                                <ul>{cartItems.map((item) => (
                                    <li key={item.product}>
                                        <div className="row">
                                            <div>
                                                <img className="small" src={item.image} alt={item.name} />
                                            </div>
                                            <div className="min-30">
                                                <Link to={`/product/${item.product}`}>{item.name}</Link>
                                            </div>
                                            <div>
                                                {item.qty} x ${item.price} = ${item.qty * item.price}
                                            </div>
                                        </div>
                                    </li>
                                ))}</ul>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className="col-1">
                    <div className="card card-body">
                        <ul>
                            <li>
                                <h2>Order Summary</h2>
                            </li>
                            <li>
                                <div className="row">
                                    <div>Items</div>
                                    <div>${itemsPrice.toFixed(2)}</div>
                                </div>
                            </li>
                            <li>
                                <div className="row">
                                    <div>Shipping</div>
                                    <div>${shippingPrice.toFixed(2)}</div>
                                </div>
                            </li>
                            <li>
                                <div className="row">
                                    <div>Tax</div>
                                    <div>${taxPrice.toFixed(2)}</div>
                                </div>
                            </li>
                            <li>
                                <div className="row">
                                    <div><strong>Order Total</strong></div>
                                    <div><strong>${totalPrice.toFixed(2)}</strong></div>
                                </div>
                            </li>
                            <li>
                                <button type="button" onClick={placeOrderHandler} className="primary block" disabled={cartItems.length === 0}>
                                    Place Order
                                </button>
                            </li>
                            {loading && <LoadingBox />}
                            {error && <MessageBox variant="danger" />}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
