
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertTriangle, Clock, Activity, CheckCircle2 } from "lucide-react";

// --- Components ---

export function StaleIssuesTable({ issues }: { issues: any[] }) {
    return (
        <Card className="col-span-1 lg:col-span-2 border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-lg font-bold">Stale Issues</CardTitle>
                    <CardDescription>Issues with no activity for &gt; 14 days</CardDescription>
                </div>
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Attention Needed</Badge>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900/50">
                            <tr>
                                <th className="px-6 py-3">ID</th>
                                <th className="px-6 py-3">Title</th>
                                <th className="px-6 py-3">Assignee</th>
                                <th className="px-6 py-3">Last Update</th>
                                <th className="px-6 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {issues.map((issue) => (
                                <tr key={issue.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-200">MIRA-{issue.id}</td>
                                    <td className="px-6 py-4 truncate max-w-[200px]">{issue.title}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Avatar className="w-6 h-6">
                                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${issue.assignee?.name || 'Unassigned'}`} />
                                                <AvatarFallback>UN</AvatarFallback>
                                            </Avatar>
                                            <span>{issue.assignee?.name || 'Unassigned'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">{new Date(issue.updatedAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        <Badge variant="secondary" className="text-[10px]">{issue.status.replace('_', ' ')}</Badge>
                                    </td>
                                </tr>
                            ))}
                            {issues.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                        <CheckCircle2 className="mx-auto h-8 w-8 text-green-500 mb-2" />
                                        No stale issues found. Great job!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}

export function TopAssigneesTable({ assignees }: { assignees: any[] }) {
    return (
        <Card className="col-span-1 border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader>
                <CardTitle className="text-lg font-bold">Top Solvers</CardTitle>
                <CardDescription>Most issues resolved this month</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {assignees.map((assignee, index) => (
                    <div key={assignee.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                                index === 0 ? 'bg-yellow-100 text-yellow-700' : 
                                index === 1 ? 'bg-slate-200 text-slate-700' :
                                index === 2 ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-500'
                            }`}>
                                {index + 1}
                            </div>
                            <Avatar className="w-8 h-8">
                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${assignee.name}`} />
                                <AvatarFallback>{assignee.name.substring(0,2)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="font-medium text-sm">{assignee.name}</div>
                                <div className="text-xs text-slate-500">{assignee.role}</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="font-bold text-indigo-600">{assignee.count}</div>
                            <div className="text-[10px] text-slate-400 uppercase">Resolved</div>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

export function CriticalEscalationsList({ issues }: { issues: any[] }) {
    return (
        <Card className="col-span-1 border-slate-200 dark:border-slate-800 shadow-sm border-l-4 border-l-red-500">
            <CardHeader>
                <CardTitle className="text-lg font-bold text-red-600 flex items-center gap-2">
                    <AlertTriangle size={20} />
                    Critical Escalations
                </CardTitle>
                <CardDescription>Open CRITICAL issues needing immediate action</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {issues.map((issue) => (
                    <div key={issue.id} className="p-3 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-100 dark:border-red-900/20">
                        <div className="flex justify-between items-start mb-2">
                             <Badge className="bg-red-200 text-red-800 hover:bg-red-300 border-none text-[10px]">MIRA-{issue.id}</Badge>
                             <span className="text-[10px] text-red-500 font-medium flex items-center gap-1">
                                <Clock size={10} /> {new Date(issue.createdAt).toLocaleDateString()}
                             </span>
                        </div>
                        <div className="font-semibold text-sm text-slate-800 dark:text-slate-200 line-clamp-2 mb-2">
                            {issue.title}
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-500">
                            <span>{issue.project?.name}</span>
                            <span>{issue.assignee?.name || 'Unassigned'}</span>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

export function ChipsetReliabilityGrid({ chipsets }: { chipsets: any[] }) {
    return (
        <Card className="col-span-1 lg:col-span-2 border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader>
                <CardTitle className="text-lg font-bold">Chipset Reliability Matrix</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {chipsets.map((chip) => (
                        <div key={chip.name} className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-indigo-200 transition-all">
                            <Activity className={`w-8 h-8 mb-2 ${
                                chip.errorRate < 10 ? 'text-green-500' :
                                chip.errorRate < 30 ? 'text-yellow-500' : 'text-red-500'
                            }`} />
                            <div className="font-bold text-sm text-center">{chip.name}</div>
                            <div className="text-xs text-slate-500 mt-1">{chip.issueCount} Issues</div>
                            <div className={`mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                 chip.errorRate < 10 ? 'bg-green-100 text-green-700' :
                                 chip.errorRate < 30 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                            }`}>
                                {chip.errorRate}% Fail Rate
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
