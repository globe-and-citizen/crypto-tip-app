import {generateNonce, SiweMessage} from 'siwe';
import {Request, Response} from 'express';
import jwt from 'jsonwebtoken';

const getNonce = async (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/plain');
    res.send(generateNonce());
}

const secretKey = process.env.SECRET_KEY as string;
const sessionExpiry = '1h'; // Set the session expiry time to 1 hour.
const verify = async (req: Request, res: Response) => {
    try {
        const {message, signature} = req.body;
        const SIWEObject = new SiweMessage(message);
        /**
         * verify the signature
         * @param signature
         * @returns {Promise<SiweResponse>}  This object if valid.
         * @throws {Error} If the signature is invalid.
         */
        const {data: newMessage} = await SIWEObject.verify({signature});

        // find the user with the given address in the database 
        // if not existe create the user and save it in the database using prisma
        
        // convert newMessage object into a  plain javascript object JSON
        const value = JSON.parse(JSON.stringify(newMessage));
        const token = jwt.sign(value, secretKey, {expiresIn: sessionExpiry});
        res.status(200).json({token});
    } catch (e) {
        console.log('Error: ', e)
        return res.status(401).json({message: 'Authentication failed. Please provide valid signature.', error: e});
    }
}
export {getNonce, verify}