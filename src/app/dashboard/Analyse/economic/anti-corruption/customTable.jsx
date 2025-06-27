import React from 'react';

const DynamicTable2 = ({ data, columns }) => {
  // Check if all rows are empty objects
  const isEmptyData = data.every(row => Object.keys(row).length === 0);

  return (
    <div className="overflow-x-auto custom-scrollbar">
    <table
      className="w-full min-w-[828px] rounded-lg border border-gray-300 "
      style={{ borderCollapse: "separate", borderSpacing: 0 }}
    >
        <thead className=" md:table-header-group">
          <tr className="md:table-row gradient-background">
            {columns.map((column, index) => (
              <th
                key={column}
                className={`px-2 py-3  text-[#727272]   md:table-cell text-center text-[12px]   border-gray-300 ${ index===0 ? "":"border-l"} `}
                style={index === 0 ? { width: '11rem', textAlign: 'center' } : { textAlign: 'left' }}
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className=" md:table-row-group">
          {data.length === 0 || isEmptyData ? (
            <tr className="md:table-row">
              <td
                colSpan={columns.length}
               className="text-center p-2  md:table-cell text-[12px] font-normal text-slate-500 border-gray-300 border-t"
              >
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className="md:table-row">
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className={`p-2  md:table-cell text-[12px] border-gray-300 border-t ${
                      colIndex === 0 ? 'text-center font-bold' : 'text-center font-normal text-slate-500 border-l'
                    }`}
                  >
                    {row[column] !== undefined && row[column] !== null
                      ? colIndex === 0 || colIndex === 1 || colIndex === 2
                        ? row[column]
                        : `${row[column]}%`
                      : 'N/A'}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DynamicTable2;
