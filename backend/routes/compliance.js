var express = require('express');
var router = express.Router();
const prisma = require('../services/prismaClient');

/* GET compliance tasks */
router.get('/tasks', async (req, res) => {
  try {
    const { hospitalId } = req.query;
    
    if (!hospitalId) {
      return res.status(400).json({ error: 'Hospital ID is required' });
    }

    const tasks = await prisma.complianceTask.findMany({
      where: { hospitalId },
      include: {
        department: {
          select: {
            name: true
          }
        },
        assignee: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      },
      orderBy: { dueDate: 'asc' }
    });

    const formattedTasks = tasks.map(task => ({
      id: task.id.slice(-8), // Use last 8 chars of CUID directly as string
      name: task.taskName,
      department: task.department?.name || 'Unassigned Department',
      dueDate: task.dueDate.toISOString().split('T')[0],
      status: task.status.replace('_', '-').toLowerCase(),
      priority: task.priority.toLowerCase(),
      description: task.description || 'No description provided',
      assignee: task.assignee ? `${task.assignee.firstName} ${task.assignee.lastName}` : 'Unassigned'
    }));

    res.json(formattedTasks);
  } catch (error) {
    console.error('Error fetching compliance tasks:', error);
    res.status(500).json({ error: error.message });
  }
});

/* GET compliance alerts for dashboard */
router.get('/alerts', async (req, res) => {
  try {
    const { hospitalId } = req.query;
    
    if (!hospitalId) {
      return res.status(400).json({ error: 'Hospital ID is required' });
    }
    
    // Get urgent compliance tasks for dashboard
    const urgentTasks = await prisma.complianceTask.findMany({
      where: {
        hospitalId,
        status: {
          in: ['OVERDUE', 'DUE_SOON', 'PENDING']
        }
      },
      include: {
        department: {
          select: {
            name: true
          }
        }
      },
      orderBy: { dueDate: 'asc' },
      take: 5
    });

    const formattedAlerts = urgentTasks.map(task => ({
      id: task.id.slice(-8), // Use last 8 chars of CUID directly as string
      task: task.taskName,
      department: task.department?.name || 'Unassigned Department',
      status: task.status.replace('_', '-').toLowerCase(),
      dueDate: task.dueDate.toISOString().split('T')[0]
    }));

    res.json(formattedAlerts);
  } catch (error) {
    console.error('Error fetching compliance alerts:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
