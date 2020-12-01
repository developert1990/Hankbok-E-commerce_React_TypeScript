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