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
    _id?: string;
    rating: string;
    comment: string;
    name: string;
    createdAt?: string;
}

export interface PaymentResultType {
    id: string;
    status: string;
    update_time: string;
    email_address: string;
}


