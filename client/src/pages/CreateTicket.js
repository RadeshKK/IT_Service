import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ticketsAPI, aiAPI } from '../services/api';
import { 
  ArrowLeft, 
  Send, 
  Loader, 
  AlertCircle, 
  CheckCircle,
  Sparkles,
  FileText,
  AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';

const CreateTicket = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [showAiSuggestions, setShowAiSuggestions] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      priority: 'medium',
      category: ''
    }
  });

  const watchedTitle = watch('title');
  const watchedDescription = watch('description');

  const getAISuggestions = async () => {
    if (!watchedTitle || !watchedDescription) {
      toast.error('Please enter both title and description first');
      return;
    }

    try {
      setAiLoading(true);
      const response = await aiAPI.categorizeTicket({
        title: watchedTitle,
        description: watchedDescription
      });

      setAiSuggestions(response.data);
      setShowAiSuggestions(true);
      
      // Auto-apply suggestions
      if (response.data.category) {
        setValue('category', response.data.category);
      }
      if (response.data.priority) {
        setValue('priority', response.data.priority);
      }

      toast.success('AI suggestions generated!');
    } catch (error) {
      console.error('Error getting AI suggestions:', error);
      toast.error('Failed to get AI suggestions');
    } finally {
      setAiLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await ticketsAPI.createTicket(data);
      toast.success('Ticket created successfully!');
      navigate('/tickets');
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast.error(error.response?.data?.message || 'Failed to create ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Create New Ticket</h1>
          <p className="mt-2 text-gray-600">
            Describe your IT issue and we'll help you get it resolved quickly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="card">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Ticket Details</h3>
                
                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    {...register('title', { 
                      required: 'Title is required',
                      minLength: { value: 5, message: 'Title must be at least 5 characters' }
                    })}
                    className={`input ${errors.title ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                    placeholder="Brief description of the issue"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.title.message}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    rows={6}
                    {...register('description', { 
                      required: 'Description is required',
                      minLength: { value: 10, message: 'Description must be at least 10 characters' }
                    })}
                    className={`input ${errors.description ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                    placeholder="Please provide detailed information about the issue, including steps to reproduce, error messages, and any relevant context."
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.description.message}
                    </p>
                  )}
                </div>

                {/* Priority and Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      id="priority"
                      {...register('priority')}
                      className="input"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <input
                      type="text"
                      id="category"
                      {...register('category')}
                      className="input"
                      placeholder="e.g., Hardware, Software, Network"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => navigate('/tickets')}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary flex items-center"
                  >
                    {loading ? (
                      <>
                        <Loader className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Create Ticket
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* AI Suggestions Sidebar */}
          <div className="lg:col-span-1">
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">AI Assistant</h3>
                <Sparkles className="w-5 h-5 text-blue-600" />
              </div>

              <p className="text-sm text-gray-600 mb-4">
                Get AI-powered suggestions for categorization and priority assignment.
              </p>

              <button
                onClick={getAISuggestions}
                disabled={aiLoading || !watchedTitle || !watchedDescription}
                className="w-full btn btn-primary flex items-center justify-center mb-4"
              >
                {aiLoading ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Get AI Suggestions
                  </>
                )}
              </button>

              {aiSuggestions && showAiSuggestions && (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">AI Analysis</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-blue-700">Suggested Category:</span>
                        <span className="text-sm font-medium text-blue-900">
                          {aiSuggestions.category}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-blue-700">Suggested Priority:</span>
                        <span className="text-sm font-medium text-blue-900 capitalize">
                          {aiSuggestions.priority}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-blue-700">Confidence:</span>
                        <span className="text-sm font-medium text-blue-900">
                          {Math.round(aiSuggestions.confidence * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        if (aiSuggestions.category) {
                          setValue('category', aiSuggestions.category);
                        }
                        if (aiSuggestions.priority) {
                          setValue('priority', aiSuggestions.priority);
                        }
                        toast.success('Suggestions applied!');
                      }}
                      className="flex-1 btn btn-success text-sm flex items-center justify-center"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Apply
                    </button>
                    <button
                      onClick={() => setShowAiSuggestions(false)}
                      className="flex-1 btn btn-secondary text-sm"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}

              {/* Help Section */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">Tips for Better Tickets</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <FileText className="w-4 h-4 mr-2 mt-0.5 text-blue-500 flex-shrink-0" />
                    Be specific and detailed in your description
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle className="w-4 h-4 mr-2 mt-0.5 text-yellow-500 flex-shrink-0" />
                    Include error messages and steps to reproduce
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                    Mention what you've already tried
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTicket;
