import React, { useState, useEffect } from 'react';
import { DndContext, DragOverlay, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ticketsAPI, usersAPI } from '../services/api';
import { 
  Plus, 
  Filter, 
  Search, 
  User, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

// Helper function for priority colors
const getPriorityColor = (priority) => {
  switch (priority) {
    case 'urgent': return 'text-red-600 bg-red-100';
    case 'high': return 'text-orange-600 bg-orange-100';
    case 'medium': return 'text-yellow-600 bg-yellow-100';
    case 'low': return 'text-green-600 bg-green-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

// Sortable Ticket Component
const SortableTicket = ({ ticket, onStatusChange }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: ticket.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3 cursor-grab hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-medium text-gray-900 text-sm">{ticket.title}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
          {ticket.priority}
        </span>
      </div>
      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{ticket.description}</p>
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>#{ticket.id}</span>
        <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
      </div>
    </div>
  );
};

const KanbanBoard = () => {
  const [tickets, setTickets] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    assignee: '',
    priority: '',
    search: ''
  });
  const [activeTicket, setActiveTicket] = useState(null);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const columns = [
    { id: 'todo', title: 'To Do', color: 'bg-gray-100' },
    { id: 'in_progress', title: 'In Progress', color: 'bg-yellow-100' },
    { id: 'resolved', title: 'Resolved', color: 'bg-green-100' },
    { id: 'closed', title: 'Closed', color: 'bg-red-100' }
  ];

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ticketsResponse, agentsResponse] = await Promise.all([
        ticketsAPI.getTickets({
          assignee: filters.assignee || undefined,
          priority: filters.priority || undefined,
          search: filters.search || undefined
        }),
        usersAPI.getAgents()
      ]);

      console.log('Fetched tickets:', ticketsResponse.data.tickets);
      setTickets(ticketsResponse.data.tickets);
      setAgents(agentsResponse.data.agents);
    } catch (error) {
      console.error('Error fetching kanban data:', error);
      toast.error('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      // Optimistic update
      setTickets(prevTickets => 
        prevTickets.map(ticket => 
          ticket.id === ticketId 
            ? { ...ticket, status: newStatus }
            : ticket
        )
      );

      await ticketsAPI.updateTicket(ticketId, { status: newStatus });
      toast.success('Ticket status updated');
    } catch (error) {
      console.error('Error updating ticket status:', error);
      toast.error('Failed to update ticket status');
      // Revert optimistic update
      fetchData();
    }
  };

  const getTicketsByStatus = (status) => {
    const filteredTickets = tickets.filter(ticket => ticket.status === status);
    console.log(`Tickets for status ${status}:`, filteredTickets);
    return filteredTickets;
  };

  // Drag and drop handlers
  const handleDragStart = (event) => {
    const { active } = event;
    const ticket = tickets.find(t => t.id === active.id);
    setActiveTicket(ticket);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveTicket(null);

    if (!over) return;

    const ticketId = active.id;
    const newStatus = over.id;

    // Find the ticket
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket || ticket.status === newStatus) return;

    // Optimistic update
    const updatedTickets = tickets.map(t => 
      t.id === ticketId ? { ...t, status: newStatus } : t
    );
    setTickets(updatedTickets);

    try {
      // Update ticket status on server
      await ticketsAPI.updateTicket(ticketId, { status: newStatus });
      toast.success(`Ticket moved to ${columns.find(c => c.id === newStatus)?.title}`);
    } catch (error) {
      console.error('Error updating ticket status:', error);
      toast.error('Failed to update ticket status');
      // Revert optimistic update
      fetchData();
    }
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const ticketId = active.id;
    const newStatus = over.id;

    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket || ticket.status === newStatus) return;

    // Update local state for visual feedback
    const updatedTickets = tickets.map(t => 
      t.id === ticketId ? { ...t, status: newStatus } : t
    );
    setTickets(updatedTickets);
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

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'urgent': return <AlertTriangle className="w-3 h-3" />;
      case 'high': return <AlertTriangle className="w-3 h-3" />;
      case 'medium': return <Clock className="w-3 h-3" />;
      case 'low': return <CheckCircle className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Kanban Board</h1>
          <p className="mt-2 text-gray-600">
            Click on tickets to update their status.
          </p>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search tickets..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pl-10 input"
                />
              </div>
            </div>

            <select
              value={filters.assignee}
              onChange={(e) => setFilters({ ...filters, assignee: e.target.value })}
              className="input w-48"
            >
              <option value="">All Assignees</option>
              {agents.map(agent => (
                <option key={agent.id} value={agent.id}>
                  {agent.first_name} {agent.last_name}
                </option>
              ))}
            </select>

            <select
              value={filters.priority}
              onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
              className="input w-32"
            >
              <option value="">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            {(filters.assignee || filters.priority || filters.search) && (
              <button
                onClick={() => setFilters({ assignee: '', priority: '', search: '' })}
                className="btn btn-secondary flex items-center"
              >
                <X className="w-4 h-4 mr-1" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Kanban Board */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {columns.map((column) => {
              const columnTickets = getTicketsByStatus(column.id);
              
              return (
                <div key={column.id} className="kanban-column">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900">{column.title}</h3>
                    <span className="bg-gray-200 text-gray-700 text-xs font-medium px-2 py-1 rounded-full">
                      {columnTickets.length}
                    </span>
                  </div>

                  <div 
                    id={column.id}
                    className="min-h-96 space-y-3 p-2 rounded-lg border-2 border-dashed border-gray-300"
                  >
                    <SortableContext items={columnTickets.map(t => t.id)} strategy={verticalListSortingStrategy}>
                      {columnTickets.map((ticket) => (
                        <SortableTicket 
                          key={ticket.id} 
                          ticket={ticket} 
                          onStatusChange={handleStatusChange}
                        />
                      ))}
                    </SortableContext>
                  </div>
                </div>
              );
            })}
          </div>

          <DragOverlay>
            {activeTicket ? (
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 opacity-90">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-gray-900 text-sm">{activeTicket.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(activeTicket.priority)}`}>
                    {activeTicket.priority}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{activeTicket.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>#{activeTicket.id}</span>
                  <span>{new Date(activeTicket.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

        {/* Empty State */}
        {tickets.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <Filter className="w-full h-full" />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No tickets found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your filters or create a new ticket.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanBoard;