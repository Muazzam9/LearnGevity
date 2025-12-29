import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../hooks/useAuth';
import TutorTable from '../../components/admin/TutorTable';
import TutorForm from '../../components/admin/TutorForm';
import Modal from '../../components/Modal';
import Alert from '../../components/Alert';
import { FaPlus, FaChalkboardTeacher, FaUserGraduate, FaCalendarAlt, FaHome } from 'react-icons/fa';

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4 sm:space-x-8 lg:space-x-12 overflow-x-auto">
              <Link to="/admin/dashboard" className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary-purple to-primary-navy bg-clip-text text-transparent whitespace-nowrap flex items-center gap-2">
                <FaHome className="text-primary-navy text-base sm:text-lg" />
                <span className="hidden sm:inline">LearnGevity Admin</span>
              </Link>
              <div className="flex space-x-2 sm:space-x-3 lg:space-x-4">
                <Link to="/admin/tutors" className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 lg:px-5 py-2 rounded-lg bg-gradient-to-r from-primary-purple to-primary-purple/80 text-white font-semibold text-xs sm:text-sm whitespace-nowrap">
                  <FaChalkboardTeacher />
                  <span>Tutors</span>
                </Link>
                <Link to="/admin/students" className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 lg:px-5 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors text-xs sm:text-sm whitespace-nowrap">
                  <FaUserGraduate />
                  <span>Students</span>
                </Link>
                <Link to="/admin/sessions" className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 lg:px-5 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors text-xs sm:text-sm whitespace-nowrap">
                  <FaCalendarAlt />
                  <span>Sessions</span>
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Link
                to="/"
                className="hidden sm:flex items-center gap-1.5 bg-primary-purple/10 text-primary-purple px-3 py-2 rounded-lg hover:bg-primary-purple/20 transition-colors text-xs font-semibold whitespace-nowrap border border-primary-purple/20"
                title="View Public Website"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="hidden md:inline">Website</span>
              </Link>
              <span className="text-gray-700 text-xs truncate max-w-[100px] sm:max-w-none hidden sm:inline">{user?.email}</span>
              <button
                onClick={handleSignOut}
                className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 text-xs sm:text-sm transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-primary-navy mb-1">
              Tutor Management
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Manage tutor profiles and accounts
            </p>
          </div>
          <button
            onClick={handleAddTutor}
            className="bg-gradient-to-r from-primary-purple to-primary-navy text-white px-5 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <FaPlus className="text-sm" />
            <span>Add New Tutor</span>
          </button>
        </div>

        {/* Alert */}
        {alert && (
          <div className="mb-6">
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert(null)}
              autoClose={true}
            />
          </div>
        )}

        {/* Tutor Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <TutorTable
            tutors={tutors}
            loading={loading}
            onEdit={handleEditTutor}
            onDelete={handleDeleteTutor}
          />
        </div>
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
        <div className="space-y-5">
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
            <p className="text-gray-700 leading-relaxed">
              {deleteConfirm?.is_active
                ? `Are you sure you want to deactivate ${deleteConfirm?.name}? They will no longer appear on the public tutors page, but their data will be preserved.`
                : `Are you sure you want to permanently delete ${deleteConfirm?.name}? This action cannot be undone.`
              }
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={confirmDelete}
              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all duration-300"
            >
              {deleteConfirm?.is_active ? 'Deactivate' : 'Delete'}
            </button>
            <button
              onClick={() => setDeleteConfirm(null)}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-300 transition-colors"
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

