"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Review = exports.Product = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const reviewSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true, unique: true },
    comment: { type: String, required: true },
    rating: { type: Number, required: true },
}, {
    timestamps: true,
});
const productSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    countInStock: { type: Number, required: true },
    rating: { type: Number, required: true },
    numReviews: { type: Number, required: true },
    reviews: [reviewSchema]
}, {
    timestamps: true,
});
exports.Product = mongoose_1.default.model("Product", productSchema);
exports.Review = mongoose_1.default.model("Review", reviewSchema);
// export default Product;
