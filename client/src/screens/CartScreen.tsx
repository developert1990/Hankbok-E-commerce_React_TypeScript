import React, { ChangeEvent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useLocation, Link, useHistory } from 'react-router-dom';
import { addToCart, removeFromCart } from '../actions/cartActions';
import { MessageBox } from '../components/MessageBox';
import { initialAppStateType } from '../store';

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
        <div className="row top">
            <div className="col-2">
                <h1>Shopping Cart</h1>
                {cartItems.length === 0
                    ? <MessageBox variant="info">Cart is empty.<Link to="/">Go Shopping</Link></MessageBox>
                    : (
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
                                        <select value={item.qty} onChange={(e: ChangeEvent<HTMLSelectElement>) => dispatch(addToCart(item.product, Number(parseInt(e.target.value))))}>
                                            {
                                                //이부분 한번 공부제대로 해볼것
                                                //[...Array(4).keys()] 이렇게 하면 [0,1,2,3] 이라는 새로운 배열이 생성된다.
                                                [...Array(item.countInStock).keys()].map(x => (
                                                    <option key={x + 1} value={x + 1}>{x + 1}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                    <div>
                                        ${item.price}
                                    </div>
                                    <div>
                                        <button type="button" onClick={() => removeFromCartHandler(item.product)}>Delete</button>
                                    </div>
                                </div>
                            </li>
                        ))}</ul>
                    )
                }
            </div>
            <div className="col-1">
                <div className="card card-body">
                    <ul>
                        <li>
                            <h2>
                                {/* Subtotal:  a는 맨처음값인데 초기값을 0으로 줘서 0부터 시작한다 0 + cartItem의 첫번째아이템의 qty를 더하고 그 더해진게 a가 되고 그 a와 그 다음 아이템의 qty를 더한다.*/}
                                {/* Price: a가 맨처음값이고 초기값이 0이므로 0 + 첫번째 아이템의 qty * 첫번째아이템의 price 해서 a가 되고 그 a와 그 다음 아이템의 qty*price 한거랑 더해서 총 price를 만들어낸다. */}
                                Subtotal({cartItems.reduce((a, c) => a + c.qty, 0)} items) : ${cartItems.reduce((a, c) => a + c.price * c.qty, 0)}
                            </h2>
                        </li>
                        <li>
                            <button type="button" onClick={checkOutHandler} className="primary block" disabled={cartItems.length === 0}>Proceed to Checkout</button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
