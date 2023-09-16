import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';

const secretKey = process.env.SECRET_KEY as string;

/**
 * Verify token middleware checking if the token is valid
 * @param req
 * @param res
 * @param next
 */
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({message: 'Token is missing'});
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({message: 'Token is invalid'});
        }
    });
    next();
};
