import { userType } from './../reducers/userReducer';
import { cartItemType } from './../reducers/cartReducers';
import { ProductType } from './../types.d';
import { orderDeliverType } from '../reducers/orderReducers';

export interface ProductActionType {
    type: string;
    payload: ProductType[];
}

export interface orderListActionType {
    type: string;
    payload: any;
}

export interface CartActionType {
    type: string;
    payload: cartItemType | string;
}

export interface userProfileUpdateActionType {
    type: string;
    payload: any;
}

export interface userActionType {
    type: string;
    payload: userType | string;
}

export interface userListActionType {
    type: string;
    payload: any;
}

export interface orderActionType {
    type: string;
    payload: orderItemsType
}

export interface orderDetailActionType {
    type: string;
    payload: orderItemsType
}

export interface orderPayActionType {
    type: string;
    payload: orderPayType
}


export interface orderMyHistoryListActionType {
    type: string;
    payload: any;
}


export interface orderDeliverActionType {
    type: string;
    payload: orderDeliverType;
}