import React from 'react';
import { FaCheckSquare, FaRegSquare } from 'react-icons/fa'; // Import checkbox icons

const BenefitTable = ({ locationdata, data }) => {
  const isDataEmpty = data.length === 0;
  return (
    <div
      style={{
        display: 'block',
        overflowX: 'auto',
        maxWidth: '100%',
        minWidth: '100%',
        width: '40vw',
      }}
      className='table-scrollbar'
    >
      <table
        className='w-full rounded-lg border-x border-t border-gray-300 '
        style={{ borderCollapse: 'separate', borderSpacing: 0 }}
      >
        <thead className=' md:table-header-group border sticky top-0 z-100  bg-white '>
          <tr className='gradient-background '>
            {/* Static header for "Significant location of operation" */}
            <th
              className='px-6 py-3 border-b border-gray-200 text-gray-500  text-[12px] text-left'
              style={{ minWidth: '200px' }}
            >
              Significant location of operation
            </th>

            {isDataEmpty ? (
              <th
                className='px-6 py-3 border-b border-gray-200 text-gray-500  text-[12px] text-left'
                style={{ minWidth: '200px' }}
              ></th>
            ) : (
              data.map((header, index) => (
                <th
                  key={index}
                  className='px-6 py-3 border-b border-gray-200 text-gray-500  text-[12px]'
                  style={{ minWidth: '200px' }}
                >
                  {header.hadername}
                </th>
              ))
            )}
          </tr>
        </thead>
        <tbody>
          {/* Render rows based on `locationdata` */}
          {locationdata.length > 0 ? (
            locationdata.map((location, rowIndex) => (
              <tr key={rowIndex}>
                {/* First column will show the location name */}
                <td className='px-6 py-4 border-b border-gray-200 text-gray-700 bg-white z-10 text-[12px] font-medium w-[20px]'>
                  {location.location_name}
                </td>

                {/* Render checkboxes for each dynamic column */}
                {data.length > 0 ? (
                  data.map((header, colIndex) => {
                    const isSelected =
                      header.selected &&
                      header.selected.includes(location.location_id);
                    return (
                      <td
                        key={colIndex}
                        className='px-6 py-4 border-b border-gray-200 text-center'
                      >
                        {isSelected ? (
                          <FaCheckSquare className='text-green-500 inline-block mx-2' /> // Checked icon
                        ) : (
                          <FaRegSquare className='text-gray-400 inline-block mx-2' /> // Unchecked icon
                        )}
                      </td>
                    );
                  })
                ) : (
                  <td
                    // Adjust as per the total column count for a proper span
                    className='px-6 py-4 border-b border-gray-200 text-gray-700 bg-white z-10 text-[12px] font-medium'
                  >
                    No data available
                  </td>
                )}
              </tr>
            ))
          ) : (
            <td
              // Adjust as per the total column count for a proper span
              className='px-6 py-4 border-b border-gray-200 text-gray-700 bg-white z-10 text-[12px] font-medium'
            >
              No data available
            </td>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BenefitTable;
