"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const userRouter_1 = __importDefault(require("./routers/userRouter"));
const productRouter_1 = __importDefault(require("./routers/productRouter"));
const dotenv = __importStar(require("dotenv"));
const orderRouter_1 = __importDefault(require("./routers/orderRouter"));
const uploadRouter_1 = __importDefault(require("./routers/uploadRouter"));
const sendEmailRouter_1 = __importDefault(require("./routers/sendEmailRouter"));
dotenv.config();
const app = express_1.default();
app.use(cors_1.default());
app.use(express_1.default.json());
// 이렇게 미들웨어로 public 폴더를 정적으로 만들어줘야 외부에서 로컬호스트의 이 public 폴더로 접속을 할 수가 있다.
app.use(express_1.default.static("public"));
const PORT = 9002;
mongoose_1.default.connect(process.env.MONGODB_URL || 'mongodb://localhost/E-commerce', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});
// 제품 사진 upload
app.use('/api/uploads', uploadRouter_1.default);
// 유저 등록하는 라우터를 연결
app.use('/api/users/', userRouter_1.default);
// 제품 등록하는 라우터를 연결
app.use('/api/products', productRouter_1.default);
// 유저가 오더한 것을 등록하는 라우터 연결
app.use('/api/orders', orderRouter_1.default);
// PayPal client id 가져오기 위한 API
app.get('/api/config/paypal', (req, res) => {
    res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
});
// Google API
app.get('/api/config/google', (req, res) => {
    console.log("구글api받으러 들어옴");
    res.send(process.env.GOOGLE_API_KEY || '');
});
// Email send
app.use('/api/email', sendEmailRouter_1.default);
app.get('/', (req, res) => {
    res.send('Server is ready');
});
// 위에서 expressAsyncHandler로 감싸준 함수가 에러가 발생하거나 하면 이쪽 미들웨어로 넘어와서 에러 message를 던져준다. userRouter에서 감싸줫기때문에 에러가 발생하면 이쪽으로 넘어와서 에러를 던진다
app.use((err, req, res, next) => {
    res.status(500).send({ message: err.message });
});
app.listen(process.env.PORT || 9002, () => {
    console.log(`Server is running at ${PORT}`);
});
