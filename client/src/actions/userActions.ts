import { USER_REGISTER_REQUEST, USER_REGISTER_SUCCESS, USER_REGISTER_FAIL, USER_PROFILE_UPDATE_REQUEST, USER_PROFILE_UPDATE_SUCCESS, USER_PROFILE_UPDATE_FAIL, USER_LIST_REQUEST, USER_LIST_FAIL, USER_LIST_SUCCESS, USER_DELETE_REQUEST, USER_DELETE_SUCCESS, USER_DELETE_FAIL, USER_DETAILS_REQUEST, USER_DETAILS_SUCCESS, USER_DETAILS_FAIL, USER_UPDATE_REQUEST, USER_UPDATE_SUCCESS, USER_UPDATE_FAIL, USER_REGISTER_RESET } from './../constants/userConstant';

import axios from 'axios';
import { ThunkDispatch } from 'redux-thunk';
import { USER_SIGNIN_FAIL, USER_SIGNIN_REQUEST, USER_SIGNIN_SUCCESS, USER_SIGNOUT } from '../constants/userConstant';
import { API_BASE } from '../config/index';

export const signin = (email: string, password: string) => async (dispatch: ThunkDispatch<any, any, any>) => {
    dispatch({ type: USER_SIGNIN_REQUEST, payload: { email, password } });
    try {
        const { data } = await axios.post(`${API_BASE}/api/users/signin`, { email, password });
        dispatch({ type: USER_SIGNIN_SUCCESS, payload: data })
        localStorage.setItem('userInfo', JSON.stringify(data));
    } catch (error) {
        dispatch({
            type: USER_SIGNIN_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
        })
    }
}

export const signout = () => (dispatch: ThunkDispatch<any, any, any>) => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('cartItems');
    localStorage.removeItem('shippingAddress');
    dispatch({ type: USER_SIGNOUT });
    dispatch({ type: USER_REGISTER_RESET });
};


export const register = (name: string, email: string, password: string) => async (dispatch: ThunkDispatch<any, any, any>) => {
    dispatch({ type: USER_REGISTER_REQUEST, payload: { email, password } });
    try {
        const { data } = await axios.post(`${API_BASE}/api/users/register`, { name, email, password }); // {name, email, password} 이부분은 fetch에서 body를 주는 부분이다.
        dispatch({ type: USER_REGISTER_SUCCESS, payload: data });
        dispatch({ type: USER_SIGNIN_SUCCESS, payload: data })
        localStorage.setItem('userInfo', JSON.stringify(data));
    } catch (error) {
        dispatch({
            type: USER_REGISTER_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
        })
    }
}

interface InfoForUpdateUserProfileType {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}


// 자기 개인 계정 update
export const updateUser = (userId: string, updateInfo: InfoForUpdateUserProfileType) => async (dispatch: ThunkDispatch<any, any, any>, getState: () => any) => {
    dispatch({ type: USER_PROFILE_UPDATE_REQUEST });
    const { userStore: { userInfo } } = getState();
    try {
        const { data } = await axios.put(`${API_BASE}/api/users/${userId}`, updateInfo, {
            headers: { Authorization: `Hong ${userInfo.token}` }
        });
        dispatch({ type: USER_PROFILE_UPDATE_SUCCESS, payload: data });
        dispatch({ type: USER_SIGNIN_SUCCESS, payload: data });
        localStorage.setItem('userInfo', JSON.stringify(data));

    } catch (error) {
        const message = error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        dispatch({ type: USER_PROFILE_UPDATE_FAIL, payload: message });
    }
};


// 모든 유저 list 가져온다.
export const listUsers = () => async (dispatch: ThunkDispatch<any, any, any>, getState: () => any) => {
    dispatch({ type: USER_LIST_REQUEST });
    const { userStore: { userInfo } } = getState();
    try {
        const { data } = await axios.get(`${API_BASE}/api/users/${userInfo.isAdmin}/allList`, {
            headers: { Authorization: `Hong ${userInfo.token}` }
        })
        console.log('리스트 뽑는 action data', data)
        dispatch({ type: USER_LIST_SUCCESS, payload: data });
    } catch (error) {
        const message = error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        dispatch({ type: USER_LIST_FAIL, payload: message });
    }

};

// 클릭한 유저 삭제

export const deleteUser = (userId: string) => async (dispatch: ThunkDispatch<any, any, any>, getState: () => any) => {
    dispatch({ type: USER_DELETE_REQUEST });
    const { userStore: { userInfo } } = getState();
    console.log('유저 삭제하는 action들어옴')
    try {
        const { data } = await axios.delete(`${API_BASE}/api/users/${userId}/${userInfo.isAdmin}`, {
            headers: { Authorization: `Hong ${userInfo.token}` },
        });

        dispatch({ type: USER_DELETE_SUCCESS, payload: data });
    } catch (error) {

        const message = error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        console.log('message delete:   ', message)
        dispatch({ type: USER_DELETE_FAIL, payload: message });
    }
}


// user detail Action
export const userDetails = (userId: string) => async (dispatch: ThunkDispatch<any, any, any>, getState: () => any) => {
    dispatch({ type: USER_DETAILS_REQUEST });
    const { userStore: { userInfo } } = getState();
    try {
        const { data } = await axios.get(`${API_BASE}/api/users/${userId}/${userInfo.isAdmin}/detail`, {
            headers: { Authorization: `Hong ${userInfo.token}` }
        });
        console.log(' 유저 디테일 받는 data', data);
        dispatch({ type: USER_DETAILS_SUCCESS, payload: data })
    } catch (error) {
        const message = error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        dispatch({ type: USER_DETAILS_FAIL, payload: message });
    }
}


interface userUpdateByAdminType {
    _id: string;
    name: string;
    email: string;
    isSeller: boolean;
    isAdmin: boolean;
}

// admin 계정에서 다른 유저의 정보 변경
export const userUpdate = (updateInfo: userUpdateByAdminType) => async (dispatch: ThunkDispatch<any, any, any>, getState: () => any) => {
    dispatch({ type: USER_UPDATE_REQUEST });
    const { userStore: { userInfo } } = getState();
    try {
        const { data } = await axios.put(`${API_BASE}/api/users/${updateInfo._id}/${userInfo.isAdmin}/update`, updateInfo, {
            headers: { Authorization: `Hong ${userInfo.token}` }
        });
        dispatch({ type: USER_UPDATE_SUCCESS, payload: data });

    } catch (error) {
        const message = error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        dispatch({ type: USER_UPDATE_FAIL, payload: message });
    }
};