// CRUD team using Prisma Client
import {PrismaClient} from '@prisma/client';
import {Request, Response} from 'express';

const prisma = new PrismaClient();
// Create a new team
const addTeam = async (req: Request, res: Response) => {
    const {name, members, description} = req.body;
    try {
        const team = await prisma.team.create({
            data: {
                name,
                members,
                description,
                ownerId: req.body.decoded.address
            },
        });
        res.status(201).json(team);
    } catch (e) {
        console.log('Error: ', e)
        return res.status(500).json({message: 'Internal server error.'});
    }
}
// Get Team
const getTeam = async (req: Request, res: Response) => {
    const {id} = req.params;
    try {

        const team = await prisma.team.findUnique({
            where: {
                id: Number(id),
            },
            include: {
                transactions: true,
            }
        });

        // Handle  404
        if (!team) {
            return res.status(404).json({error: 'Team not found'});
        }
        if (team.ownerId !== req.body.user.address) {
            return res.status(401).json({error: 'Unauthorized'});
        }
        res.status(200).json(team);
    } catch (e) {
        console.log('Error: ', e)
        return res.status(500).json({message: 'Internal server error.'});
    }
}

// Get team owned by user
const getAllTeams = async (req: Request, res: Response) => {
    try {
        const teams = await prisma.team.findMany({
            where: {
                ownerId: req.body.decoded.address
            }
        })
        if (!teams || teams.length === 0) {
            // Return a 404 response and exit the function
            return res.status(404).json({message: 'No teams found'});
        }
        res.status(200).json(teams);
    } catch (e) {
        console.log('Error: ', e)
        return res.status(500).json({message: 'Internal server error.'});
    }
}

// update team
const updateTeam = async (req: Request, res: Response) => {
    const {id} = req.params;
    const {name, members, description} = req.body;
    const team = await prisma.team.update({
        where: {id: Number(id)},
        data: {
            name,
            members,
            description,
        },
    });
    res.status(200).json(team);
}

// Delete team
const deleteTeam = async (req: Request, res: Response) => {
    const {id} = req.params;
    const team = await prisma.team.delete({
        where: {
            id: Number(id),
        },
    });
    res.status(200).json(team);
}

export {addTeam, updateTeam, deleteTeam, getTeam, getAllTeams};