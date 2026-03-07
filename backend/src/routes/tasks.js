const express = require('express');
const prisma = require('../lib/prisma');
const { authenticate, isAdmin } = require('../middleware/auth');

const router = express.Router();

// All task routes require authentication
router.use(authenticate);

// GET /tasks — user sees own, admin sees all
router.get('/', async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: req.user.role === 'ADMIN' ? {} : { userId: req.user.id },
      include: { user: { select: { email: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /tasks
router.post('/', async (req, res) => {
  const { title, description, status } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  try {
    const task = await prisma.task.create({
      data: {
        title,
        description: description || '',
        status: status === 'COMPLETED' ? 'COMPLETED' : 'PENDING',
        userId: req.user.id,
      },
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /tasks/:id
router.put('/:id', async (req, res) => {
  const taskId = parseInt(req.params.id);
  const { title, description, status } = req.body;

  try {
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) return res.status(404).json({ error: 'Task not found' });

    if (req.user.role !== 'ADMIN' && task.userId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const updated = await prisma.task.update({
      where: { id: taskId },
      data: {
        title: title || task.title,
        description: description !== undefined ? description : task.description,
        status: status || task.status,
      },
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /tasks/:id
router.delete('/:id', async (req, res) => {
  const taskId = parseInt(req.params.id);

  try {
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) return res.status(404).json({ error: 'Task not found' });

    if (req.user.role !== 'ADMIN' && task.userId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await prisma.task.delete({ where: { id: taskId } });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;