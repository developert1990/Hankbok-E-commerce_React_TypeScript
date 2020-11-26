import React from 'react';
import { Link } from 'react-router-dom';
import { ProductType } from '../types';
import { Rating } from './Rating';

export interface ProductProps {
    product: ProductType;
}

export const Product: React.FC<ProductProps> = ({ product }) => {
    return (
        <div key={product._id} className="card">
            <Link to={`/product/${product._id}`}>
                <img className="medium" src={product.image} alt={product.name} />
            </Link>
            <div className="card-body">
                <Link to={`/product/${product._id}`}>
                    <h2>{product.name}</h2>
                </Link>
                <Rating rating={product.rating} numReviews={product.numReviews} />
                <div className="price">{product.price}</div>
            </div>
        </div>
    )
}
