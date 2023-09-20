import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';

const secretKey = process.env.SECRET_KEY as string;

/**
 * Verify token middleware checking if the token is valid
 * Add decoded in the request data
 * @param req
 * @param res
 * @param next
 */
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({message: 'Token is missing'});
    }
    // split token from the Bearer
    const splitToken = token.split(' ');

    if (splitToken.length !== 2) {
        return res.status(401).json({message: 'Token is invalid'});
    }

    jwt.verify(splitToken[1], secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({message: 'Token is invalid'});
        }

        // add decoded in the request data
        req.body.decoded = decoded;
    });
    next();
};
