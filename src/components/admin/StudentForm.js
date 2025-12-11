import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

const StudentForm = ({ student, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    parent_name: '',
    parent_email: '',
    parent_phone: '',
    subjects_needed: [],
  });
  const [subjectInput, setSubjectInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || '',
        age: student.age || '',
        parent_name: student.parent_name || '',
        parent_email: student.parent_email || '',
        parent_phone: student.parent_phone || '',
        subjects_needed: student.subjects_needed || [],
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
        name: formData.name,
        age: parseInt(formData.age),
        parent_name: formData.parent_name,
        parent_email: formData.parent_email,
        parent_phone: formData.parent_phone,
        subjects_needed: formData.subjects_needed,
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
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Student Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
            placeholder="Jane Smith"
          />
        </div>

        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
            Age
          </label>
          <input
            type="number"
            id="age"
            name="age"
            min="1"
            max="100"
            value={formData.age}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
            placeholder="15"
          />
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Parent/Guardian Information</h3>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="parent_name" className="block text-sm font-medium text-gray-700 mb-2">
              Parent/Guardian Name *
            </label>
            <input
              type="text"
              id="parent_name"
              name="parent_name"
              required
              value={formData.parent_name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
              placeholder="John Smith"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="parent_email" className="block text-sm font-medium text-gray-700 mb-2">
                Parent Email *
              </label>
              <input
                type="email"
                id="parent_email"
                name="parent_email"
                required
                value={formData.parent_email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
                placeholder="parent@example.com"
              />
            </div>

            <div>
              <label htmlFor="parent_phone" className="block text-sm font-medium text-gray-700 mb-2">
                Parent Phone *
              </label>
              <input
                type="tel"
                id="parent_phone"
                name="parent_phone"
                required
                value={formData.parent_phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
                placeholder="(555) 123-4567"
              />
            </div>
          </div>
        </div>
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

