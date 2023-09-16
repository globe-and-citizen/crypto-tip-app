import express from 'express';
import {generateNonce} from 'siwe';
import {verify} from '../controllers/authController';
import {verifyToken} from '../middleware/authMiddleware';

const router = express.Router();

// export default router;
router.get('/nonce', async function (req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.send(generateNonce());
});

router.post('/verify', verify);
router.get('/protected', verifyToken, (req, res) => {
});
export default router;