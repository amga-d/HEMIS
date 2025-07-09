-- CreateEnum
CREATE TYPE "EmployeeStatus" AS ENUM ('active', 'inactive', 'terminated');

-- CreateEnum
CREATE TYPE "TransactionCategory" AS ENUM ('Revenue', 'Capital', 'Operational');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('M', 'F', 'Other');

-- CreateEnum
CREATE TYPE "VisitType" AS ENUM ('inpatient', 'outpatient', 'emergency');

-- CreateEnum
CREATE TYPE "VisitStatus" AS ENUM ('admitted', 'discharged', 'transferred');

-- CreateEnum
CREATE TYPE "BedType" AS ENUM ('ICU', 'General', 'Private', 'Emergency');

-- CreateEnum
CREATE TYPE "BedStatus" AS ENUM ('occupied', 'available', 'maintenance');

-- CreateEnum
CREATE TYPE "ComplianceStatus" AS ENUM ('pending', 'in-progress', 'due-soon', 'overdue', 'completed');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('low', 'medium', 'high');

-- CreateEnum
CREATE TYPE "ForecastType" AS ENUM ('patient-inflow', 'financial', 'bed-occupancy');

-- CreateEnum
CREATE TYPE "InsightType" AS ENUM ('patient-inflow', 'financial', 'bed-occupancy', 'hr', 'compliance');

-- CreateEnum
CREATE TYPE "EquipmentStatus" AS ENUM ('operational', 'maintenance', 'retired');

-- CreateEnum
CREATE TYPE "TrainingType" AS ENUM ('HIPAA', 'Safety', 'Technical', 'Leadership', 'Other');

-- CreateEnum
CREATE TYPE "TrainingStatus" AS ENUM ('scheduled', 'in-progress', 'completed', 'cancelled');

-- CreateTable
CREATE TABLE "hospitals" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hospitals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "departments" (
    "id" TEXT NOT NULL,
    "hospital_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employees" (
    "id" TEXT NOT NULL,
    "hospital_id" TEXT NOT NULL,
    "department_id" TEXT,
    "employee_id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "position" TEXT,
    "hire_date" TIMESTAMP(3),
    "departure_date" TIMESTAMP(3),
    "status" "EmployeeStatus" NOT NULL DEFAULT 'active',
    "salary" DECIMAL(12,2),
    "performance_score" DECIMAL(3,1),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "financial_transactions" (
    "id" TEXT NOT NULL,
    "hospital_id" TEXT NOT NULL,
    "transaction_date" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "category" "TransactionCategory" NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "department_id" TEXT,
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "financial_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "monthly_financial_summary" (
    "id" TEXT NOT NULL,
    "hospital_id" TEXT NOT NULL,
    "month_year" TIMESTAMP(3) NOT NULL,
    "total_revenue" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "total_costs" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "net_profit" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "budget_allocated" DECIMAL(15,2),
    "budget_used" DECIMAL(15,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "monthly_financial_summary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patients" (
    "id" TEXT NOT NULL,
    "hospital_id" TEXT NOT NULL,
    "patient_id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "date_of_birth" TIMESTAMP(3),
    "gender" "Gender",
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT,
    "emergency_contact_name" TEXT,
    "emergency_contact_phone" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "patients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patient_visits" (
    "id" TEXT NOT NULL,
    "hospital_id" TEXT NOT NULL,
    "patient_id" TEXT NOT NULL,
    "visit_type" "VisitType" NOT NULL,
    "admission_date" TIMESTAMP(3) NOT NULL,
    "discharge_date" TIMESTAMP(3),
    "department_id" TEXT,
    "attending_physician" TEXT,
    "diagnosis" TEXT,
    "treatment_summary" TEXT,
    "total_cost" DECIMAL(10,2),
    "insurance_covered" DECIMAL(10,2),
    "patient_paid" DECIMAL(10,2),
    "status" "VisitStatus" NOT NULL DEFAULT 'admitted',
    "session_duration" INTEGER,
    "is_readmission" BOOLEAN NOT NULL DEFAULT false,
    "previous_visit_id" TEXT,
    "wait_time" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patient_visits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "beds" (
    "id" TEXT NOT NULL,
    "hospital_id" TEXT NOT NULL,
    "department_id" TEXT,
    "bed_number" TEXT NOT NULL,
    "bed_type" "BedType",
    "status" "BedStatus" NOT NULL DEFAULT 'available',
    "current_patient_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "beds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_bed_occupancy" (
    "id" TEXT NOT NULL,
    "hospital_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "total_beds" INTEGER NOT NULL,
    "occupied_beds" INTEGER NOT NULL,
    "occupancy_rate" DECIMAL(5,2) NOT NULL,
    "department_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "daily_bed_occupancy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hr_monthly_stats" (
    "id" TEXT NOT NULL,
    "hospital_id" TEXT NOT NULL,
    "month_year" TIMESTAMP(3) NOT NULL,
    "new_hires" INTEGER NOT NULL DEFAULT 0,
    "departures" INTEGER NOT NULL DEFAULT 0,
    "total_staff" INTEGER NOT NULL,
    "turnover_rate" DECIMAL(5,2),
    "avg_satisfaction_score" DECIMAL(3,1),
    "avg_training_hours" DECIMAL(5,1),
    "total_training_hours" DECIMAL(8,1),
    "certification_count" INTEGER,
    "avg_performance_score" DECIMAL(3,1),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hr_monthly_stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "department_staffing" (
    "id" TEXT NOT NULL,
    "hospital_id" TEXT NOT NULL,
    "department_id" TEXT NOT NULL,
    "required_staff" INTEGER NOT NULL,
    "current_staff" INTEGER NOT NULL,
    "last_updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "department_staffing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee_performance" (
    "id" TEXT NOT NULL,
    "employee_id" TEXT NOT NULL,
    "evaluation_period" TIMESTAMP(3) NOT NULL,
    "performance_score" DECIMAL(5,2) NOT NULL,
    "achievement_description" TEXT,
    "evaluator_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "employee_performance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compliance_tasks" (
    "id" TEXT NOT NULL,
    "hospital_id" TEXT NOT NULL,
    "task_name" TEXT NOT NULL,
    "description" TEXT,
    "department_id" TEXT,
    "assignee_id" TEXT,
    "due_date" TIMESTAMP(3) NOT NULL,
    "status" "ComplianceStatus" NOT NULL DEFAULT 'pending',
    "priority" "Priority" NOT NULL DEFAULT 'medium',
    "completion_date" TIMESTAMP(3),
    "completed_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "compliance_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "forecast_data" (
    "id" TEXT NOT NULL,
    "hospital_id" TEXT NOT NULL,
    "forecast_type" "ForecastType" NOT NULL,
    "period_date" TIMESTAMP(3) NOT NULL,
    "historical_value" DECIMAL(15,2),
    "forecast_value" DECIMAL(15,2),
    "confidence_lower" DECIMAL(15,2),
    "confidence_upper" DECIMAL(15,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "forecast_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_insights" (
    "id" TEXT NOT NULL,
    "hospital_id" TEXT NOT NULL,
    "insight_type" "InsightType" NOT NULL,
    "title" TEXT NOT NULL,
    "insight_text" TEXT NOT NULL,
    "generated_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ai_insights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hospital_equipment" (
    "id" TEXT NOT NULL,
    "hospital_id" TEXT NOT NULL,
    "department_id" TEXT,
    "equipment_name" TEXT NOT NULL,
    "equipment_type" TEXT,
    "serial_number" TEXT,
    "purchase_date" TIMESTAMP(3),
    "last_maintenance" TIMESTAMP(3),
    "next_maintenance_due" TIMESTAMP(3),
    "status" "EquipmentStatus" NOT NULL DEFAULT 'operational',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hospital_equipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee_training" (
    "id" TEXT NOT NULL,
    "employee_id" TEXT NOT NULL,
    "training_name" TEXT NOT NULL,
    "training_type" "TrainingType" NOT NULL,
    "training_date" TIMESTAMP(3) NOT NULL,
    "hours_completed" DECIMAL(4,1) NOT NULL,
    "certification_expires" TIMESTAMP(3),
    "trainer" TEXT,
    "training_status" "TrainingStatus" NOT NULL DEFAULT 'completed',
    "completion_score" DECIMAL(3,1),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "employee_training_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashboard_kpis" (
    "id" TEXT NOT NULL,
    "hospital_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "kpi_type" TEXT NOT NULL,
    "value" DECIMAL(15,2) NOT NULL,
    "trend" DECIMAL(5,2),
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dashboard_kpis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "employees_employee_id_key" ON "employees"("employee_id");

-- CreateIndex
CREATE UNIQUE INDEX "employees_email_key" ON "employees"("email");

-- CreateIndex
CREATE UNIQUE INDEX "monthly_financial_summary_hospital_id_month_year_key" ON "monthly_financial_summary"("hospital_id", "month_year");

-- CreateIndex
CREATE UNIQUE INDEX "patients_patient_id_key" ON "patients"("patient_id");

-- CreateIndex
CREATE UNIQUE INDEX "beds_hospital_id_bed_number_key" ON "beds"("hospital_id", "bed_number");

-- CreateIndex
CREATE UNIQUE INDEX "daily_bed_occupancy_hospital_id_date_department_id_key" ON "daily_bed_occupancy"("hospital_id", "date", "department_id");

-- CreateIndex
CREATE UNIQUE INDEX "hr_monthly_stats_hospital_id_month_year_key" ON "hr_monthly_stats"("hospital_id", "month_year");

-- CreateIndex
CREATE UNIQUE INDEX "department_staffing_hospital_id_department_id_key" ON "department_staffing"("hospital_id", "department_id");

-- CreateIndex
CREATE UNIQUE INDEX "forecast_data_hospital_id_forecast_type_period_date_key" ON "forecast_data"("hospital_id", "forecast_type", "period_date");

-- CreateIndex
CREATE UNIQUE INDEX "dashboard_kpis_hospital_id_date_kpi_type_key" ON "dashboard_kpis"("hospital_id", "date", "kpi_type");

-- AddForeignKey
ALTER TABLE "departments" ADD CONSTRAINT "departments_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "hospitals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "hospitals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial_transactions" ADD CONSTRAINT "financial_transactions_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "hospitals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial_transactions" ADD CONSTRAINT "financial_transactions_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial_transactions" ADD CONSTRAINT "financial_transactions_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monthly_financial_summary" ADD CONSTRAINT "monthly_financial_summary_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "hospitals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patients" ADD CONSTRAINT "patients_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "hospitals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_visits" ADD CONSTRAINT "patient_visits_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "hospitals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_visits" ADD CONSTRAINT "patient_visits_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_visits" ADD CONSTRAINT "patient_visits_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_visits" ADD CONSTRAINT "patient_visits_attending_physician_fkey" FOREIGN KEY ("attending_physician") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_visits" ADD CONSTRAINT "patient_visits_previous_visit_id_fkey" FOREIGN KEY ("previous_visit_id") REFERENCES "patient_visits"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "beds" ADD CONSTRAINT "beds_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "hospitals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "beds" ADD CONSTRAINT "beds_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "beds" ADD CONSTRAINT "beds_current_patient_id_fkey" FOREIGN KEY ("current_patient_id") REFERENCES "patients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_bed_occupancy" ADD CONSTRAINT "daily_bed_occupancy_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "hospitals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_bed_occupancy" ADD CONSTRAINT "daily_bed_occupancy_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hr_monthly_stats" ADD CONSTRAINT "hr_monthly_stats_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "hospitals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "department_staffing" ADD CONSTRAINT "department_staffing_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "hospitals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "department_staffing" ADD CONSTRAINT "department_staffing_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_performance" ADD CONSTRAINT "employee_performance_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_performance" ADD CONSTRAINT "employee_performance_evaluator_id_fkey" FOREIGN KEY ("evaluator_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compliance_tasks" ADD CONSTRAINT "compliance_tasks_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "hospitals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compliance_tasks" ADD CONSTRAINT "compliance_tasks_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compliance_tasks" ADD CONSTRAINT "compliance_tasks_assignee_id_fkey" FOREIGN KEY ("assignee_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compliance_tasks" ADD CONSTRAINT "compliance_tasks_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forecast_data" ADD CONSTRAINT "forecast_data_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "hospitals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_insights" ADD CONSTRAINT "ai_insights_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "hospitals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hospital_equipment" ADD CONSTRAINT "hospital_equipment_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "hospitals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hospital_equipment" ADD CONSTRAINT "hospital_equipment_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_training" ADD CONSTRAINT "employee_training_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dashboard_kpis" ADD CONSTRAINT "dashboard_kpis_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "hospitals"("id") ON DELETE CASCADE ON UPDATE CASCADE;
