import Axios from 'axios';
import React, { ChangeEvent, FormEvent, useState } from 'react'
import { Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { createProduct } from '../actions/productActions';
import { LoadingBox } from '../components/LoadingBox';
import { MessageBox } from '../components/MessageBox';
import { initialAppStateType } from '../store';

export const ProductCreateScreen = () => {
    const productCreateStoreInfo = useSelector((state: initialAppStateType) => state.productCreateStore);
    const { error, product, loading } = productCreateStoreInfo;

    const userInfoStore = useSelector((state: initialAppStateType) => state.userStore);
    const { userInfo } = userInfoStore;
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

    const [loadingUpload, setLoadingUpload] = useState<boolean>(false);
    const [errorUpload, setErrorUpload] = useState<string>('');
    const textareaRow = 3;

    const createProductHandler = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch(createProduct({ name, price, image, category, brand, countInStock, description, rating: 0, numReviews: 0 }));
        history.push('/productList');
    }


    const uploadImageHandler = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const file = e.target.files[0];
            const bodyFormData = new FormData();
            console.log('bodyFormData', bodyFormData)
            bodyFormData.append('image', file); // bodyFormData를 설정해야지 multer에서 읽을 수 잇는 것같음 잘 모르겟다.
            setLoadingUpload(true);

            try {
                // image file 의 name을 가져오는 API
                const { data } = await Axios.post(`/api/uploads`, bodyFormData, {
                    headers: { Authorization: `Hong ${userInfo.token}` }
                });
                // image 경로랑 전체 product image 를 서버에서 받아오는 걸로 바꿔야한다.
                console.log('data:____', data)
                setImage(data);
                setLoadingUpload(false);
            } catch (error) {
                setErrorUpload(error.message);
                setLoadingUpload(false);
            }

        }
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
                                        <label htmlFor="imageFile">Image File</label>
                                        <input type="file" id="imageFile" placeholder="Choose Image" onChange={uploadImageHandler} />
                                        {loadingUpload && <LoadingBox />}
                                        {errorUpload && <MessageBox variant="danger">{errorUpload}</MessageBox>}
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
