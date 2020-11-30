import { CART_SAVE_SHIPPING_ADDRESS, CART_SAVE_PAYMENT_METHOD } from './../constants/cartConstant';
import { ThunkDispatch } from 'redux-thunk';
import Axios from 'axios';
import { CART_ADD_ITEM, CART_REMOVE_ITEM } from '../constants/cartConstant';

// cart에 제품 저장
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


// cart 에서 목록 전부 삭제
export const removeFromCart = (productId: string) => (dispatch: ThunkDispatch<any, any, any>, getState: () => any) => {
    dispatch({ type: CART_REMOVE_ITEM, payload: productId });
    localStorage.setItem('cartItems', JSON.stringify(getState().cartStore.cartItems));
}


export interface saveShippingAddressDataType {
    fullName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
}

// shipping 주소 설정
export const saveShippingAddress = (data: saveShippingAddressDataType) => (dispatch: ThunkDispatch<any, any, any>) => {
    dispatch({ type: CART_SAVE_SHIPPING_ADDRESS, payload: data });
    localStorage.setItem("shippingAddress", JSON.stringify(data));
}

// payment 방법 설정
export const savePaymentMethod = (method: string) => (dispatch: ThunkDispatch<any, any, any>) => {
    dispatch({ type: CART_SAVE_PAYMENT_METHOD, payload: method });
}

