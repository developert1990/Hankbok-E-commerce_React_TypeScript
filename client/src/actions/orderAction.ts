import { PayPalPaymentResultType } from './../screens/OrderScreen';
import { orderDetailsType } from './../reducers/orderReducers';
import { saveShippingAddressDataType } from './cartActions';
import { cartItemType } from './../reducers/cartReducers';
import { CART_EMPTY } from './../constants/cartConstant';
import { ORDER_CREATE_REQUEST, ORDER_CREATE_FAIL, ORDER_CREATE_SUCCESS, ORDER_DETAILS_REQUEST, ORDER_DETAILS_FAIL, ORDER_DETAILS_SUCCESS, ORDER_PAY_REQUEST, ORDER_PAY_FAIL, ORDER_PAY_SUCCESS, ORDER_MY_LIST_REQUEST, ORDER_MY_LIST_SUCCESS, ORDER_MY_LIST_FAIL } from './../constants/orderConstant';
import { ThunkDispatch } from 'redux-thunk';
import axios from 'axios';


export interface orderItemsType {
    orderItems: cartItemType[];
    shippingAddress: saveShippingAddressDataType;
    paymentMethod: string;
    itemsPrice: number;
    shippingPrice: number;
    taxPrice: number;
    totalPrice: number;
    _id?: string;
}

// order 하는 Action
export const createOrder = (order: orderItemsType) => async (dispatch: ThunkDispatch<any, any, any>, getState: () => any) => {

    dispatch({ type: ORDER_CREATE_REQUEST, payload: order });
    try {
        const { userStore: { userInfo } } = getState(); // getState() 함수는 redux에서 사용된 모든 state정보를 가져온다 그중에서 userSignin을 distructuring 햇고 그 userSignin 에서 userInfo를 distructuring해서 뽑아준것이다.
        const { data } = await axios.post('/api/orders', order, {
            headers: {
                Authorization: `Hong ${userInfo.token}`
            }
        });
        console.log('data:+++++++', data)
        dispatch({ type: ORDER_CREATE_SUCCESS, payload: data.order });
        dispatch({ type: CART_EMPTY });
        localStorage.removeItem("cartItems");
    } catch (error) {
        dispatch({ type: ORDER_CREATE_FAIL, payload: error.response && error.response.data.message ? error.response.data.message : error.message });
    }
}


// order 후 detail을 뽑는 Action 주소를 바꿧다 /detail을 붙여줌
export const detailsOrder = (orderId: string) => async (dispatch: ThunkDispatch<any, any, any>, getState: () => any) => {
    dispatch({ type: ORDER_DETAILS_REQUEST, payload: orderId });
    try {
        const { userStore: { userInfo } } = getState();
        const { data } = await axios.get(`/api/orders/detail/${orderId}`, {
            headers: { Authorization: `Hong ${userInfo.token}` }
        });
        dispatch({ type: ORDER_DETAILS_SUCCESS, payload: data });
    } catch (error) {
        const message = error.response && error.response.data.message ? error.response.data.message : error.message;
        dispatch({ type: ORDER_DETAILS_FAIL, payload: message });
    }
}

// pay를 하는 Action

export const orderPay = (order: orderDetailsType, paymentResult: PayPalPaymentResultType) => async (dispatch: ThunkDispatch<any, any, any>, getState: () => any) => {
    dispatch({ type: ORDER_PAY_REQUEST, payload: paymentResult });
    try {
        const { userStore: { userInfo } } = getState();
        const { data } = await axios.put(`/api/orders/${order._id}/pay`, paymentResult, {
            headers: { Authorization: `Hong ${userInfo.token}` }
        });
        console.log('pay 누르고 서버에서 받아온 data: ___ ', data);
        dispatch({ type: ORDER_PAY_SUCCESS, payload: data });
        dispatch(detailsOrder(order._id as string));

    } catch (error) {
        const message = error.response && error.response.data.message ? error.response.data.message : error.message;
        dispatch({ type: ORDER_PAY_FAIL, payload: message });
    }
}

// order list 뽑는 Action

export const listMyOrder = () => async (dispatch: ThunkDispatch<any, any, any>, getState: () => any) => {
    dispatch({ type: ORDER_MY_LIST_REQUEST });
    const { userStore: { userInfo } } = getState();
    try {
        const { data } = await axios.get('/api/orders/myOrderList', {
            headers: { Authorization: `Hong ${userInfo.token}` },
        });

        console.log('히스토리 data:_____', data)
        dispatch({ type: ORDER_MY_LIST_SUCCESS, payload: data });
    } catch (error) {
        const message = error.response && error.response.data.message ? error.response.data.message : error.message;
        dispatch({ type: ORDER_MY_LIST_FAIL, payload: message })
    }
}