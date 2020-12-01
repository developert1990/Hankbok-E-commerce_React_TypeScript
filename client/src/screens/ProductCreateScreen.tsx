import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { createProduct } from '../actions/productActions';
import { LoadingBox } from '../components/LoadingBox';
import { MessageBox } from '../components/MessageBox';
import { initialAppStateType } from '../store';

export const ProductCreateScreen = () => {
    const productCreateStoreInfo = useSelector((state: initialAppStateType) => state.productCreateStore);
    const { error, product, loading, success } = productCreateStoreInfo;
    console.log('product create페이지: ', product);

    const dispatch = useDispatch();
    const history = useHistory();
    const [name, setName] = useState<string>('');
    const [price, setPrice] = useState<number>(0);
    const [image, setImage] = useState<string>('');
    const [category, setCategory] = useState<string>('');
    const [countInStock, setCountInStock] = useState<number>(0);
    const [brand, setbrand] = useState<string>('');
    const [description, setDescription] = useState<string>('');

    const textareaRow = 3;

    const createProductHandler = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch(createProduct({ name, price, image, category, brand, countInStock, description, rating: 0, numReviews: 0 }));
        history.push('/productList');
    }



    return (
        <div>
            <form onSubmit={createProductHandler} className="productEdit__form">
                <div>
                    <h1>Create Product</h1>
                </div>
                {
                    loading ? <LoadingBox /> :
                        error ? <MessageBox variant="danger">{error}</MessageBox> :
                            (
                                <div className="productEdit__form__base">
                                    <div>
                                        <label htmlFor="name">Name</label>
                                        <input className="productEdit__form__input" type="text" id="name" placeholder="Enter name" value={name} onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)} />
                                    </div>

                                    <div>
                                        <label htmlFor="price">Price</label>
                                        <input className="productEdit__form__input" type="text" id="name" placeholder="Enter price" value={price} onChange={(e: ChangeEvent<HTMLInputElement>) => setPrice(parseInt(e.target.value))} />
                                    </div>

                                    <div>
                                        <label htmlFor="image">Image</label>
                                        <input className="productEdit__form__input" type="text" id="image" placeholder="Enter image" value={image} onChange={(e: ChangeEvent<HTMLInputElement>) => setImage(e.target.value)} />
                                    </div>

                                    <div>
                                        <label htmlFor="name">Category</label>
                                        <input className="productEdit__form__input" type="text" id="category" placeholder="Enter category" value={category} onChange={(e: ChangeEvent<HTMLInputElement>) => setCategory(e.target.value)} />
                                    </div>

                                    <div>
                                        <label htmlFor="brand">Brand</label>
                                        <input className="productEdit__form__input" type="text" id="brand" placeholder="Enter name" value={brand} onChange={(e: ChangeEvent<HTMLInputElement>) => setbrand(e.target.value)} />
                                    </div>

                                    <div>
                                        <label htmlFor="countInStock">Count In Stock</label>
                                        <input className="productEdit__form__input" type="text" id="countInStock" placeholder="Enter countInStock" value={countInStock} onChange={(e: ChangeEvent<HTMLInputElement>) => setCountInStock(parseInt(e.target.value))} />
                                    </div>

                                    <div>
                                        <label htmlFor="description">Description</label>
                                        <textarea className="productEdit__textArea" rows={textareaRow} id="description" placeholder="Enter description" value={description} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)} />
                                    </div>

                                    <div>
                                        <label></label>
                                        <Button variant="info" type="submit">
                                            Upload
                                        </Button>
                                    </div>
                                </div>
                            )
                }
            </form>
        </div>
    )
}
