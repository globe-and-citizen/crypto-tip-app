import express from 'express';
import {generateNonce} from 'siwe';
import {getMyProfile, verify} from '../controllers/authController';
import {verifyToken, getUser} from '../middleware/authMiddleware';
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
router.post('/teams', [verifyToken, getUser], addTeam);
router.get('/teams', [verifyToken, getUser], getAllTeams);
router.get('/teams/:id', [verifyToken, getUser], getTeam);
router.put('/teams/:id', [verifyToken, getUser], updateTeam);
router.delete('/teams/:id', [verifyToken, getUser], deleteTeam);

// Transaction Controller
// Note: Update and delete transaction are not implemented because they are not needed.
router.post('/transactions', [verifyToken], addTransaction);
router.get('/transactions', [verifyToken], getAllTransactions);
router.get('/transactions/:id', [verifyToken], getTransaction);

export default router;