import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    ChevronLeft, 
    MoreHorizontal, 
    Plus, 
    MessageSquare, 
    Clock, 
    AlertCircle,
    User,
    Search
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import IssueDetail from './IssueDetail';
import IssueForm from './IssueForm';

interface Issue {
    id: number;
    title: string;
    description: string;
    status: string;
    priority: string;
    chipset: string;
    chipsetVer?: string;
    project: { name: string };
    reporter: { name: string };
    assignee?: { name: string };
    updatedAt: string;
}

interface ProjectBoardProps {
    projectId: number;
    projectName: string;
    onBack: () => void;
}

const STATUS_COLUMNS = [
    { id: 'OPEN', label: 'To Do', color: 'bg-slate-100 text-slate-700' },
    { id: 'IN_PROGRESS', label: 'In Progress', color: 'bg-blue-100 text-blue-700' },
    { id: 'RESOLVED', label: 'Resolved', color: 'bg-green-100 text-green-700' },
    { id: 'CLOSED', label: 'Done', color: 'bg-slate-200 text-slate-500' }
];

export default function ProjectBoard({ projectId, projectName, onBack }: ProjectBoardProps) {
    const [issues, setIssues] = useState<Issue[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
    const [showIssueForm, setShowIssueForm] = useState(false);
    const [initialFormStatus, setInitialFormStatus] = useState<string | undefined>(undefined);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedMember, setSelectedMember] = useState<string>("all");

    // Get unique members from issues for the filter
    const members = React.useMemo(() => {
        const uniqueMembers = new Map();
        issues.forEach(issue => {
            if (issue.assignee) {
                uniqueMembers.set(issue.assignee.name, issue.assignee.name);
            }
        });
        return Array.from(uniqueMembers.values());
    }, [issues]);

    useEffect(() => {
        fetchProjectIssues();
    }, [projectId]);

    const fetchProjectIssues = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/issues?projectId=${projectId}`);
            if (response.ok) {
                const data = await response.json();
                setIssues(data);
            }
        } catch (error) {
            console.error('Error fetching project issues:', error);
        } finally {
            setLoading(false);
        }
    };

    const getIssuesByStatus = (status: string) => {
        return issues.filter(issue => {
            const matchesStatus = issue.status === status;
            const matchesSearch = issue.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                issue.id.toString().includes(searchQuery);
            const matchesMember = selectedMember === "all" || issue.assignee?.name === selectedMember;
            
            return matchesStatus && matchesSearch && matchesMember;
        });
    };

    const handleUpdateStatus = async (issueId: number, newStatus: string) => {
        // Optimistic update
        const originalIssues = [...issues];
        setIssues(issues.map(issue => 
            issue.id === issueId ? { ...issue, status: newStatus } : issue
        ));

        try {
            const response = await fetch(`http://localhost:5000/api/issues/${issueId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (!response.ok) {
                throw new Error('Failed to update status');
            }
        } catch (error) {
            console.error('Error updating issue status:', error);
            setIssues(originalIssues);
        }
    };

    const onDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        handleUpdateStatus(parseInt(draggableId), destination.droppableId);
    };

    const handleCreateIssue = (status?: string) => {
        setInitialFormStatus(status);
        setShowIssueForm(true);
    };

    if (loading) {
        return <div className="p-8 text-center text-slate-500">Loading board...</div>;
    }

    return (
        <div className="h-full flex flex-col space-y-6 animate-in fade-in duration-500">
            {/* Board Header */}
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
                            <ChevronLeft size={24} />
                        </Button>
                        <div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-indigo-500">Project Board</div>
                            <h1 className="text-2xl font-bold tracking-tight">{projectName}</h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search issues..."
                                className="pl-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Select value={selectedMember} onValueChange={setSelectedMember}>
                            <SelectTrigger className="w-[180px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                                <SelectValue placeholder="Filter Members" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Members</SelectItem>
                                {members.map(member => (
                                    <SelectItem key={member} value={member}>{member}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button 
                            className="gap-2 bg-indigo-600 hover:bg-indigo-700"
                            onClick={() => handleCreateIssue()}
                        >
                            <Plus size={16} />
                            <span>Create Issue</span>
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-x-auto pb-4">
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="flex gap-6 h-full min-w-max">
                        {STATUS_COLUMNS.map(column => (
                            <Droppable key={column.id} droppableId={column.id}>
                                {(provided) => (
                                    <div 
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className="w-80 flex flex-col gap-4 bg-slate-50/50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800"
                                    >
                                        <div className="flex items-center justify-between px-2">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-sm uppercase tracking-wider">{column.label}</h3>
                                                <span className="bg-white dark:bg-slate-800 px-2 py-0.5 rounded-full text-[10px] font-bold border border-slate-200 dark:border-slate-700">
                                                    {getIssuesByStatus(column.id).length}
                                                </span>
                                            </div>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                                                <MoreHorizontal size={16} />
                                            </Button>
                                        </div>

                                        <div className="flex-1 space-y-3 overflow-y-auto pr-2">
                                            {getIssuesByStatus(column.id).map((issue, index) => (
                                                <KanbanCard 
                                                    key={issue.id} 
                                                    issue={issue} 
                                                    index={index}
                                                    onClick={() => setSelectedIssue(issue)}
                                                />
                                            ))}
                                            {provided.placeholder}
                                            <Button 
                                                variant="ghost" 
                                                className="w-full justify-start text-slate-400 hover:text-indigo-600 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 text-xs gap-2 py-2 border-dashed border border-slate-200 dark:border-slate-800"
                                                onClick={() => handleCreateIssue(column.id)}
                                            >
                                                <Plus size={14} />
                                                Add another card
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </Droppable>
                        ))}
                    </div>
                </DragDropContext>
            </div>

            {selectedIssue && (
                <IssueDetail 
                    issue={selectedIssue} 
                    onClose={() => setSelectedIssue(null)} 
                />
            )}

            {showIssueForm && (
                <IssueForm 
                    onClose={() => setShowIssueForm(false)} 
                    onSuccess={() => {
                        setShowIssueForm(false);
                        fetchProjectIssues();
                    }}
                    initialProjectId={projectId}
                    initialStatus={initialFormStatus}
                />
            )}
        </div>
    );
}

function KanbanCard({ issue, index, onClick }: { issue: Issue, index: number, onClick: () => void }) {
    const priorityColors = {
        CRITICAL: 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400',
        HIGH: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
        MEDIUM: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
        LOW: 'bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
    };

    return (
        <Draggable draggableId={issue.id.toString()} index={index}>
            {(provided, snapshot) => (
                <Card 
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`group cursor-pointer hover:shadow-lg hover:border-indigo-200 dark:hover:border-indigo-900/50 transition-all bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm ${
                        snapshot.isDragging ? 'rotate-2 scale-105 shadow-xl border-indigo-500 z-50' : ''
                    }`}
                    onClick={onClick}
                >
                    <CardContent className="p-4 space-y-3">
                        <div className="flex justify-between items-start gap-2">
                            <span className="text-[10px] font-mono font-bold text-slate-400">MIRA-{issue.id}</span>
                            <Badge variant="outline" className={`text-[9px] px-1.5 py-0 border-none uppercase font-bold ${(priorityColors as any)[issue.priority]}`}>
                                {issue.priority}
                            </Badge>
                        </div>
                        
                        <h4 className="text-sm font-semibold leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {issue.title}
                        </h4>

                        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium">
                            <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-100 dark:border-slate-800">
                                <AlertCircle size={10} />
                                <span>{issue.chipset}</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-50 dark:border-slate-700/50">
                            <div className="flex items-center gap-2 text-slate-400">
                                <div className="flex items-center gap-1">
                                    <MessageSquare size={12} />
                                    <span className="text-[10px]">3</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock size={12} />
                                    <span className="text-[10px]">2d</span>
                                </div>
                            </div>
                            <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center border-2 border-white dark:border-slate-800 shadow-sm">
                                <User size={12} className="text-slate-500 dark:text-slate-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </Draggable>
    );
}

