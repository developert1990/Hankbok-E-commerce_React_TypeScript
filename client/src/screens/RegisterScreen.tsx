import React, { ChangeEvent, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { register } from '../actions/userActions';
import { LoadingBox } from '../components/LoadingBox';
import { MessageBox } from '../components/MessageBox';
import { initialAppStateType } from '../store';

export const RegisterScreen = () => {
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const dispatch = useDispatch();
    const location = useLocation();
    const history = useHistory();

    const redirect = location.search ? location.search.split("=")[1] : '/';
    const userRegister = useSelector((state: initialAppStateType) => state.registerStore);
    const { userInfo, error, loading } = userRegister;

    const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Password and confirm password are not match')
        } else {
            dispatch(register(name, email, password))
        }
    }

    // 여기서 지금 nav에서 log out했을 때 userInfo 정보가 남아있어서 자꾸 redirect path 가 / 이렇게 된다.
    useEffect(() => {

        console.log('userInfo:___', userInfo)
        if (userInfo) {
            console.log('redirect:___', redirect)
            history.push(redirect);
        }
    }, [userInfo, redirect, history])




    const [passwordConfirmError, setPasswordConfirmError] = useState<string>('');
    const isInvalid = name === '' || password === '' || email === '' || confirmPassword === '';

    const handleSignup = () => {
        if (password !== confirmPassword) {
            setPasswordConfirmError('Please Enter the same password');
        } else {
            dispatch(register(name, email, password))
        }
    }

    return (
        <>
            {/* <div>
                <form onSubmit={submitHandler} className="form">
                    <div>
                        <h1>Create Account</h1>
                    </div>
                    {loading && <LoadingBox />}
                    {error && <MessageBox variant="danger">{error}</MessageBox>}
                    <div>
                        <label htmlFor="name">Name</label>
                        <input type="text" id="name" placeholder="Enter name" required onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)} />
                    </div>
                    <div>
                        <label htmlFor="email">Email Address</label>
                        <input type="email" id="email" placeholder="Enter email" required onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} />
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" placeholder="Enter password" required onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword">ConfirmPassword</label>
                        <input type="password" id="confirmPassword" placeholder="Enter confirm password" required onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)} />
                    </div>
                    <div>
                        <label />
                        <button className="primary" type="submit">Register</button>
                        <div>
                            <label />
                            <div>
                                Already have an account?{''}
                                <Link to={`/signin?redirect=${redirect}`}>Sign-In</Link>
                            </div>
                        </div>
                    </div>
                </form>
            </div> */}




            <div className="signup">
                <div className="form">
                    <h1 className="form__title">Sign Up</h1>
                    {loading && <LoadingBox />}
                    {error && <MessageBox variant="danger">{error}</MessageBox>}

                    <div className="form__base">
                        <input className="form__input"
                            placeholder="First Name"
                            value={name}
                            onChange={({ target }) => setName(target.value)} />
                        <input className="form__input"
                            type="email"
                            placeholder="Email address"
                            value={email}
                            onChange={({ target }) => setEmail(target.value)} />
                        <input className="form__input"
                            type="password"
                            value={password}
                            autoComplete="off"
                            placeholder="Password"
                            onChange={({ target }) => setPassword(target.value)} />
                        <input className="form__input"
                            type="password"
                            value={confirmPassword}
                            autoComplete="off"
                            placeholder="Confirm Password"
                            onChange={({ target }) => setConfirmPassword(target.value)} />
                        {passwordConfirmError}
                        <button className="form__submit" disabled={isInvalid} onClick={handleSignup} type="submit">
                            Sign Up
                    </button>
                        <div>
                            Already have an account?{''}
                            <Link to={`/signin?redirect=${redirect}`}>Sign-In</Link>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}
