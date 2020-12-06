import React, { ComponentType } from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { initialAppStateType } from '../store';
import { useSelector } from 'react-redux';


// admin 유저가 아닌경우 url로 접속하는걸 방지하는 컴포넌트


interface adminRoutePropsType extends RouteProps {
    component: ComponentType<any>
}

export const AdminRoute: React.FC<adminRoutePropsType> = ({ component: Component, ...rest }) => {
    const userSignin = useSelector((state: initialAppStateType) => state.userStore);
    const { userInfo } = userSignin;
    return (
        <Route
            {...rest}
            render={(props) => userInfo && userInfo.isAdmin ? (
                <Component {...props}></Component>
            ) : (
                    <Redirect to="signin" />
                )}
        >

        </Route>
    )
}
