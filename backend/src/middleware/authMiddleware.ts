import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import {PrismaClient} from '@prisma/client';

const secretKey = process.env.SECRET_KEY as string;

const prisma = new PrismaClient();
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


// Add the user information in the request data
export const getUser = async (req: Request, res: Response, next: NextFunction) => {
    const tokenData = req.body.decoded;
    const profile = await prisma.user.findUnique({
        where: {
            'address': tokenData?.address
        }
    });
    if (profile === null) {
        return res.status(404).json({message: 'User not found'});
    }
    req.body.user = profile;
    next();
}