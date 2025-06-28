"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { KPICard } from "@/components/kpi-card"
import { useAuthRedirect } from "@/hooks/use-auth-redirect"
import { Users, DollarSign, Clock, RotateCcw, TrendingUp, AlertTriangle, Brain } from "lucide-react"
import { Line, LineChart, Pie, PieChart, Cell, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface PatientInflowData {
  month: string;
  patients: number;
  admissions: number;
}

interface BudgetData {
  name: string;
  value: number;
  color: string;
}

interface ComplianceAlert {
  id: number;
  task: string;
  department: string;
  status: string;
  dueDate: string;
}

interface DashboardKPIs {
  totalPatients: { value: number; trend: string };
  revenue: { value: number; trend: string };
  avgSessionTime: { value: string; trend: string };
  readmissionRate: { value: string; trend: string };
}

export default function Dashboard() {
  useAuthRedirect()

  const [patientInflowData, setPatientInflowData] = useState<PatientInflowData[]>([]);
  const [budgetData, setBudgetData] = useState<BudgetData[]>([]);
  const [complianceAlerts, setComplianceAlerts] = useState<ComplianceAlert[]>([]);
  const [aiInsights, setAiInsights] = useState<string[]>([]);
  const [kpis, setKpis] = useState<DashboardKPIs>({
    totalPatients: { value: 0, trend: '0' },
    revenue: { value: 0, trend: '0' },
    avgSessionTime: { value: '0 min', trend: '0' },
    readmissionRate: { value: '0%', trend: '0' }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
        const hospitalId = process.env.NEXT_PUBLIC_HOSPITAL_ID || 'default';

        // Fetch all dashboard data in parallel
        const [kpisRes, patientRes, budgetRes, complianceRes, insightsRes] = await Promise.all([
          fetch(`${baseUrl}/api/dashboard/kpis?hospitalId=${hospitalId}`),
          fetch(`${baseUrl}/api/dashboard/patient-inflow?hospitalId=${hospitalId}`),
          fetch(`${baseUrl}/api/dashboard/budget?hospitalId=${hospitalId}`),
          fetch(`${baseUrl}/api/compliance/alerts?hospitalId=${hospitalId}`),
          fetch(`${baseUrl}/api/dashboard/ai-insights?hospitalId=${hospitalId}`)
        ]);

        if (!kpisRes.ok || !patientRes.ok || !budgetRes.ok || !complianceRes.ok || !insightsRes.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const [kpisData, patientData, budgetData, complianceData, insightsData] = await Promise.all([
          kpisRes.json(),
          patientRes.json(),
          budgetRes.json(),
          complianceRes.json(),
          insightsRes.json()
        ]);

        setKpis(kpisData);
        setPatientInflowData(patientData);
        setBudgetData(budgetData);
        setComplianceAlerts(complianceData);
        setAiInsights(insightsData);

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        setError(errorMessage);
        console.error('Dashboard data fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <div className="p-8">Loading dashboard...</div>;
  if (error) return <div className="p-8">Error: {error}</div>;
  
  return (
    <div className="p-8">
      <Header title="Dashboard" />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard 
          title="Total Patients" 
          value={kpis.totalPatients.value.toLocaleString()} 
          icon={Users} 
          trend={{ value: `${kpis.totalPatients.trend}%`, isPositive: parseFloat(kpis.totalPatients.trend) > 0 }} 
        />
        <KPICard 
          title="Revenue" 
          value={`$${(kpis.revenue.value / 1000000).toFixed(1)}M`} 
          icon={DollarSign} 
          trend={{ value: `${kpis.revenue.trend}%`, isPositive: parseFloat(kpis.revenue.trend) > 0 }} 
        />
        <KPICard 
          title="Avg Session Time" 
          value={kpis.avgSessionTime.value} 
          icon={Clock} 
          trend={{ value: `${kpis.avgSessionTime.trend}%`, isPositive: parseFloat(kpis.avgSessionTime.trend) > 0 }} 
        />
        <KPICard 
          title="Readmission Rate" 
          value={kpis.readmissionRate.value} 
          icon={RotateCcw} 
          trend={{ value: `${kpis.readmissionRate.trend}%`, isPositive: parseFloat(kpis.readmissionRate.trend) < 0 }} 
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Patient Inflow Chart */}
        <div className="lg:col-span-2 glass-panel">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Patient Inflow
          </h3>
          <ChartContainer
            config={{
              patients: { label: "Total Patients", color: "#3A86FF" },
              admissions: { label: "Admissions", color: "#4CAF50" },
            }}
            className="h-80"
          >
            <LineChart data={patientInflowData}>
              <XAxis dataKey="month" stroke="#ffffff60" />
              <YAxis stroke="#ffffff60" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="patients" stroke="#3A86FF" strokeWidth={3} />
              <Line type="monotone" dataKey="admissions" stroke="#4CAF50" strokeWidth={3} />
            </LineChart>
          </ChartContainer>
        </div>

        {/* Budget Usage */}
        <div className="glass-panel">
          <h3 className="text-xl font-semibold text-white mb-6">Budget Usage</h3>
          <div className="flex items-center justify-center h-64">
            <ChartContainer
              config={{
                used: { label: "Used", color: "#3A86FF" },
                remaining: { label: "Remaining", color: "#E5E7EB" },
              }}
              className="h-full w-full"
            >
              <PieChart>
                <Pie data={budgetData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value">
                  {budgetData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-white">68%</p>
            <p className="text-white/70">Budget Utilized</p>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Compliance Alerts */}
        <div className="glass-panel">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Compliance Alerts
          </h3>
          <div className="space-y-4">
            {complianceAlerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-4 rounded-xl bg-white/10">
                <div>
                  <p className="text-white font-medium">{alert.task}</p>
                  <p className="text-white/70 text-sm">{alert.department}</p>
                </div>
                <div className="text-right">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      alert.status === "overdue"
                        ? "bg-red-500/20 text-red-300"
                        : alert.status === "due-soon"
                          ? "bg-yellow-500/20 text-yellow-300"
                          : "bg-green-500/20 text-green-300"
                    }`}
                  >
                    {alert.status.replace("-", " ")}
                  </span>
                  <p className="text-white/70 text-xs mt-1">{alert.dueDate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Assistant */}
        <div className="glass-panel">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Assistant Insights
          </h3>
          <div className="space-y-4">
            {aiInsights.map((insight, index) => (
              <div key={index} className="flex items-start gap-3 p-4 rounded-xl bg-white/10">
                <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0"></div>
                <p className="text-white/90 text-sm leading-relaxed">{insight}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
