import React, { useState } from "react";
import { FiX, FiFileText, FiDownload } from "react-icons/fi";

const TaskDetailsModal = ({ isOpen, onClose, task }) => {
  const [showFilePreview, setShowFilePreview] = useState(false);

  if (!isOpen || !task) return null;

  const handleFileClick = (e) => {
    e.preventDefault();
    if (task.file_data?.url) {
      setShowFilePreview(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`flex ${showFilePreview ? "gap-4" : ""}`}>
        {/* Main Task Details */}
        <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[95vh] relative overflow-auto table-scrollbar">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          >
            <FiX size={24} />
          </button>

          {/* Task Name */}
          <h2 className="text-2xl font-medium text-gray-900 mb-6">
            {task.task_name}
          </h2>

          {/* Basic Info */}
          <div className="space-y-4 mb-8">
            <div className="flex">
              <span className="w-32 text-gray-600">Status</span>
              <span className="text-green-600 font-medium">
                {task.task_status}
              </span>
            </div>

            <div className="flex">
              <span className="w-32 text-gray-600">Assigned on</span>
              <span className="text-gray-700">
                {new Date(task.created_at).toLocaleString("en-GB", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: false,
                })}
              </span>
            </div>

            <div className="flex">
              <span className="w-32 text-gray-600">Due Date</span>
              <span className="text-gray-700">{task.deadline}</span>
            </div>

            <div className="flex flex-col">
              <span className="w-32 text-gray-600">Assigned by</span>
              <div className="ml-32 -mt-5">
                <p className="text-gray-700">{task.assigned_by_name}</p>
                <p className="text-gray-500 text-sm">{task.assign_by_email}</p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-b border-gray-200 my-6"></div>

          {/* Task Details */}
          <div className="space-y-4 mb-8">
            <div className="flex">
              <span className="w-32 text-gray-600">Location</span>
              <span className="text-gray-700">{task.location}</span>
            </div>

            <div className="flex">
              <span className="w-32 text-gray-600">Year</span>
              <span className="text-gray-700">{task.year}</span>
            </div>

            <div className="flex">
              <span className="w-32 text-gray-600">Month</span>
              <span className="text-gray-700">{task.month}</span>
            </div>

            <div className="flex">
              <span className="w-32 text-gray-600">Scope</span>
              <span className="text-gray-700">{task.scope}</span>
            </div>

            <div className="flex">
              <span className="w-32 text-gray-600">Category</span>
              <span className="text-gray-700">{task.category}</span>
            </div>

            <div className="flex">
              <span className="w-32 text-gray-600">Sub-Category</span>
              <span className="text-gray-700">{task.subcategory}</span>
            </div>
          </div>

          {/* Data Review Section */}
          <div>
            <h3 className="text-gray-900 font-medium mb-4">Data reviewed:</h3>
            <div className="space-y-4">
              <div className="flex">
                <span className="w-32 text-gray-600">Activity</span>
                <span className="text-gray-700">{task.activity}</span>
              </div>

              <div className="flex">
                <span className="w-32 text-gray-600">Quantity</span>
                <span className="text-gray-700">{task.value1}</span>
              </div>

              <div className="flex">
                <span className="w-32 text-gray-600">Unit</span>
                <span className="text-gray-700">{task.unit1}</span>
              </div>

              <div className="flex">
                <span className="w-32 text-gray-600">Attachment</span>
                <div className="flex items-center space-x-2">
                  <FiFileText className="text-green-600" size={20} />
                  <div>
                    {task.file_data?.url ? (
                      <>
                        <div className="flex items-center gap-2">
                          <a
                            href="#"
                            onClick={handleFileClick}
                            className="text-blue-600 hover:underline"
                          >
                            {task.file_data.name}
                          </a>
                          <a
                            href={task.file_data.url}
                            download
                            className="text-gray-500 hover:text-gray-700"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <FiDownload size={16} />
                          </a>
                        </div>
                        <p className="text-gray-500 text-sm">
                          {task.file_data.uploadDateTime} •{" "}
                          {(task.file_data.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </>
                    ) : (
                      "No file available"
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* File Preview Modal */}
        {showFilePreview && (
          <div className="bg-white rounded-lg w-[800px] max-h-[95vh] relative flex flex-col">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                {task.file_data.name}
              </h3>
              <button
                onClick={() => setShowFilePreview(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={24} />
              </button>
            </div>
            <div className="flex-1 p-4">
              <iframe
                src={task.file_data.url}
                className="w-full h-full rounded border border-gray-200"
                title="File Preview"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDetailsModal;
