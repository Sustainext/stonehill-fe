import React, { useState, useEffect } from 'react';
import { FiX, FiFileText, FiDownload } from 'react-icons/fi';
import Moment from 'react-moment';
import { getLocationName } from '../../../utils/locationName';

const TaskDetailsModal = ({ isOpen, onClose, task }) => {
  const [showFilePreview, setShowFilePreview] = useState(false);

  const handleFileClick = (e) => {
    e.preventDefault();
    if (task.file_data?.url) {
      setShowFilePreview(true);
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      not_started: 'Not Started',
      in_progress: 'In Progress',
      under_review: 'Under Review',
      completed: 'Completed',
      approved: 'Approved',
      reject: 'Rejected',
    };
    return labels[status] || status;
  };

  const [locationName, setLocationName] = useState('');

  useEffect(() => {
    const fetchLocationName = async () => {
      if (task?.location) {
        try {
          console.log('data of location', task.location);
          const name = await getLocationName(task.location);
          console.log('name of location', name);

          setLocationName(name);
        } catch (error) {
          console.error('Error fetching location name:', error);
          setLocationName(task.location);
        }
      }
    };

    fetchLocationName();
  }, [task?.location]);

  if (!isOpen || !task) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className={`flex ${showFilePreview ? 'gap-4' : ''}`}>
        {/* Main Task Details */}
        <div className='bg-white rounded-lg p-6 w-full max-w-md max-h-[95vh] relative overflow-auto table-scrollbar'>
          {/* Close Button */}
          <button
            onClick={onClose}
            className='absolute right-2 top-2 text-gray-500 hover:text-gray-700'
          >
            <FiX size={18} />
          </button>

          {/* Task Name */}
          <h2 className='text-md font-medium text-gray-900 mb-6'>
            {task.task_name}
          </h2>

          {/* Basic Info */}
          <div className='space-y-4 mb-8'>
            <div className='flex'>
              <span className='w-32 text-gray-600 text-sm'>Status</span>
              <span className='text-green-600 font-medium text-sm'>
                {getStatusLabel(task.task_status)}
              </span>
            </div>

            <div className='flex'>
              <span className='w-32 text-gray-600 text-sm'>Assigned On</span>
              <span className='text-gray-700 text-sm'>
                <Moment format='DD/MM/YYYY'>{task.created_at}</Moment>
              </span>
            </div>

            <div className='flex'>
              <span className='w-32 text-gray-600 text-sm'>Due Date</span>
              <span className='text-gray-700 text-sm'>
                <Moment format='DD/MM/YYYY'>{task.deadline}</Moment>
              </span>
            </div>

            <div className='flex flex-col'>
              <span className='w-32 text-gray-600 text-sm'>Assigned by</span>
              <div className='ml-32 -mt-5 text-sm'>
                <p className='text-gray-700'>{task.assign_by_name}</p>
                <p className='text-gray-500 text-sm'>{task.assign_by_email}</p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className='border-b border-gray-200 my-6'></div>

          {/* Task Details */}
          <div className='space-y-4 mb-8'>
            <div className='flex'>
              <span className='w-32 text-gray-600 text-sm'>Location</span>
              <span className='text-gray-700 text-sm'>
                {locationName || 'loading...'}
              </span>
            </div>

            <div className='flex'>
              <span className='w-32 text-gray-600 text-sm'>Year</span>
              <span className='text-gray-700 text-sm'>{task.year}</span>
            </div>

            <div className='flex'>
              <span className='w-32 text-gray-600 text-sm'>Month</span>
              <span className='text-gray-700 text-sm'>{task.month}</span>
            </div>

            <div className='flex'>
              <span className='w-32 text-gray-600 text-sm'>Scope</span>
              <span className='text-gray-700 text-sm'>Scope {task.scope}</span>
            </div>

            <div className='flex'>
              <span className='w-32 text-gray-600 text-sm'>Category</span>
              <span className='text-gray-700 text-sm'>{task.category}</span>
            </div>

            <div className='flex'>
              <span className='w-32 text-gray-600 text-sm'>Sub-Category</span>
              <span className='text-gray-700 text-sm'>{task.subcategory}</span>
            </div>
          </div>

          {/* Data Review Section */}
          <div>
            <h3 className='text-gray-900 font-medium mb-4'>Data reviewed:</h3>
            <div className='space-y-4'>
              <div className='flex'>
                <span className='w-32 text-gray-600 text-sm'>Activity</span>
                <span className='text-gray-700 text-sm'>{task.activity}</span>
              </div>

              <div className='flex'>
                <span className='w-32 text-gray-600 text-sm'>Quantity</span>
                <span className='text-gray-700 text-sm'>{task.value1}</span>
              </div>

              <div className='flex'>
                <span className='w-32 text-gray-600 text-sm'>Unit</span>
                <span className='text-gray-700 text-sm'>{task.unit1}</span>
              </div>

              <div className='flex'>
                <span className='w-32 text-gray-600 text-sm'>Attachment</span>
                <div className='flex items-center space-x-2 text-sm'>
                  <FiFileText className='text-green-600' size={20} />
                  <div>
                    {task.file_data?.url ? (
                      <>
                        <div className='flex items-center gap-2'>
                          <a
                            href='#'
                            onClick={handleFileClick}
                            className='text-blue-600 hover:underline'
                          >
                            {task.file_data.name}
                          </a>
                          <a
                            href={task.file_data.url}
                            download
                            className='text-gray-500 hover:text-gray-700'
                            onClick={(e) => e.stopPropagation()}
                          >
                            <FiDownload size={16} />
                          </a>
                        </div>
                        <p className='text-gray-500 text-sm'>
                          {task.file_data.uploadDateTime} •{' '}
                          {(task.file_data.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </>
                    ) : (
                      'No file available'
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* File Preview Modal */}
        {showFilePreview && (
          <div className='bg-white rounded-lg w-[800px] max-h-[95vh] relative flex flex-col'>
            <div className='p-4 border-b border-gray-200 flex justify-between items-center'>
              <h3 className='text-lg font-medium text-gray-900'>
                {task.file_data.name}
              </h3>
              <button
                onClick={() => setShowFilePreview(false)}
                className='text-gray-500 hover:text-gray-700'
              >
                <FiX size={24} />
              </button>
            </div>
            <div className='flex-1 p-4'>
              {task.file_data.type?.startsWith('image/') ||
              task.file_data.type === 'application/pdf' ? (
                <iframe
                  src={task.file_data.url}
                  className='w-full h-full rounded border border-gray-200'
                  title='File Preview'
                />
              ) : (
                <div className='flex flex-col items-center justify-center h-full'>
                  <p className='text-gray-600 mb-4'>
                    Preview not available for this file type
                  </p>
                  <a
                    href={task.file_data.url}
                    download
                    className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600'
                  >
                    Download File
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDetailsModal;
