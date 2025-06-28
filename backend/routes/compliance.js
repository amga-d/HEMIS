var express = require('express');
var router = express.Router();
const prisma = require('../services/prismaClient');

/* GET compliance tasks */
router.get('/tasks', async (req, res) => {
  try {
    // Simulated compliance tasks data
    const complianceTasks = [
      {
        id: 1,
        name: "Fire Safety Inspection",
        department: "Facilities Management",
        dueDate: "2024-01-15",
        status: "overdue",
        priority: "high",
        description: "Annual fire safety inspection and equipment testing",
        assignee: "John Smith",
      },
      {
        id: 2,
        name: "Staff Training Certification",
        department: "Human Resources",
        dueDate: "2024-01-25",
        status: "due-soon",
        priority: "medium",
        description: "Mandatory HIPAA and safety training updates",
        assignee: "Sarah Johnson",
      },
      {
        id: 3,
        name: "Equipment Calibration",
        department: "Medical Equipment",
        dueDate: "2024-01-20",
        status: "completed",
        priority: "high",
        description: "Quarterly calibration of diagnostic equipment",
        assignee: "Mike Chen",
      },
      {
        id: 4,
        name: "Waste Management Audit",
        department: "Environmental Services",
        dueDate: "2024-02-01",
        status: "in-progress",
        priority: "medium",
        description: "Medical waste disposal compliance review",
        assignee: "Lisa Park",
      },
      {
        id: 5,
        name: "Patient Privacy Assessment",
        department: "Information Technology",
        dueDate: "2024-02-10",
        status: "pending",
        priority: "high",
        description: "Annual HIPAA compliance and data security review",
        assignee: "David Wilson",
      },
    ];

    res.json(complianceTasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* GET compliance alerts for dashboard */
router.get('/alerts', async (req, res) => {
  try {
    const complianceAlerts = [
      { id: 1, task: "Fire Safety Inspection", department: "Facilities", status: "overdue", dueDate: "2024-01-15" },
      { id: 2, task: "Staff Training Update", department: "HR", status: "due-soon", dueDate: "2024-01-25" },
      { id: 3, task: "Equipment Calibration", department: "Medical", status: "completed", dueDate: "2024-01-20" },
    ];

    res.json(complianceAlerts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
