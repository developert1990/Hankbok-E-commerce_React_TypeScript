import { isAuth, isAdmin } from './../utils';
import { data } from './../data';
import express, { Request, response, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/userModel';
import expressAsyncHandler from 'express-async-handler'; // express에서 비동기식으로 에러 헨들링을 하기 위한 라이브러리 이다.
import { userFromDB } from '../types';
import { generateToken } from '../utils';

const userRouter = express.Router();

// 바로 url 로 유저 생성 admin 생성하면된다
userRouter.get('/seed', expressAsyncHandler(async (req: Request, res: Response) => {
    const createdUsers = await User.insertMany(data.users);
    res.send({ createdUsers });

}));


// user signin 하는 API
userRouter.post('/signin', expressAsyncHandler(async (req: Request, res: Response) => {
    const user = await User.findOne({ email: req.body.email });
    const typedUser = user as userFromDB;
    if (user) {
        if (bcrypt.compareSync(req.body.password, typedUser.password)) {
            res.send({
                _id: typedUser._id,
                name: typedUser.name,
                email: typedUser.email,
                isAdmin: typedUser.isAdmin,
                token: generateToken(typedUser),
            });
            return;
        }
    }
    res.status(401).send({ message: 'Invalid email or password' });
}));

// user register 하는 API
userRouter.post('/register', expressAsyncHandler(async (req: Request, res: Response) => {
    // 새로운 유저의 정보를 만들고 
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8)
    });
    // 그 유저의 정보를 db에 저장한다.
    const createdUser = await user.save();
    const typedUser = createdUser as userFromDB;
    res.send({
        _id: typedUser._id,
        name: typedUser.name,
        email: typedUser.email,
        isAdmin: typedUser.isAdmin,
        token: generateToken(typedUser),
    });
}));

// user profile update 하는 API
userRouter.put('/:id', isAuth, expressAsyncHandler(async (req: Request, res: Response) => {
    const user = await User.findById(req.params.id);
    const typedUser = user as userFromDB;
    if (user) {
        typedUser.name = req.body.name || typedUser.name;
        typedUser.email = req.body.email || typedUser.email;
        if (req.body.password) {
            typedUser.password = bcrypt.hashSync(req.body.password, 8);
        }

        const updatedUser = await typedUser.save();
        const typedUpdatedUser = updatedUser as userFromDB;
        res.send({
            _id: typedUser._id,
            name: typedUser.name,
            email: typedUser.email,
            isAdmin: typedUser.isAdmin,
            token: generateToken(typedUpdatedUser),
        });
    } else {
        res.status(404).send({ message: 'User Not Found' });
    }
}));



// 모든 user data 받음
userRouter.get('/:isAdmin/allList', isAuth, isAdmin, expressAsyncHandler(async (req: Request, res: Response) => {
    const users = await User.find();
    res.send(users);
}));



// user delete API
userRouter.delete('/:id/:isAdmin/', isAuth, isAdmin, expressAsyncHandler(async (req: Request, res: Response) => {
    const user = await User.findById(req.params.id);
    const typedUser = user as userFromDB;
    if (user) {
        if (typedUser.email === 'admin@example.com') {
            res.status(400).send({ message: 'Can not delete Admin User' });
            return;
        }
        const deletedUser = await typedUser.remove();
        res.send({ message: 'User Deleted', user: deletedUser });
    } else {
        res.status(404).send({ message: 'User Not Found' });
    }
}))



// user detail API
userRouter.get('/:id/:isAdmin/detail', isAuth, isAdmin, expressAsyncHandler(async (req: Request, res: Response) => {
    console.log("유저 디테일 뽑는곳");
    const user = await User.findById(req.params.id);
    if (user) {
        res.send(user)
    } else {
        res.status(404).send({ message: 'User Not Found' });
    }
}))


userRouter.put('/:id/:isAdmin/update', isAuth, isAdmin, expressAsyncHandler(async (req: Request, res: Response) => {
    const user = await User.findById(req.params.id);
    const typedUser = user as userFromDB;
    if (user) {
        typedUser.name = req.body.name || typedUser.name;
        typedUser.email = req.body.email || typedUser.email;
        typedUser.isAdmin = req.body.isAdmin || typedUser.isAdmin;
        typedUser.isSeller = req.body.isSeller || typedUser.isSeller;

        const updatedUser = await typedUser.save();
        res.send({ message: 'User Updated', user: updatedUser })
    } else {
        res.status(404).send({ message: 'User Not Found' });
    }
}))

export default userRouter;