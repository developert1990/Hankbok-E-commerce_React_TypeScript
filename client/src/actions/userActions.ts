import { USER_REGISTER_REQUEST, USER_REGISTER_SUCCESS, USER_REGISTER_FAIL, USER_PROFILE_UPDATE_REQUEST, USER_PROFILE_UPDATE_SUCCESS, USER_PROFILE_UPDATE_FAIL, USER_LIST_REQUEST, USER_LIST_FAIL, USER_LIST_SUCCESS } from './../constants/userConstant';

import axios from 'axios';
import { ThunkDispatch } from 'redux-thunk';
import { USER_SIGNIN_FAIL, USER_SIGNIN_REQUEST, USER_SIGNIN_SUCCESS, USER_SIGNOUT } from '../constants/userConstant';

export const signin = (email: string, password: string) => async (dispatch: ThunkDispatch<any, any, any>) => {
    dispatch({ type: USER_SIGNIN_REQUEST, payload: { email, password } });
    try {
        const { data } = await axios.post('/api/users/signin', { email, password });
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
};


export const register = (name: string, email: string, password: string) => async (dispatch: ThunkDispatch<any, any, any>) => {
    dispatch({ type: USER_REGISTER_REQUEST, payload: { email, password } });
    try {
        const { data } = await axios.post('/api/users/register', { name, email, password }); // {name, email, password} 이부분은 fetch에서 body를 주는 부분이다.
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

export const updateUser = (userId: string, updateInfo: InfoForUpdateUserProfileType) => async (dispatch: ThunkDispatch<any, any, any>, getState: () => any) => {
    dispatch({ type: USER_PROFILE_UPDATE_REQUEST });
    const { userStore: { userInfo } } = getState();
    try {
        const { data } = await axios.put(`/api/users/${userId}`, updateInfo, {
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
        const { data } = await axios.get(`/api/users/:${userInfo.isAdmin}`, {
            headers: { Authorization: `Hong ${userInfo.token}` }
        })
        dispatch({ type: USER_LIST_SUCCESS, payload: data });
    } catch (error) {
        const message = error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        dispatch({ type: USER_LIST_FAIL, payload: message });
    }

}