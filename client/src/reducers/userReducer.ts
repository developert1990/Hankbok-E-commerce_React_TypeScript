import { USER_SIGNIN_REQUEST, USER_SIGNIN_SUCCESS, USER_SIGNIN_FAIL, USER_SIGNOUT, USER_REGISTER_REQUEST, USER_REGISTER_SUCCESS, USER_REGISTER_FAIL, USER_PROFILE_UPDATE_REQUEST, USER_PROFILE_UPDATE_SUCCESS, USER_PROFILE_UPDATE_FAIL } from './../constants/userConstant';
import { userActionType, userProfileUpdateActionType } from './../actions/types.d';

export interface userType {
    _id: string;
    name: string;
    email: string;
    isAdmin: boolean
    token: string;
}

export interface userSigninInitialStateType {
    userInfo: userType;
    error: string;
    loading: boolean;
}

export const userSigninInitialState: userSigninInitialStateType = {
    userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo') as string) : null,
    error: '',
    loading: false,
}

export const userSigninReducer = (state = userSigninInitialState, action: userActionType) => {
    switch (action.type) {
        case USER_SIGNIN_REQUEST:
            return { loading: true }
        case USER_SIGNIN_SUCCESS:
            return { loading: false, userInfo: action.payload };
        case USER_SIGNIN_FAIL:
            return { loading: false, error: action.payload };
        case USER_SIGNOUT:
            return {}
        default:
            return state;
    }
}

export interface registerType {
    name: string;
    email: string;
}

export interface userRegisterInitialType {
    userInfo: registerType;
    error: string;
    loading: boolean;
}

export const userRegisterInitailState: userRegisterInitialType = {
    userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo') as string) : null,
    error: '',
    loading: false,
}


export const userRegisterReducer = (state = userRegisterInitailState, action: userActionType) => {
    switch (action.type) {
        case USER_REGISTER_REQUEST:
            return { loading: true }
        case USER_REGISTER_SUCCESS:
            return { loading: false, userInfo: action.payload };
        case USER_REGISTER_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}












export interface userProfileUpdateInitialStateType {
    user: any;
    error: string;
    loading: boolean;
}

export const userProfileUpdateInitialState: userProfileUpdateInitialStateType = {
    user: {},
    error: '',
    loading: false,
}




export const userProfileUpdateReducer = (state = userProfileUpdateInitialState, action: userProfileUpdateActionType) => {
    switch (action.type) {
        case USER_PROFILE_UPDATE_REQUEST:
            return { loading: true };
        case USER_PROFILE_UPDATE_SUCCESS:
            return { loading: false, user: action.payload };
        case USER_PROFILE_UPDATE_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}