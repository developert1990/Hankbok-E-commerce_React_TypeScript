import express, { Response, Request, NextFunction } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import userRouter from './routers/userRouter';
import productRouter from './routers/productRouter';
import * as dotenv from 'dotenv';
import orderRouter from './routers/orderRouter';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 9002;
mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost/E-commerce', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});


// 유저 등록하는 라우터를 연결
app.use('/api/users/', userRouter);
// 제품 등록하는 라우터를 연결
app.use('/api/products', productRouter);
// 유저가 오더한 것을 등록하는 라우터 연결
app.use('/api/orders', orderRouter);





app.get('/', (req: Request, res: Response) => {
    res.send('Server is ready');
});


// 위에서 expressAsyncHandler로 감싸준 함수가 에러가 발생하거나 하면 이쪽 미들웨어로 넘어와서 에러 message를 던져준다. userRouter에서 감싸줫기때문에 에러가 발생하면 이쪽으로 넘어와서 에러를 던진다
app.use((err: ErrorEvent, req: Request, res: Response, next: NextFunction) => {
    res.status(500).send({ message: err.message })
})

app.listen(process.env.PORT || 9002, () => {
    console.log(`Server is running at ${PORT}`)
});