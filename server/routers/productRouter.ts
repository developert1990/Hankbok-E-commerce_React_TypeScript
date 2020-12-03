import { productsInfoType } from './../models/productModel';
import { isAuth, isAdmin } from './../utils';
import expressAsyncHandler from 'express-async-handler';
import express, { Request, Response } from 'express';
import Product from '../models/productModel';
import { data } from '../data';

const productRouter = express.Router();


// 모든 products 나 search하는 products를 가져옴
productRouter.get('/list/:name/:category', expressAsyncHandler(async (req: Request, res: Response) => {
    console.log("리스트 뽑으러 옴");
    console.log('req.params.name', req.params.name)
    console.log('req.params.category', req.params.category)
    const name = req.params.name;
    const category = req.params.category;
    if (name === 'all' && category === 'all') {
        const products = await Product.find({}) // {} 이라는 빈객체를 find에 넣으면 모든 것을 찾아준다.즉 find all임
        res.send(products);
        return;
    } else if (name === 'all' && category !== 'all') {
        const categorizedProducts = await Product.find({ category: { '$regex': category, '$options': 'i' } });
        res.send(categorizedProducts);
        return;
    } else if (name !== 'all' && category !== 'all') {
        const cateAndNamedProducts = await Product.find({ category: { '$regex': category, '$options': 'i' }, name: { '$regex': name, '$options': 'i' } })
        res.send(cateAndNamedProducts);
        return;
    } else {
        const searchedProducts = await Product.find({ name: { '$regex': name, '$options': 'i' } })
        res.send(searchedProducts);
    }
}));


// 저장
productRouter.get('/seed', expressAsyncHandler(async (req: Request, res: Response) => {
    await Product.remove({}); //이걸 이렇게 앞에다 주면 Product Collection(table)에 잇는 데이터가 모두 삭제된다. 그 다음 아래가 실행됨
    const createdProducts = await Product.insertMany(data.products);
    res.send({ createdProducts });
}));


// 찾기
productRouter.get('/:id', expressAsyncHandler(async (req: Request, res: Response) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        res.send(product);
    } else {
        res.status(400).send({ message: 'Product Not Found' });
    }
}))




// product 새로 추가
productRouter.post('/', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
    console.log("admin확인 되서 들어옴")
    const product = new Product({
        name: req.body.createProduct.name,
        image: req.body.createProduct.image,
        price: req.body.createProduct.price,
        category: req.body.createProduct.category,
        brand: req.body.createProduct.brand,
        countInStock: req.body.createProduct.countInStock,
        rating: 0,
        numReviews: 0,
        description: req.body.createProduct.description,
    });
    const createdProduct = await product.save();
    res.send({ message: 'Product Created', product: createdProduct });
}));



// product update 하는 API
productRouter.put('/:id', isAuth, isAdmin, expressAsyncHandler(async (req: Request, res: Response) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    const typedProduct = product as productsInfoType;
    console.log('업데이트 하는 api로 들어옴', req.body.product)
    if (product) {
        typedProduct.name = req.body.product.name;
        typedProduct.price = req.body.product.price;
        typedProduct.image = req.body.product.image;
        typedProduct.category = req.body.product.category;
        typedProduct.brand = req.body.product.brand;
        typedProduct.countInStock = req.body.product.countInStock;
        typedProduct.description = req.body.product.description;

        const updatedProduct = await typedProduct.save();
        res.send({ message: 'Product Updated', product: updatedProduct })
    } else {
        res.status(404).send({ message: 'Product Not Found' });
    }
}))


// product delete 하는 API

productRouter.delete('/:id', isAuth, isAdmin, expressAsyncHandler(async (req: Request, res: Response) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        const deletedProduct = await product.remove();
        res.send({ message: 'Product Deleted', product: deletedProduct });
    } else {
        res.status(404).send({ message: 'Product Not Found' });
    }
}));


// 제품의 카테고리들을 뽑는것
productRouter.get('/category/array', expressAsyncHandler(async (req: Request, res: Response) => {
    console.log("카테고리 뽑으러 들어옴")
    const categories = await Product.find().distinct('category');
    res.send(categories);
}))



export default productRouter;