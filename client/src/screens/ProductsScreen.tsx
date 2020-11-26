import React, { useEffect } from 'react';
import { Product } from '../components/Product';
import { ProductType } from '../types';
import { LoadingBox } from '../components/LoadingBox';
import { MessageBox } from '../components/MessageBox';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { initialAppStateType } from '../store';
import { ProductListInitialStateType } from '../reducers/productReducers';
import { listProducts } from '../actions/productActions';

export const ProductsScreen = () => {
    const productList: ProductListInitialStateType = useSelector((state: initialAppStateType) => state.productListStore);
    const { loading, error, products } = productList;
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(listProducts())
    }, [dispatch]);
    return (
        <div>
            {loading ?
                <LoadingBox /> :
                error ?
                    <MessageBox variant="danger">{error}</MessageBox> :
                    <div className="row center">
                        {
                            products.map((product) => (
                                <Product key={product._id} product={product} />
                            ))
                        }
                    </div>}
        </div>
    )
}
