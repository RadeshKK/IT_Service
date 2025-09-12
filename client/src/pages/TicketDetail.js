import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ticketsAPI, usersAPI } from '../services/api';
import { 
  ArrowLeft, 
  Edit, 
  User, 
  Clock, 
  Send,
  Loader
} from 'lucide-react';
import toast from 'react-hot-toast';

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  const fetchTicketData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await ticketsAPI.getTicket(id);
      setTicket(response.data.ticket);
      setComments(response.data.comments);
      setEditData({
        title: response.data.ticket.title,
        description: response.data.ticket.description,
        status: response.data.ticket.status,
        priority: response.data.ticket.priority,
        category: response.data.ticket.category || '',
        assigneeId: response.data.ticket.assignee_id || ''
      });
    } catch (error) {
      console.error('Error fetching ticket:', error);
      toast.error('Failed to load ticket');
      navigate('/tickets');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchTicketData();
    fetchAgents();
  }, [fetchTicketData]);

  const fetchAgents = async () => {
    try {
      const response = await usersAPI.getAgents();
      setAgents(response.data.agents);
    } catch (error) {
      console.error('Error fetching agents:', error);
    }
  };

  const handleUpdateTicket = async () => {
    try {
      const updateData = { ...editData };
      if (updateData.assigneeId === '') {
        updateData.assigneeId = null;
      }
      
      await ticketsAPI.updateTicket(id, updateData);
      await fetchTicketData();
      setIsEditing(false);
      toast.success('Ticket updated successfully');
    } catch (error) {
      console.error('Error updating ticket:', error);
      toast.error('Failed to update ticket');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setCommentLoading(true);
      await ticketsAPI.addComment(id, { content: newComment });
      setNewComment('');
      await fetchTicketData();
      toast.success('Comment added successfully');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    } finally {
      setCommentLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'todo': return 'text-gray-600 bg-gray-100';
      case 'in_progress': return 'text-yellow-600 bg-yellow-100';
      case 'resolved': return 'text-green-600 bg-green-100';
      case 'closed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Ticket not found</h1>
          <button
            onClick={() => navigate('/tickets')}
            className="btn btn-primary"
          >
            Back to Tickets
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                #{ticket.id} {ticket.title}
              </h1>
              <p className="mt-2 text-gray-600">
                Created by {ticket.reporter_first_name} {ticket.reporter_last_name} on {formatDate(ticket.created_at)}
              </p>
            </div>
            {(user?.role === 'agent' || user?.role === 'admin') && (
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="btn btn-secondary flex items-center"
              >
                <Edit className="w-4 h-4 mr-2" />
                {isEditing ? 'Cancel Edit' : 'Edit Ticket'}
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Ticket Details */}
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Description</h3>
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={editData.title}
                      onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      rows={6}
                      value={editData.description}
                      onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                      className="input"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        value={editData.status}
                        onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                        className="input"
                      >
                        <option value="todo">To Do</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Priority
                      </label>
                      <select
                        value={editData.priority}
                        onChange={(e) => setEditData({ ...editData, priority: e.target.value })}
                        className="input"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <input
                        type="text"
                        value={editData.category}
                        onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                        className="input"
                        placeholder="e.g., Hardware, Software"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Assignee
                      </label>
                      <select
                        value={editData.assigneeId}
                        onChange={(e) => setEditData({ ...editData, assigneeId: e.target.value })}
                        className="input"
                      >
                        <option value="">Unassigned</option>
                        {agents.map(agent => (
                          <option key={agent.id} value={agent.id}>
                            {agent.first_name} {agent.last_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdateTicket}
                      className="btn btn-primary"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
                </div>
              )}
            </div>

            {/* Comments */}
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Comments</h3>
              
              {/* Add Comment Form */}
              <form onSubmit={handleAddComment} className="mb-6">
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      rows={3}
                      className="input"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={commentLoading || !newComment.trim()}
                    className="btn btn-primary self-end flex items-center"
                  >
                    {commentLoading ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No comments yet</p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="border-l-4 border-blue-200 pl-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="font-medium text-gray-900">
                            {comment.first_name} {comment.last_name}
                          </span>
                          {comment.is_internal && (
                            <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                              Internal
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-gray-500 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatDate(comment.created_at)}
                        </span>
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Ticket Info */}
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Ticket Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <div className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                      {ticket.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Priority</label>
                  <div className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Category</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {ticket.category || 'Uncategorized'}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Assignee</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {ticket.assignee_first_name ? (
                      `${ticket.assignee_first_name} ${ticket.assignee_last_name}`
                    ) : (
                      'Unassigned'
                    )}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Created</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {formatDate(ticket.created_at)}
                  </p>
                </div>

                {ticket.updated_at !== ticket.created_at && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Last Updated</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {formatDate(ticket.updated_at)}
                    </p>
                  </div>
                )}

                {ticket.resolved_at && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Resolved</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {formatDate(ticket.resolved_at)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* AI Suggestions */}
            {ticket.ai_suggested_category && (
              <div className="card">
                <h3 className="text-lg font-medium text-gray-900 mb-4">AI Suggestions</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Suggested Category</label>
                    <p className="mt-1 text-sm text-gray-900">{ticket.ai_suggested_category}</p>
                  </div>
                  {ticket.ai_suggested_priority && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Suggested Priority</label>
                      <p className="mt-1 text-sm text-gray-900 capitalize">{ticket.ai_suggested_priority}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;
