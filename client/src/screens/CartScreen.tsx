import React, { ChangeEvent, useEffect } from 'react';
import { Button, Card, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useLocation, Link, useHistory } from 'react-router-dom';
import { addToCart, removeFromCart } from '../actions/cartActions';
import { MessageBox } from '../components/MessageBox';
import { initialAppStateType } from '../store';
import { API_BASE } from '../config';
import DeleteIcon from '@material-ui/icons/Delete';

interface CartScreenParamType {
    id: string;
}

export const CartScreen = () => {
    const param: CartScreenParamType = useParams();
    const location = useLocation();
    const history = useHistory();
    const dispatch = useDispatch();

    // console.log(location.search ? Number(location.search.split("=")[1]) : 1);
    const qty = location.search ? Number(location.search.split("=")[1]) : 1;
    const productId = param.id;
    const cart = useSelector((state: initialAppStateType) => state.cartStore);
    const { cartItems } = cart;

    useEffect(() => {
        if (productId) {
            dispatch(addToCart(productId, qty));
        }
    }, [dispatch, productId, qty]);

    const removeFromCartHandler = (id: string) => {
        // delete action.
        dispatch(removeFromCart(id));
    }

    const checkOutHandler = () => {
        history.push('/signin?redirect=shipping')
    }

    return (
        <div className="cartScreen">
            <div className="cart__left">
                <h3>Shopping Cart</h3>
                {cartItems.length === 0
                    ? <MessageBox variant="info">Cart is empty.<Link to="/products"> Go Shopping</Link></MessageBox>
                    : (
                        <Table striped bordered hover variant="dark">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Product Name</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            {

                                cartItems.map((item) => (
                                    <tbody key={item.product}>
                                        <tr>
                                            <td>
                                                <img className="small" src={`${API_BASE}/uploads/${item.image}`} alt={item.name} />
                                            </td>
                                            <td className="min-30">
                                                <Link to={`/product/${item.product}`}>{item.name}</Link>
                                            </td>
                                            <td>
                                                <select value={item.qty} onChange={(e: ChangeEvent<HTMLSelectElement>) => dispatch(addToCart(item.product, Number(parseInt(e.target.value))))}>
                                                    {
                                                        //이부분 한번 공부제대로 해볼것
                                                        //[...Array(4).keys()] 이렇게 하면 [0,1,2,3] 이라는 새로운 배열이 생성된다.
                                                        [...Array(item.countInStock).keys()].map(x => (
                                                            <option key={x + 1} value={x + 1}>{x + 1}</option>
                                                        ))
                                                    }
                                                </select>
                                            </td>
                                            <td>
                                                ${item.price}
                                            </td>
                                            <td>
                                                <Button variant="warning" type="button" onClick={() => removeFromCartHandler(item.product)}><DeleteIcon /></Button>
                                            </td>
                                        </tr>
                                    </tbody>
                                )

                                )}
                        </Table>
                    )
                }
            </div>

            <div className="cart__right">
                <Card className="cart__right__card">
                    <h3 className="cart__right__subtotal">
                        {/* Subtotal:  a는 맨처음값인데 초기값을 0으로 줘서 0부터 시작한다 0 + cartItem의 첫번째아이템의 qty를 더하고 그 더해진게 a가 되고 그 a와 그 다음 아이템의 qty를 더한다.*/}
                        {/* Price: a가 맨처음값이고 초기값이 0이므로 0 + 첫번째 아이템의 qty * 첫번째아이템의 price 해서 a가 되고 그 a와 그 다음 아이템의 qty*price 한거랑 더해서 총 price를 만들어낸다. */}
                                Subtotal({cartItems.reduce((a, c) => a + c.qty, 0)} items) : ${cartItems.reduce((a, c) => a + c.price * c.qty, 0)}
                    </h3>
                    <Button type="button" onClick={checkOutHandler} disabled={cartItems.length === 0}>Proceed to Checkout</Button>

                </Card>
            </div>
        </div>
    )
}








// (
//     <ul>{cartItems.map((item) => (
//         <li key={item.product}>
//             <div className="row">
//                 <div>
//                     <img className="small" src={item.image} alt={item.name} />
//                 </div>
//                 <div className="min-30">
//                     <Link to={`/product/${item.product}`}>{item.name}</Link>
//                 </div>
//                 <div>
//                     <select value={item.qty} onChange={(e: ChangeEvent<HTMLSelectElement>) => dispatch(addToCart(item.product, Number(parseInt(e.target.value))))}>
//                         {
//                             //이부분 한번 공부제대로 해볼것
//                             //[...Array(4).keys()] 이렇게 하면 [0,1,2,3] 이라는 새로운 배열이 생성된다.
//                             [...Array(item.countInStock).keys()].map(x => (
//                                 <option key={x + 1} value={x + 1}>{x + 1}</option>
//                             ))
//                         }
//                     </select>
//                 </div>
//                 <div>
//                     ${item.price}
//                 </div>
//                 <div>
//                     <button type="button" onClick={() => removeFromCartHandler(item.product)}>Delete</button>
//                 </div>
//             </div>
//         </li>
//     ))}
//     </ul>
// )