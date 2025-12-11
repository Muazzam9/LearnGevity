import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../hooks/useAuth';
import StudentTable from '../../components/admin/StudentTable';
import StudentForm from '../../components/admin/StudentForm';
import Modal from '../../components/Modal';
import Alert from '../../components/Alert';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [alert, setAlert] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('name');

      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
      showAlert('error', 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = () => {
    setSelectedStudent(null);
    setShowModal(true);
  };

  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  const handleDeleteStudent = (student) => {
    setDeleteConfirm(student);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;

    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', deleteConfirm.id);

      if (error) throw error;
      showAlert('success', 'Student deleted successfully');
      fetchStudents();
    } catch (error) {
      console.error('Error deleting student:', error);
      showAlert('error', 'Failed to delete student');
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleFormSuccess = (message) => {
    setShowModal(false);
    setSelectedStudent(null);
    showAlert('success', message);
    fetchStudents();
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
                <Link to="/admin/tutors" className="text-gray-700 hover:text-primary-purple">Tutors</Link>
                <Link to="/admin/students" className="text-primary-purple font-semibold">Students</Link>
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
          <h1 className="text-3xl font-bold text-primary-navy">Student Management</h1>
          <button
            onClick={handleAddStudent}
            className="bg-primary-purple text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Student
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

        {/* Student Table */}
        <StudentTable
          students={students}
          loading={loading}
          onEdit={handleEditStudent}
          onDelete={handleDeleteStudent}
        />
      </div>

      {/* Add/Edit Student Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedStudent(null);
        }}
        title={selectedStudent ? 'Edit Student' : 'Add New Student'}
        size="lg"
      >
        <StudentForm
          student={selectedStudent}
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setShowModal(false);
            setSelectedStudent(null);
          }}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Student"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete {deleteConfirm?.name}? This will also delete all associated session records. This action cannot be undone.
          </p>
          <div className="flex gap-4">
            <button
              onClick={confirmDelete}
              className="flex-1 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700"
            >
              Delete
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

export default StudentManagement;

