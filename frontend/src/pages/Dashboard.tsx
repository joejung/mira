import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
    Activity, 
    AlertCircle, 
    CheckCircle2,  
    Cpu, 
    TrendingUp,
    Download,
    RefreshCw
} from "lucide-react";

import { 
    IssueTrendsChart, 
    PriorityDistributionChart, 
    StatusDistributionChart, 
    ReporterLeaderboardChart,
    ProjectHealthChart,
    ResolutionTimeChart
} from "@/components/dashboard/DashboardCharts";

import { 
    StaleIssuesTable, 
    TopAssigneesTable, 
    CriticalEscalationsList, 
    ChipsetReliabilityGrid 
} from "@/components/dashboard/DashboardTables";

import { Card, CardContent } from "@/components/ui/card";
import { API_BASE_URL } from "@/config";

interface Issue {
    id: number;
    title: string;
    description: string;
    status: string;
    priority: string;
    chipset: string;
    project: { name: string };
    reporter: { name: string; id?: number };
    assignee?: { name: string; role?: string; id?: number };
    createdAt: string;
    updatedAt: string;
}

export default function Dashboard() {
    const [loading, setLoading] = useState(true);
    
    // Derived Stats
    const [stats, setStats] = useState({
        totalIssues: 0,
        criticalIssues: 0,
        resolvedIssues: 0,
        activeChipsets: 0,
        velocity: 0,
        bounceRate: 0
    });

    // Chart Data
    const [trendsData, setTrendsData] = useState<any[]>([]);
    const [priorityData, setPriorityData] = useState<any[]>([]);
    const [statusData, setStatusData] = useState<any[]>([]);
    const [reporterData, setReporterData] = useState<any[]>([]);
    const [healthData, setHealthData] = useState<any[]>([]);
    const [resolutionData, setResolutionData] = useState<any[]>([]);

    // Table Data
    const [staleIssues, setStaleIssues] = useState<Issue[]>([]);
    const [topAssignees, setTopAssignees] = useState<any[]>([]);
    const [criticalEscalations, setCriticalEscalations] = useState<Issue[]>([]);
    const [chipsetReliability, setChipsetReliability] = useState<any[]>([]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/issues`);
            if (!response.ok) throw new Error('Failed to fetch data');
            
            const issues: Issue[] = await response.json();
            processData(issues);
        } catch (error) {
            console.error("Failed to load dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    const processData = (issues: Issue[]) => {
        // --- 1. Basic KPI Stats ---
        const total = issues.length;
        const critical = issues.filter(i => i.priority === 'CRITICAL').length;
        const resolved = issues.filter(i => i.status === 'RESOLVED' || i.status === 'CLOSED').length;
        const uniqueChipsets = new Set(issues.filter(i => i.chipset).map(i => i.chipset)).size;
        
        // Mock Velocity (issues resolved in last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const velocity = issues.filter(i => 
            (i.status === 'RESOLVED' || i.status === 'CLOSED') && 
            new Date(i.updatedAt) > sevenDaysAgo
        ).length;

        setStats({
            totalIssues: total,
            criticalIssues: critical,
            resolvedIssues: resolved,
            activeChipsets: uniqueChipsets,
            velocity: velocity,
            bounceRate: 12 // Mocked for now (would need history log)
        });

        // --- 2. Trends Chart (Area) ---
        // Group by date (last 7 days for demo, usually 30)
        const dateMap: Record<string, {created: number, resolved: number}> = {};
        issues.forEach(i => {
            const date = new Date(i.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            if (!dateMap[date]) dateMap[date] = { created: 0, resolved: 0 };
            dateMap[date].created++;
            
            if (i.status === 'RESOLVED' || i.status === 'CLOSED') {
                 const resolveDate = new Date(i.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                 if (!dateMap[resolveDate]) dateMap[resolveDate] = { created: 0, resolved: 0 };
                 dateMap[resolveDate].resolved++;
            }
        });
        setTrendsData(Object.keys(dateMap).slice(-10).map(k => ({ date: k, ...dateMap[k] })));

        // --- 3. Priority Distribution (Pie) ---
        const prioCounts: Record<string, number> = {};
        issues.forEach(i => prioCounts[i.priority] = (prioCounts[i.priority] || 0) + 1);
        setPriorityData(Object.keys(prioCounts).map(k => ({ name: k, value: prioCounts[k] })));

        // --- 4. Status Distribution (Bar) ---
        const statusCounts: Record<string, number> = {};
        issues.forEach(i => statusCounts[i.status] = (statusCounts[i.status] || 0) + 1);
        setStatusData(Object.keys(statusCounts).map(k => ({ name: k, value: statusCounts[k] })));

        // --- 5. Reporter Leaderboard (Bar) ---
        const reporterCounts: Record<string, number> = {};
        issues.forEach(i => {
            const name = i.reporter.name;
            reporterCounts[name] = (reporterCounts[name] || 0) + 1;
        });
        setReporterData(Object.entries(reporterCounts)
            .sort((a,b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name, count]) => ({ name, count })));

        // --- 6. Stale Issues (Table) ---
        const fourteenDaysAgo = new Date();
        fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
        setStaleIssues(issues.filter(i => 
            i.status !== 'CLOSED' && 
            i.status !== 'RESOLVED' && 
            new Date(i.updatedAt) < fourteenDaysAgo
        ).slice(0, 5));

        // --- 7. Critical Escalations (List) ---
        setCriticalEscalations(issues.filter(i => 
            i.priority === 'CRITICAL' && 
            (i.status === 'OPEN' || i.status === 'IN_PROGRESS')
        ).slice(0, 5));

        // --- 8. Top Assignees (Table) ---
        // Mock roles for demo
        const assigneeMap: Record<string, number> = {};
        issues.forEach(i => {
            if (i.assignee) {
                assigneeMap[i.assignee.name] = (assigneeMap[i.assignee.name] || 0) + 1;
            }
        });
        setTopAssignees(Object.entries(assigneeMap)
            .sort((a,b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name, count]) => ({ name, role: 'Developer', count, id: name })));

        // --- 9. Chipset Reliability (Grid) ---
        const chipsetMap: Record<string, {count: number, errors: number}> = {};
        issues.forEach(i => {
            const chip = i.chipset || 'Unknown';
            if (!chipsetMap[chip]) chipsetMap[chip] = { count: 0, errors: 0 };
            chipsetMap[chip].count++;
            // Assume critical/high are "errors" for this metric
            if (i.priority === 'CRITICAL' || i.priority === 'HIGH') chipsetMap[chip].errors++;
        });
        setChipsetReliability(Object.entries(chipsetMap).map(([name, val]) => ({
            name,
            issueCount: val.count,
            errorRate: Math.round((val.errors / val.count) * 100)
        })).slice(0, 8));
        
        // --- 10. Project Health (Radar) ---
        // Mock data logic to show interesting shapes
        setHealthData([
            { subject: 'Bug Density', A: 80, B: 110, fullMark: 150 },
            { subject: 'Velocity', A: 98, B: 130, fullMark: 150 },
            { subject: 'Uptime', A: 86, B: 130, fullMark: 150 },
            { subject: 'Code Quality', A: 99, B: 100, fullMark: 150 },
            { subject: 'Security', A: 85, B: 90, fullMark: 150 },
            { subject: 'UX Score', A: 65, B: 85, fullMark: 150 },
        ]);

        // --- 11. Resolution Time (Line) ---
        // Mock trend
        setResolutionData([
            { date: 'Mon', days: 2.4 },
            { date: 'Tue', days: 2.1 },
            { date: 'Wed', days: 3.5 }, // spike
            { date: 'Thu', days: 2.8 },
            { date: 'Fri', days: 1.9 },
            { date: 'Sat', days: 1.5 },
            { date: 'Sun', days: 1.2 },
        ]);
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return <div className="p-8 text-center text-slate-500 animate-pulse">Loading analytics engine...</div>;
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Executive Dashboard</h1>
                    <p className="text-slate-500 text-sm mt-1">Real-time command center for chipset development.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-9 gap-2" onClick={fetchData}>
                        <RefreshCw size={14} /> Refresh
                    </Button>
                    <Button className="h-9 gap-2 bg-indigo-600 hover:bg-indigo-700">
                        <Download size={14} /> Export Report
                    </Button>
                </div>
            </div>

            {/* 1. Key Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                <StatCard title="Total Issues" value={stats.totalIssues} icon={<Activity />} trend="+12%" color="indigo" />
                <StatCard title="Critical" value={stats.criticalIssues} icon={<AlertCircle />} trend="-2" color="rose" />
                <StatCard title="Resolved" value={stats.resolvedIssues} icon={<CheckCircle2 />} trend="85%" color="emerald" />
                <StatCard title="Velocity" value={stats.velocity} icon={<TrendingUp />} trend="Issues/Wk" color="blue" />
                <StatCard title="Bounce Rate" value={`${stats.bounceRate}%`} icon={<RefreshCw />} trend="Stable" color="orange" />
                <StatCard title="Chipsets" value={stats.activeChipsets} icon={<Cpu />} trend="Active" color="violet" />
            </div>

            {/* 2. Main Charts Row (Area + Pie) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <IssueTrendsChart data={trendsData} />
                <PriorityDistributionChart data={priorityData} />
            </div>

            {/* 3. Secondary Charts Row (Bar + Radar) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <StatusDistributionChart data={statusData} />
                <ReporterLeaderboardChart data={reporterData} />
                <ProjectHealthChart data={healthData} />
            </div>

            {/* 4. Tables Row (Stale + Critical) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <StaleIssuesTable issues={staleIssues} />
                <CriticalEscalationsList issues={criticalEscalations} />
            </div>

            {/* 5. Bottom Row (Assignees + Chipsets + Trends) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <ResolutionTimeChart data={resolutionData} />
                <TopAssigneesTable assignees={topAssignees} />
                <div className="lg:col-span-2">
                     <ChipsetReliabilityGrid chipsets={chipsetReliability} />
                </div>
            </div>
        </div>
    );
}

// Simple Stat Card Component
function StatCard({ title, value, icon, trend, color }: any) {
    const colors: Record<string, string> = {
        indigo: "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20",
        rose: "text-rose-600 bg-rose-50 dark:bg-rose-900/20",
        emerald: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20",
        blue: "text-blue-600 bg-blue-50 dark:bg-blue-900/20",
        orange: "text-orange-600 bg-orange-50 dark:bg-orange-900/20",
        violet: "text-violet-600 bg-violet-50 dark:bg-violet-900/20",
    };
    
    return (
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-default">
            <CardContent className="p-5">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</p>
                        <div className="text-2xl font-bold mt-1 text-slate-900 dark:text-slate-100">{value}</div>
                    </div>
                    <div className={`p-2.5 rounded-xl ${colors[color]}`}>
                        {React.cloneElement(icon, { size: 20 })}
                    </div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs">
                     <span className="font-medium text-slate-500">{trend}</span>
                </div>
            </CardContent>
        </Card>
    );
}

import React from "react";
