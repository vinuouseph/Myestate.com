import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;

    if(!token) return next(errorHandler(401, 'Unauthorized'));
        jwt.verify(token, 'something1234', (err, user) => {
            if(err) return next(errorHandler(403, 'Forbidden'));
            req.user = user;
            req.user._id = user.id; // Access the user's ID using the property name you used in the JWT payload
            next();

        });

};