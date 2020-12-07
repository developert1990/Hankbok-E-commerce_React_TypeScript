import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useHistory, useParams } from 'react-router-dom';
import { addReview, detailsProduct } from '../actions/productActions';
import { LoadingBox } from '../components/LoadingBox';
import { MessageBox } from '../components/MessageBox';
import { Rating } from '../components/Rating';
import { initialAppStateType } from '../store';
import { API_BASE } from '../config';

import { Card, Button } from 'react-bootstrap';
import { PRODUCT_ADD_REVIEW_RESET } from '../constants/productConstants';
import Pagination, { UsePaginationProps } from '@material-ui/lab/Pagination';
import { reviewType } from '../types';

interface ProductScreenParamType {
    id: string;
}

export const ProductDetailScreen = () => {
    const dispatch = useDispatch();
    const param: ProductScreenParamType = useParams();
    const history = useHistory();
    const [qty, setQty] = useState<number>(1);
    const productId = param.id;

    // 제품 디테일 가져옴 리덕스
    const productDetails = useSelector((state: initialAppStateType) => state.productDetailsStore);
    const { loading, error, product } = productDetails;

    // user info 가져옴 리덕스
    const userInfoStore = useSelector((state: initialAppStateType) => state.userStore);
    const { userInfo } = userInfoStore;

    // 제품 리뷰 추가 여부 리덕스
    const productReviewsStore = useSelector((state: initialAppStateType) => state.addReviewStore);
    const { loading: loadingReview, error: errorReview, success: successReview } = productReviewsStore;

    const [rating, setRating] = useState<string>('');
    const [comment, setComment] = useState<string>('');




    // const { description, image, name, numReviews, price, rating, countInStock } = product as ProductType;
    // console.log('loading', loading)
    if (error) {
        console.log('loading', loading)
    }
    // console.log('product', product)

    useEffect(() => {

        if (successReview) {
            // alert('Review Submitted Successfully');
            setRating('');
            setComment('');
            dispatch({ type: PRODUCT_ADD_REVIEW_RESET });
        }
        dispatch(detailsProduct(productId))
    }, [dispatch, productId, successReview]);



    const addToCartHandler = () => {
        history.push(`/cart/${productId}?qty=${qty}`);
    }

    const submitHandler = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("submit 누름")
        if (comment && rating) {
            console.log("add 리뷰 하러 들어감")
            dispatch(addReview(productId, { rating, comment, name: userInfo.name }));
        } else {
            alert('Please enter comment and rating')
        }
    }

    // pagenation

    const [page, setPage] = useState<number>(1);
    const [pageData, setPageData] = useState<reviewType[]>([]);
    const dataLimit = 3;
    const indexOfLast = page * dataLimit;
    const indexOfFirst = indexOfLast - dataLimit;
    const handlePageChange: UsePaginationProps["onChange"] = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    }
    useEffect(() => {
        if (product) {
            setPageData(product.reviews.slice(indexOfFirst, indexOfLast)); // 0 2 , 1 3, 2 4           0 2 , 2 4, 4 6 
        }
    }, [indexOfFirst, indexOfLast, product])
    console.log('pageData', pageData)
    console.log('indexOfLast', indexOfLast)
    console.log('indexOfFirst', indexOfFirst)


    return (
        <div>
            {loading ? (
                <LoadingBox />) :
                error ? (
                    <MessageBox variant="danger">{error}</MessageBox>
                ) : (
                        <>
                            <div>
                                <Link to="/products">Back to result</Link>

                                {
                                    product &&
                                    <div className="productDetailPage">
                                        <div className="detail-left">
                                            <img className="large" src={`${API_BASE}/uploads/${product.image}`} alt={product.name}></img>
                                        </div>
                                        <div className="detail-middle">
                                            <ul>
                                                <li>
                                                    <h1>{product.name}</h1>
                                                </li>
                                                <li>
                                                    <Rating rating={product.rating} numReviews={product.numReviews} />
                                                </li>
                                                <li>Price: ${product.price}</li>
                                                <li>Description: <p>{product.description}</p></li>
                                            </ul>
                                        </div>
                                        <div className="detail-right">
                                            <Card className="detail-card">
                                                <Card.Text className="detail-row">
                                                    <div>Price</div>
                                                    <div className="price">${product.price}</div>
                                                </Card.Text>

                                                <Card.Text className="detail-row">
                                                    <div>Status: </div>
                                                    <div>
                                                        {
                                                            // TODO: 여기 나중에 countInStock 으로 바꿔줘야함
                                                            product.countInStock && product.countInStock > 0
                                                                ? <span className="success">In Stock</span>
                                                                : <span className="danger">Unavailable</span>
                                                        }
                                                    </div>
                                                </Card.Text>
                                                {product.countInStock && product.countInStock > 0 && (
                                                    <>
                                                        <Card.Text className="detail-row">

                                                            <div>Qty</div>
                                                            <div>

                                                                <select value={qty} onChange={(e: ChangeEvent<HTMLSelectElement>) => setQty(parseInt(e.target.value))}>
                                                                    {
                                                                        //이부분 한번 공부제대로 해볼것
                                                                        //[...Array(4).keys()] 이렇게 하면 [0,1,2,3] 이라는 새로운 배열이 생성된다.
                                                                        [...Array(product.countInStock).keys()].map(x => (
                                                                            <option key={x + 1} value={x + 1}>{x + 1}</option>
                                                                        ))
                                                                    }
                                                                </select>
                                                            </div>

                                                        </Card.Text>

                                                        <Card.Text className="detail-row">
                                                            <Button onClick={addToCartHandler}>Add to Cart</Button>
                                                        </Card.Text>
                                                    </>
                                                )}
                                            </Card>
                                        </div>

                                    </div>
                                }
                            </div>



                            <div className="review_saction">
                                <h2 id="reviews">Reviews</h2>
                                {
                                    <div>
                                        {product.reviews.length === 0 ? <MessageBox variant="danger">There is no review</MessageBox> : (
                                            <div>
                                                <h2>{product.reviews.length} Reviews</h2>
                                                {console.log('product.reviews.length', product.reviews.length)}
                                                <div>
                                                    {pageData.map((review) => (
                                                        <div key={review._id}>
                                                            <div>{review.name}</div>
                                                            <Rating rating={review.rating} numReviews={review.rating}></Rating>
                                                            <p>
                                                                {review.createdAt.substring(0, 10)}
                                                            </p>
                                                            <p>{review.comment}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                                <Pagination count={Math.ceil(product.reviews.length / dataLimit)} color="secondary" onChange={handlePageChange} page={page} />
                                            </div>
                                        )}

                                        <div>{userInfo ? (
                                            <form className="form" onSubmit={submitHandler}>
                                                <div>
                                                    <h2>Write a customer review</h2>
                                                </div>
                                                <div>
                                                    <label htmlFor="rating">Rating</label>
                                                    <select value={rating} id="rating" onChange={(e: ChangeEvent<HTMLSelectElement>) => setRating(e.target.value)}>
                                                        <option value="">Select...</option>
                                                        <option value="1">1- Poor</option>
                                                        <option value="2">2- Fair</option>
                                                        <option value="3">3- Good</option>
                                                        <option value="4">4- Very good</option>
                                                        <option value="5">5- Excelent</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label htmlFor="comment">Comment</label>
                                                    <textarea value={comment} id="comment" onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)}></textarea>
                                                </div>
                                                <div>
                                                    <label></label>
                                                    <button className="primary" type="submit">Submit</button>
                                                </div>
                                                <div>
                                                    {loadingReview && <LoadingBox />}
                                                    {errorReview && <MessageBox variant="danger">{errorReview}</MessageBox>}
                                                </div>
                                            </form>
                                        ) : (
                                                <MessageBox variant="danger">Please <Link to="/signin">Sign In</Link> to write a review</MessageBox>
                                            )}</div>


                                    </div>

                                }

                            </div>
                        </>
                    )



            }

        </div>

    )
}
