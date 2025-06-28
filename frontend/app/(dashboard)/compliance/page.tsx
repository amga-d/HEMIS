"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Shield, AlertTriangle, CheckCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ComplianceTask {
  id: number;
  name: string;
  department: string;
  dueDate: string;
  status: string;
  priority: string;
  description: string;
  assignee: string;
}

export default function ComplianceManagement() {
  const [complianceTasks, setComplianceTasks] = useState<ComplianceTask[]>([]);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
        const hospitalId = process.env.NEXT_PUBLIC_HOSPITAL_ID || 'default';

        const response = await fetch(`${baseUrl}/api/compliance/tasks?hospitalId=${hospitalId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch compliance data');
        }

        const data = await response.json();
        setComplianceTasks(data);

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        setError(errorMessage);
        console.error('Compliance data fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <div className="p-8">Loading compliance data...</div>;
  if (error) return <div className="p-8">Error: {error}</div>;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-400" />
      case "overdue":
        return <AlertTriangle className="h-5 w-5 text-red-400" />
      case "due-soon":
        return <Clock className="h-5 w-5 text-yellow-400" />
      default:
        return <Clock className="h-5 w-5 text-blue-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-300"
      case "overdue":
        return "bg-red-500/20 text-red-300"
      case "due-soon":
        return "bg-yellow-500/20 text-yellow-300"
      case "in-progress":
        return "bg-blue-500/20 text-blue-300"
      default:
        return "bg-gray-500/20 text-gray-300"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/20 text-red-300"
      case "medium":
        return "bg-yellow-500/20 text-yellow-300"
      case "low":
        return "bg-green-500/20 text-green-300"
      default:
        return "bg-gray-500/20 text-gray-300"
    }
  }

  const filteredTasks = selectedFilter === "all" 
    ? complianceTasks 
    : complianceTasks.filter(task => task.status === selectedFilter);

  const statusCounts = {
    all: complianceTasks.length,
    overdue: complianceTasks.filter(task => task.status === "overdue").length,
    "due-soon": complianceTasks.filter(task => task.status === "due-soon").length,
    "in-progress": complianceTasks.filter(task => task.status === "in-progress").length,
    completed: complianceTasks.filter(task => task.status === "completed").length,
  }

  return (
    <div className="p-8">
      <Header title="Compliance Management" />

      {/* Status Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {Object.entries(statusCounts).map(([status, count]) => (
          <button
            key={status}
            onClick={() => setSelectedFilter(status)}
            className={`glass-panel p-4 text-center transition-all ${
              selectedFilter === status ? "ring-2 ring-blue-500" : ""
            }`}
          >
            <div className="text-2xl font-bold text-white">{count}</div>
            <div className="text-sm text-white/70 capitalize">
              {status.replace("-", " ")}
            </div>
          </button>
        ))}
      </div>

      {/* Compliance Tasks */}
      <div className="glass-panel">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Compliance Tasks
            {selectedFilter !== "all" && (
              <span className="text-sm text-white/70">
                ({selectedFilter.replace("-", " ")})
              </span>
            )}
          </h3>
          <Button className="glass-card border-white/20 text-white hover:bg-white/20">
            Add New Task
          </Button>
        </div>

        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <div key={task.id} className="bg-white/5 rounded-lg p-6 border border-white/10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  {getStatusIcon(task.status)}
                  <div>
                    <h4 className="text-lg font-semibold text-white">{task.name}</h4>
                    <p className="text-white/70">{task.department}</p>
                    <p className="text-sm text-white/50 mt-1">{task.description}</p>
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                    {task.status.replace("-", " ")}
                  </span>
                  <br />
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                    {task.priority} priority
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div>
                  <p className="text-white/70 text-sm">Assigned to: <span className="text-white">{task.assignee}</span></p>
                </div>
                <div>
                  <p className="text-white/70 text-sm">Due: <span className="text-white">{task.dueDate}</span></p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <Shield className="h-12 w-12 text-white/30 mx-auto mb-4" />
            <p className="text-white/70">No compliance tasks found for the selected filter.</p>
          </div>
        )}
      </div>
    </div>
  )
}
