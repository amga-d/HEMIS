// filepath: /home/amgad/Desktop/projects/HEMIS/backend/prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.financialTransaction.deleteMany({});
  await prisma.monthlyFinancialSummary.deleteMany({});
  await prisma.employee.deleteMany({});
  await prisma.department.deleteMany({});
  await prisma.hospital.deleteMany({});

  // Create hospital
  const hospital = await prisma.hospital.create({
    data: {
      name: 'Central Hospital',
      address: '123 Health St',
      phone: '555-123-4567',
      email: 'info@centralhospital.com',
    },
  });
  
  console.log('Created hospital with ID:', hospital.id);

  // Create departments
  const departments = await Promise.all([
    prisma.department.create({
      data: {
        name: 'Nursing',
        description: 'Patient care and nursing services',
        hospitalId: hospital.id,
      },
    }),
    prisma.department.create({
      data: {
        name: 'Medical',
        description: 'Medical staff and physicians',
        hospitalId: hospital.id,
      },
    }),
    prisma.department.create({
      data: {
        name: 'Administration',
        description: 'Administrative and management staff',
        hospitalId: hospital.id,
      },
    }),
    prisma.department.create({
      data: {
        name: 'Emergency',
        description: 'Emergency room and trauma care',
        hospitalId: hospital.id,
      },
    }),
    prisma.department.create({
      data: {
        name: 'Cardiology',
        description: 'Heart and cardiovascular care',
        hospitalId: hospital.id,
      },
    }),
  ]);

  // Create employees
  const employees = await Promise.all([
    prisma.employee.create({
      data: {
        employeeId: 'EMP001',
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@centralhospital.com',
        position: 'Head Nurse',
        hireDate: new Date('2020-01-15'),
        salary: 75000,
        performanceScore: 9.8,
        hospitalId: hospital.id,
        departmentId: departments[0].id, // Nursing
      },
    }),
    prisma.employee.create({
      data: {
        employeeId: 'EMP002',
        firstName: 'Mike',
        lastName: 'Chen',
        email: 'mike.chen@centralhospital.com',
        position: 'ICU Nurse',
        hireDate: new Date('2021-03-20'),
        salary: 68000,
        performanceScore: 9.6,
        hospitalId: hospital.id,
        departmentId: departments[0].id, // Nursing
      },
    }),
    prisma.employee.create({
      data: {
        employeeId: 'EMP003',
        firstName: 'Emily',
        lastName: 'Rodriguez',
        email: 'emily.rodriguez@centralhospital.com',
        position: 'Emergency Physician',
        hireDate: new Date('2019-06-10'),
        salary: 180000,
        performanceScore: 9.5,
        hospitalId: hospital.id,
        departmentId: departments[3].id, // Emergency
      },
    }),
    prisma.employee.create({
      data: {
        employeeId: 'EMP004',
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@centralhospital.com',
        position: 'Administrator',
        hireDate: new Date('2018-09-05'),
        salary: 85000,
        performanceScore: 8.9,
        hospitalId: hospital.id,
        departmentId: departments[2].id, // Administration
      },
    }),
  ]);

  // Create financial data
  const months = [
    new Date('2024-01-01'),
    new Date('2024-02-01'),
    new Date('2024-03-01'),
    new Date('2024-04-01'),
    new Date('2024-05-01'),
    new Date('2024-06-01'),
  ];

  // Create monthly financial summaries
  await Promise.all(months.map((month, index) => 
    prisma.monthlyFinancialSummary.create({
      data: {
        hospitalId: hospital.id,
        monthYear: month,
        totalRevenue: 2200000 + (index * 150000) + Math.random() * 200000,
        totalCosts: 1800000 + (index * 100000) + Math.random() * 150000,
        netProfit: 400000 + (index * 50000) + Math.random() * 100000,
        budgetAllocated: 2500000,
        budgetUsed: 2000000 + (index * 100000),
      },
    })
  ));

  // Create financial transactions
  const transactionCategories = ['REVENUE', 'OPERATIONAL', 'CAPITAL'];
  const transactionDescriptions = [
    'Patient Services Revenue',
    'Medical Equipment Purchase',
    'Staff Salaries',
    'Utility Bills',
    'Pharmaceutical Supplies',
    'Equipment Maintenance',
    'Insurance Claims',
    'Facility Maintenance',
  ];

  for (let i = 0; i < 50; i++) {
    await prisma.financialTransaction.create({
      data: {
        hospitalId: hospital.id,
        transactionDate: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000),
        description: transactionDescriptions[Math.floor(Math.random() * transactionDescriptions.length)],
        category: transactionCategories[Math.floor(Math.random() * transactionCategories.length)],
        amount: (Math.random() - 0.3) * 100000,
        departmentId: departments[Math.floor(Math.random() * departments.length)].id,
        createdBy: employees[Math.floor(Math.random() * employees.length)].id,
      },
    });
  }

  console.log('Seed data created successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });