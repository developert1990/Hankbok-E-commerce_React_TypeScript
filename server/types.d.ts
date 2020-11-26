import { Document } from 'mongoose';

export interface userFromDB extends Document {
    _id: string;
    password: string;
    name: string;
    email: string;
    isAdmin: boolean;
    token: () => string;
}