export interface ProductType {
    _id: string;
    name: string;
    category: string;
    image: string;
    price: number;
    brand: string;
    rating: number;
    numReviews: number;
    description: string;
    countInStock?: number;
    reviews: reviewType[];
}

export interface reviewType {
    name: string;
    comment: string;
    rating: number;
    createdAt: string;
    _id: string;
}

export interface ProductCreateType {
    name: string;
    category: string;
    image: string;
    price: number;
    brand: string;
    rating: number;
    numReviews: number;
    description: string;
    countInStock?: number;
}

export interface ProductReviewType {
    rating: string;
    comment: string;
    name: string;
}


declare module 'googlemaps';