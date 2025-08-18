import React, { useState, useEffect } from 'react';
import { FiX, FiFileText, FiDownload } from 'react-icons/fi';

const TaskDetailsModal = ({ isOpen, onClose, task, setShowFilePreview }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setAnimate(true), 50);
    } else {
      setAnimate(false);
    }
  }, [isOpen]);

  const handleFileClick = (e) => {
    e.preventDefault();
    if (task.file_data?.url) {
      setShowFilePreview(true);
    }
  };

  const statusMap = {
    in_progress: 'text-yellow-500',
    approved: 'text-green-600',
    under_review: 'text-orange-400',
    completed: 'text-green-600',
    reject: 'text-red-500',
  };

  if (!isOpen || !task) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-30 flex justify-end z-50'>
      {/* Modal Content */}
      <div
        className='w-full xl:w-[30vw] md:w-[35vw] lg:w-[32vw] 2xl:w-[30vw] 4k:w-[30vw] 2k:w-[30vw] sm:w-[80vw] max-h-[90vh] m-4 bg-white rounded-lg shadow-lg overflow-y-auto table-scrollbar transition-transform duration-300 ease-in-out transform mt-[60px]'
        style={{ transform: animate ? 'translateX(0)' : 'translateX(100%)' }}
      >
        {/* Modal Header */}
        <div className='flex justify-between items-center p-4 border-b'>
          <h2 className='text-lg font-medium text-gray-900'>Task Details</h2>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700'
          >
            <FiX size={24} />
          </button>
        </div>

        {task.roles === 3 ? (
          <>
            <div className='bg-white rounded-lg xl:w-[30vw] md:w-[30vw] lg:w-[30vw] 2xl:w-[30vw] 4k:w-[30vw] 2k:w-[30vw] w-[116vw] max-h-[90vh] overflow-y-auto table-scrollbar'>
              <div className='p-6'>
                {/* Content */}
                <div className='space-y-6'>
                  {/* Task Name */}
                  <input
                    type='text'
                    value={task?.task_name || ''}
                    disabled
                    className='w-full text-gray-900 bg-transparent border-gray-200 pb-2 font-medium'
                  />

                  <div className='border-t border-gray-200 mb-6 w-full'></div>

                  {/* Info Grid */}
                  <div className='grid grid-cols-3 gap-y-6'>
                    {/* Status */}
                    <div className='text-gray-600 text-sm'>Status</div>
                    <div
                      className={`col-span-2 text-sm ${
                        statusMap[task.task_status] || 'text-gray-500'
                      }`}
                    >
                      {task.task_status.replace('_', ' ')}{' '}
                    </div>

                    {/* Assigned on */}
                    <div className='text-gray-600 text-sm'>Assigned on</div>
                    <div className='col-span-2 text-sm'>
                      {new Date(task.created_at).toISOString().split('T')[0] ||
                        ''}
                    </div>

                    {/* Due Date */}
                    <div className='text-gray-600 text-sm'>Due Date</div>
                    <div className='col-span-2 text-sm'>{task?.deadline}</div>

                    {/* Assigned By */}
                    <div className='text-gray-600 text-sm'>Assigned by</div>
                    <div className='col-span-2'>
                      <p className='text-sm'>{task?.assign_by_user_name}</p>
                      <p className='text-sm text-gray-500'>
                        {task?.assign_by_email}
                      </p>
                    </div>

                    {/* Description */}
                    <div className='text-gray-600 text-sm'>Description</div>
                    <div className='col-span-2 text-sm'>
                      {task?.description || '-'}
                    </div>
                  </div>

                  <hr className='border-gray-200' />

                  {/* Comments */}
                  <div className='grid grid-cols-3 gap-y-6'>
                    <div className='text-gray-600 text-sm'>Comments</div>
                    <div className='col-span-2 text-sm whitespace-pre-wrap'>
                      {task?.comments_assignee || '-'}
                    </div>

                    {/* Attachment */}
                    <div className='text-gray-600 text-sm'>Attachment</div>
                    <div className='col-span-2'>
                      <div className='flex items-center gap-2 text-sm'>
                        <FiFileText className='w-5 h-5 text-green-600' />
                        {task.file_data?.url ? (
                          <div>
                            <button
                              onClick={() => setShowFilePreview(true)}
                              className='text-blue-600 hover:underline'
                            >
                              {task.file_data?.name}
                            </button>
                            <p className='text-xs text-gray-500'>
                              {isNaN(
                                new Date(
                                  task.file_data?.uploadDateTime
                                ).getTime()
                              )
                                ? task.file_data?.uploadDateTime
                                : new Date(
                                    task.file_data?.uploadDateTime
                                  ).toLocaleDateString('en-GB', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: '2-digit',
                                  })}{' '}
                              • {task.file_data?.size / 1000} kB
                            </p>
                          </div>
                        ) : (
                          'No file available'
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className='p-6 overflow-y-auto flex-1'>
              {/* Task Name */}
              <h3 className='text-xl font-medium text-gray-900 mb-6'>
                {task.task_name}
              </h3>

              <div className='border-b border-gray-200 my-6'></div>

              {/* Basic Info */}
              <div className='space-y-4 mb-6'>
                <div className='flex'>
                  <span className='w-32 text-gray-600'>Status</span>
                  <span className='text-green-600 font-medium'>
                    {task.task_status}
                  </span>
                </div>

                <div className='flex'>
                  <span className='w-32 text-gray-600'>Assigned on</span>
                  <span className='text-gray-700'>
                    {new Date(task.created_at).toLocaleString('en-GB', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: false,
                    })}
                  </span>
                </div>

                <div className='flex'>
                  <span className='w-32 text-gray-600'>Due Date</span>
                  <span className='text-gray-700'>{task.deadline}</span>
                </div>

                <div className='flex flex-col'>
                  <span className='w-32 text-gray-600'>Assigned by</span>
                  <div className='ml-32 -mt-5'>
                    <p className='text-gray-700'>{task.assigned_by_name}</p>
                    <p className='text-gray-500 text-sm'>
                      {task.assign_by_email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className='border-b border-gray-200 my-6'></div>

              {/* Additional Task Details */}
              <div className='space-y-4 mb-6'>
                <div className='flex'>
                  <span className='w-32 text-gray-600'>Location</span>
                  <span className='text-gray-700'>{task.location}</span>
                </div>

                <div className='flex'>
                  <span className='w-32 text-gray-600'>Year</span>
                  <span className='text-gray-700'>{task.year}</span>
                </div>

                <div className='flex'>
                  <span className='w-32 text-gray-600'>Month</span>
                  <span className='text-gray-700'>{task.month}</span>
                </div>

                <div className='flex'>
                  <span className='w-32 text-gray-600'>Scope</span>
                  <span className='text-gray-700'>{task.scope}</span>
                </div>

                <div className='flex'>
                  <span className='w-32 text-gray-600'>Category</span>
                  <span className='text-gray-700'>{task.category}</span>
                </div>

                <div className='flex'>
                  <span className='w-32 text-gray-600'>Sub-Category</span>
                  <span className='text-gray-700'>{task.subcategory}</span>
                </div>
              </div>

              {/* Data Review Section */}
              <div>
                <h3 className='text-gray-900 font-medium mb-4'>
                  Data reviewed:
                </h3>
                <div className='space-y-4'>
                  <div className='flex'>
                    <span className='w-32 text-gray-600'>Activity</span>
                    <span className='text-gray-700'>
                      {task.activity || '-'}
                    </span>
                  </div>

                  {task.activity.split('-')[2]?.includes('Over') ? (
                    <>
                      <div className='flex'>
                        <span className='w-32 text-gray-600'>Quantity 1</span>
                        <span className='text-gray-700'>
                          {task.value1 || '-'}
                        </span>
                      </div>

                      <div className='flex'>
                        <span className='w-32 text-gray-600'>Unit 1</span>
                        <span className='text-gray-700'>
                          {task.unit1 || '-'}
                        </span>
                      </div>
                      <div className='flex'>
                        <span className='w-32 text-gray-600'>Quantity 2</span>
                        <span className='text-gray-700'>
                          {task.value2 || '-'}
                        </span>
                      </div>

                      <div className='flex'>
                        <span className='w-32 text-gray-600'>Unit 2</span>
                        <span className='text-gray-700'>
                          {task.unit2 || '-'}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className='flex'>
                        <span className='w-32 text-gray-600'>Quantity</span>
                        <span className='text-gray-700'>
                          {task.value1 || '-'}
                        </span>
                      </div>

                      <div className='flex'>
                        <span className='w-32 text-gray-600'>Unit</span>
                        <span className='text-gray-700'>
                          {task.unit1 || '-'}
                        </span>
                      </div>
                    </>
                  )}

                  {/* File Attachment Section */}
                  <div className='flex items-center space-x-2'>
                    <span className='w-32 text-gray-600'>Attachment</span>
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
          </>
        )}
      </div>
    </div>
  );
};

export default TaskDetailsModal;
