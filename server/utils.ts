import { userFromDB } from './types';
import jwt from 'jsonwebtoken';
export const generateToken = (user: userFromDB) => {
    console.log('process.env.JWT_SECRET', process.env.JWT_SECRET)
    return jwt.sign({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
    }, process.env.JWT_SECRET as string, {
        expiresIn: '24h',
    });
}