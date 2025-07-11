// filepath: /home/amgad/Desktop/projects/HEMIS/backend/prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data in order to avoid foreign key constraints
  await prisma.dashboardKPI.deleteMany({});
  await prisma.employeeTraining.deleteMany({});
  await prisma.aiInsight.deleteMany({});
  await prisma.forecastData.deleteMany({});
  await prisma.complianceTask.deleteMany({});
  await prisma.employeePerformance.deleteMany({});
  await prisma.hospitalEquipment.deleteMany({});
  await prisma.dailyBedOccupancy.deleteMany({});
  await prisma.bed.deleteMany({});
  await prisma.patientVisit.deleteMany({});
  await prisma.patient.deleteMany({});
  await prisma.hrMonthlyStats.deleteMany({});
  await prisma.departmentStaffing.deleteMany({});
  await prisma.financialTransaction.deleteMany({});
  await prisma.monthlyFinancialSummary.deleteMany({});
  await prisma.employee.deleteMany({});
  await prisma.department.deleteMany({});
  await prisma.hospital.deleteMany({});
  await prisma.user.deleteMany({});

  // Create users;
  const adminPassword = 'admin'; // Change as needed
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const user = await prisma.user.create({
    data: {
      username: 'admin',
      firstName: 'John',
      lastName: 'Smith',
      password: hashedPassword,
    },
  });

  console.log('✅ Created user: ' + user.username);

  console.log('✅ Created user:');
  // Create hospital
  const hospital = await prisma.hospital.create({
    data: {
      name: 'Central Medical Hospital',
      address: '123 Healthcare Avenue, Medical District',
      phone: '+1-555-HOSPITAL',
      email: 'admin@centralmedical.com',
    },
  });

  console.log('✅ Created hospital:', hospital.name);

  // Create departments
  const departments = await Promise.all([
    prisma.department.create({
      data: {
        name: 'Emergency Medicine',
        description: 'Emergency and trauma care',
        hospitalId: hospital.id,
      },
    }),
    prisma.department.create({
      data: {
        name: 'Internal Medicine',
        description: 'General internal medicine and primary care',
        hospitalId: hospital.id,
      },
    }),
    prisma.department.create({
      data: {
        name: 'Surgery',
        description: 'Surgical procedures and post-operative care',
        hospitalId: hospital.id,
      },
    }),
    prisma.department.create({
      data: {
        name: 'Pediatrics',
        description: 'Children and adolescent healthcare',
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
    prisma.department.create({
      data: {
        name: 'Nursing',
        description: 'Patient care and nursing services',
        hospitalId: hospital.id,
      },
    }),
    prisma.department.create({
      data: {
        name: 'Administration',
        description: 'Hospital administration and management',
        hospitalId: hospital.id,
      },
    }),
    prisma.department.create({
      data: {
        name: 'Facilities',
        description: 'Facility management and maintenance',
        hospitalId: hospital.id,
      },
    }),
    prisma.department.create({
      data: {
        name: 'IT',
        description: 'Information technology and systems',
        hospitalId: hospital.id,
      },
    }),
    prisma.department.create({
      data: {
        name: 'Pharmacy',
        description: 'Pharmaceutical services',
        hospitalId: hospital.id,
      },
    }),
  ]);

  console.log('✅ Created', departments.length, 'departments');

  // Create employees
  const employeeData = [
    {
      id: 'EMP001',
      firstName: 'Dr. Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@centralmedical.com',
      phone: '555-123-4567',
      position: 'Emergency Physician',
      dept: 0,
      salary: 285000,
      performance: 9.4,
      hireDate: '2020-03-15',
    },
    {
      id: 'EMP002',
      firstName: 'Dr. Michael',
      lastName: 'Chen',
      email: 'michael.chen@centralmedical.com',
      phone: '555-234-5678',
      position: 'Cardiologist',
      dept: 4,
      salary: 320000,
      performance: 9.6,
      hireDate: '2019-07-22',
    },
    {
      id: 'EMP003',
      firstName: 'Dr. Emily',
      lastName: 'Rodriguez',
      email: 'emily.rodriguez@centralmedical.com',
      phone: '555-345-6789',
      position: 'Surgeon',
      dept: 2,
      salary: 380000,
      performance: 9.8,
      hireDate: '2018-11-10',
    },
    {
      id: 'EMP004',
      firstName: 'Dr. James',
      lastName: 'Wilson',
      email: 'james.wilson@centralmedical.com',
      phone: '555-456-7890',
      position: 'Internal Medicine',
      dept: 1,
      salary: 250000,
      performance: 8.9,
      hireDate: '2021-01-15',
    },
    {
      id: 'EMP005',
      firstName: 'Dr. Lisa',
      lastName: 'Park',
      email: 'lisa.park@centralmedical.com',
      phone: '555-567-8901',
      position: 'Pediatrician',
      dept: 3,
      salary: 240000,
      performance: 9.2,
      hireDate: '2020-09-05',
    },
    {
      id: 'EMP006',
      firstName: 'Jennifer',
      lastName: 'Smith',
      email: 'jennifer.smith@centralmedical.com',
      phone: '555-678-9012',
      position: 'Head Nurse',
      dept: 5,
      salary: 95000,
      performance: 9.1,
      hireDate: '2019-02-20',
    },
    {
      id: 'EMP007',
      firstName: 'Robert',
      lastName: 'Brown',
      email: 'robert.brown@centralmedical.com',
      phone: '555-789-0123',
      position: 'ICU Nurse',
      dept: 5,
      salary: 78000,
      performance: 8.8,
      hireDate: '2020-06-12',
    },
    {
      id: 'EMP008',
      firstName: 'Maria',
      lastName: 'Garcia',
      email: 'maria.garcia@centralmedical.com',
      phone: '555-890-1234',
      position: 'ER Nurse',
      dept: 5,
      salary: 75000,
      performance: 9.0,
      hireDate: '2021-04-03',
    },
    {
      id: 'EMP009',
      firstName: 'David',
      lastName: 'Anderson',
      email: 'david.anderson@centralmedical.com',
      phone: '555-901-2345',
      position: 'Hospital Administrator',
      dept: 6,
      salary: 125000,
      performance: 8.7,
      hireDate: '2018-05-18',
    },
    {
      id: 'EMP010',
      firstName: 'Susan',
      lastName: 'Miller',
      email: 'susan.miller@centralmedical.com',
      phone: '555-012-3456',
      position: 'Finance Director',
      dept: 6,
      salary: 110000,
      performance: 8.9,
      hireDate: '2019-12-01',
    },
    {
      id: 'EMP011',
      firstName: 'John',
      lastName: 'Thompson',
      email: 'john.thompson@centralmedical.com',
      phone: '555-123-4567',
      position: 'IT Manager',
      dept: 8,
      salary: 98000,
      performance: 8.5,
      hireDate: '2020-08-15',
    },
    {
      id: 'EMP012',
      firstName: 'Karen',
      lastName: 'Davis',
      email: 'karen.davis@centralmedical.com',
      phone: '555-234-5678',
      position: 'Facilities Manager',
      dept: 7,
      salary: 85000,
      performance: 8.3,
      hireDate: '2021-02-28',
    },
    {
      id: 'EMP013',
      firstName: 'Dr. Kevin',
      lastName: 'Lee',
      email: 'kevin.lee@centralmedical.com',
      phone: '555-345-6789',
      position: 'Chief Pharmacist',
      dept: 9,
      salary: 140000,
      performance: 9.0,
      hireDate: '2019-10-12',
    },
    {
      id: 'EMP014',
      firstName: 'Nancy',
      lastName: 'White',
      email: 'nancy.white@centralmedical.com',
      phone: '555-456-7890',
      position: 'OR Nurse',
      dept: 5,
      salary: 82000,
      performance: 8.9,
      hireDate: '2020-11-20',
    },
    {
      id: 'EMP015',
      firstName: 'Thomas',
      lastName: 'Taylor',
      email: 'thomas.taylor@centralmedical.com',
      phone: '555-567-8901',
      position: 'Maintenance Supervisor',
      dept: 7,
      salary: 65000,
      performance: 8.4,
      hireDate: '2021-03-10',
    },
  ];

  const employees = await Promise.all(
    employeeData.map((emp) =>
      prisma.employee.create({
        data: {
          employeeId: emp.id,
          firstName: emp.firstName,
          lastName: emp.lastName,
          email: emp.email,
          phone: emp.phone,
          position: emp.position,
          hireDate: new Date(emp.hireDate),
          salary: emp.salary,
          performanceScore: emp.performance,
          hospitalId: hospital.id,
          departmentId: departments[emp.dept].id,
          status: 'ACTIVE',
        },
      })
    )
  );

  console.log('✅ Created', employees.length, 'employees');

  // Create patients
  const patientData = [];
  const addresses = [
    '123 Main St, Springfield',
    '456 Oak Ave, Riverside',
    '789 Pine Rd, Lakewood',
    '321 Elm St, Hillside',
    '654 Maple Dr, Meadowbrook',
    '987 Cedar Ln, Parkview',
    '147 Birch Way, Greenfield',
    '258 Willow Ct, Fairview',
    '369 Aspen Pl, Westside',
  ];

  for (let i = 1; i <= 100; i++) {
    patientData.push({
      patientId: `PAT${i.toString().padStart(4, '0')}`,
      firstName: `Patient${i}`,
      lastName: `LastName${i}`,
      dateOfBirth: new Date(
        1950 + Math.floor(Math.random() * 70),
        Math.floor(Math.random() * 12),
        Math.floor(Math.random() * 28) + 1
      ),
      gender: Math.random() > 0.5 ? 'M' : 'F',
      phone: `555-${Math.floor(Math.random() * 900) + 100}-${
        Math.floor(Math.random() * 9000) + 1000
      }`,
      email: `patient${i}@email.com`,
      address:
        addresses[Math.floor(Math.random() * addresses.length)] +
        `, Apt ${Math.floor(Math.random() * 500) + 1}`,
      emergencyContactName: `Emergency Contact ${i}`,
      emergencyContactPhone: `555-${Math.floor(Math.random() * 900) + 100}-${
        Math.floor(Math.random() * 9000) + 1000
      }`,
      hospitalId: hospital.id,
    });
  }

  const patients = await Promise.all(
    patientData.map((patient) => prisma.patient.create({ data: patient }))
  );

  console.log('✅ Created', patients.length, 'patients');

  // Generate data for January 2025 to July 2025 (7 months)
  const startDate = new Date('2025-01-01');
  const endDate = new Date('2025-07-31');

  // Helper function to generate random date within range
  function randomDate(start, end) {
    return new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime())
    );
  }

  // Create patient visits for each month
  console.log('🏥 Creating patient visits...');
  const patientVisits = [];

  for (let month = 0; month < 7; month++) {
    const monthStart = new Date(2025, month, 1);
    const monthEnd = new Date(2025, month + 1, 0);

    // Generate 120-200 visits per month
    const visitsThisMonth = 120 + Math.floor(Math.random() * 80);

    for (let i = 0; i < visitsThisMonth; i++) {
      const visitDate = randomDate(monthStart, monthEnd);
      const patientIndex = Math.floor(Math.random() * patients.length);
      const departmentIndex = Math.floor(Math.random() * 5); // Medical departments only
      const visitType =
        Math.random() < 0.3
          ? 'INPATIENT'
          : Math.random() < 0.7
          ? 'OUTPATIENT'
          : 'EMERGENCY';

      const sessionDuration =
        visitType === 'INPATIENT'
          ? Math.floor(Math.random() * 4320) + 1440 // 1-4 days for inpatient
          : Math.floor(Math.random() * 180) + 30; // 30-210 minutes for outpatient/emergency

      const dischargeDate =
        visitType === 'INPATIENT'
          ? new Date(visitDate.getTime() + sessionDuration * 60000)
          : visitDate;

      const visit = await prisma.patientVisit.create({
        data: {
          hospitalId: hospital.id,
          patientId: patients[patientIndex].id,
          visitType: visitType,
          admissionDate: visitDate,
          dischargeDate: visitType === 'OUTPATIENT' ? visitDate : dischargeDate,
          departmentId: departments[departmentIndex].id,
          attendingPhysician: employees[departmentIndex].id,
          diagnosis: `Diagnosis for visit ${i + 1}`,
          treatmentSummary: `Treatment provided for patient visit ${i + 1}`,
          totalCost: Math.floor(Math.random() * 15000) + 500,
          insuranceCovered: Math.floor(Math.random() * 12000) + 400,
          patientPaid: Math.floor(Math.random() * 3000) + 100,
          status:
            visitType === 'INPATIENT' && Math.random() < 0.8
              ? 'DISCHARGED'
              : 'ADMITTED',
          sessionDuration: sessionDuration,
          isReadmission: Math.random() < 0.12, // 12% readmission rate
          waitTime: Math.floor(Math.random() * 120) + 15, // 15-135 minutes wait
        },
      });

      patientVisits.push(visit);
    }
  }

  console.log('✅ Created', patientVisits.length, 'patient visits');

  // Create monthly financial summaries for Jan 2025 - Jul 2025
  console.log('💰 Creating financial data...');
  const monthlyData = [];

  for (let month = 0; month < 7; month++) {
    const monthYear = new Date(2025, month, 1);
    const baseRevenue = 2400000 + month * 100000; // Growing revenue
    const baseCosts = 1800000 + month * 75000; // Growing costs

    const summary = await prisma.monthlyFinancialSummary.create({
      data: {
        hospitalId: hospital.id,
        monthYear: monthYear,
        totalRevenue: baseRevenue + Math.floor(Math.random() * 300000),
        totalCosts: baseCosts + Math.floor(Math.random() * 200000),
        netProfit: baseRevenue - baseCosts + Math.floor(Math.random() * 100000),
        budgetAllocated: 3000000,
        budgetUsed:
          2200000 + month * 80000 + Math.floor(Math.random() * 150000),
      },
    });
    monthlyData.push(summary);
  }

  // Create financial transactions
  for (let i = 0; i < 500; i++) {
    const transactionDate = randomDate(startDate, endDate);
    const categories = ['REVENUE', 'OPERATIONAL', 'CAPITAL'];
    const descriptions = [
      'Patient Services Revenue',
      'Emergency Care Revenue',
      'Surgery Revenue',
      'Medical Equipment Purchase',
      'Pharmaceutical Supplies',
      'Staff Salaries',
      'Utility Bills',
      'Equipment Maintenance',
      'Insurance Claims',
      'Facility Maintenance',
      'IT Infrastructure',
      'Medical Supplies',
    ];

    await prisma.financialTransaction.create({
      data: {
        hospitalId: hospital.id,
        transactionDate: transactionDate,
        description:
          descriptions[Math.floor(Math.random() * descriptions.length)],
        category: categories[Math.floor(Math.random() * categories.length)],
        amount: (Math.random() - 0.4) * 150000, // Mix of positive and negative amounts
        departmentId:
          departments[Math.floor(Math.random() * departments.length)].id,
        createdBy: employees[Math.floor(Math.random() * employees.length)].id,
      },
    });
  }

  // Create HR monthly stats for each month
  console.log('👥 Creating HR data...');
  for (let month = 0; month < 7; month++) {
    const monthYear = new Date(2025, month, 1);

    await prisma.hrMonthlyStats.create({
      data: {
        hospitalId: hospital.id,
        monthYear: monthYear,
        newHires: Math.floor(Math.random() * 5) + 1,
        departures: Math.floor(Math.random() * 3),
        totalStaff: employees.length + month, // Gradual growth
        turnoverRate: Math.random() * 5 + 8, // 8-13% turnover
        avgSatisfactionScore: Math.random() * 1 + 4, // 4-5 scale
        avgTrainingHours: Math.random() * 20 + 30, // 30-50 hours
        totalTrainingHours: (Math.random() * 20 + 30) * employees.length,
        certificationCount: Math.floor(Math.random() * 20) + 10,
        avgPerformanceScore: Math.random() * 1 + 8.5, // 8.5-9.5 scale
      },
    });
  }

  // Create employee training records
  console.log('📚 Creating training records...');
  const trainingTypes = ['HIPAA', 'SAFETY', 'TECHNICAL', 'LEADERSHIP'];
  const trainingNames = [
    'HIPAA Privacy Training',
    'Fire Safety Training',
    'CPR Certification',
    'Leadership Development',
    'Medical Equipment Training',
    'Emergency Procedures',
    'Patient Safety Protocol',
    'Infection Control',
    'Communication Skills',
  ];

  for (const employee of employees) {
    // Each employee gets 2-5 training records
    const trainingCount = Math.floor(Math.random() * 4) + 2;

    for (let i = 0; i < trainingCount; i++) {
      const trainingDate = randomDate(startDate, endDate);

      await prisma.employeeTraining.create({
        data: {
          employeeId: employee.id,
          trainingName:
            trainingNames[Math.floor(Math.random() * trainingNames.length)],
          trainingType:
            trainingTypes[Math.floor(Math.random() * trainingTypes.length)],
          trainingDate: trainingDate,
          hoursCompleted: Math.floor(Math.random() * 30) + 5, // 5-35 hours
          certificationExpires: new Date(
            trainingDate.getTime() + 365 * 24 * 60 * 60 * 1000
          ), // 1 year from training
          trainer: `Trainer ${Math.floor(Math.random() * 5) + 1}`,
          status: Math.random() < 0.9 ? 'COMPLETED' : 'IN_PROGRESS',
          completionScore: Math.random() * 2 + 8, // 8-10 score
        },
      });
    }
  }

  // Create compliance tasks
  console.log('📋 Creating compliance tasks...');
  const complianceTasks = [
    {
      name: 'Fire Safety Inspection',
      dept: 7,
      priority: 'HIGH',
      desc: 'Annual fire safety inspection and equipment testing',
    },
    {
      name: 'HIPAA Compliance Audit',
      dept: 8,
      priority: 'HIGH',
      desc: 'Annual HIPAA compliance and data security review',
    },
    {
      name: 'Equipment Calibration',
      dept: 7,
      priority: 'MEDIUM',
      desc: 'Quarterly calibration of diagnostic equipment',
    },
    {
      name: 'Staff Training Certification',
      dept: 6,
      priority: 'MEDIUM',
      desc: 'Mandatory safety and compliance training updates',
    },
    {
      name: 'Waste Management Audit',
      dept: 7,
      priority: 'MEDIUM',
      desc: 'Medical waste disposal compliance review',
    },
    {
      name: 'Emergency Preparedness Drill',
      dept: 0,
      priority: 'HIGH',
      desc: 'Quarterly emergency response drill and evaluation',
    },
    {
      name: 'Pharmacy Compliance Check',
      dept: 9,
      priority: 'MEDIUM',
      desc: 'Monthly pharmacy compliance and inventory review',
    },
    {
      name: 'Patient Privacy Assessment',
      dept: 8,
      priority: 'HIGH',
      desc: 'Quarterly patient privacy and data protection review',
    },
  ];

  for (let i = 0; i < complianceTasks.length; i++) {
    const task = complianceTasks[i];
    const dueDate = randomDate(new Date('2025-01-01'), new Date('2025-12-31'));
    const assigneeIndex = Math.floor(Math.random() * employees.length);

    // Determine status based on due date
    let status = 'PENDING';
    const now = new Date('2025-07-09');
    if (dueDate < now) {
      status = Math.random() < 0.7 ? 'COMPLETED' : 'OVERDUE';
    } else if (dueDate.getTime() - now.getTime() < 7 * 24 * 60 * 60 * 1000) {
      status = 'DUE_SOON';
    }

    await prisma.complianceTask.create({
      data: {
        hospitalId: hospital.id,
        taskName: task.name,
        description: task.desc,
        departmentId: departments[task.dept].id,
        assigneeId: employees[assigneeIndex].id,
        dueDate: dueDate,
        status: status,
        priority: task.priority,
        completionDate:
          status === 'COMPLETED'
            ? new Date(
                dueDate.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000
              )
            : null,
        completedBy:
          status === 'COMPLETED' ? employees[assigneeIndex].id : null,
      },
    });
  }

  // Create AI insights
  console.log('🤖 Creating AI insights...');
  const insights = [
    {
      type: 'PATIENT_INFLOW',
      title: 'Patient Volume Trend',
      text: 'Patient inflow has increased by 15% compared to last quarter, suggesting need for additional staffing in Emergency and Internal Medicine departments.',
    },
    {
      type: 'FINANCIAL',
      title: 'Cost Optimization',
      text: 'Pharmaceutical costs can be reduced by approximately $45,000 annually through bulk purchasing agreements and generic substitutions where appropriate.',
    },
    {
      type: 'HR',
      title: 'Staffing Analysis',
      text: 'Current nurse-to-patient ratio is optimal, but consider hiring 2 additional ICU nurses to handle peak capacity periods more effectively.',
    },
    {
      type: 'COMPLIANCE',
      title: 'Compliance Risk',
      text: 'Three high-priority compliance tasks are approaching deadlines. Immediate attention required for Fire Safety Inspection and HIPAA Audit.',
    },
    {
      type: 'BED_OCCUPANCY',
      title: 'Capacity Planning',
      text: 'Bed occupancy rate averaging 87% suggests need for capacity expansion planning, particularly in cardiology and surgery departments.',
    },
  ];

  for (const insight of insights) {
    await prisma.aiInsight.create({
      data: {
        hospitalId: hospital.id,
        insightType: insight.type,
        title: insight.title,
        insightText: insight.text,
        generatedDate: randomDate(
          new Date('2025-06-01'),
          new Date('2025-07-09')
        ),
        isActive: true,
      },
    });
  }

  // Create forecast data
  console.log('📊 Creating forecast data...');
  const forecastTypes = ['PATIENT_INFLOW', 'FINANCIAL', 'BED_OCCUPANCY'];

  for (const type of forecastTypes) {
    for (let month = 0; month < 12; month++) {
      const periodDate = new Date(2025, month, 1);
      const isHistorical = month < 7; // Jan-Jul are historical

      let historical = null,
        forecast = null,
        lower = null,
        upper = null;

      if (isHistorical) {
        // Historical data
        if (type === 'PATIENT_INFLOW') {
          historical = 1200 + month * 50 + Math.floor(Math.random() * 200);
        } else if (type === 'FINANCIAL') {
          historical =
            2400000 + month * 100000 + Math.floor(Math.random() * 300000);
        } else {
          // BED_OCCUPANCY
          historical = 75 + Math.floor(Math.random() * 20);
        }
      } else {
        // Forecast data
        if (type === 'PATIENT_INFLOW') {
          forecast = 1500 + month * 40 + Math.floor(Math.random() * 150);
          lower = forecast - 100;
          upper = forecast + 150;
        } else if (type === 'FINANCIAL') {
          forecast =
            2800000 + month * 90000 + Math.floor(Math.random() * 200000);
          lower = forecast - 200000;
          upper = forecast + 300000;
        } else {
          // BED_OCCUPANCY
          forecast = 85 + Math.floor(Math.random() * 10);
          lower = forecast - 5;
          upper = forecast + 8;
        }
      }

      await prisma.forecastData.create({
        data: {
          hospitalId: hospital.id,
          forecastType: type,
          periodDate: periodDate,
          historicalValue: historical,
          forecastValue: forecast,
          confidenceLower: lower,
          confidenceUpper: upper,
        },
      });
    }
  }

  // Create beds and bed occupancy data
  console.log('🛏️ Creating bed and occupancy data...');
  const bedTypes = ['ICU', 'GENERAL', 'PRIVATE', 'EMERGENCY'];
  const beds = [];

  // Create 50 beds across departments
  for (let i = 1; i <= 50; i++) {
    const bed = await prisma.bed.create({
      data: {
        hospitalId: hospital.id,
        departmentId: departments[Math.floor(Math.random() * 5)].id, // Medical departments
        bedNumber: `BED-${i.toString().padStart(3, '0')}`,
        bedType: bedTypes[Math.floor(Math.random() * bedTypes.length)],
        status: Math.random() < 0.85 ? 'OCCUPIED' : 'AVAILABLE',
        currentPatientId:
          Math.random() < 0.85
            ? patients[Math.floor(Math.random() * patients.length)].id
            : null,
      },
    });
    beds.push(bed);
  }

  // Create daily bed occupancy data
  for (let day = 0; day < 210; day++) {
    // 7 months * 30 days
    const date = new Date('2025-01-01');
    date.setDate(date.getDate() + day);

    const totalBeds = beds.length;
    const occupiedBeds = Math.floor(totalBeds * (0.7 + Math.random() * 0.25)); // 70-95% occupancy

    await prisma.dailyBedOccupancy.create({
      data: {
        hospitalId: hospital.id,
        date: date,
        totalBeds: totalBeds,
        occupiedBeds: occupiedBeds,
        occupancyRate: (occupiedBeds / totalBeds) * 100,
        departmentId: departments[Math.floor(Math.random() * 5)].id,
      },
    });
  }

  // Create department staffing data
  console.log('🏢 Creating department staffing data...');
  for (const department of departments) {
    const currentStaff = employees.filter(
      (emp) => emp.departmentId === department.id
    ).length;
    const requiredStaff = Math.max(
      currentStaff,
      currentStaff + Math.floor(Math.random() * 3)
    );

    await prisma.departmentStaffing.create({
      data: {
        hospitalId: hospital.id,
        departmentId: department.id,
        requiredStaff: requiredStaff,
        currentStaff: currentStaff,
        lastUpdated: randomDate(new Date('2025-06-01'), new Date('2025-07-09')),
      },
    });
  }

  // Create employee performance evaluations
  console.log('📊 Creating employee performance evaluations...');
  for (const employee of employees) {
    // Each employee gets 1-2 performance evaluations in the period
    const evalCount = Math.floor(Math.random() * 2) + 1;

    for (let i = 0; i < evalCount; i++) {
      const evaluationDate = randomDate(
        new Date('2025-01-01'),
        new Date('2025-06-30')
      );
      const evaluatorIndex = Math.floor(Math.random() * employees.length);

      await prisma.employeePerformance.create({
        data: {
          employeeId: employee.id,
          evaluationPeriod: evaluationDate,
          performanceScore: Math.random() * 2 + 8, // 8-10 scale
          achievementDescription: `Performance evaluation for ${evaluationDate.getFullYear()}-${
            evaluationDate.getMonth() + 1
          }. Strong contribution to department goals and patient care.`,
          evaluatorId: employees[evaluatorIndex].id,
        },
      });
    }
  }

  // Create hospital equipment
  console.log('🏥 Creating hospital equipment...');
  const equipmentData = [
    {
      name: 'MRI Scanner',
      type: 'Diagnostic Imaging',
      dept: 1,
      serial: 'MRI-001',
    },
    {
      name: 'CT Scanner',
      type: 'Diagnostic Imaging',
      dept: 1,
      serial: 'CT-001',
    },
    {
      name: 'X-Ray Machine',
      type: 'Diagnostic Imaging',
      dept: 0,
      serial: 'XRAY-001',
    },
    {
      name: 'Ultrasound Machine',
      type: 'Diagnostic Imaging',
      dept: 1,
      serial: 'US-001',
    },
    {
      name: 'Defibrillator',
      type: 'Emergency Equipment',
      dept: 0,
      serial: 'DEF-001',
    },
    { name: 'Ventilator', type: 'Life Support', dept: 0, serial: 'VENT-001' },
    {
      name: 'Surgical Robot',
      type: 'Surgical Equipment',
      dept: 2,
      serial: 'ROBOT-001',
    },
    {
      name: 'Anesthesia Machine',
      type: 'Surgical Equipment',
      dept: 2,
      serial: 'ANES-001',
    },
    {
      name: 'Patient Monitor',
      type: 'Monitoring Equipment',
      dept: 5,
      serial: 'MON-001',
    },
    {
      name: 'Dialysis Machine',
      type: 'Treatment Equipment',
      dept: 1,
      serial: 'DIAL-001',
    },
    {
      name: 'Laboratory Analyzer',
      type: 'Laboratory Equipment',
      dept: 9,
      serial: 'LAB-001',
    },
    { name: 'Pharmacy Robot', type: 'Automation', dept: 9, serial: 'PHRM-001' },
  ];

  for (const equipment of equipmentData) {
    const purchaseDate = randomDate(
      new Date('2020-01-01'),
      new Date('2024-12-31')
    );
    const lastMaintenance = randomDate(purchaseDate, new Date('2025-07-01'));
    const nextMaintenance = new Date(lastMaintenance);
    nextMaintenance.setMonth(
      nextMaintenance.getMonth() + Math.floor(Math.random() * 6) + 3
    ); // 3-9 months from last maintenance

    await prisma.hospitalEquipment.create({
      data: {
        hospitalId: hospital.id,
        departmentId: departments[equipment.dept].id,
        equipmentName: equipment.name,
        equipmentType: equipment.type,
        serialNumber: equipment.serial,
        purchaseDate: purchaseDate,
        lastMaintenance: lastMaintenance,
        nextMaintenanceDue: nextMaintenance,
        status:
          Math.random() < 0.95
            ? 'OPERATIONAL'
            : Math.random() < 0.8
            ? 'MAINTENANCE'
            : 'RETIRED',
      },
    });
  }

  // Create dashboard KPI data
  console.log('📈 Creating dashboard KPI data...');
  const kpiTypes = [
    'patient_satisfaction',
    'bed_occupancy_rate',
    'average_length_of_stay',
    'readmission_rate',
    'staff_turnover',
    'revenue_per_patient',
    'cost_per_patient',
    'emergency_wait_time',
    'surgery_success_rate',
  ];

  for (let day = 0; day < 210; day++) {
    // 7 months of daily data
    const date = new Date('2025-01-01');
    date.setDate(date.getDate() + day);

    for (const kpiType of kpiTypes) {
      let value, trend;

      switch (kpiType) {
        case 'patient_satisfaction':
          value = 4.2 + Math.random() * 0.6; // 4.2-4.8 out of 5
          trend = (Math.random() - 0.5) * 0.2; // -0.1 to +0.1
          break;
        case 'bed_occupancy_rate':
          value = 75 + Math.random() * 20; // 75-95%
          trend = (Math.random() - 0.5) * 5; // -2.5% to +2.5%
          break;
        case 'average_length_of_stay':
          value = 3.5 + Math.random() * 2; // 3.5-5.5 days
          trend = (Math.random() - 0.5) * 0.5; // -0.25 to +0.25 days
          break;
        case 'readmission_rate':
          value = 8 + Math.random() * 4; // 8-12%
          trend = (Math.random() - 0.5) * 2; // -1% to +1%
          break;
        case 'staff_turnover':
          value = 10 + Math.random() * 5; // 10-15%
          trend = (Math.random() - 0.5) * 2; // -1% to +1%
          break;
        case 'revenue_per_patient':
          value = 8000 + Math.random() * 4000; // $8,000-$12,000
          trend = (Math.random() - 0.5) * 1000; // -$500 to +$500
          break;
        case 'cost_per_patient':
          value = 6000 + Math.random() * 3000; // $6,000-$9,000
          trend = (Math.random() - 0.5) * 800; // -$400 to +$400
          break;
        case 'emergency_wait_time':
          value = 25 + Math.random() * 20; // 25-45 minutes
          trend = (Math.random() - 0.5) * 10; // -5 to +5 minutes
          break;
        case 'surgery_success_rate':
          value = 92 + Math.random() * 7; // 92-99%
          trend = (Math.random() - 0.5) * 2; // -1% to +1%
          break;
        default:
          value = Math.random() * 100;
          trend = (Math.random() - 0.5) * 10;
      }

      await prisma.dashboardKPI.create({
        data: {
          hospitalId: hospital.id,
          date: date,
          kpiType: kpiType,
          value: value,
          trend: trend,
          metadata: {
            source: 'automated_calculation',
            confidence: 0.85 + Math.random() * 0.15,
          },
        },
      });
    }
  }

  console.log('🎉 Database seeding completed successfully!');
  console.log('📊 Summary:');
  console.log(`   🏥 1 Hospital`);
  console.log(`   🏬 ${departments.length} Departments`);
  console.log(`   👥 ${employees.length} Employees`);
  console.log(`   🏥 ${patients.length} Patients`);
  console.log(`   📋 ${patientVisits.length} Patient Visits`);
  console.log(`   💰 7 Monthly Financial Summaries`);
  console.log(`   💳 500 Financial Transactions`);
  console.log(`   📚 ${employees.length * 3} Training Records (avg)`);
  console.log(`   📋 8 Compliance Tasks`);
  console.log(`   🤖 5 AI Insights`);
  console.log(`   📊 ${forecastTypes.length * 12} Forecast Data Points`);
  console.log(`   🛏️ ${beds.length} Beds with 210 days of occupancy data`);
  console.log(`   🏢 ${departments.length} Department Staffing Records`);
  console.log(
    `   📊 ${employees.length * 2} Employee Performance Evaluations (avg)`
  );
  console.log(`   🏥 12 Hospital Equipment Records`);
  console.log(`   📈 ${kpiTypes.length * 210} Dashboard KPI Data Points`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
