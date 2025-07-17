"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { KPICard } from "@/components/kpi-card";
import { Users, DollarSign, Clock, RotateCcw, TrendingUp, AlertTriangle, Brain, AlertCircle } from "lucide-react";
import { Line, LineChart, Pie, PieChart, Cell, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

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

interface BudgetDetails {
  data: BudgetData[];
  allocated: number;
  used: number;
  usedPercentage: number;
  remaining: number;
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
  const [patientInflowData, setPatientInflowData] = useState<PatientInflowData[]>([]);
  const [budgetDetails, setBudgetDetails] = useState<BudgetDetails>({
    data: [],
    allocated: 0,
    used: 0,
    usedPercentage: 0,
    remaining: 0,
  });
  const [complianceAlerts, setComplianceAlerts] = useState<ComplianceAlert[]>([]);
  const [aiInsights, setAiInsights] = useState<string[]>([]);
  const [expandedInsights, setExpandedInsights] = useState<Set<number>>(new Set());
  const [kpis, setKpis] = useState<DashboardKPIs>({
    totalPatients: { value: 0, trend: "0" },
    revenue: { value: 0, trend: "0" },
    avgSessionTime: { value: "0 min", trend: "0" },
    readmissionRate: { value: "0%", trend: "0" },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const toggleInsightExpansion = (index: number) => {
    setExpandedInsights((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const truncateText = (text: string, maxLines: number = 2) => {
    const words = text.split(" ");
    const wordsPerLine = 12; // Approximate words per line
    const maxWords = maxLines * wordsPerLine;

    if (words.length <= maxWords) {
      return text;
    }

    return words.slice(0, maxWords).join(" ") + "...";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
        const hospitalId = process.env.NEXT_PUBLIC_HOSPITAL_ID || "default";

        // Fetch all dashboard data in parallel
        const [kpisRes, patientRes, budgetRes, complianceRes, insightsRes] = await Promise.all([
          fetch(`${baseUrl}/api/dashboard/kpis?hospitalId=${hospitalId}`, { credentials: "include" }),
          fetch(`${baseUrl}/api/dashboard/patient-inflow?hospitalId=${hospitalId}`, { credentials: "include" }),
          fetch(`${baseUrl}/api/dashboard/budget?hospitalId=${hospitalId}`, { credentials: "include" }),
          fetch(`${baseUrl}/api/compliance/alerts?hospitalId=${hospitalId}`, { credentials: "include" }),
          fetch(`${baseUrl}/api/dashboard/ai-insights?hospitalId=${hospitalId}`, { credentials: "include" }),
        ]);

        if (!kpisRes.ok || !patientRes.ok || !budgetRes.ok || !complianceRes.ok || !insightsRes.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const [kpisData, patientData, budgetData, complianceData, insightsData] = await Promise.all([kpisRes.json(), patientRes.json(), budgetRes.json(), complianceRes.json(), insightsRes.json()]);

        setKpis(kpisData);
        setPatientInflowData(patientData);
        setBudgetDetails(budgetData);
        setComplianceAlerts(complianceData);
        setAiInsights(insightsData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage);
        console.error("Dashboard data fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="glass-panel flex flex-col items-center justify-center py-16">
          <Spinner size="lg" className="mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Loading Dashboard</h2>
          <p className="text-white/70 text-center">Please wait while we fetch your data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="glass-panel max-w-md w-full">
          <Alert variant="destructive" className="bg-red-500/10 border-red-500/20">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="text-red-300">Error Loading Dashboard</AlertTitle>
            <AlertDescription className="text-red-200">{error}</AlertDescription>
          </Alert>
          <div className="mt-6 text-center">
            <button onClick={() => window.location.reload()} className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-colors">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <Header title="Dashboard" />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard title="Total Patients" value={kpis.totalPatients.value.toLocaleString()} icon={Users} trend={{ value: `${kpis.totalPatients.trend}%`, isPositive: parseFloat(kpis.totalPatients.trend) > 0 }} />
        <KPICard title="Revenue" value={`$${(kpis.revenue.value / 1000000).toFixed(1)}M`} icon={DollarSign} trend={{ value: `${kpis.revenue.trend}%`, isPositive: parseFloat(kpis.revenue.trend) > 0 }} />
        <KPICard title="Avg Session Time" value={kpis.avgSessionTime.value} icon={Clock} trend={{ value: `${kpis.avgSessionTime.trend}%`, isPositive: parseFloat(kpis.avgSessionTime.trend) > 0 }} />
        <KPICard title="Readmission Rate" value={kpis.readmissionRate.value} icon={RotateCcw} trend={{ value: `${kpis.readmissionRate.trend}%`, isPositive: parseFloat(kpis.readmissionRate.trend) < 0 }} />
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
                <Pie data={budgetDetails.data} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value">
                  {budgetDetails.data.map((entry: BudgetData, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-white">{budgetDetails.usedPercentage}%</p>
            <p className="text-white/70">Budget Utilized</p>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Allocated:</span>
                <span className="text-white">Rp.{budgetDetails.allocated.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Used:</span>
                <span className="text-white">Rp.{budgetDetails.used.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Remaining:</span>
                <span className="text-white">Rp.{budgetDetails.remaining.toLocaleString()}</span>
              </div>
            </div>
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
                    className={`px-3 py-1 rounded-full text-xs font-medium ${alert.status === "overdue" ? "bg-red-500/20 text-red-300" : alert.status === "due-soon" ? "bg-yellow-500/20 text-yellow-300" : "bg-green-500/20 text-green-300"}`}
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
            {aiInsights.map((insight, index) => {
              const isExpanded = expandedInsights.has(index);
              const displayText = isExpanded ? insight : truncateText(insight);
              const shouldShowReadMore = insight.split(" ").length > 24; // Show read more if more than ~2 lines

              return (
                <div key={index} className="flex items-start gap-3 p-4 rounded-xl bg-white/10">
                  <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-white/90 text-sm leading-relaxed">{displayText}</p>
                    {shouldShowReadMore && (
                      <button onClick={() => toggleInsightExpansion(index)} className="mt-2 text-blue-400 hover:text-blue-300 text-xs font-medium transition-colors">
                        {isExpanded ? "Show Less" : "Read More"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
