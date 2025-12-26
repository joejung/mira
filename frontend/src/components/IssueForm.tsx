import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, X } from "lucide-react";
import ChipsetSelector from "./ChipsetSelector";

interface IssueFormProps {
    onClose: () => void;
    onSuccess: () => void;
    initialProjectId?: number;
    initialStatus?: string;
}

export default function IssueForm({ onClose, onSuccess, initialProjectId, initialStatus }: IssueFormProps) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        status: initialStatus || "OPEN",
        priority: "MEDIUM",
        projectId: initialProjectId || 1, // Default project for now
        reporterId: 1, // Default reporter for now
        chipsetVendor: "QUALCOMM" as "QUALCOMM" | "MEDIATEK" | "EXYNOS",
        chipset: "Snapdragon 8 Gen 3",
        chipsetVer: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/api/issues", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                onSuccess();
                onClose();
            }
        } catch (error) {
            console.error("Error creating issue:", error);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-lg border-slate-200 dark:border-slate-800 shadow-2xl bg-white dark:bg-slate-900 animate-in zoom-in-95 duration-200">
                <CardHeader className="border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between pb-4">
                    <CardTitle className="text-xl font-bold">Create New Issue</CardTitle>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                        <X size={20} />
                    </Button>
                </CardHeader>
                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="title" className="text-xs font-bold uppercase text-slate-500">Title</label>
                            <Input
                                id="title"
                                placeholder="Brief summary of the issue"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="priority" className="text-xs font-bold uppercase text-slate-500">Priority</label>
                            <select
                                id="priority"
                                className="w-full h-10 px-3 rounded-md border border-slate-200 dark:border-slate-800 bg-transparent text-sm outline-none"
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                            >
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                                <option value="CRITICAL">Critical</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="description" className="text-xs font-bold uppercase text-slate-500">Description</label>
                            <textarea
                                id="description"
                                className="w-full min-h-[100px] p-3 rounded-md border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
                                placeholder="Detailed steps to reproduce, expected vs actual behavior..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="py-2">
                            <ChipsetSelector
                                vendor={formData.chipsetVendor}
                                onVendorChange={(v) => setFormData({ ...formData, chipsetVendor: v, chipset: "" })}
                                version={formData.chipset}
                                onVersionChange={(v) => setFormData({ ...formData, chipset: v })}
                                revision={formData.chipsetVer}
                                onRevisionChange={(r) => setFormData({ ...formData, chipsetVer: r })}
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 gap-2">
                                <Save size={18} />
                                Create Issue
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
