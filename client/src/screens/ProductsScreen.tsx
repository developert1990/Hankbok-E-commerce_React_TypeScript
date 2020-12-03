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
import { SearchBox } from '../components/SearchBox';
import { Link, useLocation, useParams } from 'react-router-dom';

export const ProductsScreen = () => {
    const productList: ProductListInitialStateType = useSelector((state: initialAppStateType) => state.productListStore);
    const { loading, error, products } = productList;
    const location = useLocation();
    const category = new URLSearchParams(location.search).get('category'); // 쿼리스트링 사용할때 쉽게 쿼리 뽑아낼수 있다.

    const productListCategoryStoreInfo = useSelector((state: initialAppStateType) => state.productCategoryListStore);
    const { categories, error: errorCategory, loading: loadingCategory } = productListCategoryStoreInfo;

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(listProducts('all', category ? category : 'all'))
    }, [dispatch, category]);

    const getFilterUrl = (filter: string) => {
        const filterCategory = filter || 'all';
        const filterName = 'all';
        return `/products?category=${filterCategory}&name=${filterName}`;
    }

    return (
        <div>
            <SearchBox /> {
                loadingCategory ? <LoadingBox /> :
                    errorCategory ? <MessageBox variant="danger">{errorCategory}</MessageBox> :
                        (
                            categories.map((category) => (
                                <li><Link to={getFilterUrl(category)}>{category.charAt(0).toUpperCase() + category.slice(1)}</Link></li>
                            ))
                        )
            }
            {loading ?
                <LoadingBox /> :
                error ?
                    <MessageBox variant="danger">{error}</MessageBox> :
                    <div className="productsScreen">
                        {
                            products.map((product) => (
                                <Product key={product._id} product={product} />
                            ))
                        }
                    </div>}
        </div>
    )
}
