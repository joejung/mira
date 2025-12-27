
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Folder, MoreVertical, Plus, X } from "lucide-react";
import ProjectBoard from "@/components/ProjectBoard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_BASE_URL } from "@/config";

interface Project {
    id: number;
    name: string;
    key: string;
    description: string;
    _count?: { issues: number };
}

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    // const [loading, setLoading] = useState(true); // Loading unused in render, commented out to satisfy linter
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
    const [newProjectData, setNewProjectData] = useState({ name: "", key: "", description: "" });

    const handleCreateProject = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_BASE_URL}/projects`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newProjectData)
            });
            if (response.ok) {
                const project = await response.json();
                setProjects([...projects, project]);
                setShowNewProjectDialog(false);
                setNewProjectData({ name: "", key: "", description: "" });
            }
        } catch (error) {
            console.error('Error creating project:', error);
        }
    };

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/projects`);
                if (response.ok) {
                    const data = await response.json();
                    setProjects(data);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchProjects();
    }, []);

    if (selectedProject) {
        return (
            <ProjectBoard 
                projectId={selectedProject.id} 
                projectName={selectedProject.name}
                onBack={() => setSelectedProject(null)}
            />
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage and organize your chipset development portfolios.</p>
                </div>
                <Button 
                    className="gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200 dark:shadow-none transition-all hover:translate-y-[-1px]"
                    onClick={() => setShowNewProjectDialog(true)}
                >
                    <Plus size={18} />
                    <span>New Project</span>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <Card 
                        key={project.id} 
                        onClick={() => setSelectedProject(project)}
                        className="border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group overflow-hidden bg-white/50 dark:bg-slate-900/50 backdrop-blur-md cursor-pointer active:scale-[0.98]"
                    >
                        <div className="p-1 h-1 bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <CardHeader className="pb-2">
                            <div className="flex items-start justify-between">
                                <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 border border-indigo-100 dark:border-indigo-900/30 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                    <Folder size={20} />
                                </div>
                                <Button variant="ghost" size="icon" className="text-slate-400" onClick={(e) => e.stopPropagation()}>
                                    <MoreVertical size={18} />
                                </Button>
                            </div>
                            <CardTitle className="mt-4 text-lg font-bold group-hover:text-indigo-600 transition-colors uppercase tracking-tight">
                                {project.name}
                            </CardTitle>
                            <CardDescription className="text-xs font-mono font-medium text-slate-400">
                                Key: {project.key}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 h-10 italic">
                                {project.description || "No description provided."}
                            </p>
                            <div className="mt-6 flex items-center gap-4 border-t border-slate-100 dark:border-slate-800 pt-4">
                                <div className="text-center">
                                    <div className="text-lg font-bold text-slate-900 dark:text-slate-100">{project._count?.issues || 0}</div>
                                    <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Open Issues</div>
                                </div>
                                <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-700" />
                                <div className="text-center">
                                    <div className="text-lg font-bold text-slate-900 dark:text-slate-100">84%</div>
                                    <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Health</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            {showNewProjectDialog && (
                <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-md border-slate-200 dark:border-slate-800 shadow-2xl bg-white dark:bg-slate-900 animate-in zoom-in-95 duration-200">
                        <CardHeader className="border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between pb-4">
                            <CardTitle className="text-xl font-bold">Create Project</CardTitle>
                            <Button variant="ghost" size="icon" onClick={() => setShowNewProjectDialog(false)} className="rounded-full">
                                <X size={20} />
                            </Button>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <form onSubmit={handleCreateProject} className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-slate-500">Project Name</Label>
                                    <Input
                                        placeholder="e.g. Athena Chipset"
                                        value={newProjectData.name}
                                        onChange={(e) => setNewProjectData({ ...newProjectData, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-slate-500">Project Key</Label>
                                    <Input
                                        placeholder="e.g. ATH"
                                        className="font-mono uppercase"
                                        maxLength={4}
                                        value={newProjectData.key}
                                        onChange={(e) => setNewProjectData({ ...newProjectData, key: e.target.value.toUpperCase() })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-slate-500">Description</Label>
                                    <Input
                                        placeholder="Brief description..."
                                        value={newProjectData.description}
                                        onChange={(e) => setNewProjectData({ ...newProjectData, description: e.target.value })}
                                    />
                                </div>
                                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <Button type="button" variant="outline" onClick={() => setShowNewProjectDialog(false)}>Cancel</Button>
                                    <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">Create Project</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
