import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { LoadingBox } from '../components/LoadingBox';
import { MessageBox } from '../components/MessageBox';
import { initialAppStateType } from '../store';
import { deleteProduct, listProducts } from '../actions/productActions';
import { ProductType } from '../types';
import { PRODUCT_DELETE_RESET } from '../constants/productConstants';
import { Button, Table } from 'react-bootstrap';

import EditRoundedIcon from '@material-ui/icons/EditRounded';
import DeleteForeverRoundedIcon from '@material-ui/icons/DeleteForeverRounded';
import Pagination, { UsePaginationProps } from '@material-ui/lab/Pagination';
import { useStyles } from '../config';

export const AdminProductListScreen = () => {
    const productList = useSelector((state: initialAppStateType) => state.productListStore);
    const { loading, error, products } = productList;


    const dispatch = useDispatch();
    const history = useHistory();

    const productDeleteStoreInfo = useSelector((state: initialAppStateType) => state.productDeleteStore);
    const { loading: loadingDelete, error: errorDelete, success: successDelete } = productDeleteStoreInfo;

    useEffect(() => {
        console.log("어드민 프로덕트리스트 스크린 유즈이펙트")
        if (successDelete) {
            dispatch({ type: PRODUCT_DELETE_RESET });
        }
        dispatch(listProducts('all', 'all', 0, 'none'))
    }, [dispatch, history, successDelete]);


    const deleteHandler = (product: ProductType) => {
        dispatch(deleteProduct(product));
    }

    const createHandler = () => {
        history.push('/productCreate');
    }

    // pagination
    const [page, setPage] = useState<number>(1);
    const [pageData, setPageData] = useState<ProductType[]>([]);
    const dataLimit = 10;
    const indexOfLast = page * dataLimit;
    const indexOfFirst = indexOfLast - dataLimit;
    const handlePageChange: UsePaginationProps["onChange"] = (event: React.ChangeEvent<unknown>, page: number) => {
        setPage(page);
    }
    useEffect(() => {
        if (products) {
            setPageData(products.slice(indexOfFirst, indexOfLast));
        }
    }, [indexOfFirst, indexOfLast, products])

    const classes = useStyles();

    return (
        <div className="adminProductListScreen">
            <div >
                <h1>Products</h1>
                <Button className="createBtn" value="success" onClick={createHandler}>Create Product</Button>
            </div>
            {loadingDelete && <LoadingBox />}
            {errorDelete && <MessageBox variant="danger">{errorDelete}</MessageBox>}
            {
                loading ? <LoadingBox /> :
                    error ? <MessageBox variant="danger">{error}</MessageBox> :
                        <Table striped bordered hover variant="dark">
                            <thead>
                                <tr>
                                    <td>Num</td>
                                    <td>ID</td>
                                    <td>NAME</td>
                                    <td>PRICE</td>
                                    <td>CATEGORY</td>
                                    <td>BRAND</td>
                                    <td>ACTIONS</td>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    pageData.map((product, index) => (
                                        <tr key={product._id}>
                                            <td>{index + 1}</td>
                                            <td>{product._id}</td>
                                            <td>{product.name}</td>
                                            <td>{product.price}</td>
                                            <td>{product.category}</td>
                                            <td>{product.brand}</td>
                                            <td>
                                                <Button className="actionBtn" variant="warning" onClick={() => history.push(`/product/${product._id}/edit`)}><EditRoundedIcon /></Button>
                                                <Button className="actionBtn" variant="danger" onClick={() => deleteHandler(product)}><DeleteForeverRoundedIcon /></Button>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </Table>

            }
            <div className={`${classes.root} pagination`}>
                <Pagination count={products && Math.ceil(products.length / dataLimit)} variant="outlined" shape="rounded" color="primary" onChange={handlePageChange} />
            </div>
        </div>
    )
}
