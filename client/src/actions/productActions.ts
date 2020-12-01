import { ProductType, ProductCreateType } from './../types.d';
import { PRODUCT_CREATE_REQUEST, PRODUCT_CREATE_SUCCESS, PRODUCT_CREATE_FAIL, PRODUCT_UPDATE_REQUEST, PRODUCT_UPDATE_SUCCESS, PRODUCT_UPDATE_FAIL, PRODUCT_DELETE_REQUEST, PRODUCT_DELETE_SUCCESS, PRODUCT_DELETE_FAIL } from './../constants/productConstants';

import { PRODUCT_LIST_REQUEST, PRODUCT_LIST_SUCCESS, PRODUCT_LIST_FAIL, PRODUCT_DETAILS_REQUEST, PRODUCT_DETAILS_SUCCESS, PRODUCT_DETAILS_FAIL } from '../constants/productConstants';
import Axios from 'axios';
import { ThunkDispatch } from 'redux-thunk';

// all products List 가져옴
export const listProducts = () => async (dispatch: ThunkDispatch<any, any, any>) => {
    dispatch({
        type: PRODUCT_LIST_REQUEST
    });
    try {
        const { data } = await Axios.get(`/api/products`);
        dispatch({ type: PRODUCT_LIST_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: PRODUCT_LIST_FAIL, payload: error.message })
    }
}

// product 세부 정보 가져옴
export const detailsProduct = (productId: string) => async (dispatch: ThunkDispatch<any, any, any>) => {
    dispatch({ type: PRODUCT_DETAILS_REQUEST, payload: productId });
    try {
        const { data } = await Axios.get(`/api/products/${productId}`);
        dispatch({ type: PRODUCT_DETAILS_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: PRODUCT_DETAILS_FAIL,
            payload: error.response && error.response.data.message ?
                error.response.data.message :
                error.message
        })
    }
}


// 새 product Create
export const createProduct = (createProduct: ProductCreateType) => async (dispatch: ThunkDispatch<any, any, any>, getState: () => any) => {
    dispatch({ type: PRODUCT_CREATE_REQUEST });
    const { userStore: { userInfo } } = getState();
    try {
        const { data } = await Axios.post('/api/products', { userInfo, createProduct }, {
            headers: { Authorization: `hong ${userInfo.token}` }
        });
        console.log('created product data', data)
        dispatch({ type: PRODUCT_CREATE_SUCCESS, payload: data.product });
    } catch (error) {
        const message = error.response && error.response.data.message ?
            error.response.data.message :
            error.message
        dispatch({ type: PRODUCT_CREATE_FAIL, payload: message });
    }
}

// 기존 product Update
export const updateProduct = (product: ProductType) => async (dispatch: ThunkDispatch<any, any, any>, getState: () => any) => {
    dispatch({ type: PRODUCT_UPDATE_REQUEST, payload: product });
    const { userStore: { userInfo } } = getState();
    try {
        const { data } = await Axios.put(`/api/products/${product._id}`, { product, userInfo }, {
            headers: { Authorization: `Hong ${userInfo.token}` }
        });
        dispatch({ type: PRODUCT_UPDATE_SUCCESS, payload: data });
    } catch (error) {
        const message = error.response && error.response.data.message ?
            error.response.data.message :
            error.message
        dispatch({ type: PRODUCT_UPDATE_FAIL, payload: message });
    }
}


// product delete

export const deleteProduct = (product: ProductType) => async (dispatch: ThunkDispatch<any, any, any>, getState: () => any) => {
    dispatch({ type: PRODUCT_DELETE_REQUEST });
    const { userStore: { userInfo } } = getState();
    try {
        const { data } = await Axios.delete(`/api/products/${product._id}`, {
            headers: { Authorization: `Hong ${userInfo.token}` },
            data: { userInfo: userInfo }, // 이렇게 넣으면 서버에서 body로 받는다.
        });
        dispatch({ type: PRODUCT_DELETE_SUCCESS });
    } catch (error) {
        const message = error.response && error.response.data.message ?
            error.response.data.message :
            error.message
        dispatch({ type: PRODUCT_DELETE_FAIL, payload: message });
    }
} 