"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./../utils");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const express_1 = __importDefault(require("express"));
const orderModel_1 = __importDefault(require("../models/orderModel"));
const orderRouter = express_1.default.Router();
// 기본 카트
orderRouter.post('/', utils_1.isAuth, express_async_handler_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("isAuth성공하고 post에 들어옴");
    console.log(req.body);
    if (req.body.orderItems.length === 0) {
        res.status(400).send({ message: 'Cart is empty' });
    }
    else {
        const order = new orderModel_1.default({
            orderItems: req.body.orderItems,
            shippingAddress: req.body.shippingAddress,
            paymentMethod: req.body.paymentMethod,
            itemsPrice: req.body.itemsPrice,
            shippingPrice: req.body.shippingPrice,
            taxPrice: req.body.taxPrice,
            totalPrice: req.body.totalPrice,
            user: req.user,
            lat: req.body.lat,
            lng: req.body.lng,
        });
        const createdOrder = yield order.save();
        res.status(201).send({ message: 'New Order Created', order: createdOrder });
    }
})));
// 주문한거 찾음 detail
orderRouter.get('/detail/:id', utils_1.isAuth, express_async_handler_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield orderModel_1.default.findById(req.params.id);
    if (order) {
        res.send(order);
    }
    else {
        res.status(404).send({ message: "Order Not Found" });
    }
})));
// pay 버튼 누르고 페이한거 없데이트 한다
orderRouter.put('/:id/pay', utils_1.isAuth, express_async_handler_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield orderModel_1.default.findById(req.params.id);
    const typedOrder = order;
    if (order) {
        typedOrder.isPaid = true;
        typedOrder.paidAt = Date.now();
        typedOrder.paymentResult = { id: req.body.id, status: req.body.status, update_time: req.body.update_time, email_address: req.body.payer.email_address };
        const updatedOrder = yield order.save();
        res.send(updatedOrder);
    }
    else {
        res.status(404).send({ message: 'Order Not Found' });
    }
})));
// history 페이지에 data 전송
orderRouter.get('/myOrderList', utils_1.isAuth, express_async_handler_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('히스토리 페이지 진행하는 router로 들어옴');
    const orders = yield orderModel_1.default.find({ user: req.user }); // req.user 에 _id 값이 들어감
    res.send(orders);
})));
// Admin 계정으로 user들이 order한 list를 뽑는다.
orderRouter.get('/:isAdmin', utils_1.isAuth, utils_1.isAdmin, express_async_handler_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield orderModel_1.default.find().populate('user', 'name'); // 모든정보를 찾는다. 그리고 user부분은 참조한것에서 name을 따온다 populate를 없이 쓰면 user부분에 참조한 _id만 들어오고 populate('참조한부분') 이렇게 쓰면 객체로 값을 추출한다.
    // console.log('오더한 리스트 쫙 뽑는 data:   ', orders)
    res.send(orders);
})));
// Amin 계정으로 user가 order한 것을 delete한다.
orderRouter.delete('/:id', utils_1.isAuth, utils_1.isAdmin, express_async_handler_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield orderModel_1.default.findById(req.params.id);
    if (order) {
        const deleteOrder = yield order.remove();
        res.send({ message: 'Order Deleted', order: deleteOrder });
    }
    else {
        res.status(404).send({ message: 'Order Not Found' });
    }
})));
// deliver 버튼 누르고 deliver 업데이트 한다
orderRouter.put('/:id/deliver/:isAdmin', utils_1.isAuth, utils_1.isAdmin, express_async_handler_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield orderModel_1.default.findById(req.params.id);
    const typedOrder = order;
    console.log('페이버튼 누르고 진행하는 router로 들어옴');
    if (order) {
        typedOrder.isDelivered = true;
        typedOrder.deliveredAt = Date.now();
        const updatedOrder = yield typedOrder.save();
        res.send({ message: 'Order Delivered', order: updatedOrder });
    }
    else {
        res.status(404).send({ message: 'Order Not Found' });
    }
})));
exports.default = orderRouter;
