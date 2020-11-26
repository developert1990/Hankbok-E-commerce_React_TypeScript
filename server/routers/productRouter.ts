import expressAsyncHandler from 'express-async-handler';
import express, { Request, Response } from 'express';
import Product from '../models/productModel';
import { data } from '../data';

const productRouter = express.Router();


// 모든 products 가져옴
productRouter.get('/', expressAsyncHandler(async (req: Request, res: Response) => {
    const products = await Product.find({}) // {} 이라는 빈객체를 find에 넣으면 모든 것을 찾아준다.즉 find all임
    res.send(products);
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


export default productRouter;