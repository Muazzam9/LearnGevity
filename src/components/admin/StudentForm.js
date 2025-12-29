import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

const StudentForm = ({ student, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    subjects_needed: [],
    preferred_lesson_type: 'Online',
  });
  const [subjectInput, setSubjectInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (student) {
      setFormData({
        first_name: student.first_name || '',
        last_name: student.last_name || '',
        email: student.email || '',
        phone: student.phone || '',
        subjects_needed: student.subjects_needed || [],
        preferred_lesson_type: student.preferred_lesson_type || 'Online',
      });
    }
  }, [student]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSubject = () => {
    const trimmed = subjectInput.trim();
    if (trimmed && !formData.subjects_needed.includes(trimmed)) {
      setFormData(prev => ({
        ...prev,
        subjects_needed: [...prev.subjects_needed, trimmed]
      }));
      setSubjectInput('');
    }
  };

  const handleRemoveSubject = (subject) => {
    setFormData(prev => ({
      ...prev,
      subjects_needed: prev.subjects_needed.filter(s => s !== subject)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const studentData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        subjects_needed: formData.subjects_needed,
        preferred_lesson_type: formData.preferred_lesson_type,
      };

      if (student) {
        // Update existing student
        const { error: updateError } = await supabase
          .from('students')
          .update(studentData)
          .eq('id', student.id);

        if (updateError) throw updateError;
        onSuccess('Student updated successfully!');
      } else {
        // Create new student
        const { error: insertError } = await supabase
          .from('students')
          .insert([studentData]);

        if (insertError) throw insertError;
        onSuccess('Student created successfully!');
      }
    } catch (err) {
      console.error('Error saving student:', err);
      setError(err.message || 'Failed to save student');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-2">
            First Name *
          </label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            required
            value={formData.first_name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
            placeholder="Jane"
          />
        </div>

        <div>
          <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-2">
            Last Name *
          </label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            required
            value={formData.last_name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
            placeholder="Smith"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
            placeholder="jane.smith@example.com"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
            placeholder="(555) 123-4567"
          />
        </div>
      </div>

      <div>
        <label htmlFor="preferred_lesson_type" className="block text-sm font-medium text-gray-700 mb-2">
          Preferred Lesson Type *
        </label>
        <select
          id="preferred_lesson_type"
          name="preferred_lesson_type"
          required
          value={formData.preferred_lesson_type}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
        >
          <option value="Online">Online</option>
          <option value="In-person">In-person</option>
        </select>
      </div>

      <div>
        <label htmlFor="subjects_needed" className="block text-sm font-medium text-gray-700 mb-2">
          Subjects Needed *
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={subjectInput}
            onChange={(e) => setSubjectInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddSubject();
              }
            }}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
            placeholder="Type subject and click Add"
          />
          <button
            type="button"
            onClick={handleAddSubject}
            className="px-4 py-2 bg-primary-purple text-white rounded-lg hover:bg-opacity-90"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.subjects_needed.map((subject, idx) => (
            <span
              key={idx}
              className="bg-primary-orange bg-opacity-10 text-primary-orange px-3 py-1 rounded-full text-sm flex items-center gap-2"
            >
              {subject}
              <button
                type="button"
                onClick={() => handleRemoveSubject(subject)}
                className="hover:text-red-600"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        {formData.subjects_needed.length === 0 && (
          <p className="text-xs text-red-500 mt-1">Please add at least one subject</p>
        )}
      </div>

      <div className="flex gap-4 pt-4 border-t">
        <button
          type="submit"
          disabled={loading || formData.subjects_needed.length === 0}
          className="flex-1 bg-primary-purple text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : student ? 'Update Student' : 'Create Student'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default StudentForm;

