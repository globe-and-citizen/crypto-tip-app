import express from 'express';
import {generateNonce} from 'siwe';
import {getMyProfile, verify} from '../controllers/authController';
import {verifyToken} from '../middleware/authMiddleware';
import {addTeam, getTeam, getAllTeams, deleteTeam, updateTeam} from '../controllers/teamController';
import {addTransaction, getAllTransactions, getTransaction} from '../controllers/transactionController';

const router = express.Router();

// export default router;
router.get('/nonce', async function (req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.send(generateNonce());
});

router.post('/verify', verify);
router.get('/protected', verifyToken, getMyProfile);

// Team Controller
router.post('/teams', [verifyToken], addTeam);
router.get('/teams', [verifyToken], getAllTeams);
router.get('/teams/:id', [verifyToken], getTeam);
router.put('/teams/:id', [verifyToken], updateTeam);
router.delete('/teams/:id', [verifyToken], deleteTeam);

// Transaction Controller
// Note: Update and delete transaction are not implemented because they are not needed.
router.post('/transactions', [verifyToken], addTransaction);
router.get('/transactions', [verifyToken], getAllTransactions);
router.get('/transactions/:id', [verifyToken], getTransaction);

export default router;