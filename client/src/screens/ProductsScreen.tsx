import React, { ChangeEvent, useEffect, useState } from 'react';
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
import { Link, useLocation } from 'react-router-dom';

import { useStyles, marks, valuetext } from '../config';
import Slider from '@material-ui/core/Slider';


export const ProductsScreen = () => {
    const productList: ProductListInitialStateType = useSelector((state: initialAppStateType) => state.productListStore);
    const { loading, error, products } = productList;
    const location = useLocation();
    const category = new URLSearchParams(location.search).get('category'); // 쿼리스트링 사용할때 쉽게 쿼리 뽑아낼수 있다.

    const productListCategoryStoreInfo = useSelector((state: initialAppStateType) => state.productCategoryListStore);
    const { categories, error: errorCategory, loading: loadingCategory } = productListCategoryStoreInfo;

    const dispatch = useDispatch();

    const [priceValue, setPriceValue] = useState<number>(0);

    useEffect(() => {
        dispatch(listProducts('all', category ? category : 'all', priceValue && priceValue === 0 ? 2000 : priceValue))
    }, [dispatch, category, priceValue]);

    const getFilterUrl = (filter: string) => {
        const filterCategory = filter || 'all';
        const filterName = 'all';
        return `/products?category=${filterCategory}&name=${filterName}`;
    }

    // ********** price range ***********
    const classes = useStyles();
    const maxvalue = 400;

    const changePriceHandler = (e: any, value: number | number[]) => {
        console.log('e.target.value 가격 검색 체인지', value);
        setPriceValue(value as number);
    }
    // **************************************
    return (
        <div>
            <div>

                <SearchBox />
                <div>
                    {
                        loadingCategory ? <LoadingBox /> :
                            errorCategory ? <MessageBox variant="danger">{errorCategory}</MessageBox> :
                                (
                                    categories.map((category) => (
                                        <li><Link to={getFilterUrl(category)}>{category.charAt(0).toUpperCase() + category.slice(1)}</Link></li>
                                    ))
                                )
                    }
                </div>
                <div className={classes.root}>
                    <Slider
                        defaultValue={0}
                        getAriaValueText={valuetext}
                        aria-labelledby="discrete-slider-custom"
                        step={10}
                        valueLabelDisplay="on"
                        marks={marks}
                        max={maxvalue}
                        onChange={changePriceHandler}
                    />
                </div>
            </div>
            <div>
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
        </div>
    )
}
