import React, { ChangeEvent, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { signin } from '../actions/userActions';
import { LoadingBox } from '../components/LoadingBox';
import { MessageBox } from '../components/MessageBox';
import { initialAppStateType } from '../store';

export const SigninScreen = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const dispatch = useDispatch();
    const location = useLocation();
    const history = useHistory();

    const redirect = location.search ? location.search.split('=')[1] : '/';
    const userSignin = useSelector((state: initialAppStateType) => state.userStore);
    const { userInfo, error, loading } = userSignin;
    const isInvalid = email === '' || password === '';

    const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch(signin(email, password))
    }

    useEffect(() => {
        if (userInfo) {
            history.push(redirect);
        }
    }, [userInfo, redirect, history])

    const handleSignIn = () => {

        dispatch(signin(email, password))
    }

    return (
        <>
            <div className="signin">
                <div className="form">
                    <h1 className="form__title">Sign In</h1>
                    {loading && <LoadingBox />}
                    {error && <MessageBox variant="danger">{error}</MessageBox>}
                    <div className="form__base">
                        <input className="form__input"
                            placeholder="Email Address"
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                            name="email" />
                        <input className="form__input"
                            type="password"
                            autoComplete="off"
                            placeholder="Password"
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                            name="password"
                            onKeyPress={event => event.key === 'Enter' ? handleSignIn() : null} />
                        {error && <MessageBox variant="danger">{error}</MessageBox>}
                        <button onClick={handleSignIn} className="form__submit" disabled={isInvalid} type="submit">
                            Sign In
                            </button>
                    </div>

                    <div className="form__text">
                        New customer? <Link className="form__link" to={`/register?redirect=${redirect}`}>Sign up now.</Link>
                    </div>
                    <div className="form__smallText">
                        This page is protected by Canada to ensure you're not a bot. Learn more.
                    </div>


                </div>
            </div>
        </>
    )
}
