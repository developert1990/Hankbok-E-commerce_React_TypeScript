import { OrderType } from './../types.d';
import { isAuth } from './../utils';
import expressAsyncHandler from 'express-async-handler';
import express, { Request, Response, NextFunction } from 'express';
import Order from '../models/orderModel';
import { CustomRequestExtendsUser } from '../types';

const orderRouter = express.Router();

// 기본 카트
orderRouter.post('/', isAuth, expressAsyncHandler(async (req: CustomRequestExtendsUser, res: Response, next: NextFunction) => {
    console.log("isAuth성공하고 post에 들어옴");
    console.log(req.body);
    if (req.body.orderItems.length === 0) {
        res.status(400).send({ message: 'Cart is empty' });
    } else {
        const order = new Order({
            orderItems: req.body.orderItems,
            shippingAddress: req.body.shippingAddress,
            paymentMethod: req.body.paymentMethod,
            itemsPrice: req.body.itemsPrice,
            shippingPrice: req.body.shippingPrice,
            taxPrice: req.body.taxPrice,
            totalPrice: req.body.totalPrice,
            user: req.user, // _id 값이 들어간다
        });
        const createdOrder = await order.save();
        res.status(201).send({ message: 'New Order Created', order: createdOrder });
    }
}));

// 주문한거 찾음 detail
orderRouter.get('/detail/:id', isAuth, expressAsyncHandler(async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id);
    if (order) {
        res.send(order);
    } else {
        res.status(404).send({ message: "Order Not Found" });
    }
}));


// pay 버튼 누르고 페이한거 없데이트 한다
orderRouter.put('/:id/pay', isAuth, expressAsyncHandler(async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id);
    const typedOrder = order as OrderType;
    if (order) {
        typedOrder.isPaid = true;
        typedOrder.paidAt = Date.now();
        typedOrder.paymentResult = { id: req.body.id, status: req.body.status, update_time: req.body.update_time, email_address: req.body.payer.email_address };
        const updatedOrder = await order.save();
        res.send(updatedOrder);
    } else {
        res.status(404).send({ message: 'Order Not Found' });
    }
}));


// history 페이지에 data 전송
orderRouter.get('/myOrderList', isAuth, expressAsyncHandler(async (req: CustomRequestExtendsUser, res: Response) => {
    console.log('히스토리 페이지 진행하는 router로 들어옴')
    const orders = await Order.find({ user: req.user }); // req.user 에 _id 값이 들어감
    res.send(orders);
}));






export default orderRouter;