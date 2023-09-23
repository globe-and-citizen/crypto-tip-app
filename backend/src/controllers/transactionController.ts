// CRUD transactions using prisma

import {PrismaClient} from '@prisma/client';
import {Request, Response} from 'express';

const prisma = new PrismaClient();

// Create a new transaction
export const addTransaction = async (req: Request, res: Response) => {
    const {hash, type, value, teamId} = req.body;
    try {
        // find the team by id
        const team = await prisma.team.findUnique({
            where: {
                id: Number(teamId)
            }
        });
        if (!team) {
            return res.status(404).json({error: 'Team not found'});
        }
        if (team.ownerId !== req.body.decoded.address) {
            return res.status(401).json({error: 'Unauthorized to add transaction for this team'});
        }

        const transaction = await prisma.transaction.create({
            data: {
                hash,
                authorId: req.body.decoded.address,
                teamId: parseInt(teamId),
                members: team.members,
                type,
                value
            }
        });
        res.status(201).json(transaction);
    } catch (e) {
        console.log('Error: ', e)
        return res.status(500).json({message: 'Internal server error.'});
    }
}