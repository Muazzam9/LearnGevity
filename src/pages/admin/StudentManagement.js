import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import AdminLayout from "../../components/admin/AdminLayout";
import StudentTable from "../../components/admin/StudentTable";
import StudentForm from "../../components/admin/StudentForm";
import Modal from "../../components/Modal";
import Alert from "../../components/Alert";
import { FaPlus } from "react-icons/fa";

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [alert, setAlert] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .order("first_name");

      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error("Error fetching students:", error);
      showAlert("error", "Failed to load students");
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
        .from("students")
        .delete()
        .eq("id", deleteConfirm.id);

      if (error) throw error;
      showAlert("success", "Student deleted successfully");
      fetchStudents();
    } catch (error) {
      console.error("Error deleting student:", error);
      showAlert("error", "Failed to delete student");
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleFormSuccess = (message) => {
    setShowModal(false);
    setSelectedStudent(null);
    showAlert("success", message);
    fetchStudents();
  };

  const showAlert = (type, message) => {
    setAlert({ type, message });
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-primary-navy mb-1">
            Student Management
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Manage student profiles and information
          </p>
        </div>
        <button
          onClick={handleAddStudent}
          className="bg-gradient-to-r from-primary-orange to-primary-orange/80 text-white px-5 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap"
        >
          <FaPlus className="text-sm" />
          <span>Add New Student</span>
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

      {/* Student Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <StudentTable
            students={students}
            loading={loading}
            onEdit={handleEditStudent}
            onDelete={handleDeleteStudent}
          />
        </div>
      </div>

      {/* Add/Edit Student Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedStudent(null);
        }}
        title={selectedStudent ? "Edit Student" : "Add New Student"}
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
        <div className="space-y-5">
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
            <p className="text-gray-700 leading-relaxed">
              Are you sure you want to delete {deleteConfirm?.first_name}{" "}
              {deleteConfirm?.last_name}? This will also delete all associated
              session records. This action cannot be undone.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={confirmDelete}
              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all duration-300"
            >
              Delete
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
    </AdminLayout>
  );
};

export default StudentManagement;
