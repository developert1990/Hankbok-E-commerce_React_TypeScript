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
const data_1 = require("./../data");
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const userModel_1 = __importDefault(require("../models/userModel"));
const express_async_handler_1 = __importDefault(require("express-async-handler")); // express에서 비동기식으로 에러 헨들링을 하기 위한 라이브러리 이다.
const utils_2 = require("../utils");
const userRouter = express_1.default.Router();
// 바로 url 로 유저 생성 admin 생성하면된다
userRouter.get('/seed', express_async_handler_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const createdUsers = yield userModel_1.default.insertMany(data_1.data.users);
    res.send({ createdUsers });
})));
// user signin 하는 API
userRouter.post('/signin', express_async_handler_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.default.findOne({ email: req.body.email });
    const typedUser = user;
    if (user) {
        if (bcrypt_1.default.compareSync(req.body.password, typedUser.password)) {
            res.send({
                _id: typedUser._id,
                name: typedUser.name,
                email: typedUser.email,
                isAdmin: typedUser.isAdmin,
                token: utils_2.generateToken(typedUser),
            });
            return;
        }
    }
    res.status(401).send({ message: 'Invalid email or password' });
})));
// user register 하는 API
userRouter.post('/register', express_async_handler_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // 새로운 유저의 정보를 만들고 
    const user = new userModel_1.default({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt_1.default.hashSync(req.body.password, 8)
    });
    // 그 유저의 정보를 db에 저장한다.
    const createdUser = yield user.save();
    const typedUser = createdUser;
    res.send({
        _id: typedUser._id,
        name: typedUser.name,
        email: typedUser.email,
        isAdmin: typedUser.isAdmin,
        token: utils_2.generateToken(typedUser),
    });
})));
// user profile update 하는 API
userRouter.put('/:id', utils_1.isAuth, express_async_handler_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.default.findById(req.params.id);
    const typedUser = user;
    if (user) {
        typedUser.name = req.body.name || typedUser.name;
        typedUser.email = req.body.email || typedUser.email;
        if (req.body.password) {
            typedUser.password = bcrypt_1.default.hashSync(req.body.password, 8);
        }
        const updatedUser = yield typedUser.save();
        const typedUpdatedUser = updatedUser;
        res.send({
            _id: typedUser._id,
            name: typedUser.name,
            email: typedUser.email,
            isAdmin: typedUser.isAdmin,
            token: utils_2.generateToken(typedUpdatedUser),
        });
    }
    else {
        res.status(404).send({ message: 'User Not Found' });
    }
})));
// 모든 user data 받음
userRouter.get('/:isAdmin/allList', utils_1.isAuth, utils_1.isAdmin, express_async_handler_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield userModel_1.default.find();
    res.send(users);
})));
// user delete API
userRouter.delete('/:id/:isAdmin/', utils_1.isAuth, utils_1.isAdmin, express_async_handler_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.default.findById(req.params.id);
    const typedUser = user;
    if (user) {
        if (typedUser.email === 'admin@example.com') {
            res.status(400).send({ message: 'Can not delete Admin User' });
            return;
        }
        const deletedUser = yield typedUser.remove();
        res.send({ message: 'User Deleted', user: deletedUser });
    }
    else {
        res.status(404).send({ message: 'User Not Found' });
    }
})));
// user detail API
userRouter.get('/:id/:isAdmin/detail', utils_1.isAuth, utils_1.isAdmin, express_async_handler_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("유저 디테일 뽑는곳");
    const user = yield userModel_1.default.findById(req.params.id);
    if (user) {
        res.send(user);
    }
    else {
        res.status(404).send({ message: 'User Not Found' });
    }
})));
userRouter.put('/:id/:isAdmin/update', utils_1.isAuth, utils_1.isAdmin, express_async_handler_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.default.findById(req.params.id);
    const typedUser = user;
    if (user) {
        typedUser.name = req.body.name || typedUser.name;
        typedUser.email = req.body.email || typedUser.email;
        typedUser.isAdmin = req.body.isAdmin || typedUser.isAdmin;
        typedUser.isSeller = req.body.isSeller || typedUser.isSeller;
        const updatedUser = yield typedUser.save();
        res.send({ message: 'User Updated', user: updatedUser });
    }
    else {
        res.status(404).send({ message: 'User Not Found' });
    }
})));
exports.default = userRouter;
