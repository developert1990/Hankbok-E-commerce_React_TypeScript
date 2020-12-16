import React, { useEffect, useState } from 'react'
import { Button, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { listMyOrder } from '../actions/orderAction';
import { LoadingBox } from '../components/LoadingBox'
import { MessageBox } from '../components/MessageBox'
import { initialAppStateType } from '../store';
import { OrdersType } from '../reducers/orderReducers';

import Pagination, { UsePaginationProps } from '@material-ui/lab/Pagination';
import MenuBookOutlinedIcon from '@material-ui/icons/MenuBookOutlined';


export const OrderHistoryScreen = () => {

    const orderMyList = useSelector((state: initialAppStateType) => state.orderMyHistoryListStore);
    const { loading, orders, error } = orderMyList;
    const history = useHistory();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(listMyOrder());
    }, [dispatch]);


    // pagination *****************************

    const [page, setPage] = useState<number>(1);
    const [pageData, setPageData] = useState<OrdersType[]>([]);
    const dataLimit = 10;
    const indexOfLast = page * dataLimit;
    const indexOfFirst = indexOfLast - dataLimit;
    const handlePageChange: UsePaginationProps["onChange"] = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    }
    useEffect(() => {
        if (orders) {
            // setPageData(createdReviews.slice(0, 4) as reviewType[]); // 0 2 , 1 3, 2 4           0 2 , 2 4, 4 6 
            // 우선 먼저 sort 를 해서 순서를 바꿔주고 slice 로 data를 나눠준다.
            setPageData(orders.slice(indexOfFirst, indexOfLast)); // 0 2 , 1 3, 2 4           0 2 , 2 4, 4 6 
        }
    }, [indexOfFirst, indexOfLast, orders])

    // ****************************************

    return (
        <div className="orderHistoryScreen">
            <h1>Order History</h1>
            {
                loading ? <LoadingBox /> :
                    error ? <MessageBox variant="danger">{error}</MessageBox> :
                        (
                            <>
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
                                        {pageData.map((order) => (
                                            <tr key={order._id}>
                                                <td>{order._id}</td>
                                                <td>{order.createdAt.substring(0, 10)}</td>
                                                <td>{order.totalPrice.toFixed(2)}</td>
                                                <td>{order.isPaid ? order.paidAt.substring(0, 10) : 'No'}</td>
                                                <td>{order.isDelivered ? order.deliveredAt.substring(0, 10) : 'No'}</td>
                                                <td>
                                                    <Button value="success" type="button" onClick={() => { history.push(`/order/${order._id}`) }}><MenuBookOutlinedIcon /></Button>
                                                </td>

                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>

                                <Pagination count={Math.ceil(orders.length / dataLimit)} color="secondary" onChange={handlePageChange} page={page} />
                            </>
                        )
            }
        </div>
    )
}
