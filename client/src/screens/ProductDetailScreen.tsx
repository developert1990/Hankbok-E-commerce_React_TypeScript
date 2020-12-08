import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useHistory, useParams } from 'react-router-dom';
import { addReview, deleteReview, detailsProduct } from '../actions/productActions';
import { LoadingBox } from '../components/LoadingBox';
import { MessageBox } from '../components/MessageBox';
import { CustomRating } from '../components/CustomRating';
import { initialAppStateType } from '../store';
import { API_BASE, useStyles } from '../config';

import { Card, Button } from 'react-bootstrap';
import { PRODUCT_ADD_REVIEW_RESET, PRODUCT_DELETE_REVIEW_RESET } from '../constants/productConstants';
import Pagination, { UsePaginationProps } from '@material-ui/lab/Pagination';
import { reviewType } from '../types';
import { TextField } from '@material-ui/core';
import Rating, { RatingProps } from '@material-ui/lab/Rating';

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
    const { loading: loadingReview, error: errorReview, success: successReview, reviews: createdReviews } = productReviewsStore;


    // 제품 삭제 여부 리덕스
    const productDeleteReviewStore = useSelector((state: initialAppStateType) => state.deleteReviewStore);
    const { success: successDeleteReview } = productDeleteReviewStore;

    const [rating, setRating] = useState<string>('Select');
    const [comment, setComment] = useState<string>('');




    useEffect(() => {
        if (successReview) {
            // alert('Review Submitted Successfully');
            setRating('');
            setComment('');
            dispatch({ type: PRODUCT_ADD_REVIEW_RESET });
        }
        if (successDeleteReview) {
            dispatch({ type: PRODUCT_DELETE_REVIEW_RESET });
        }
        dispatch(detailsProduct(productId))

    }, [dispatch, productId, successReview, successDeleteReview]);



    const addToCartHandler = () => {
        history.push(`/cart/${productId}?qty=${qty}`);
    }

    const submitHandler = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (comment && rating) {
            dispatch(addReview(productId, { rating, comment, name: userInfo.name }));
        } else {
            alert('Please enter comment and rating')
        }
    }

    // pagenation **************************************************

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
            // setPageData(createdReviews.slice(0, 4) as reviewType[]); // 0 2 , 1 3, 2 4           0 2 , 2 4, 4 6 
            setPageData(product.reviews.slice(indexOfFirst, indexOfLast)); // 0 2 , 1 3, 2 4           0 2 , 2 4, 4 6 
        }
    }, [indexOfFirst, indexOfLast, product])

    // *****************************************************************


    // Rating material-ui
    const classes = useStyles();

    const ratingChange: RatingProps["onChange"] = (event: React.ChangeEvent<{}>, value: number | null) => {
        setRating(value?.toString() as string);
    }
    // *******************************

    const deleteReviewHandler = (review: reviewType) => {
        // dispath 해주기
        dispatch(deleteReview(review._id, productId));
    }

    if (product) {
        console.log('product.reviews', product.reviews)
        // sort
        const newProductArray = product.reviews.map((review) => {
            // const _id = review._id;
            // const comment = review.comment;
            // const createdAt = Date.parse(review.createdAt);
            // const name = review.name;
            // const rating = review.rating;
            // const newArray = {
            //     _id: _id,
            //     comment: comment,
            //     createdAt: createdAt,
            //     name: name,
            //     rating: rating,
            // }
            // return newArray;
            return {
                ...review,
                createdAt: Date.parse(review.createdAt)
            }
        }).sort((a, b) => b.createdAt - a.createdAt);;

        // sort
        const array = product.reviews.sort((a, b) => {
            let dateA: any = new Date(a.createdAt);
            let dateB: any = new Date(b.createdAt);
            return dateB as number - dateA as number;
        })


        console.log('array', array)

        console.log('newProductArray', newProductArray);
        const sortedData = newProductArray.map((data) => data.createdAt)
        // console.log('sortedData', sortedData)
        // const date = Date.parse("2020-12-08T02:10:39.557Z");

    }
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
                                                <li className="rating__part">
                                                    <CustomRating rating={product.rating} />{product.numReviews} Reviews
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



                            <div className="review__section">
                                <h2 id="reviews">Reviews</h2>
                                {
                                    <div className="review">
                                        {product.reviews.length === 0 ? <MessageBox variant="danger">There is no review</MessageBox> : (
                                            <div className="review__list">
                                                <h2>{product.reviews.length} Reviews</h2>
                                                <div>
                                                    {pageData.map((review) => (
                                                        <div className="reviews" key={review._id}>
                                                            <div className="review__top">{review.name}
                                                                <CustomRating rating={review.rating} />
                                                                <p>
                                                                    {review.createdAt.substring(0, 10)}
                                                                </p>
                                                                {
                                                                    userInfo && userInfo.isAdmin &&
                                                                    <Button onClick={() => deleteReviewHandler(review)} className="deleteBtn__review" variant="danger">Delete</Button>
                                                                }
                                                            </div>
                                                            <p>{review.comment}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                                <Pagination count={Math.ceil(product.reviews.length / dataLimit)} color="secondary" onChange={handlePageChange} page={page} />
                                            </div>
                                        )}

                                        <div className="review__form">{userInfo ? (
                                            <form className="form__section" onSubmit={submitHandler}>
                                                <div>
                                                    <h1>Write a customer review</h1>
                                                </div>
                                                <div>
                                                    <h2>Rating</h2>

                                                    <div className={classes.root}>
                                                        <Rating name="half-rating" defaultValue={2.5} precision={0.5} onChange={ratingChange} size="large" style={{ fontSize: "30px" }} />
                                                    </div>

                                                </div>
                                                <div className="">
                                                    <h2>Comment</h2>
                                                    <TextField
                                                        id="outlined-multiline-static"
                                                        label="Comment"
                                                        multiline
                                                        rows={4}
                                                        defaultValue="Default Value"
                                                        variant="outlined"
                                                        value={comment}
                                                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)}
                                                    />
                                                </div>
                                                <div>
                                                    <Button variant="primary" type="submit">Submit</Button>
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
