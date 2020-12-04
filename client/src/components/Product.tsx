import React from "react";
import { Link } from "react-router-dom";
import { ProductType } from "../types";
import { Rating } from "./Rating";
import { Card } from "react-bootstrap";
import { API_BASE } from '../config';

export interface ProductProps {
    product: ProductType;
}

// console.log('process.env.API_BASE', API_BASE)

export const Product: React.FC<ProductProps> = ({ product }) => {
    return (
        <>


            <Card className="products">
                <Link to={`/product/${product._id}`}>
                    <Card.Img
                        className="products__image"
                        src={`${API_BASE}/uploads/${product.image}`}
                        variant="top"
                    />

                </Link>
                <Card.Text>
                    <Card.Header>{product.category}</Card.Header>
                    <Card.Text>
                        <span className="date">Stock: {product.countInStock}</span>
                    </Card.Text>
                    <Card.Text>
                        <Rating rating={product.rating} numReviews={product.numReviews} />
                        <div className="price">${product.price}</div>
                    </Card.Text>
                </Card.Text>
                <Card.Title>
                    <Link to={`/product/${product._id}`}>
                        <h2>{product.name}</h2>
                    </Link>
                </Card.Title>
            </Card>
        </>
    );
};
