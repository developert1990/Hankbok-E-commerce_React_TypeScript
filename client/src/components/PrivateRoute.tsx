import React, { ComponentType } from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { initialAppStateType } from '../store';



// 계정 유저가 아닌경우 url로 접속하는걸 방지하는 컴포넌트

interface PrivateCustomRoutePropsType extends RouteProps {
    component: ComponentType<any>
}

export const PrivateRoute: React.FC<PrivateCustomRoutePropsType> = ({ component: Component, ...rest }) => {
    const userStoreInfo = useSelector((state: initialAppStateType) => state.userStore);
    const { userInfo } = userStoreInfo;
    return (
        <Route
            {...rest}
            render={(props) => userInfo ? (
                <Component {...props}></Component>
            ) : (
                    <Redirect to="/signin" />
                )
            }
        >

        </Route>
    )
}