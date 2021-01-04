"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./../utils");
const multer_1 = __importDefault(require("multer"));
const express_1 = __importDefault(require("express"));
const uploadRouter = express_1.default.Router();
// define storage
const storage = multer_1.default.diskStorage({
    destination: `./public/uploads/`,
    filename(req, file, callback) {
        callback(null, `${Date.now()}.jpg`);
    }
});
const upload = multer_1.default({ storage }).single('image'); // productEditScreen 에서 bodyFormdata 의 file 이름을 image라고 해줘서
uploadRouter.post('/', utils_1.isAuth, (req, res) => {
    console.log('upload 포스트로 들어옴:  ');
    upload(req, res, (err) => {
        if (err) {
            return res.status(404).send({ message: 'Can not upload image' });
        }

        console.log('req.file:___', req.file);
        return res.send(`${req.file.filename}`);
    });
});
exports.default = uploadRouter;
