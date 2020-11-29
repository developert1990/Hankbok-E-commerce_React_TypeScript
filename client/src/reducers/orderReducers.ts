import { PaymentResultType } from './../../../server/types.d';
import { orderItemsType } from '../actions/orderAction';
import { cartItemType } from './cartReducers';
import { saveShippingAddressDataType } from './../actions/cartActions';
import { ORDER_CREATE_REQUEST, ORDER_CREATE_SUCCESS, ORDER_CREATE_FAIL, ORDER_CREATE_RESET, ORDER_DETAILS_REQUEST, ORDER_DETAILS_SUCCESS, ORDER_DETAILS_FAIL, ORDER_PAY_REQUEST, ORDER_PAY_SUCCESS, ORDER_PAY_FAIL, ORDER_MY_LIST_REQUEST, ORDER_MY_LIST_SUCCESS, ORDER_MY_LIST_FAIL } from './../constants/orderConstant';
import { orderActionType, orderDetailActionType, orderPayActionType, orderMyHistoryListActionType } from './../actions/types.d';



// ORDER
export interface orderIinitialStateType {
    loading: boolean;
    error: string;
    success: boolean;
    order?: orderItemsType;
}

export const orderInitialState: orderIinitialStateType = {
    loading: false,
    error: '',
    success: false,

}

export const orderCreateReducer = (state = orderInitialState, action: orderActionType) => {
    switch (action.type) {
        case ORDER_CREATE_REQUEST:
            return { loading: true };
        case ORDER_CREATE_SUCCESS:
            return { loading: false, success: true, order: action.payload }
        case ORDER_CREATE_FAIL:
            return { loading: false, error: action.payload };
        case ORDER_CREATE_RESET:
            return {};
        default:
            return state;
    }
}

// ORDER DETAIL

export interface orderDetailsType {
    orderItems: cartItemType[];
    shippingAddress: saveShippingAddressDataType;
    paymentMethod: string;
    itemsPrice: number;
    shippingPrice: number;
    taxPrice: number;
    totalPrice: number;
    isDelivered: boolean;
    createdAt: string;
    isPaid: boolean;
    _id?: string;
    paidAt?: string;
    updatedAt?: string;
    user?: string;
}

export interface orderDetailInitailStateType {
    loading: boolean,
    order: orderDetailsType,
    error: '',
}

export const orderDetailInitialState: orderDetailInitailStateType = {
    loading: true,
    error: '',
    order: {
        orderItems: localStorage.getItem("cartItems")
            ? JSON.parse(localStorage.getItem("cartItems") as string)
            : [],
        shippingAddress: localStorage.getItem("shippingAddress") ? JSON.parse(localStorage.getItem("shippingAddress") as string) : {},
        paymentMethod: 'PayPal',
        itemsPrice: 0,
        shippingPrice: 0,
        taxPrice: 0,
        totalPrice: 0,
        isDelivered: false,
        createdAt: '',
        isPaid: false,
    },
}

export const orderDetailsReducer = (state = orderDetailInitialState, action: orderDetailActionType) => {
    switch (action.type) {
        case ORDER_DETAILS_REQUEST:
            return { loading: true }
        case ORDER_DETAILS_SUCCESS:
            return { loading: false, order: action.payload };
        case ORDER_DETAILS_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state;
    }
}






// PAY 

export interface orderPayType {
    paidAt: string;
    orderItems: cartItemType[];
    shippingAddress: saveShippingAddressDataType;
    paymentMethod: string;
    itemsPrice: number;
    shippingPrice: number;
    taxPrice: number;
    totalPrice: number;
    isDelivered: boolean;
    createdAt: string;
    isPaid: boolean;
    _id?: string;
    updatedAt: string;
    user: string;
}

export interface orderPayInitialStateType {
    loading: boolean,
    order: orderPayType,
    error: '',
}

export const orderPayInitailState: orderPayInitialStateType = {
    loading: true,
    error: '',
    order: {
        createdAt: '',
        isDelivered: false,
        isPaid: false,
        itemsPrice: 0,
        orderItems: localStorage.getItem("cartItems")
            ? JSON.parse(localStorage.getItem("cartItems") as string)
            : [],
        paidAt: '',
        paymentMethod: 'PayPal',
        shippingAddress: localStorage.getItem("shippingAddress") ? JSON.parse(localStorage.getItem("shippingAddress") as string) : {},
        shippingPrice: 0,
        taxPrice: 0,
        totalPrice: 0,
        updatedAt: '',
        user: '',
        _id: '',
    },
}

export const orderPayReducer = (state = orderPayInitailState, action: orderPayActionType) => {
    switch (action.type) {
        case ORDER_PAY_REQUEST:
            return { loading: true };
        case ORDER_PAY_SUCCESS:
            return { loading: false, order: action.payload };
        case ORDER_PAY_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}









export interface DeliveryResultType {
    deliveredAt: string;
}

export interface OrdersType {
    paidAt: string;
    orderItems: cartItemType[];
    shippingAddress: saveShippingAddressDataType;
    paymentMethod: string;
    itemsPrice: number;
    shippingPrice: number;
    taxPrice: number;
    totalPrice: number;
    isDelivered: boolean;
    createdAt: string;
    isPaid: boolean;
    _id?: string;
    updatedAt: string;
    user: string;
    paymentResult: PaymentResultType;
    deliveryResult: DeliveryResultType;
}


export interface orderMyHistoryListInitialStateType {
    loading: boolean,
    orders: OrdersType[],
    error: '',
}

export const orderMyHistoryListInitailState: orderMyHistoryListInitialStateType = {
    loading: false,
    error: '',
    orders: []
}

export const orderMyHistoryListReducer = (state = orderMyHistoryListInitailState, action: orderMyHistoryListActionType) => {
    switch (action.type) {
        case ORDER_MY_LIST_REQUEST:
            return { loading: true };
        case ORDER_MY_LIST_SUCCESS:
            return { loading: false, orders: action.payload };
        case ORDER_MY_LIST_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}