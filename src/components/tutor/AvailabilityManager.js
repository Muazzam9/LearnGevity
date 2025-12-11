import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { format } from 'date-fns';

const AvailabilityManager = ({ tutorId }) => {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    start_date: '',
    start_time: '',
    end_date: '',
    end_time: '',
    reason: '',
  });
  const [editingBlock, setEditingBlock] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (tutorId) {
      fetchBlocks();
    }
  }, [tutorId]);

  const fetchBlocks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tutor_availability_blocks')
        .select('*')
        .eq('tutor_id', tutorId)
        .gte('end_datetime', new Date().toISOString())
        .order('start_datetime');

      if (error) throw error;
      setBlocks(data || []);
    } catch (err) {
      console.error('Error fetching availability blocks:', err);
      setError('Failed to load availability blocks');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // Combine date and time
      const startDatetime = new Date(`${formData.start_date}T${formData.start_time}`);
      const endDatetime = new Date(`${formData.end_date}T${formData.end_time}`);

      // Validation
      if (endDatetime <= startDatetime) {
        setError('End time must be after start time');
        return;
      }

      const blockData = {
        tutor_id: tutorId,
        start_datetime: startDatetime.toISOString(),
        end_datetime: endDatetime.toISOString(),
        reason: formData.reason || 'Unavailable',
      };

      if (editingBlock) {
        // Update existing block
        const { error: updateError } = await supabase
          .from('tutor_availability_blocks')
          .update(blockData)
          .eq('id', editingBlock.id);

        if (updateError) throw updateError;
        setSuccess('Availability block updated successfully!');
      } else {
        // Create new block
        const { error: insertError } = await supabase
          .from('tutor_availability_blocks')
          .insert([blockData]);

        if (insertError) throw insertError;
        setSuccess('Availability block created successfully!');
      }

      // Reset form and refresh
      setFormData({
        start_date: '',
        start_time: '',
        end_date: '',
        end_time: '',
        reason: '',
      });
      setEditingBlock(null);
      setShowForm(false);
      fetchBlocks();
    } catch (err) {
      console.error('Error saving block:', err);
      setError(err.message || 'Failed to save availability block');
    }
  };

  const handleEdit = (block) => {
    const startDate = new Date(block.start_datetime);
    const endDate = new Date(block.end_datetime);

    setFormData({
      start_date: format(startDate, 'yyyy-MM-dd'),
      start_time: format(startDate, 'HH:mm'),
      end_date: format(endDate, 'yyyy-MM-dd'),
      end_time: format(endDate, 'HH:mm'),
      reason: block.reason || '',
    });
    setEditingBlock(block);
    setShowForm(true);
  };

  const handleDelete = async (blockId) => {
    if (!window.confirm('Are you sure you want to delete this availability block?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('tutor_availability_blocks')
        .delete()
        .eq('id', blockId);

      if (error) throw error;
      setSuccess('Availability block deleted successfully!');
      fetchBlocks();
    } catch (err) {
      console.error('Error deleting block:', err);
      setError('Failed to delete availability block');
    }
  };

  const handleCancel = () => {
    setFormData({
      start_date: '',
      start_time: '',
      end_date: '',
      end_time: '',
      reason: '',
    });
    setEditingBlock(null);
    setShowForm(false);
    setError('');
  };

  const formatDateTime = (datetime) => {
    return format(new Date(datetime), 'MMM d, yyyy h:mm a');
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}

      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="bg-primary-purple text-white px-4 py-2 rounded-lg hover:bg-opacity-90 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Block Unavailable Time
        </button>
      )}

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingBlock ? 'Edit Availability Block' : 'Block Unavailable Time'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  id="start_date"
                  name="start_date"
                  required
                  value={formData.start_date}
                  onChange={handleChange}
                  min={format(new Date(), 'yyyy-MM-dd')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="start_time" className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time *
                </label>
                <input
                  type="time"
                  id="start_time"
                  name="start_time"
                  required
                  value={formData.start_time}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-2">
                  End Date *
                </label>
                <input
                  type="date"
                  id="end_date"
                  name="end_date"
                  required
                  value={formData.end_date}
                  onChange={handleChange}
                  min={formData.start_date || format(new Date(), 'yyyy-MM-dd')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="end_time" className="block text-sm font-medium text-gray-700 mb-2">
                  End Time *
                </label>
                <input
                  type="time"
                  id="end_time"
                  name="end_time"
                  required
                  value={formData.end_time}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                Reason (optional)
              </label>
              <input
                type="text"
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
                placeholder="e.g., Vacation, Personal appointment"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 bg-primary-purple text-white py-2 rounded-lg font-semibold hover:bg-opacity-90"
              >
                {editingBlock ? 'Update Block' : 'Create Block'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List of existing blocks */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Your Unavailable Times</h3>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-purple mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading...</p>
          </div>
        ) : blocks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No unavailable times blocked</p>
            <p className="text-sm mt-1">Block times when you can't take sessions</p>
          </div>
        ) : (
          <div className="divide-y">
            {blocks.map(block => (
              <div key={block.id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-gray-900">
                      {formatDateTime(block.start_datetime)} - {formatDateTime(block.end_datetime)}
                    </div>
                    {block.reason && (
                      <div className="text-sm text-gray-600 mt-1">{block.reason}</div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(block)}
                      className="text-primary-purple hover:text-primary-navy text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(block.id)}
                      className="text-red-600 hover:text-red-900 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AvailabilityManager;

