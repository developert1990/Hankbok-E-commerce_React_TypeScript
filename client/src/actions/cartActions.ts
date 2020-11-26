import { ThunkDispatch } from 'redux-thunk';
import Axios from 'axios';
import { CART_ADD_ITEM, CART_REMOVE_ITEM } from '../constants/cartConstant';

export const addToCart = (productId: string, qty: number) => async (dispatch: ThunkDispatch<any, any, any>, getState: () => any) => {
    const { data } = await Axios.get(`/api/products/${productId}`);
    dispatch({
        type: CART_ADD_ITEM,
        payload: {
            name: data.name,
            image: data.image,
            price: data.price,
            countInStock: data.countInStock,
            product: data._id, // 여기서 product 는 제품 아이디를 가져온다.
            qty,
        }
    });
    console.log('getState()', getState())
    localStorage.setItem('cartItems', JSON.stringify(getState().cartStore.cartItems))
}
//    E-Commerce_React_TypeScript_Redux


export const removeFromCart = (productId: string) => (dispatch: ThunkDispatch<any, any, any>, getState: () => any) => {
    dispatch({ type: CART_REMOVE_ITEM, payload: productId });
    localStorage.setItem('cartItems', JSON.stringify(getState().cartStore.cartItems));
}