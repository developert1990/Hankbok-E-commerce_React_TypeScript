import { Document } from 'mongoose';
import { Request } from 'express';

export interface userFromDB extends Document {
    _id: string;
    password: string;
    name: string;
    email: string;
    isAdmin: boolean;
    token: () => string;
}


// req에 express extends 한것
export interface CustomRequestExtendsUser extends Request {
    user?: String;
}
