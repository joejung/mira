import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
    Activity, 
    AlertCircle, 
    CheckCircle2, 
    Clock, 
    Cpu, 
    TrendingUp, 
    Users 
} from "lucide-react";

interface Issue {
    id: number;
    title: string;
    status: string;
    priority: string;
    chipset: string;
    project: { name: string };
    updatedAt: string;
}

export default function Dashboard() {
    const [stats, setStats] = useState({
        totalIssues: 0,
        criticalIssues: 0,
        resolvedIssues: 0,
        activeChipsets: 0
    });
    const [recentActivity, setRecentActivity] = useState<Issue[]>([]);
    const [chipsetStats, setChipsetStats] = useState<{name: string, count: number}[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // In a real app we might have a dedicated dashboard endpoint, 
                // but for now we can calculate from all issues
                const response = await fetch('http://localhost:5000/api/issues');
                if (response.ok) {
                    const issues: Issue[] = await response.json();
                    
                    // Calculate basic stats
                    const uniqueChipsets = new Set(issues.map(i => i.chipset)).size;
                    
                    setStats({
                        totalIssues: issues.length,
                        criticalIssues: issues.filter(i => i.priority === 'CRITICAL').length,
                        resolvedIssues: issues.filter(i => i.status === 'RESOLVED' || i.status === 'CLOSED').length,
                        activeChipsets: uniqueChipsets
                    });

                    // Recent activity (latest 5)
                    setRecentActivity([...issues]
                        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                        .slice(0, 5));

                    // Chipset distribution
                    const chipCounts: Record<string, number> = {};
                    issues.forEach(i => {
                        chipCounts[i.chipset] = (chipCounts[i.chipset] || 0) + 1;
                    });
                    setChipsetStats(Object.entries(chipCounts)
                        .map(([name, count]) => ({ name, count }))
                        .sort((a, b) => b.count - a.count)
                        .slice(0, 4)); // Top 4
                }
            } catch (error) {
                console.error("Failed to load dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="p-8 text-center text-slate-500">Loading dashboard analytics...</div>;
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Executive Dashboard</h1>
                <p className="text-slate-500 text-sm mt-1">Real-time overview of chipset development and issue tracking.</p>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard 
                    title="Total Issues" 
                    value={stats.totalIssues} 
                    icon={<Activity className="text-indigo-600" size={24} />}
                    trend="+12% from last week"
                />
                <StatCard 
                    title="Critical Bugs" 
                    value={stats.criticalIssues} 
                    icon={<AlertCircle className="text-rose-600" size={24} />}
                    trend="-2 since yesterday"
                    trendPositive
                />
                <StatCard 
                    title="Resolved" 
                    value={stats.resolvedIssues} 
                    icon={<CheckCircle2 className="text-green-600" size={24} />}
                    trend="84% success rate"
                />
                <StatCard 
                    title="Active Chipsets" 
                    value={stats.activeChipsets} 
                    icon={<Cpu className="text-blue-600" size={24} />}
                    trend="Across 3 projects"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chipset Distribution */}
                <Card className="col-span-1 lg:col-span-2 border-slate-200 dark:border-slate-800 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold">Chipset Issue Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {chipsetStats.map((stat, i) => (
                                <div key={stat.name} className="space-y-2">
                                    <div className="flex items-center justify-between text-sm font-medium">
                                        <div className="flex items-center gap-2">
                                            <Cpu size={16} className="text-slate-400" />
                                            <span>{stat.name}</span>
                                        </div>
                                        <span className="text-slate-500">{stat.count} issues</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full ${['bg-indigo-500', 'bg-blue-500', 'bg-violet-500', 'bg-purple-500'][i % 4]}`} 
                                            style={{ width: `${(stat.count / stats.totalIssues) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity Feed */}
                <Card className="col-span-1 border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto pr-2">
                        <div className="space-y-6">
                            {recentActivity.map(issue => (
                                <div key={issue.id} className="flex gap-4 items-start">
                                    <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${
                                        issue.priority === 'CRITICAL' ? 'bg-rose-500' : 'bg-indigo-500'
                                    }`} />
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium line-clamp-2 leading-tight">
                                            {issue.title}
                                        </p>
                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                            <span>MIRA-{issue.id}</span>
                                            <span>•</span>
                                            <span className="truncate max-w-[100px]">{issue.project?.name}</span>
                                            <span>•</span>
                                            <span className="capitalize">{issue.status.toLowerCase().replace('_', ' ')}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, trend, trendPositive }: any) {
    return (
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{title}</p>
                        <div className="text-3xl font-bold mt-2">{value}</div>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                        {icon}
                    </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs">
                    <TrendingUp size={14} className={trendPositive ? "text-green-500" : "text-slate-400"} />
                    <span className="text-slate-500 font-medium">{trend}</span>
                </div>
            </CardContent>
        </Card>
    );
}
