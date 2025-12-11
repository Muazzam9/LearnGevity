import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

const TutorForm = ({ tutor, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    photo_url: '',
    subjects: [],
    bio: '',
    hourly_rate: '',
    password: '',
  });
  const [subjectInput, setSubjectInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (tutor) {
      setFormData({
        name: tutor.name || '',
        email: tutor.email || '',
        phone: tutor.phone || '',
        photo_url: tutor.photo_url || '',
        subjects: tutor.subjects || [],
        bio: tutor.bio || '',
        hourly_rate: tutor.hourly_rate || '',
        password: '', // Never pre-fill password
      });
    }
  }, [tutor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSubject = () => {
    const trimmed = subjectInput.trim();
    if (trimmed && !formData.subjects.includes(trimmed)) {
      setFormData(prev => ({
        ...prev,
        subjects: [...prev.subjects, trimmed]
      }));
      setSubjectInput('');
    }
  };

  const handleRemoveSubject = (subject) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.filter(s => s !== subject)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (tutor) {
        // Update existing tutor
        const { error: updateError } = await supabase
          .from('tutors')
          .update({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            photo_url: formData.photo_url,
            subjects: formData.subjects,
            bio: formData.bio,
            hourly_rate: parseFloat(formData.hourly_rate),
          })
          .eq('id', tutor.id);

        if (updateError) throw updateError;

        // If password provided, update auth user password
        if (formData.password) {
          const { error: passwordError } = await supabase.auth.admin.updateUserById(
            tutor.user_id,
            { password: formData.password }
          );
          if (passwordError) {
            console.error('Password update error:', passwordError);
            // Don't fail the whole operation if password update fails
          }
        }

        onSuccess('Tutor updated successfully!');
      } else {
        // Create new tutor with auth account using database function
        // This prevents the admin from being logged out
        const { data, error: rpcError } = await supabase.rpc('create_tutor_account', {
          p_email: formData.email,
          p_password: formData.password,
          p_name: formData.name,
          p_phone: formData.phone || null,
          p_photo_url: formData.photo_url || null,
          p_subjects: formData.subjects,
          p_bio: formData.bio || null,
          p_hourly_rate: parseFloat(formData.hourly_rate),
        });

        if (rpcError) throw rpcError;
        if (!data) throw new Error('Failed to create tutor account');

        onSuccess('Tutor created successfully!');
      }
    } catch (err) {
      console.error('Error saving tutor:', err);
      setError(err.message || 'Failed to save tutor');
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
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
            placeholder="John Doe"
          />
        </div>

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
            disabled={!!tutor}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent disabled:bg-gray-100"
            placeholder="john@example.com"
          />
          {tutor && (
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed after creation</p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
            placeholder="(555) 123-4567"
          />
        </div>

        <div>
          <label htmlFor="hourly_rate" className="block text-sm font-medium text-gray-700 mb-2">
            Hourly Rate ($) *
          </label>
          <input
            type="number"
            id="hourly_rate"
            name="hourly_rate"
            required
            min="0"
            step="0.01"
            value={formData.hourly_rate}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
            placeholder="50.00"
          />
        </div>
      </div>

      <div>
        <label htmlFor="photo_url" className="block text-sm font-medium text-gray-700 mb-2">
          Photo URL
        </label>
        <input
          type="url"
          id="photo_url"
          name="photo_url"
          value={formData.photo_url}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
          placeholder="https://example.com/photo.jpg"
        />
        <p className="text-xs text-gray-500 mt-1">Provide a URL to the tutor's profile photo</p>
      </div>

      <div>
        <label htmlFor="subjects" className="block text-sm font-medium text-gray-700 mb-2">
          Subjects *
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
          {formData.subjects.map((subject, idx) => (
            <span
              key={idx}
              className="bg-primary-purple bg-opacity-10 text-primary-purple px-3 py-1 rounded-full text-sm flex items-center gap-2"
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
        {formData.subjects.length === 0 && (
          <p className="text-xs text-red-500 mt-1">Please add at least one subject</p>
        )}
      </div>

      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          rows="4"
          value={formData.bio}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
          placeholder="Tell us about the tutor's experience and qualifications..."
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          Password {!tutor && '*'}
        </label>
        <input
          type="password"
          id="password"
          name="password"
          required={!tutor}
          value={formData.password}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
          placeholder={tutor ? "Leave blank to keep current password" : "Set initial password"}
          minLength="6"
        />
        <p className="text-xs text-gray-500 mt-1">
          {tutor 
            ? "Only fill this if you want to change the password" 
            : "Minimum 6 characters required"
          }
        </p>
      </div>

      <div className="flex gap-4 pt-4 border-t">
        <button
          type="submit"
          disabled={loading || formData.subjects.length === 0}
          className="flex-1 bg-primary-purple text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : tutor ? 'Update Tutor' : 'Create Tutor'}
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

export default TutorForm;

