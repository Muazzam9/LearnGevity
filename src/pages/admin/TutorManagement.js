import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import AdminLayout from "../../components/admin/AdminLayout";
import TutorTable from "../../components/admin/TutorTable";
import TutorForm from "../../components/admin/TutorForm";
import Modal from "../../components/Modal";
import Alert from "../../components/Alert";
import { FaPlus } from "react-icons/fa";

const TutorManagement = () => {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [alert, setAlert] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchTutors();
  }, []);

  const fetchTutors = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("tutors")
        .select("*")
        .order("name");

      if (error) throw error;
      setTutors(data || []);
    } catch (error) {
      console.error("Error fetching tutors:", error);
      showAlert("error", "Failed to load tutors");
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
          .from("tutors")
          .update({ is_active: false })
          .eq("id", deleteConfirm.id);

        if (error) throw error;
        showAlert("success", "Tutor deactivated successfully");
      } else {
        // Delete tutor
        const { error } = await supabase
          .from("tutors")
          .delete()
          .eq("id", deleteConfirm.id);

        if (error) throw error;
        showAlert("success", "Tutor deleted successfully");
      }

      fetchTutors();
    } catch (error) {
      console.error("Error deleting tutor:", error);
      showAlert("error", "Failed to delete tutor");
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleFormSuccess = (message) => {
    setShowModal(false);
    setSelectedTutor(null);
    showAlert("success", message);
    fetchTutors();
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
        <div className="overflow-x-auto">
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
        title={selectedTutor ? "Edit Tutor" : "Add New Tutor"}
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
        title={deleteConfirm?.is_active ? "Deactivate Tutor" : "Delete Tutor"}
        size="sm"
      >
        <div className="space-y-5">
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
            <p className="text-gray-700 leading-relaxed">
              {deleteConfirm?.is_active
                ? `Are you sure you want to deactivate ${deleteConfirm?.name}? They will no longer appear on the public tutors page, but their data will be preserved.`
                : `Are you sure you want to permanently delete ${deleteConfirm?.name}? This action cannot be undone.`}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={confirmDelete}
              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all duration-300"
            >
              {deleteConfirm?.is_active ? "Deactivate" : "Delete"}
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

export default TutorManagement;
