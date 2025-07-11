"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { Brain, BarChart3, AlertCircle } from "lucide-react";
import { Line, XAxis, YAxis, Area, AreaChart } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface ForecastModel {
  id: string;
  name: string;
}

interface ForecastData {
  month: string;
  historical: number | null;
  forecast: number | null;
  confidence: { lower: number; upper: number } | null;
}

interface AIInsight {
  id: number;
  title: string;
  description: string;
  impact: string;
  category: string;
}

const forecastModels: ForecastModel[] = [
  { id: "patient-inflow", name: "Patient Inflow Forecast" },
  { id: "financial", name: "Financial Forecast" },
  { id: "bed-occupancy", name: "Bed Occupancy Forecast" },
];

export default function Analytics() {
  const [selectedModel, setSelectedModel] = useState("patient-inflow");
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
        const hospitalId = process.env.NEXT_PUBLIC_HOSPITAL_ID || "default";

        // Fetch forecast data and insights in parallel
        const [forecastRes, insightsRes] = await Promise.all([fetch(`${baseUrl}/api/analytics/forecast/${selectedModel}?hospitalId=${hospitalId}`), fetch(`${baseUrl}/api/analytics/insights/optimization?hospitalId=${hospitalId}`)]);

        if (!forecastRes.ok || !insightsRes.ok) {
          throw new Error("Failed to fetch analytics data");
        }

        const [forecastData, insightsData] = await Promise.all([forecastRes.json(), insightsRes.json()]);

        setForecastData(forecastData);
        setInsights(insightsData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage);
        console.error("Analytics data fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedModel]);

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="glass-panel flex flex-col items-center justify-center py-16">
          <Spinner size="lg" className="mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Loading Analytics</h2>
          <p className="text-white/70 text-center">Please wait while we fetch your analytics data...</p>
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
            <AlertTitle className="text-red-300">Error Loading Analytics</AlertTitle>
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

  const formatValue = (value: number | null): string => {
    if (value === null) return "";

    if (selectedModel === "financial") {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (selectedModel === "bed-occupancy") {
      return `${value}%`;
    } else {
      return value.toLocaleString();
    }
  };

  return (
    <div className="p-8">
      <Header title="Analytics & Forecasting" />

      {/* Model Selection */}
      <div className="glass-panel mb-8">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Forecast Models
        </h3>
        <div className="flex flex-wrap gap-4">
          {forecastModels.map((model) => (
            <Button
              key={model.id}
              onClick={() => setSelectedModel(model.id)}
              variant={selectedModel === model.id ? "default" : "outline"}
              className={`${selectedModel === model.id ? "bg-blue-600 text-white" : "glass-card border-white/20 text-white hover:bg-white/10"}`}
            >
              {model.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Forecast Chart */}
      <div className="glass-panel mb-8">
        <h3 className="text-xl font-semibold text-white mb-6">{forecastModels.find((m) => m.id === selectedModel)?.name}</h3>
        <ChartContainer
          config={{
            historical: { label: "Historical Data", color: "#3A86FF" },
            forecast: { label: "Forecast", color: "#F59E0B" },
            confidence: { label: "Confidence Interval", color: "#10B981" },
          }}
          className="h-96"
        >
          <AreaChart data={forecastData}>
            <XAxis dataKey="month" stroke="#ffffff" />
            <YAxis stroke="#ffffff" />
            <ChartTooltip content={<ChartTooltipContent />} formatter={(value: any, name: string) => [formatValue(value), name]} />

            {/* Confidence interval area */}
            <Area dataKey="confidence.upper" stackId="1" stroke="none" fill="#10B981" fillOpacity={0.2} />
            <Area dataKey="confidence.lower" stackId="1" stroke="none" fill="#ffffff" fillOpacity={0} />

            {/* Historical and forecast lines */}
            <Line type="monotone" dataKey="historical" stroke="#3A86FF" strokeWidth={3} dot={{ fill: "#3A86FF", strokeWidth: 2, r: 4 }} connectNulls={false} />
            <Line type="monotone" dataKey="forecast" stroke="#F59E0B" strokeWidth={3} strokeDasharray="5 5" dot={{ fill: "#F59E0B", strokeWidth: 2, r: 4 }} connectNulls={false} />
          </AreaChart>
        </ChartContainer>
      </div>

      {/* AI Insights */}
      <div className="glass-panel">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <Brain className="h-5 w-5" />
          AI-Powered Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {insights.map((insight) => (
            <div key={insight.id} className="bg-white/5 rounded-lg p-6 border border-white/10">
              <div className="flex items-start justify-between mb-4">
                <h4 className="text-lg font-semibold text-white">{insight.title}</h4>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${insight.impact === "High" ? "bg-red-500/20 text-red-300" : insight.impact === "Medium" ? "bg-yellow-500/20 text-yellow-300" : "bg-green-500/20 text-green-300"}`}
                >
                  {insight.impact} Impact
                </span>
              </div>
              <p className="text-white/80 mb-3">{insight.description}</p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/60 bg-white/10 px-2 py-1 rounded">{insight.category}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
