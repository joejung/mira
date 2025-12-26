import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    X,
    Clock,
    User,
    Tag,
    Cpu,
    Paperclip,
    ArrowRight,
    Save
} from "lucide-react";
import CommentSection from "./CommentSection";

interface Issue {
    id: number;
    title: string;
    description: string;
    status: string;
    priority: string;
    chipset: string;
    chipsetVer?: string;
    project: { name: string };
    reporter: { name: string; id?: number };
    assignee?: { name: string };
    updatedAt: string;
}

interface IssueDetailProps {
    issue: Issue;
    onClose: () => void;
    currentUserId?: number;
}

export default function IssueDetail({ issue, onClose, currentUserId = 1 }: IssueDetailProps) {
    return (
        <div className="fixed inset-y-0 right-0 w-full max-w-2xl bg-white dark:bg-slate-900 shadow-2xl z-50 animate-in slide-in-from-right duration-300 border-l border-slate-200 dark:border-slate-800 flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50 backdrop-blur-md">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        <span>MIRA-{issue.id}</span>
                        <ArrowRight size={10} />
                        <span className="text-indigo-500">{issue.project.name}</span>
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight line-clamp-1">{issue.title}</h2>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                    <X size={20} />
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8">
                {/* Status & Priority Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <Card className="bg-slate-50 dark:bg-slate-800/50 border-none shadow-none p-4 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-indigo-500 shadow-sm">
                            <Tag size={18} />
                        </div>
                        <div>
                            <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Status</div>
                            <div className="font-semibold text-sm">{issue.status.replace('_', ' ')}</div>
                        </div>
                    </Card>
                    <Card className="bg-slate-50 dark:bg-slate-800/50 border-none shadow-none p-4 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-rose-500 shadow-sm">
                            <Clock size={18} />
                        </div>
                        <div>
                            <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Priority</div>
                            <div className="font-semibold text-sm">{issue.priority}</div>
                        </div>
                    </Card>
                </div>

                {/* Metadata section */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Metadata</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                        <MetaDataItem icon={<User size={16} />} label="Reporter" value={issue.reporter.name} />
                        <MetaDataItem icon={<User size={16} />} label="Assignee" value={issue.assignee?.name || "Unassigned"} />
                        <MetaDataItem icon={<Cpu size={16} />} label="Chipset" value={issue.chipset} />
                        {issue.chipsetVer && <MetaDataItem icon={<Cpu size={16} />} label="Revision" value={issue.chipsetVer} />}
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Description</h3>
                    <div className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-100 dark:border-slate-800 whitespace-pre-wrap">
                        {issue.description || "No description provided."}
                    </div>
                </div>

                {/* Comments Section */}
                <CommentSection issueId={issue.id} currentUserId={currentUserId} />
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3 bg-slate-50/50 dark:bg-slate-950/50">
                <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700 font-semibold gap-2">
                    <Save size={18} />
                    Update Status
                </Button>
                <Button variant="outline" size="icon" className="rounded-xl border-slate-200 dark:border-slate-800 h-10 w-10">
                    <Paperclip size={18} />
                </Button>
            </div>
        </div>
    );
}

function MetaDataItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
    return (
        <div className="flex items-center gap-3">
            <div className="text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 p-2 rounded-lg">
                {icon}
            </div>
            <div>
                <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider leading-tight">{label}</div>
                <div className="text-sm font-semibold leading-tight">{value}</div>
            </div>
        </div>
    )
}
