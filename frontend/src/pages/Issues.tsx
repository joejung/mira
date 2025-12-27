import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { API_BASE_URL } from "@/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Plus, ChevronRight, Cpu } from "lucide-react";
import IssueForm from "@/components/IssueForm";
import IssueDetail from "@/components/IssueDetail";

interface Issue {
    id: number;
    title: string;
    status: string;
    priority: string;
    chipset: string;
    project: { name: string };
    updatedAt: string;
}

export default function IssuesPage() {
    const [issues, setIssues] = useState<Issue[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

    const fetchIssues = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/issues`);
            if (!response.ok) throw new Error('Failed to fetch issues');
            const data = await response.json();
            setIssues(data);
        } catch (err) {
            console.error(err);
        } finally {
            // Loading finished
        }
    };

    useEffect(() => {
        fetchIssues();
    }, []);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between font-sans">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Issues</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage and track technical issues across your projects.</p>
                </div>
                <Button
                    onClick={() => setShowForm(true)}
                    className="gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200 dark:shadow-none transition-all hover:translate-y-[-1px]"
                >
                    <Plus size={18} />
                    <span>New Issue</span>
                </Button>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <Input className="pl-10 h-11 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500/20" placeholder="Search issues, tags, or chipsets..." />
                </div>
                <Button variant="outline" className="gap-2 h-11 border-slate-200 dark:border-slate-800">
                    <Filter size={18} />
                    <span>Filters</span>
                </Button>
            </div>

            <Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden text-sm bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
                <div className="grid grid-cols-12 px-6 py-4 bg-slate-50/50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800 font-semibold text-slate-500 uppercase tracking-wider text-[11px]">
                    <div className="col-span-5">Issue Title</div>
                    <div className="col-span-2 text-center">Status</div>
                    <div className="col-span-2 text-center">Priority</div>
                    <div className="col-span-2 text-center">Chipset</div>
                    <div className="col-span-1"></div>
                </div>
                <CardContent className="p-0">
                    {issues.map((issue) => (
                        <div
                            key={issue.id}
                            onClick={() => setSelectedIssue(issue)}
                            className="grid grid-cols-12 px-6 py-4 items-center border-b border-slate-100 dark:border-slate-800/40 hover:bg-white dark:hover:bg-slate-800/40 transition-all cursor-pointer group"
                        >
                            <div className="col-span-5 flex flex-col gap-1">
                                <span className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{issue.title}</span>
                                <span className="text-[11px] text-slate-400 font-medium">MIRA-{issue.id} • {issue.project.name}</span>
                            </div>
                            <div className="col-span-2 flex justify-center">
                                <StatusBadge status={issue.status} />
                            </div>
                            <div className="col-span-2 flex justify-center">
                                <PriorityBadge priority={issue.priority} />
                            </div>
                            <div className="col-span-2 flex justify-center">
                                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-[10px] border border-slate-200/50 dark:border-slate-700/50">
                                    <Cpu size={12} className="text-indigo-500" />
                                    {issue.chipset}
                                </div>
                            </div>
                            <div className="col-span-1 flex justify-end text-slate-300 group-hover:text-indigo-500 transition-all group-hover:translate-x-1">
                                <ChevronRight size={18} />
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {showForm && (
                <IssueForm
                    onClose={() => setShowForm(false)}
                    onSuccess={fetchIssues}
                />
            )}

            {selectedIssue && (
                <IssueDetail
                    issue={selectedIssue as any}
                    onClose={() => setSelectedIssue(null)}
                />
            )}
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const variants: Record<string, string> = {
        OPEN: "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30",
        IN_PROGRESS: "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/30",
        RESOLVED: "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30",
        CLOSED: "bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-900/20 dark:text-slate-400 dark:border-slate-800",
    }
    return <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${variants[status] || variants.OPEN}`}>{status.replace('_', ' ')}</span>
}

function PriorityBadge({ priority }: { priority: string }) {
    const variants: Record<string, string> = {
        LOW: "text-slate-400 font-medium",
        MEDIUM: "text-indigo-500 font-semibold",
        HIGH: "text-amber-500 font-bold",
        CRITICAL: "text-rose-500 font-black",
    }
    return <span className={`text-[10px] uppercase tracking-wide ${variants[priority] || variants.MEDIUM}`}>{priority}</span>
}
