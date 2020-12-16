import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { LoadingBox } from '../components/LoadingBox';
import { MessageBox } from '../components/MessageBox';
import { initialAppStateType } from '../store';
import { Button, Table } from 'react-bootstrap';
import { OrdersListType } from '../reducers/orderReducers';
import { deleteOrder, listOrders } from '../actions/orderAction';
import { ORDER_DELETE_RESET } from '../constants/orderConstant';


import RoomIcon from '@material-ui/icons/Room';
import { Pagination, UsePaginationProps } from '@material-ui/lab';
import MenuBookOutlinedIcon from '@material-ui/icons/MenuBookOutlined';
import DeleteForeverRoundedIcon from '@material-ui/icons/DeleteForeverRounded';
import { useStyles } from '../config';

export const AdminOrderListScreen = () => {
    const orderListStoreInfo = useSelector((state: initialAppStateType) => state.orderListStore);
    const { error, loading, orders } = orderListStoreInfo;

    const productDeleteStoreInfo = useSelector((state: initialAppStateType) => state.orderDeleteStore);
    const { error: errorDelete, loading: loadingDelete, success: successDelete } = productDeleteStoreInfo;

    const history = useHistory();
    const dispatch = useDispatch();

    useEffect(() => {
        console.log("유즈이팩트 들어옴")
        dispatch(listOrders());
        dispatch({ type: ORDER_DELETE_RESET }) // 이렇게 리셋을 해줘야 success가 ture로 되있고 loading이 false로 되있는 것을 초기화 해서 다시 새롭게 진행해줄수가 있다.
    }, [dispatch, successDelete]);

    // console.log('orders??????::____', orders)

    const deleteHandler = (order: OrdersListType) => {
        if (window.confirm('Are you sure to delete?')) {
            dispatch(deleteOrder(order._id as string));
        }
    }


    // pagination
    const [page, setPage] = useState<number>(1);
    const [pageData, setPageData] = useState<OrdersListType[]>([]);
    const dataLimit = 10;
    const indexOfLast = page * dataLimit;
    const indexOfFirst = indexOfLast - dataLimit;
    const handlePageChange: UsePaginationProps["onChange"] = (event: React.ChangeEvent<unknown>, page: number) => {
        setPage(page);
    }
    useEffect(() => {
        if (orders) {
            setPageData(orders.slice(indexOfFirst, indexOfLast));
        }
    }, [indexOfFirst, indexOfLast, orders])

    const classes = useStyles();

    // ***********************************

    return (
        <div className="adminOrderListScreen">
            <h1>Orders</h1>
            {loadingDelete && <LoadingBox />}
            {errorDelete && <MessageBox variant="danger">{errorDelete}</MessageBox>}
            {
                loading ? <LoadingBox /> :
                    error ? <MessageBox variant="danger">{error}</MessageBox> :
                        <Table striped bordered hover variant="dark">
                            <thead>
                                <tr>
                                    <th>NUM</th>
                                    <th>ID</th>
                                    <th>Location</th>
                                    <th>USER</th>
                                    <th>DATE</th>
                                    <th>TOTAL</th>
                                    <th>PAID</th>
                                    <th>DELIVERED</th>
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    pageData.map((order, index) => (
                                        <tr key={order._id}>
                                            <td>{index + 1}</td>
                                            <td>{order._id}</td>
                                            <td className="location_col"><Link to={{
                                                pathname: "/adminGoogleMapOrderList",
                                                state: order.shippingAddress,
                                            }} ><RoomIcon />Map</Link></td>
                                            <td>{order.user.name}</td>
                                            <td>{order.createdAt.substring(0, 10)}</td>
                                            <td>{order.totalPrice.toFixed(2)}</td>
                                            <td>{order.isPaid ? order.paidAt.substring(0, 10) : 'No'}</td>
                                            <td>{order.isDelivered ? order.deliveredAt.substring(0, 10) : 'No'}</td>
                                            <td>
                                                <Button className="actionBtn" variant="warning" onClick={() => { history.push(`/order/${order._id}`) }}><MenuBookOutlinedIcon /></Button>
                                                <Button className="actionBtn" variant="danger" onClick={() => deleteHandler(order)}><DeleteForeverRoundedIcon /></Button>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </Table>
            }
            <div className={`${classes.root} pagination`}>
                <Pagination count={orders && Math.ceil(orders.length / dataLimit)} variant="outlined" shape="rounded" color="primary" onChange={handlePageChange} />
            </div>
        </div>
    )
}
