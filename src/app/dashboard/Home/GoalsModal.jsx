import React, { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../utils/axiosMiddleware";

const GoalsModal = ({
  isOpen,
  onClose,
  isEditing,
  formData,
  onSubmit,
  onChange,
  onDelete,
  handleStatusChange,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showUpdateConfirm, setShowUpdateConfirm] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [organizations, setOrganizations] = useState([]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      setShowUpdateConfirm(true);
    } else {
      onSubmit(e);
    }
  };

  const handleDeleteClick = () => {
    setShowUpdateConfirm(false);
    setShowDeleteConfirm(true);
  };

  const handleUpdateClick = () => {
    setShowDeleteConfirm(false);
    setShowUpdateConfirm(true);
  };

  const handleConfirmDelete = () => {
    onDelete();
    setShowDeleteConfirm(false);
  };

  const handleConfirmUpdate = () => {
    onSubmit({ preventDefault: () => {} });
    setShowUpdateConfirm(false);
  };

  const fetchOrganizations = async () => {
    try {
      const response = await axiosInstance.get(`/orggetonly`);
      setOrganizations(response.data);
    } catch (error) {
      toast.error("Error fetching goals", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  useEffect(() => {
    if (!organizations.length) fetchOrganizations();
  }, []);

  return (
    <>
      {/* <ToastContainer style={{ fontSize: "12px", zIndex: 1000 }} /> */}
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 pt-[40px]">
        <div className="bg-white rounded-lg w-full max-w-[370px] relative overflow-y-auto min-h-[20em] max-h-[90vh] scrollable-content m-4">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <FiX className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl text-gray-800">
              {isEditing ? "Edit Organization Goals" : "Add Organization Goals"}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              {isEditing
                ? "Modify, delete or mark goals as completed here"
                : "Add goals with descriptions and deadlines to keep your goals on track."}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            {/* Status Dropdown */}
            <div>
              <label className={`block text-sm font-medium text-gray-700 mb-1`}>
                Status
              </label>
              <div className="relative">
                <button
                  type="button"
                  className="flex items-center w-full rounded-md py-2 text-left text-sm text-gray-700 bg-white focus:outline-none"
                  onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                >
                  <div className="flex items-center gap-2">
                    {formData.status === "not_started" && (
                      <span className="w-4 h-4 rounded-full border-[1.5px] border-gray-300"></span>
                    )}
                    {formData.status === "in_progress" && (
                      <span className="w-4 h-4 rounded-full bg-[#FDB022]"></span>
                    )}
                    {formData.status === "completed" && (
                      <span className="w-4 h-4 rounded-full bg-[#12B76A]"></span>
                    )}
                    <span>
                      {formData.status === "not_started" && "Not Started"}
                      {formData.status === "in_progress" && "In Progress"}
                      {formData.status === "completed" && "Completed"}
                    </span>
                    <svg
                      className="w-5 h-5 text-gray-400 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {isStatusDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg py-1">
                    {[
                      {
                        id: "not_started",
                        label: "Not Started",
                        icon: (
                          <span className="w-4 h-4 rounded-full border-[1.5px] border-gray-300"></span>
                        ),
                      },
                      {
                        id: "in_progress",
                        label: "In Progress",
                        icon: (
                          <span className="w-4 h-4 rounded-full bg-[#FDB022]"></span>
                        ),
                      },
                      {
                        id: "completed",
                        label: "Completed",
                        icon: (
                          <span className="w-4 h-4 rounded-full bg-[#12B76A]"></span>
                        ),
                      },
                    ].map((status) => (
                      <button
                        key={status.id}
                        type="button"
                        className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => {
                          handleStatusChange(status.id);
                          setIsStatusDropdownOpen(false);
                        }}
                      >
                        <div className="flex items-center gap-2">
                          {status.icon}
                          <span>{status.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Select 'completed' status to move the task to completed section
              </p>
            </div>

            {/* Goal Name */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Goal Name
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={onChange}
                placeholder="Name"
                className="w-full p-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
              />
            </div>

            {/* Organization */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Organization
              </label>
              <select
                name="organization"
                value={formData.organization}
                onChange={onChange}
                className="w-full p-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
              >
                <option value="">Select Organization</option>
                {organizations.map((organization) => (
                  <option key={organization.id} value={organization.id}>
                    {organization.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Goal Description */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Goal Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={onChange}
                placeholder="Details....."
                rows="4"
                className="w-full p-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
              />
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Due Date
              </label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={onChange}
                className="w-full p-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
              />
            </div>

            {/* Action Buttons */}
            {isEditing ? (
              <div className="space-y-2">
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleDeleteClick}
                    className={`flex-1 py-2 border border-red-500 rounded-lg text-sm ${
                      showDeleteConfirm
                        ? "bg-red-500 text-white"
                        : "text-red-500 bg-white hover:bg-red-50"
                    }`}
                  >
                    Delete Goal
                  </button>
                  <button
                    type="submit"
                    onClick={handleUpdateClick}
                    className={`flex-1 py-2 rounded-lg text-sm ${
                      showUpdateConfirm
                        ? "bg-blue-500 text-white"
                        : "text-blue-500 bg-whiten border border-blue-500 hover:bg-blue-50"
                    }`}
                  >
                    Update
                  </button>
                </div>

                {showDeleteConfirm && (
                  <div className="space-y-2">
                    <p className="text-center text-sm text-gray-600">
                      Click on delete to proceed
                    </p>
                    <button
                      type="button"
                      onClick={handleConfirmDelete}
                      className="w-full py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 text-sm"
                    >
                      Submit
                    </button>
                  </div>
                )}

                {showUpdateConfirm && (
                  <div className="space-y-2">
                    <p className="text-center text-sm text-gray-600">
                      Click on update to proceed
                    </p>
                    <button
                      type="button"
                      onClick={handleConfirmUpdate}
                      className="w-full py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 text-sm"
                    >
                      Submit
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2 text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 text-sm"
                >
                  Add Goal
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default GoalsModal;
