import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { LoadingBox } from '../components/LoadingBox';
import { MessageBox } from '../components/MessageBox';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { initialAppStateType } from '../store';
import { userDetails, userUpdate } from '../actions/userActions';
import { userType } from '../reducers/userReducer';
import { USER_DETAILS_RESET, USER_UPDATE_RESET } from '../constants/userConstant';

interface AdminUserEditParamsType {
    id: string;
}

export const AdminUserEdit = () => {

    const userDetailStore = useSelector((state: initialAppStateType) => state.userDetailStore);
    const { error, loading, user } = userDetailStore;

    const typedUser = user as userType;

    const userUpdateStore = useSelector((state: initialAppStateType) => state.userUpdateStore);
    const { error: errorUpdate, loading: loadingUpdate, success: successUpdate } = userUpdateStore;

    console.log('user:  ', user)
    const param: AdminUserEditParamsType = useParams();
    const userId = param.id;
    const dispatch = useDispatch();
    const history = useHistory();

    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [isSeller, setIsSeller] = useState<boolean>(false);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    useEffect(() => {
        console.log('userId', userId);
        console.log('typedUser', typedUser);
        if (successUpdate) {
            dispatch({ type: USER_UPDATE_RESET });
            history.push('/userList');
        }
        if (!user) {
            dispatch(userDetails(userId));
        } else {
            setName(typedUser.name);
            setEmail(typedUser.email);
            setIsAdmin(typedUser.isAdmin);
            setIsSeller(typedUser.isSeller);
        }
    }, [dispatch, typedUser, user, userId, successUpdate, history])

    const submitHandler = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        dispatch(userUpdate({ _id: userId, name, email, isSeller, isAdmin }));

    }

    return (
        <div>
            <form className="form" onSubmit={submitHandler}>
                <div>
                    <h1>Edit User {name}</h1>
                    {loadingUpdate && <LoadingBox />}
                    {errorUpdate && <MessageBox variant="danger">{errorUpdate}</MessageBox>}
                </div>
                {
                    loading ? <LoadingBox /> :
                        error ? <MessageBox variant="danger">{error}</MessageBox> :
                            (
                                <>
                                    <div>
                                        <label htmlFor="name">Name</label>
                                        <input type="text" id="name" placeholder="Enter name" value={name} onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)} />
                                    </div>
                                    <div>
                                        <label htmlFor="email">Email</label>
                                        <input type="text" id="email" placeholder="Enter name" value={email} onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} />
                                    </div>
                                    <div>
                                        <label htmlFor="isSeller">Is Seller</label>
                                        <input type="checkbox" id="isSeller" checked={isSeller} onChange={(e: ChangeEvent<HTMLInputElement>) => setIsSeller(e.target.checked)} />
                                    </div>
                                    <div>
                                        <label htmlFor="isAdmin">Is Admin</label>
                                        <input type="checkbox" id="isAdmin" checked={isAdmin} onChange={(e: ChangeEvent<HTMLInputElement>) => setIsAdmin(e.target.checked)} />
                                    </div>
                                    <div>
                                        <Button variant="primary" type="submit">Update</Button>
                                    </div>
                                </>
                            )
                }
            </form>
        </div>

    )
}
