import { CustomRequestExtendsUser } from './types';
import { NextFunction, Request, Response } from 'express';
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





export interface decodeType {
    _id: string;
}


export const isAuth = (req: CustomRequestExtendsUser, res: Response, next: NextFunction) => {
    const authorization = req.headers.authorization;
    console.log('어또라이제이션: ', authorization);
    if (authorization) {
        const token = authorization.slice(5, authorization.length); // Hong XXXXXXX  : Hong하고 띄워쓰기 까지 포함한 5개 글자 이후가 token이라서 이렇게 해줌
        jwt.verify(token, process.env.JWT_SECRET as string, (err, decode) => {
            if (err) {
                res.status(401).send({ message: 'Invalid Token' });
            } else {
                const { _id } = decode as decodeType;
                req.user = _id;
                next();
            }
        });
    } else {
        res.status(401).send({ message: 'No Token' });
    }

} 