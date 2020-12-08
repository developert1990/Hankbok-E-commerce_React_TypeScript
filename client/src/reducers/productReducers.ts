import { reviewType } from './../../../server/models/productModel';
import { ProductActionType, AddReviewActionType, deleteReviewActionType } from './../actions/types.d';
import { PRODUCT_DETAILS_FAIL, PRODUCT_DETAILS_REQUEST, PRODUCT_DETAILS_SUCCESS, PRODUCT_CREATE_REQUEST, PRODUCT_CREATE_SUCCESS, PRODUCT_CREATE_FAIL, PRODUCT_CREATE_RESET, PRODUCT_UPDATE_REQUEST, PRODUCT_UPDATE_SUCCESS, PRODUCT_UPDATE_FAIL, PRODUCT_UPDATE_RESET, PRODUCT_DELETE_REQUEST, PRODUCT_DELETE_SUCCESS, PRODUCT_DELETE_FAIL, PRODUCT_DELETE_RESET, PRODUCT_CATEGORY_REQUEST, PRODUCT_CATEGORY_SUCCESS, PRODUCT_CATEGORY_FAIL, PRODUCT_ADD_REVIEW_REQUEST, PRODUCT_ADD_REVIEW_SUCCESS, PRODUCT_ADD_REVIEW_FAIL, PRODUCT_ADD_REVIEW_RESET, PRODUCT_DELETE_REVIEW_REQUEST, PRODUCT_DELETE_REVIEW_SUCCESS, PRODUCT_DELETE_REVIEW_FAIL, PRODUCT_DELETE_REVIEW_RESET } from './../constants/productConstants';

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
        reviews: []
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







export interface productCreateInitialStateType {
    product: ProductType,
    error: string;
    loading: boolean;
    success: boolean;
}

export const productCreateInitialState: productCreateInitialStateType = {
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
        reviews: []
    },
    error: '',
    loading: false,
    success: false,
}

export const productCreateReducer = (state = productCreateInitialState, action: ProductActionType) => {
    switch (action.type) {
        case PRODUCT_CREATE_REQUEST:
            return { loading: true }
        case PRODUCT_CREATE_SUCCESS:
            return { loading: false, success: true, product: action.payload };
        case PRODUCT_CREATE_FAIL:
            return { loading: false, error: action.payload };
        case PRODUCT_CREATE_RESET:
            return {}
        default:
            return state;
    }
}







export interface productUpdateInitialStateType {
    error: string;
    loading: boolean;
    success: boolean;
}

export const productUpdateInitialState: productUpdateInitialStateType = {
    error: '',
    loading: false,
    success: false,
}





export const productUpdateReducer = (state = productUpdateInitialState, action: ProductActionType) => {
    switch (action.type) {
        case PRODUCT_UPDATE_REQUEST:
            return { loading: true };
        case PRODUCT_UPDATE_SUCCESS:
            return { loading: false, success: true }
        case PRODUCT_UPDATE_FAIL:
            return { loading: false, error: action.payload }
        case PRODUCT_UPDATE_RESET:
            return {};
        default:
            return state;
    }
}







export interface productDeleteInitialStateType {
    error: string;
    loading: boolean;
    success: boolean;
}

export const productDeleteInitialState: productDeleteInitialStateType = {
    error: '',
    loading: false,
    success: false,
}



export const productDeleteReducer = (state = productDeleteInitialState, action: ProductActionType) => {
    switch (action.type) {
        case PRODUCT_DELETE_REQUEST:
            return { loading: true };
        case PRODUCT_DELETE_SUCCESS:
            return { loading: false, success: true };
        case PRODUCT_DELETE_FAIL:
            return { loading: false, error: action.payload };
        case PRODUCT_DELETE_RESET:
            return {};
        default:
            return state;
    }
}








export interface ProductListCategoryInitialStateType {
    categories: string[],
    error: string;
    loading: boolean;
}

export const productListCategoryInitialState: ProductListCategoryInitialStateType = {
    categories: [],
    error: '',
    loading: false,
}




export const productListCategoryReducer = (state = productListCategoryInitialState, action: ProductActionType) => {
    switch (action.type) {
        case PRODUCT_CATEGORY_REQUEST:
            return { loading: true };
        case PRODUCT_CATEGORY_SUCCESS:
            return { loading: false, categories: action.payload }
        case PRODUCT_CATEGORY_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state;
    }
}



export interface addReviewInitialStateType {
    error: string;
    success: boolean,
    loading: boolean,
    reviews: reviewType[];
}

export const addReviewInitialState: addReviewInitialStateType = {
    error: '',
    loading: false,
    success: false,
    reviews: [],
}

export const addReviewReducer = (state = addReviewInitialState, action: AddReviewActionType) => {
    switch (action.type) {
        case PRODUCT_ADD_REVIEW_REQUEST:
            return { loading: true }
        case PRODUCT_ADD_REVIEW_SUCCESS:
            return { loading: false, success: true, reviews: action.payload }
        case PRODUCT_ADD_REVIEW_FAIL:
            return { loading: false, error: action.payload }
        case PRODUCT_ADD_REVIEW_RESET:
            return {}
        default:
            return state;
    }
}




export interface deleteReviewInitialStateType {
    error: string;
    success: boolean,
    loading: boolean,
    message: string;
}

export const deleteReviewInitialState: deleteReviewInitialStateType = {
    error: '',
    loading: false,
    success: false,
    message: '',
}


export const deleteReviewReducer = (state = deleteReviewInitialState, action: deleteReviewActionType) => {
    switch (action.type) {
        case PRODUCT_DELETE_REVIEW_REQUEST:
            return { loading: true }
        case PRODUCT_DELETE_REVIEW_SUCCESS:
            return { loading: false, success: true, reviews: action.payload }
        case PRODUCT_DELETE_REVIEW_FAIL:
            return { loading: false, error: action.payload }
        case PRODUCT_DELETE_REVIEW_RESET:
            return {};
        default:
            return state;
    }
}