import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { listProducts } from '../actions/productActions';
import { initialAppStateType } from '../store';
import { LoadingBox } from '../components/LoadingBox';
import { MessageBox } from '../components/MessageBox';
import { Product } from '../components/Product';



export const SearchScreen = () => {
    const location = useLocation();
    const name: string = location.search.split("=")[1];
    const dispatch = useDispatch();

    const productListStore = useSelector((state: initialAppStateType) => state.productListStore);
    const { error, loading, products } = productListStore;

    const productListCatetoryStore = useSelector((state: initialAppStateType) => state.productCategoryListStore);
    const { error: errorCategories, loading: loadingCategories, categories } = productListCatetoryStore;

    useEffect(() => {
        console.log('name', name)
        dispatch(listProducts(name !== 'all' ? name : 'all', 'all'))
    }, [dispatch, name])
    return (
        <div>
            {console.log('써치 스크린에서 products', products)}
            <div>
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
