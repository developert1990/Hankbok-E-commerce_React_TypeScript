import { Pagination, UsePaginationProps } from '@material-ui/lab'
import React, { useEffect, useState } from 'react'
import { Button, Table } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { deleteUser, listUsers } from '../actions/userActions'
import { LoadingBox } from '../components/LoadingBox'
import { MessageBox } from '../components/MessageBox'
import { useStyles } from '../config'
import { USER_DETAILS_RESET } from '../constants/userConstant'
import { initialAppStateType } from '../store'
import { userType } from '../reducers/userReducer';

import EditRoundedIcon from '@material-ui/icons/EditRounded';
import DeleteForeverRoundedIcon from '@material-ui/icons/DeleteForeverRounded';


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

    // pagination
    const [page, setPage] = useState<number>(1);
    const [pageData, setPageData] = useState<userType[]>([]);
    const dataLimit = 10;
    const indexOfLast = page * dataLimit;
    const indexOfFirst = indexOfLast - dataLimit;
    const handlePageChange: UsePaginationProps["onChange"] = (event: React.ChangeEvent<unknown>, page: number) => {
        setPage(page);
    }
    useEffect(() => {
        if (users) {
            setPageData(users.slice(indexOfFirst, indexOfLast));
        }
    }, [indexOfFirst, indexOfLast, users])

    const classes = useStyles();

    // ***********************************


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
                                        <th>Num</th>
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
                                        pageData.map((user, index) => (
                                            <tr key={user._id}>
                                                <td>{index + 1}</td>
                                                <td>{user._id}</td>
                                                <td>{user.name}</td>
                                                <td>{user.email}</td>
                                                <td>{user.isSeller ? 'YES' : 'NO'}</td>
                                                <td>{user.isAdmin ? 'YES' : 'NO'}</td>
                                                <td>
                                                    <Button className="actionBtn" variant="warning" onClick={() => history.push(`/user/${user._id}/edit`)}><EditRoundedIcon /></Button>
                                                    <Button className="actionBtn" variant="danger" onClick={() => deleteUserHandler(user._id)}><DeleteForeverRoundedIcon /></Button>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </Table>
                        )
            }
            <div className={`${classes.root} pagination`}>
                <Pagination count={users && Math.ceil(users.length / dataLimit)} variant="outlined" shape="rounded" color="primary" onChange={handlePageChange} />
            </div>
        </div>
    )
}
