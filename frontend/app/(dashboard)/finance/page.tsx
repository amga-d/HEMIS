"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { KPICard } from "@/components/kpi-card"
import { DollarSign, TrendingDown, TrendingUp, AlertCircle, Calendar } from "lucide-react"
import { Bar, Line, XAxis, YAxis, ComposedChart } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  department: string;
  createdBy: string;
}

interface ChartData {
  month: string;
  revenue: number;
  profit: number;
  costs: number;
}

interface KPIData {
  totalRevenue: { value: number; trend: string };
  totalCosts: { value: number; trend: string };
  netProfit: { value: number; trend: string };
  budgetVariance: { value: number; trend: string };
}

export default function FinanceReport() {
  const [revenueData, setRevenueData] = useState<ChartData[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [kpis, setKpis] = useState<KPIData>({
    totalRevenue: { value: 0, trend: '0' },
    totalCosts: { value: 0, trend: '0' },
    netProfit: { value: 0, trend: '0' },
    budgetVariance: { value: 0, trend: '0' }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
        const hospitalId = process.env.NEXT_PUBLIC_HOSPITAL_ID || 'default';
        
        // Fetch financial summary for chart
        const summaryRes = await fetch(`${baseUrl}/api/finance/summary?hospitalId=${hospitalId}`);
        if (!summaryRes.ok) throw new Error('Failed to fetch summary data');
        const summaryData = await summaryRes.json();
        
        // Transform data for the chart
        const transformedData: ChartData[] = summaryData.map((item: any) => ({
          month: new Date(item.monthYear).toLocaleString('default', { month: 'short' }),
          revenue: parseFloat(item.totalRevenue) / 1000000, // Convert to millions
          profit: parseFloat(item.netProfit) / 1000000,
          costs: parseFloat(item.totalCosts) / 1000000
        }));
        setRevenueData(transformedData);
        
        // Fetch transactions
        const transRes = await fetch(`${baseUrl}/api/finance/transactions?hospitalId=${hospitalId}&limit=10`);
        if (!transRes.ok) throw new Error('Failed to fetch transactions');
        const transData: Transaction[] = await transRes.json();
        setTransactions(transData);
        
        // Fetch KPIs
        const kpiRes = await fetch(`${baseUrl}/api/finance/kpis?hospitalId=${hospitalId}`);
        if (!kpiRes.ok) throw new Error('Failed to fetch KPIs');
        const kpiData: KPIData = await kpiRes.json();
        setKpis(kpiData);
        
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        setError(errorMessage);
        console.error('Finance data fetch error:', err);
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
          <h2 className="text-xl font-semibold text-white mb-2">Loading Finance Data</h2>
          <p className="text-white/70 text-center">Please wait while we fetch your financial information...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="glass-panel max-w-md w-full">
          <Alert variant="destructive" className="bg-red-500/10 border-red-500/20">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="text-red-300">Error Loading Finance Data</AlertTitle>
            <AlertDescription className="text-red-200">
              {error}
            </AlertDescription>
          </Alert>
          <div className="mt-6 text-center">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="p-8">
      <Header title="Finance Report">
        <Button className="glass-card border-white/20 text-white hover:bg-white/20">
          <Calendar className="h-4 w-4 mr-2" />
          Last 6 Months
        </Button>
      </Header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard 
          title="Total Revenue" 
          value={`$${(kpis.totalRevenue.value / 1000000).toFixed(1)}M`} 
          icon={DollarSign} 
          trend={{ value: `${kpis.totalRevenue.trend}%`, isPositive: parseFloat(kpis.totalRevenue.trend) > 0 }} 
        />
        <KPICard
          title="Operational Costs"
          value={`$${(kpis.totalCosts.value / 1000000).toFixed(1)}M`}
          icon={TrendingDown}
          trend={{ value: `${kpis.totalCosts.trend}%`, isPositive: parseFloat(kpis.totalCosts.trend) < 0 }}
        />
        <KPICard 
          title="Net Profit" 
          value={`$${(kpis.netProfit.value / 1000000).toFixed(1)}M`} 
          icon={TrendingUp} 
          trend={{ value: `${kpis.netProfit.trend}%`, isPositive: parseFloat(kpis.netProfit.trend) > 0 }} 
        />
        <KPICard 
          title="Budget Variance" 
          value={`$${(kpis.budgetVariance.value / 1000).toFixed(0)}K`} 
          icon={AlertCircle} 
          trend={{ value: `${kpis.budgetVariance.trend}%`, isPositive: parseFloat(kpis.budgetVariance.trend) > 0 }} 
        />
      </div>

      {/* Revenue vs Profit Chart */}
      <div className="glass-panel mb-8">
        <h3 className="text-xl font-semibold text-white mb-6">Revenue vs Profit Analysis</h3>
        <ChartContainer
          config={{
            revenue: { label: "Revenue", color: "#3A86FF" },
            profit: { label: "Net Profit", color: "#4CAF50" },
            costs: { label: "Costs", color: "#F44336" },
          }}
          className="h-96"
        >
          <ComposedChart data={revenueData}>
            <XAxis dataKey="month" stroke="#ffffff60" />
            <YAxis stroke="#ffffff60" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="revenue" fill="#3A86FF" radius={[4, 4, 0, 0]} />
            <Line type="monotone" dataKey="profit" stroke="#4CAF50" strokeWidth={3} />
          </ComposedChart>
        </ChartContainer>
      </div>

      {/* Transactions Table */}
      <div className="glass-panel">
        <h3 className="text-xl font-semibold text-white mb-6">Recent Transactions</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left text-white/70 font-medium py-3">Date</th>
                <th className="text-left text-white/70 font-medium py-3">Description</th>
                <th className="text-left text-white/70 font-medium py-3">Category</th>
                <th className="text-left text-white/70 font-medium py-3">Department</th>
                <th className="text-right text-white/70 font-medium py-3">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-b border-white/10">
                  <td className="text-white/90 py-4">{transaction.date}</td>
                  <td className="text-white py-4 font-medium">{transaction.description}</td>
                  <td className="py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        transaction.category === "REVENUE"
                          ? "bg-green-500/20 text-green-300"
                          : transaction.category === "CAPITAL"
                            ? "bg-blue-500/20 text-blue-300"
                            : "bg-orange-500/20 text-orange-300"
                      }`}
                    >
                      {transaction.category}
                    </span>
                  </td>
                  <td className="text-white/70 py-4">{transaction.department}</td>
                  <td
                    className={`text-right py-4 font-bold ${
                      transaction.amount > 0 ? "text-green-300" : "text-red-300"
                    }`}
                  >
                    ${Math.abs(transaction.amount).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
