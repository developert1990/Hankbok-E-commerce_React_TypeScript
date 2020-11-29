import axios from 'axios';
import { PayPalButton } from 'react-paypal-button-v2';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { detailsOrder, orderPay } from '../actions/orderAction';
import { LoadingBox } from '../components/LoadingBox';
import { MessageBox } from '../components/MessageBox';
import { initialAppStateType } from '../store';
import { Card, Table } from 'react-bootstrap';

interface paramsType {
    id: string;
}

export interface PayPalPaymentResultType {
    id: string;
    status: string;
    update_time: string;
    email_address: string;
}


export const OrderScreen = () => {
    const orderDetails = useSelector((state: initialAppStateType) => state.orderDetailStore);
    // const payedOrder = useSelector((state: initialAppStateType) => state.orderPayStore);

    const [sdkReady, setSdkReady] = useState<boolean>(false); // paypal 의 sdk 받아오기위한 hook 이다.
    const { order, loading, error } = orderDetails;
    const dispatch = useDispatch();
    const params: paramsType = useParams();
    const orderId = params.id;


    console.log('orderDetails___: ', orderDetails)

    useEffect(() => {

        const addPayPalScript = async () => {
            const { data } = await axios.get('/api/config/paypal');
            const script = document.createElement('script');
            script.type = "text/javascript";
            script.src = `https://www.paypal.com/sdk/js?client-id=${data}`;
            script.async = true;
            script.onload = () => {
                setSdkReady(true);
            };
            document.body.appendChild(script);
        };

        if (!order?._id) {
            dispatch(detailsOrder(orderId));
        } else {
            if (!order.isPaid) {
                if (!window.paypal) {
                    addPayPalScript();
                } else {
                    setSdkReady(true);
                }
            }
        }

    }, [orderId, dispatch, order?._id, order?.isPaid])

    const successPaymentHandler = (paymentResult: PayPalPaymentResultType) => {
        dispatch(orderPay(order, paymentResult));
    }

    return (
        loading ? (
            <LoadingBox />
        ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
        ) : (
                    <div>
                        <h1>Order {order?._id}</h1>
                        <div className="orderScreen">


                            <div className="orderScreen__left">
                                <Card className="orderScreen__card">
                                    <h2>Shipping</h2>
                                    <p>
                                        <strong>Name:</strong>{order?.shippingAddress.fullName} <br />
                                        <strong>Address:</strong>{order?.shippingAddress.address}, {order?.shippingAddress.city}, {order?.shippingAddress.postalCode}, {order?.shippingAddress.country}
                                    </p>
                                    {/* 배달 유무 */}
                                    {order?.isDelivered ? <MessageBox variant="success">Delivered at {order?.isDelivered}</MessageBox> :
                                        <MessageBox variant="danger">Not Delivered</MessageBox>
                                    }
                                </Card>
                                <Card className="orderScreen__card">
                                    <h2>Payment</h2>
                                    <p>
                                        <strong>Method:</strong>{order?.paymentMethod} <br />
                                    </p>
                                    {order?.isPaid ? <MessageBox variant="success">Paid at {order?.paidAt}</MessageBox> :
                                        <MessageBox variant="danger">Not Paid</MessageBox>
                                    }
                                </Card>
                                <Card className="orderScreen__card">
                                    <h2>Order Items</h2>

                                    <Table striped bordered hover size="sm">
                                        <thead>
                                            <tr>
                                                <th>Product</th>
                                                <th>Product Name</th>
                                                <th>Quantity</th>
                                            </tr>
                                        </thead>

                                        {order?.orderItems.map((item) => (
                                            <tbody key={item.product}>
                                                <tr>
                                                    <td>
                                                        <img className="small" src={item.image} alt={item.name} />
                                                    </td>
                                                    <td>
                                                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                                                    </td>
                                                    <td>
                                                        {item.qty} x ${item.price} = ${item.qty * item.price}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        ))}

                                    </Table>
                                </Card>
                            </div>


                            <div className="orderScreen__right">


                                <Card className="orderScreen__card">
                                    <h2>Order Summary</h2>
                                    <div>
                                        <div>Items</div>
                                        <div>${order?.itemsPrice.toFixed(2)}</div>
                                    </div>
                                    <div>
                                        <div>Shipping</div>
                                        <div>${order?.shippingPrice.toFixed(2)}</div>
                                    </div>
                                    <div>
                                        <div>Tax</div>
                                        <div>${order?.taxPrice.toFixed(2)}</div>
                                    </div>
                                    <div>
                                        <div><strong>Order Total</strong></div>
                                        <div><strong>${order?.totalPrice.toFixed(2)}</strong></div>
                                    </div>
                                    {
                                        !order?.isPaid && (
                                            <div>
                                                {!sdkReady ? <LoadingBox /> : <PayPalButton amount={order?.totalPrice} onSuccess={successPaymentHandler} />}
                                            </div>
                                        )
                                    }
                                </Card>

                            </div>


                        </div>


                    </div>
                )
    )
}
