import { ProductActionType } from './../actions/types.d';
import { PRODUCT_DETAILS_FAIL, PRODUCT_DETAILS_REQUEST, PRODUCT_DETAILS_SUCCESS } from './../constants/productConstants';

import { ProductType } from './../types.d';
import { PRODUCT_LIST_FAIL, PRODUCT_LIST_REQUEST, PRODUCT_LIST_SUCCESS } from '../constants/productConstants';



export interface ProductListInitialStateType {
    products: ProductType[],
    error: string;
    loading: boolean;
}

export const productListInitialState: ProductListInitialStateType = {
    products: [],
    error: '',
    loading: false,
}

export interface ProductDetailsInitialStateType {
    product: ProductType,
    error: string;
    loading: boolean;
}

export const productDetailsInitialState: ProductDetailsInitialStateType = {
    product: {
        _id: '',
        name: '',
        category: '',
        image: '',
        price: 0,
        brand: '',
        rating: 0,
        numReviews: 0,
        description: '',
        countInStock: 0,
    },
    error: '',
    loading: false,
}




export const productListReducer = (state = productListInitialState, action: ProductActionType) => {
    switch (action.type) {
        case PRODUCT_LIST_REQUEST:
            return { loading: true };
        case PRODUCT_LIST_SUCCESS:
            return { loading: false, products: action.payload }
        case PRODUCT_LIST_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state;
    }
}

export const productDetailsReducer = (state = productDetailsInitialState, action: ProductActionType) => {
    switch (action.type) {
        case PRODUCT_DETAILS_REQUEST:
            return { loading: true }
        case PRODUCT_DETAILS_SUCCESS:
            return { loading: false, product: action.payload }
        case PRODUCT_DETAILS_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state;
    }
}