import React, { useEffect, useState } from 'react';
import { Product } from '../components/Product';
import { LoadingBox } from '../components/LoadingBox';
import { MessageBox } from '../components/MessageBox';
import { useSelector, useDispatch } from 'react-redux';
import { initialAppStateType } from '../store';
import { ProductListInitialStateType } from '../reducers/productReducers';
import { listProducts } from '../actions/productActions';
import { SearchBox } from '../components/SearchBox';
import { Link, useHistory, useLocation } from 'react-router-dom';

import { useStyles, marks, valuetext } from '../config';
import Slider from '@material-ui/core/Slider';
import { Alert } from '@material-ui/lab';
import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import Pagination, { UsePaginationProps } from '@material-ui/lab/Pagination';
import { ProductType } from '../types';

export const ProductsScreen = () => {
    const productList: ProductListInitialStateType = useSelector((state: initialAppStateType) => state.productListStore);
    const { loading, error, products } = productList;
    const location = useLocation();
    const category = new URLSearchParams(location.search).get('category'); // 쿼리스트링 사용할때 쉽게 쿼리 뽑아낼수 있다.

    const productListCategoryStoreInfo = useSelector((state: initialAppStateType) => state.productCategoryListStore);
    const { categories, error: errorCategory, loading: loadingCategory } = productListCategoryStoreInfo;

    const dispatch = useDispatch();

    const [priceValue, setPriceValue] = useState<number>(0);
    const [sortBy, setSortBy] = useState<string>('');

    useEffect(() => {
        dispatch(listProducts('all', category ? category : 'all', priceValue && priceValue === 0 ? 0 : priceValue, sortBy === '' ? 'none' : sortBy))
    }, [dispatch, category, priceValue, sortBy]);

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

    const handleSortChange = (e: React.ChangeEvent<{ value: unknown }>) => {
        setSortBy(e.target.value as string)
        console.log('e.target.value', e.target.value as string)
    }

    // **************************************


    // 실험하는중
    const history = useHistory();

    const openMapHandler = () => {
        history.push('/googleMap');
    }


    // pagination *****************************

    const [page, setPage] = useState<number>(1);
    const [pageData, setPageData] = useState<ProductType[]>([]);
    const dataLimit = 10;
    const indexOfLast = page * dataLimit;
    const indexOfFirst = indexOfLast - dataLimit;
    const handlePageChange: UsePaginationProps["onChange"] = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    }
    useEffect(() => {
        if (products) {
            // setPageData(createdReviews.slice(0, 4) as reviewType[]); // 0 2 , 1 3, 2 4           0 2 , 2 4, 4 6 
            // 우선 먼저 sort 를 해서 순서를 바꿔주고 slice 로 data를 나눠준다.
            setPageData(products.slice(indexOfFirst, indexOfLast)); // 0 2 , 1 3, 2 4           0 2 , 2 4, 4 6 
        }
    }, [indexOfFirst, indexOfLast, products])

    // ****************************************



    return (
        <div className="productsScreen">
            <div className="controll__bar">
                <SearchBox />
                <div className="sortList">
                    {
                        loadingCategory ? <LoadingBox /> :
                            errorCategory ? <MessageBox variant="danger">{errorCategory}</MessageBox> :
                                (
                                    categories.map((category, index) => (
                                        <li key={index}><Link to={getFilterUrl(category)}>{category.charAt(0).toUpperCase() + category.slice(1)}</Link></li>
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
                <div className="sortby">
                    <FormControl className={classes.formControl}>
                        <InputLabel id="demo-simple-select-label">Sort by</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={sortBy}
                            onChange={handleSortChange}
                        >
                            <MenuItem value="lowest">Price: Low to High</MenuItem>
                            <MenuItem value="highest">Price: High to Low</MenuItem>
                            <MenuItem value="reviewRate">Customer Review</MenuItem>
                        </Select>
                    </FormControl>
                </div>
            </div>
            <div className="productList">
                {loading ?
                    <LoadingBox /> :
                    error ?
                        <MessageBox variant="danger">{error}</MessageBox> :
                        <div className="product__innerList">
                            <Alert className="result_alert" severity={products.length === 0 ? 'warning' : 'success'} color={products.length === 0 ? 'warning' : 'info'}>{products.length} Results</Alert>
                            <div className="productsScreen">
                                {
                                    pageData.map((product) => (
                                        <Product key={product._id} product={product} />
                                    ))
                                }
                            </div>
                            <Pagination count={Math.ceil(products.length / dataLimit)} color="secondary" onChange={handlePageChange} page={page} />
                        </div>
                }
            </div>
        </div>
    )
}
