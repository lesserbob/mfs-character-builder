import { Router } from 'express';
const router = Router();
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

router.get('/test', (req, res) => {
    res.json({ message: 'Test route works! So does the auto build' });
});

// Endpoint to get a creature by id
router.get('/creature/:id', async(req, res) => {
    const creature = await prisma.creature.findUnique({
        where: {
            id: parseInt(req.params.id)
        }
    });
    res.json(creature);
});

export default router;