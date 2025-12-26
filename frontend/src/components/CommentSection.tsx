import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, Send, Trash2, User } from 'lucide-react';

interface Comment {
    id: number;
    content: string;
    createdAt: string;
    author: {
        id: number;
        name: string;
        email: string;
    };
}

interface CommentSectionProps {
    issueId: number;
    currentUserId: number;
}

export default function CommentSection({ issueId, currentUserId }: CommentSectionProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchComments();
    }, [issueId]);

    const fetchComments = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/comments/issue/${issueId}`);
            if (response.ok) {
                const data = await response.json();
                setComments(data);
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const response = await fetch('http://localhost:5000/api/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: newComment,
                    issueId,
                    authorId: currentUserId
                })
            });
            if (response.ok) {
                const comment = await response.json();
                setComments([comment, ...comments]);
                setNewComment('');
            }
        } catch (error) {
            console.error('Error creating comment:', error);
        }
    };

    const handleDelete = async (commentId: number) => {
        try {
            const response = await fetch(`http://localhost:5000/api/comments/${commentId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                setComments(comments.filter(c => c.id !== commentId));
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="mt-6 border-t border-slate-200 dark:border-slate-700 pt-6">
            <div className="flex items-center gap-2 mb-4">
                <MessageCircle size={20} className="text-indigo-500" />
                <h3 className="text-lg font-semibold">Comments ({comments.length})</h3>
            </div>

            {/* New Comment Form */}
            <form onSubmit={handleSubmit} className="mb-6">
                <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0">
                        <User size={16} className="text-white" />
                    </div>
                    <div className="flex-1">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment..."
                            className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm min-h-[80px] resize-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                        />
                        <div className="flex justify-end mt-2">
                            <Button
                                type="submit"
                                disabled={!newComment.trim()}
                                className="bg-indigo-600 hover:bg-indigo-700 gap-2"
                            >
                                <Send size={16} />
                                Post Comment
                            </Button>
                        </div>
                    </div>
                </div>
            </form>

            {/* Comments List */}
            {loading ? (
                <div className="text-center py-4 text-slate-500">Loading comments...</div>
            ) : comments.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                    <MessageCircle size={32} className="mx-auto mb-2 opacity-50" />
                    <p>No comments yet. Be the first to comment!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {comments.map((comment) => (
                        <div
                            key={comment.id}
                            className="flex gap-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700"
                        >
                            <div className="w-8 h-8 rounded-full bg-slate-300 dark:bg-slate-600 flex items-center justify-center flex-shrink-0">
                                <User size={16} className="text-slate-600 dark:text-slate-300" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-sm">
                                            {comment.author.name || comment.author.email}
                                        </span>
                                        <span className="text-xs text-slate-500">
                                            {formatDate(comment.createdAt)}
                                        </span>
                                    </div>
                                    {comment.author.id === currentUserId && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDelete(comment.id)}
                                            className="h-6 w-6 text-slate-400 hover:text-red-500"
                                        >
                                            <Trash2 size={14} />
                                        </Button>
                                    )}
                                </div>
                                <p className="text-sm mt-1 text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                                    {comment.content}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
