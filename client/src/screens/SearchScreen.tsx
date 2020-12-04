import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { listProducts } from '../actions/productActions';
import { initialAppStateType } from '../store';
import { LoadingBox } from '../components/LoadingBox';
import { MessageBox } from '../components/MessageBox';
import { Product } from '../components/Product';

import { useStyles, marks, valuetext } from '../config';
import Slider from '@material-ui/core/Slider';
import { Alert } from '@material-ui/lab';
import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';


export const SearchScreen = () => {
    const location = useLocation();
    const dispatch = useDispatch();

    const productListStore = useSelector((state: initialAppStateType) => state.productListStore);
    const { error, loading, products } = productListStore;

    const productListCategoryStoreInfo = useSelector((state: initialAppStateType) => state.productCategoryListStore);
    const { categories, error: errorCategory, loading: loadingCategory } = productListCategoryStoreInfo;

    const category = new URLSearchParams(location.search).get('category'); // 쿼리스트링 사용할때 쉽게 쿼리 뽑아낼수 있다.
    const name = new URLSearchParams(location.search).get('name');

    const [priceValue, setPriceValue] = useState<number>(0);
    const [sortBy, setSortBy] = useState<string>('');

    useEffect(() => {
        dispatch(listProducts(name && name !== 'all' ? name : 'all', category && category !== 'all' ? category : 'all', priceValue === 0 ? 2000 : priceValue, sortBy === '' ? 'none' : sortBy))
    }, [dispatch, name, category, priceValue, sortBy]);


    const getFilterUrl = (selectedCategory: string) => {
        const filterCategory = selectedCategory || 'all';
        return `/search?category=${filterCategory}&name=${name}`;
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


    // ***********************************

    return (
        <div className="searchScreen">

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
                <div>
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
            <div>
                {
                    loading ? <LoadingBox /> :
                        error ? <MessageBox variant="danger">{error}</MessageBox> :
                            (
                                <div>
                                    <Alert severity="success" color="info">{products.length} Results</Alert>
                                    <div>
                                        <div className="productsScreen">
                                            {

                                                products.map((product) => (
                                                    <Product key={product._id} product={product} />
                                                ))
                                            }
                                        </div>
                                    </div>
                                </div>
                            )
                }
            </div>

        </div>
    )
}
