// CRUD transactions using prisma

import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

// Create a new transaction
export const addTransaction = async (req: Request, res: Response) => {
  const { hash, type, value, teamId, senderAddress, members } = req.body;
  try {
    // find the team by id
    const team = await prisma.team.findUnique({
      where: {
        id: Number(teamId)
      }
    });
    if (!team) {
      return res.status(404).json({ error: `Team with id ${teamId} not found` });
    }
    if (team.ownerId !== req.body.decoded.address) {
      return res.status(401).json({ error: "Unauthorized to add transaction for this team" });
    }

    const transaction = await prisma.transaction.create({
      data: {
        hash,
        authorId: req.body.decoded.address,
        teamId: parseInt(teamId),
        members,
        senderAddress,
        type,
        value
      }
    });
    res.status(201).json(transaction);
  } catch (e) {
    console.log("Error: ", e);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Get transaction
export const getTransaction = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {

    const transaction = await prisma.transaction.findUnique({
      where: {
        id: Number(id)
      }
    });

    // Handle  404
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    if (transaction.authorId !== req.body.decoded.address) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    res.status(200).json(transaction);
  } catch (e) {
    console.log("Error: ", e);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Get transactions owned by user
export const getAllTransactions = async (req: Request, res: Response) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        authorId: req.body.decoded.address
      }
    });
    if (!transactions || transactions.length === 0) {
      // Return a 404 response and exit the function
      return res.status(404).json({ message: "No transactions found" });
    }
    res.status(200).json(transactions);
  } catch (e) {
    console.log("Error: ", e);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Update a transaction
// export const updateTransaction = async (req: Request, res: Response) => {
//     const {id} = req.params;
//     const {hash, type, value, teamId} = req.body;
//     try {
//         const transaction = await prisma.transaction.findUnique({
//             where: {
//                 id: Number(id)
//             }
//         });
//         if (!transaction) {
//             return res.status(404).json({error: 'Transaction not found'});
//         }
//         if (transaction.authorId !== req.body.decoded.address) {
//             return res.status(401).json({error: 'Unauthorized to update transaction for this team'});
//         }
//         const updatedTransaction = await prisma.transaction.update({
//             where: {
//                 id: Number(id)
//             },
//             data: {
//                 hash,
//                 type,
//                 value,
//                 teamId: parseInt(teamId)
//             }
//         })
//         res.status(200).json(updatedTransaction);
//     } catch (e) {
//         console.log('Error: ', e)
//         return res.status(500).json({message: 'Internal server error.'});
//     }
// }