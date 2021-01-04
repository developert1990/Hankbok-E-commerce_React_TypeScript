"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.isAuth = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (user) => {
    console.log('process.env.JWT_SECRET', process.env.JWT_SECRET);
    return jsonwebtoken_1.default.sign({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
    }, process.env.JWT_SECRET, {
        expiresIn: '24h',
    });
};
exports.generateToken = generateToken;
// 계정으로 접속 햇을 때 API를 사용하기 위해 verify 하는 middleware.
const isAuth = (req, res, next) => {
    const authorization = req.headers.authorization;
    // console.log('어또라이제이션: ', authorization);
    if (authorization) {
        const token = authorization.slice(5, authorization.length); // Hong XXXXXXX  : Hong하고 띄워쓰기 까지 포함한 5개 글자 이후가 token이라서 이렇게 해줌
        jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, decode) => {
            if (err) {
                res.status(401).send({ message: 'Invalid Token' });
            }
            else {
                const { _id, name } = decode;
                req.user = _id;
                req.name = name;
                next();
            }
        });
    }
    else {
        res.status(401).send({ message: 'No Token' });
    }
};
exports.isAuth = isAuth;
// amin계정으로 접속했을 경우에 admin관리를 할 수 있는 페이지에서 동작하는 API를 verify 해주기 위한 middleware
const isAdmin = (req, res, next) => {
    console.log("admin인지 확인하러 들어옴");
    console.log('1: ', req.user);
    console.log('2: ', req.body);
    console.log('3: ', req.params);
    if (req.user && req.params.isAdmin) {
        next();
    }
    else if (req.user && req.body.userInfo.isAdmin) {
        next();
    }
    else {
        res.status(401).send({ message: 'Invalid Admin Token' });
    }
};
exports.isAdmin = isAdmin;
