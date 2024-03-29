import {generateNonce, SiweMessage} from 'siwe';
import {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient()

const getNonce = async (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/plain');
    res.send(generateNonce());
}

const secretKey = process.env.SECRET_KEY as string;
const sessionExpiry = '1h'; // Set the session expiry time to 1 hour.

/**
 * Verify the signature and return a JWT token
 * check if user exists, if not create a new user record
 *
 * @param req
 * @param res
 */
const verify = async (req: Request, res: Response) => {
    try {
        const {message, signature} = req.body;
        const SIWEObject = new SiweMessage(message);
        /**
         * Verify the signature
         * @param signature
         * @returns {Promise<SiweResponse>}  This object if valid.
         * @throws {Error} If the signature is invalid.
         */
        const {data: newMessage} = await SIWEObject.verify({signature});

        // check if user exists, if not create a new user record
        const user = await prisma.user.findUnique({
            where: {
                'address': SIWEObject.address
            }
        });
        let status: number = 200;
        if (user === null) {
            // create a new user record
            const newUser = await prisma.user.create({
                data: {
                    address: SIWEObject.address
                }
            });
            status = newUser ? 201 : 200;
        }

        // convert newMessage object into a  plain javascript object JSON
        const value = JSON.parse(JSON.stringify(newMessage));
        const token = jwt.sign(value, secretKey, {expiresIn: sessionExpiry});
        res.status(status).json({token});
    } catch (e: any) {
        console.log('Error: ', e)
        if (e.error?.type === 'Signature does not match address of the message.') {
            return res.status(401).json({message: 'Authentication failed. Please provide valid signature.', error: e});
        } else {
            return res.status(500).json({message: 'Internal server error.'})
        }
    }
}

const getMyProfile = async (req: Request, res: Response) => {
    const tokenData = req.body.decoded;
    const profile = await prisma.user.findUnique({
        where: {
            'address': tokenData?.address
        }
    });
    if (profile === null) {
        return res.status(404).json({message: 'User not found'});
    }
    res.status(200).json(profile);
}
export {getNonce, verify, getMyProfile}