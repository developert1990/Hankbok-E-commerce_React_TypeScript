import React, { useEffect } from 'react'
import { Button, Table } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { deleteUser, listUsers } from '../actions/userActions'
import { LoadingBox } from '../components/LoadingBox'
import { MessageBox } from '../components/MessageBox'
import { USER_DETAILS_RESET } from '../constants/userConstant'
import { initialAppStateType } from '../store'

export const AdminUserListScreen = () => {

    const userListStore = useSelector((state: initialAppStateType) => state.userListStore);
    const { error, loading, users } = userListStore;

    const userDeleteStore = useSelector((state: initialAppStateType) => state.userDeleteStore);
    const { error: errorDelete, loading: loadingDelete, success: successDelete } = userDeleteStore;

    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        console.log("리스트 뽑을라고 유즈이펙트 들어옴")
        dispatch(listUsers());
        dispatch({ type: USER_DETAILS_RESET });
    }, [dispatch, successDelete])

    const deleteUserHandler = (userId: string) => {
        if (window.confirm('Are you sure?')) {
            dispatch(deleteUser(userId));
        }
    }


    return (
        <div className="adminUserListScreen">
            <h1>Users</h1>
            {loadingDelete && <LoadingBox />}
            {errorDelete && <MessageBox variant="danger">{errorDelete}</MessageBox>}
            {successDelete && <MessageBox variant="success">User Deleted Successfully</MessageBox>}
            {
                loading ? <LoadingBox /> :
                    error ? <MessageBox variant="danger">{error}</MessageBox> :
                        (
                            <Table striped bordered hover variant="dark">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>NAME</th>
                                        <th>EMAIL</th>
                                        <th>IS SELLER</th>
                                        <th>IS ADMIN</th>
                                        <th>ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        users.map((user) => (
                                            <tr key={user._id}>
                                                <td>{user._id}</td>
                                                <td>{user.name}</td>
                                                <td>{user.email}</td>
                                                <td>{user.isSeller ? 'YES' : 'NO'}</td>
                                                <td>{user.isAdmin ? 'YES' : 'NO'}</td>
                                                <td>
                                                    <Button className="actionBtn" variant="warning" onClick={() => history.push(`/user/${user._id}/edit`)}>Edit</Button>
                                                    <Button className="actionBtn" variant="danger" onClick={() => deleteUserHandler(user._id)}>Delete</Button>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </Table>
                        )
            }
        </div>
    )
}
