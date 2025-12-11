import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../hooks/useAuth';
import TutorTable from '../../components/admin/TutorTable';
import TutorForm from '../../components/admin/TutorForm';
import Modal from '../../components/Modal';
import Alert from '../../components/Alert';

const TutorManagement = () => {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [alert, setAlert] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTutors();
  }, []);

  const fetchTutors = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tutors')
        .select('*')
        .order('name');

      if (error) throw error;
      setTutors(data || []);
    } catch (error) {
      console.error('Error fetching tutors:', error);
      showAlert('error', 'Failed to load tutors');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTutor = () => {
    setSelectedTutor(null);
    setShowModal(true);
  };

  const handleEditTutor = (tutor) => {
    setSelectedTutor(tutor);
    setShowModal(true);
  };

  const handleDeleteTutor = (tutor) => {
    setDeleteConfirm(tutor);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;

    try {
      if (deleteConfirm.is_active) {
        // Deactivate tutor
        const { error } = await supabase
          .from('tutors')
          .update({ is_active: false })
          .eq('id', deleteConfirm.id);

        if (error) throw error;
        showAlert('success', 'Tutor deactivated successfully');
      } else {
        // Delete tutor
        const { error } = await supabase
          .from('tutors')
          .delete()
          .eq('id', deleteConfirm.id);

        if (error) throw error;
        showAlert('success', 'Tutor deleted successfully');
      }

      fetchTutors();
    } catch (error) {
      console.error('Error deleting tutor:', error);
      showAlert('error', 'Failed to delete tutor');
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleFormSuccess = (message) => {
    setShowModal(false);
    setSelectedTutor(null);
    showAlert('success', message);
    fetchTutors();
  };

  const showAlert = (type, message) => {
    setAlert({ type, message });
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/admin/dashboard" className="text-2xl font-bold text-primary-navy">
                LearnGevity Admin
              </Link>
              <div className="ml-10 flex space-x-4">
                <Link to="/admin/tutors" className="text-primary-purple font-semibold">Tutors</Link>
                <Link to="/admin/students" className="text-gray-700 hover:text-primary-purple">Students</Link>
                <Link to="/admin/sessions" className="text-gray-700 hover:text-primary-purple">Sessions</Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 text-sm">{user?.email}</span>
              <button
                onClick={handleSignOut}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 text-sm"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary-navy">Tutor Management</h1>
          <button
            onClick={handleAddTutor}
            className="bg-primary-purple text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Tutor
          </button>
        </div>

        {/* Alert */}
        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
            autoClose={true}
          />
        )}

        {/* Tutor Table */}
        <TutorTable
          tutors={tutors}
          loading={loading}
          onEdit={handleEditTutor}
          onDelete={handleDeleteTutor}
        />
      </div>

      {/* Add/Edit Tutor Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedTutor(null);
        }}
        title={selectedTutor ? 'Edit Tutor' : 'Add New Tutor'}
        size="lg"
      >
        <TutorForm
          tutor={selectedTutor}
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setShowModal(false);
            setSelectedTutor(null);
          }}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title={deleteConfirm?.is_active ? 'Deactivate Tutor' : 'Delete Tutor'}
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            {deleteConfirm?.is_active
              ? `Are you sure you want to deactivate ${deleteConfirm?.name}? They will no longer appear on the public tutors page, but their data will be preserved.`
              : `Are you sure you want to permanently delete ${deleteConfirm?.name}? This action cannot be undone.`
            }
          </p>
          <div className="flex gap-4">
            <button
              onClick={confirmDelete}
              className="flex-1 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700"
            >
              {deleteConfirm?.is_active ? 'Deactivate' : 'Delete'}
            </button>
            <button
              onClick={() => setDeleteConfirm(null)}
              className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TutorManagement;

