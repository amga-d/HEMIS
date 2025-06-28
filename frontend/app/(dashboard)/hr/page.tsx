"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { KPICard } from "@/components/kpi-card"
import { Users, UserMinus, Star, GraduationCap, Award } from "lucide-react"
import { Bar, BarChart, Line, LineChart, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface StaffingData {
  department: string;
  current: number;
  required: number;
  avgPerformance: number;
}

interface HiringTrend {
  month: string;
  hires: number;
  departures: number;
}

interface TopPerformer {
  name: string;
  department: string;
  score: number;
  position: string;
  achievement: string;
}

interface HRKPIs {
  totalStaff: { value: number; trend: string };
  turnoverRate: { value: string; trend: string };
  satisfactionScore: { value: string; trend: string };
  avgTrainingHours: { value: string; trend: string };
}

export default function HRReport() {
  const [staffingData, setStaffingData] = useState<StaffingData[]>([]);
  const [hiringTrends, setHiringTrends] = useState<HiringTrend[]>([]);
  const [topPerformers, setTopPerformers] = useState<TopPerformer[]>([]);
  const [kpis, setKpis] = useState<HRKPIs>({
    totalStaff: { value: 0, trend: '0' },
    turnoverRate: { value: '0', trend: '0' },
    satisfactionScore: { value: '0', trend: '0' },
    avgTrainingHours: { value: '0', trend: '0' }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
        const hospitalId = process.env.NEXT_PUBLIC_HOSPITAL_ID || 'default';

        // Fetch all HR data in parallel
        const [staffingRes, trendsRes, performersRes, kpisRes] = await Promise.all([
          fetch(`${baseUrl}/api/hr/staffing?hospitalId=${hospitalId}`),
          fetch(`${baseUrl}/api/hr/hiring-trends?hospitalId=${hospitalId}`),
          fetch(`${baseUrl}/api/hr/top-performers?hospitalId=${hospitalId}&limit=4`),
          fetch(`${baseUrl}/api/hr/kpis?hospitalId=${hospitalId}`)
        ]);

        if (!staffingRes.ok || !trendsRes.ok || !performersRes.ok || !kpisRes.ok) {
          throw new Error('Failed to fetch HR data');
        }

        const [staffingData, trendsData, performersData, kpisData] = await Promise.all([
          staffingRes.json(),
          trendsRes.json(),
          performersRes.json(),
          kpisRes.json()
        ]);

        setStaffingData(staffingData);
        setHiringTrends(trendsData);
        setTopPerformers(performersData);
        setKpis(kpisData);

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        setError(errorMessage);
        console.error('HR data fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <div className="p-8">Loading HR data...</div>;
  if (error) return <div className="p-8">Error: {error}</div>;

  return (
    <div className="p-8">
      <Header title="HR Report" />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard 
          title="Total Staff" 
          value={kpis.totalStaff.value.toString()} 
          icon={Users} 
          trend={{ value: `${kpis.totalStaff.trend}%`, isPositive: parseFloat(kpis.totalStaff.trend) > 0 }} 
        />
        <KPICard 
          title="Turnover Rate" 
          value={`${kpis.turnoverRate.value}%`} 
          icon={UserMinus} 
          trend={{ value: `${kpis.turnoverRate.trend}%`, isPositive: parseFloat(kpis.turnoverRate.trend) < 0 }} 
        />
        <KPICard 
          title="Satisfaction Score" 
          value={`${kpis.satisfactionScore.value}/5`} 
          icon={Star} 
          trend={{ value: kpis.satisfactionScore.trend, isPositive: parseFloat(kpis.satisfactionScore.trend) > 0 }} 
        />
        <KPICard
          title="Avg Training Hours"
          value={`${kpis.avgTrainingHours.value}h`}
          icon={GraduationCap}
          trend={{ value: `${kpis.avgTrainingHours.trend}h`, isPositive: parseFloat(kpis.avgTrainingHours.trend) > 0 }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Staffing Levels */}
        <div className="glass-panel">
          <h3 className="text-xl font-semibold text-white mb-6">Department Staffing Levels</h3>
          <ChartContainer
            config={{
              current: { label: "Current Staff", color: "#3A86FF" },
              required: { label: "Required Staff", color: "#F59E0B" },
            }}
            className="h-80"
          >
            <BarChart data={staffingData}>
              <XAxis dataKey="department" stroke="#ffffff60" />
              <YAxis stroke="#ffffff60" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="current" fill="#3A86FF" radius={[4, 4, 0, 0]} />
              <Bar dataKey="required" fill="#F59E0B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </div>

        {/* Hiring Trends */}
        <div className="glass-panel">
          <h3 className="text-xl font-semibold text-white mb-6">Hiring Trends</h3>
          <ChartContainer
            config={{
              hires: { label: "New Hires", color: "#4CAF50" },
              departures: { label: "Departures", color: "#F44336" },
            }}
            className="h-80"
          >
            <LineChart data={hiringTrends}>
              <XAxis dataKey="month" stroke="#ffffff60" />
              <YAxis stroke="#ffffff60" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="hires" stroke="#4CAF50" strokeWidth={3} />
              <Line type="monotone" dataKey="departures" stroke="#F44336" strokeWidth={3} />
            </LineChart>
          </ChartContainer>
        </div>
      </div>

      {/* Top Performers */}
      <div className="glass-panel">
        <h3 className="text-xl font-semibold text-white mb-6">Top Performers</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {topPerformers.map((performer, index) => (
            <div key={index} className="bg-white/5 rounded-lg p-6 border border-white/10">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-white">{performer.name}</h4>
                  <p className="text-white/70">{performer.position}</p>
                  <p className="text-sm text-white/50">{performer.department}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-400">{performer.score}</div>
                  <div className="text-sm text-white/70">Score</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-yellow-400" />
                <span className="text-sm text-white/80">{performer.achievement}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
