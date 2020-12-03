import React, { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { listProducts } from '../actions/productActions';
import { initialAppStateType } from '../store';
import { LoadingBox } from '../components/LoadingBox';
import { MessageBox } from '../components/MessageBox';
import { Product } from '../components/Product';



export const SearchScreen = () => {
    const location = useLocation();
    const dispatch = useDispatch();

    const productListStore = useSelector((state: initialAppStateType) => state.productListStore);
    const { error, loading, products } = productListStore;

    const productListCategoryStoreInfo = useSelector((state: initialAppStateType) => state.productCategoryListStore);
    const { categories, error: errorCategory, loading: loadingCategory } = productListCategoryStoreInfo;

    const category = new URLSearchParams(location.search).get('category'); // 쿼리스트링 사용할때 쉽게 쿼리 뽑아낼수 있다.
    const name = new URLSearchParams(location.search).get('name');

    useEffect(() => {
        dispatch(listProducts(name && name !== 'all' ? name : 'all', category && category !== 'all' ? category : 'all'))
    }, [dispatch, name, category]);


    const getFilterUrl = (selectedCategory: string) => {
        const filterCategory = selectedCategory || 'all';
        return `/search?category=${filterCategory}&name=${name}`;
    }

    return (
        <div>
            서치해서 결과
            {console.log('써치 스크린에서 products', products)}
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
                {
                    loading ? <LoadingBox /> :
                        error ? <MessageBox variant="danger">{error}</MessageBox> :
                            (
                                <div>
                                    <h2>{products.length} Results</h2>
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
