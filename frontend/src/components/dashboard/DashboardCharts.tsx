
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell,
    BarChart, Bar, Legend,
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    LineChart, Line
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// --- Colors ---
const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#eab308'];
const STATUS_COLORS: Record<string, string> = {
    'OPEN': '#3b82f6', // blue
    'IN_PROGRESS': '#f59e0b', // amber
    'RESOLVED': '#10b981', // green
    'CLOSED': '#64748b', // slate
};
const PRIORITY_COLORS: Record<string, string> = {
    'LOW': '#94a3b8',
    'MEDIUM': '#60a5fa',
    'HIGH': '#f97316',
    'CRITICAL': '#ef4444',
};

// --- Components ---

export function IssueTrendsChart({ data }: { data: any[] }) {
    return (
        <Card className="col-span-1 lg:col-span-2 border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader>
                <CardTitle className="text-lg font-bold">Issue Trends (30 Days)</CardTitle>
                <CardDescription>Volume of created vs resolved issues</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="date" fontSize={12} stroke="#94a3b8" />
                        <YAxis fontSize={12} stroke="#94a3b8" />
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Area type="monotone" dataKey="created" stroke="#6366f1" fillOpacity={1} fill="url(#colorCreated)" />
                        <Area type="monotone" dataKey="resolved" stroke="#10b981" fillOpacity={1} fill="url(#colorResolved)" />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

export function PriorityDistributionChart({ data }: { data: any[] }) {
    return (
        <Card className="col-span-1 border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader>
                <CardTitle className="text-lg font-bold">Priority Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={PRIORITY_COLORS[entry.name] || COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

export function StatusDistributionChart({ data }: { data: any[] }) {
    return (
        <Card className="col-span-1 border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader>
                <CardTitle className="text-lg font-bold">Status Pipeline</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                        <XAxis type="number" fontSize={12} stroke="#94a3b8" />
                        <YAxis type="category" dataKey="name" fontSize={12} stroke="#94a3b8" width={80} />
                        <Tooltip cursor={{ fill: 'transparent' }} />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || COLORS[index % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

export function ReporterLeaderboardChart({ data }: { data: any[] }) {
    return (
        <Card className="col-span-1 border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader>
                <CardTitle className="text-lg font-bold">Top Reporters</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="name" fontSize={10} stroke="#94a3b8" interval={0} angle={-15} textAnchor="end" height={60} />
                        <YAxis fontSize={12} stroke="#94a3b8" />
                        <Tooltip cursor={{ fill: 'transparent' }} />
                        <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

export function ProjectHealthChart({ data }: { data: any[] }) {
    return (
        <Card className="col-span-1 border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader>
                <CardTitle className="text-lg font-bold">Project Health</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                        <PolarGrid stroke="#e2e8f0" />
                        <PolarAngleAxis dataKey="subject" fontSize={10} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} />
                        <Radar name="Completion Rate" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
                        <Radar name="Bug Density" dataKey="B" stroke="#ec4899" fill="#ec4899" fillOpacity={0.6} />
                        <Legend />
                        <Tooltip />
                    </RadarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

export function ResolutionTimeChart({ data }: { data: any[] }) {
    return (
        <Card className="col-span-1 border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader>
                <CardTitle className="text-lg font-bold">Avg Resolution Time (Days)</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="date" fontSize={12} stroke="#94a3b8" />
                        <YAxis fontSize={12} stroke="#94a3b8" />
                        <Tooltip />
                        <Line type="monotone" dataKey="days" stroke="#f97316" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
