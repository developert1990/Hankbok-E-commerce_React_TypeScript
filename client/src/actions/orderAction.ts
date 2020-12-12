import { PayPalPaymentResultType } from './../screens/OrderScreen';
import { orderDetailsType } from './../reducers/orderReducers';
import { saveShippingAddressDataType } from './cartActions';
import { cartItemType } from './../reducers/cartReducers';
import { CART_EMPTY } from './../constants/cartConstant';
import { ORDER_CREATE_REQUEST, ORDER_CREATE_FAIL, ORDER_CREATE_SUCCESS, ORDER_DETAILS_REQUEST, ORDER_DETAILS_FAIL, ORDER_DETAILS_SUCCESS, ORDER_PAY_REQUEST, ORDER_PAY_FAIL, ORDER_PAY_SUCCESS, ORDER_MY_LIST_REQUEST, ORDER_MY_LIST_SUCCESS, ORDER_MY_LIST_FAIL, ORDER_LIST_REQUEST, ORDER_LIST_SUCCESS, ORDER_LIST_FAIL, ORDER_DELIVER_REQUEST, ORDER_DELIVER_SUCCESS, ORDER_DELIVER_FAIL, ORDER_DELETE_REQUEST, ORDER_DELETE_SUCCESS, ORDER_DELETE_FAIL } from './../constants/orderConstant';
import { ThunkDispatch } from 'redux-thunk';
import axios from 'axios';
import { API_BASE } from '../config/index';



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
        const { data } = await axios.post(`${API_BASE}/api/orders`, order, {
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
        const { data } = await axios.get(`${API_BASE}/api/orders/detail/${orderId}`, {
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
        const { data } = await axios.put(`${API_BASE}/api/orders/${order._id}/pay`, paymentResult, {
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
        const { data } = await axios.get(`${API_BASE}/api/orders/myOrderList`, {
            headers: { Authorization: `Hong ${userInfo.token}` },
        });

        console.log('히스토리 data:_____', data)
        dispatch({ type: ORDER_MY_LIST_SUCCESS, payload: data });
    } catch (error) {
        const message = error.response && error.response.data.message ? error.response.data.message : error.message;
        dispatch({ type: ORDER_MY_LIST_FAIL, payload: message })
    }
}


// 유저가 order한 목록 전부 가져옴
export const listOrders = () => async (dispatch: ThunkDispatch<any, any, any>, getState: () => any) => {
    dispatch({ type: ORDER_LIST_REQUEST });
    const { userStore: { userInfo } } = getState();
    try {
        const { data } = await axios.get(`${API_BASE}/api/orders/${userInfo.isAmdin}`, {
            headers: { Authorization: `Hong ${userInfo.token}` },
        });
        dispatch({ type: ORDER_LIST_SUCCESS, payload: data });

    } catch (error) {
        const message = error.response && error.response.data.message ? error.response.data.message : error.message;
        dispatch({ type: ORDER_LIST_FAIL, payload: message })
    }
}



// 유저가 오더 했던것들 삭제 할수 잇는 기능
export const deleteOrder = (orderId: string) => async (dispatch: ThunkDispatch<any, any, any>, getState: () => any) => {
    dispatch({ type: ORDER_DELETE_REQUEST });
    const { userStore: { userInfo } } = getState();
    try {
        const { data } = await axios.delete(`${API_BASE}/api/orders/${orderId}`, {
            headers: { Authorization: `Hong ${userInfo.token}` },
            data: { userInfo: userInfo },
        })
        dispatch({ type: ORDER_DELETE_SUCCESS, payload: data });
    } catch (error) {
        const message = error.response && error.response.data.message ? error.response.data.message : error.message;
        dispatch({ type: ORDER_DELETE_FAIL, payload: message })
    }
}








// deliver 설정
export const deliverOrder = (orderId: string) => async (dispatch: ThunkDispatch<any, any, any>, getState: () => any) => {
    dispatch({ type: ORDER_DELIVER_REQUEST });
    try {
        const { userStore: { userInfo } } = getState();
        const { data } = await axios.put(`${API_BASE}/api/orders/${orderId}/deliver/${userInfo.isAdmin}`, {}, {
            headers: { Authorization: `Hong ${userInfo.token}` },
        });
        console.log('Pay버튼누르고 받아온 data: _____', data);
        dispatch({ type: ORDER_DELIVER_SUCCESS, payload: data });
        // 페이 한다음 detail을 다시 받아온다.
        dispatch(detailsOrder(orderId));
    } catch (error) {
        const message = error.response && error.response.data.message ? error.response.data.message : error.message;
        dispatch({ type: ORDER_DELIVER_FAIL, payload: message });
    }
}