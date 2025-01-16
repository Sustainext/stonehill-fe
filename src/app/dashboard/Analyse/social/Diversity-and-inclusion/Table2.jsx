import React from 'react';

const Table2 = ({ data }) => {
  const columns = [
    "Location",
    "Male",
    "Female",
    "Non-Binary",

  ];
console.log(data,"markete table");
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse block md:table w-full rounded-lg overflow-hidden">
        <thead className="block md:table-header-group border">
          <tr className="border border-gray-300 md:table-row gradient-background">
            <th
              className="px-2 py-3 text-[#727272] block md:table-cell text-[12px] text-center border border-gray-300 w-[25%]"
            
            >
              {columns[0]}
            </th>
            <th
              className="px-2 py-3 text-[#727272] block md:table-cell text-[12px] text-center border border-gray-300 w-[25%]"
          
            >
              {columns[1]}
            </th>
     
            <th
              className="px-2 py-3 text-[#727272] block md:table-cell text-[12px] text-center border border-gray-300 w-[25%]"
           
            >
              {columns[2]}
            </th>
            <th
              className="px-2 py-3 text-[#727272] block md:table-cell text-[12px] text-center border border-gray-300 w-[25%]"
          
            >
              {columns[3]}
            </th>
          </tr>
   
        </thead>
        <tbody className="block md:table-row-group">
          {data?.length === 0 ? (
            <tr className="border border-gray-300 md:table-row">
              <td
                colSpan={columns.length}
                className="text-center p-2 block md:table-cell text-[12px] font-[400]  border-r border-gray-300"
              >
                No data available
              </td>
            </tr>
          ) : (
           
              data.map((entry) => (
                <tr className="border border-gray-300 md:table-row">
                  <td className="p-2 block md:table-cell  text-center font-normal text-slate-500 text-[12px] border-r border-gray-300">
                    {entry.Location}
                  </td>
                  <td className="p-2 block md:table-cell  text-center font-normal text-slate-500 text-[12px] border-r border-gray-300">
                    {entry.Male}
                  </td>
                  <td className="p-2 block md:table-cell  text-center font-normal text-slate-500 text-[12px] border-r border-gray-300">
                    {entry.Female}
                  </td>
                  <td className="p-2 block md:table-cell  text-center font-normal text-slate-500 text-[12px] border-r border-gray-300">
                  {entry['Non-binary']}
                  </td>
               
                </tr>
              ))
            
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table2;
