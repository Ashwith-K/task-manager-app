const express = require('express');
const prisma = require('../lib/prisma');
const { authenticate, isAdmin } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate, isAdmin);

// GET /users — admin only
router.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, role: true, createdAt: true },
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /users/:id — admin only
router.delete('/:id', async (req, res) => {
  const userId = parseInt(req.params.id);
  try {
    await prisma.user.delete({ where: { id: userId } });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;