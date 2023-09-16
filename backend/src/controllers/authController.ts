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
        const {data: newMessage} = await SIWEObject.verify({signature});
        // convert newMessage object into a  plain javascript object JSON
        const value = JSON.parse(JSON.stringify(newMessage));
        const token = jwt.sign(value, secretKey, {expiresIn: sessionExpiry});
        res.status(200).json({token});
    } catch (e) {
        console.log('Error: ', e)

        return res.status(500).json({message: 'Error Occur', error: e});
    }
    console.log('here 2')
}
export {getNonce, verify}