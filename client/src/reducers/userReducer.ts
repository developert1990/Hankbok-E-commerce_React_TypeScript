import { USER_SIGNIN_REQUEST, USER_SIGNIN_SUCCESS, USER_SIGNIN_FAIL, USER_SIGNOUT, USER_REGISTER_REQUEST, USER_REGISTER_SUCCESS, USER_REGISTER_FAIL, USER_PROFILE_UPDATE_REQUEST, USER_PROFILE_UPDATE_SUCCESS, USER_PROFILE_UPDATE_FAIL, USER_LIST_REQUEST, USER_LIST_SUCCESS, USER_LIST_FAIL, USER_DELETE_REQUEST, USER_DELETE_SUCCESS, USER_DELETE_FAIL, USER_DELETE_RESET, USER_DETAILS_REQUEST, USER_DETAILS_SUCCESS, USER_DETAILS_FAIL, USER_DETAILS_RESET, USER_UPDATE_REQUEST, USER_UPDATE_SUCCESS, USER_UPDATE_FAIL, USER_UPDATE_RESET } from './../constants/userConstant';
import { userActionType, userProfileUpdateActionType, userListActionType, userDeleteActionType, userDetailActionType } from './../actions/types.d';

export interface userType {
    _id: string;
    name: string;
    email: string;
    isAdmin: boolean;
    isSeller: boolean;
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


export interface userListInitialStateType {
    users: userType[];
    error: string;
    loading: boolean;
}

export const userListInitialState: userListInitialStateType = {
    users: [],
    error: '',
    loading: false,
}




export const userListReducer = (state = userListInitialState, action: userListActionType) => {
    switch (action.type) {
        case USER_LIST_REQUEST:
            return { loading: true };
        case USER_LIST_SUCCESS:
            return { loading: false, users: action.payload };
        case USER_LIST_FAIL:
            return { loading: false, error: action.payload };

        default:
            return state;
    }
}









export interface userDeleteInitialStateType {
    success: boolean;
    error: string;
    loading: boolean;
}

export const userDeleteInitialState: userDeleteInitialStateType = {
    success: false,
    error: '',
    loading: false,
}




export const userDeleteReducer = (state = userDeleteInitialState, action: userDeleteActionType) => {
    switch (action.type) {
        case USER_DELETE_REQUEST:
            return { loading: true };
        case USER_DELETE_SUCCESS:
            return { loading: false, success: true };
        case USER_DELETE_FAIL:
            return { loading: false, error: action.payload };
        case USER_DELETE_RESET:
            return {};
        default:
            return state;
    }
};











export interface userDetailInitialStateType {
    loading: boolean;
    user: userType | {};
    error: string;
}

export const userDetailInitialState: userDetailInitialStateType = {
    loading: false,
    user: {},
    error: '',

}

export const userDetailReducer = (state = {}, action: userDetailActionType) => {
    switch (action.type) {
        case USER_DETAILS_REQUEST:
            return { loading: true }
        case USER_DETAILS_SUCCESS:
            return { loading: false, user: action.payload };
        case USER_DETAILS_FAIL:
            return { loading: false, error: action.payload };
        case USER_DETAILS_RESET:
            return {};
        default:
            return state;
    }
}





// admin 계정으로 user 계정 정보 변경
export interface userUpdateInitialStateType {
    success: boolean
    error: string;
    loading: boolean;
}

export const userUpdateInitialState: userUpdateInitialStateType = {
    success: false,
    error: '',
    loading: false,
}




export const userUpdateReducer = (state = userUpdateInitialState, action: userProfileUpdateActionType) => {
    switch (action.type) {
        case USER_UPDATE_REQUEST:
            return { loading: true };
        case USER_UPDATE_SUCCESS:
            return { loading: false, success: true };
        case USER_UPDATE_FAIL:
            return { loading: false, error: action.payload };
        case USER_UPDATE_RESET:
            return {};
        default:
            return state;
    }
}
