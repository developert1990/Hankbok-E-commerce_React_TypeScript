import React, { useEffect } from 'react'
import { Button, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { listMyOrder } from '../actions/orderAction';
import { LoadingBox } from '../components/LoadingBox'
import { MessageBox } from '../components/MessageBox'
import { initialAppStateType } from '../store';

export const OrderHistoryScreen = () => {

    const orderMyList = useSelector((state: initialAppStateType) => state.orderMyHistoryListStore);
    const { loading, orders, error } = orderMyList;
    const history = useHistory();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(listMyOrder());
    }, [dispatch])
    return (
        <div>
            <h1>Order History</h1>
            {
                loading ? <LoadingBox /> :
                    error ? <MessageBox variant="danger">{error}</MessageBox> :
                        (
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>DATE</th>
                                        <th>TOTAL</th>
                                        <th>PAID</th>
                                        <th>DELIVERED</th>
                                        <th>ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr key={order._id}>
                                            <td>{order._id}</td>
                                            <td>{order.createdAt.substring(0, 10)}</td>
                                            <td>{order.totalPrice.toFixed(2)}</td>
                                            <td>{order.isPaid ? order.paidAt.substring(0, 10) : 'No'}</td>
                                            <td>{order.isDelivered ? order.deliveryResult.deliveredAt.substring(0, 10) : 'No'}</td>
                                            <td>
                                                <Button value="success" type="button" onClick={() => { history.push(`/order/${order._id}`) }}>Details</Button>
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        )
            }
        </div>
    )
}
