import React from "react";

const Table4 = ({ data }) => {
  const columns = [
    "Employee Category",
    "Women to men",
    "Non-Binary to Men",
    "Non-binary to Women",
    "Significant Location of Operations",
  ];
  console.log("test data", data);
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse block md:table w-full rounded-lg overflow-hidden">
        <thead className="block md:table-header-group border">
          <tr className="border border-gray-300 md:table-row gradient-background">
            <th
              className="px-2 py-3 text-[#727272] block md:table-cell text-[12px] text-center border border-gray-300 w-[25%]"
              rowSpan="2"
            >
              {columns[0]}
            </th>
            <th
              className="px-2 py-3 text-[#727272] block md:table-cell text-[12px] text-center border border-gray-300 w-[25%]"
              rowSpan="2"
            >
              {columns[4]}
            </th>
            <th
              className="px-2 py-3 text-[#727272] block md:table-cell text-[12px] text-center border border-gray-300w-[50%]"
              colSpan="3"
            >
             Ratio of Remuneration by Gender
            </th>
          </tr>
          <tr className="border border-gray-300 md:table-row gradient-background">
            <th className="px-2 py-3 text-[#727272] block md:table-cell text-[12px] text-center border border-gray-300">
              {columns[1]}
            </th>
            <th className="px-2 py-3 text-[#727272] block md:table-cell text-[12px] text-center border border-gray-300">
              {columns[2]}
            </th>
            <th className="px-2 py-3 text-[#727272] block md:table-cell text-[12px] text-center border border-gray-300">
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
            data?.map((row, rowIndex) =>
              row.Q2.map((entry, entryIndex) => (
                <tr
                  key={`${rowIndex}-${entryIndex}`}
                  className="border border-gray-300 md:table-row"
                >
                  <td className="p-2 block md:table-cell  text-center font-normal text-slate-500 text-[12px] border-r border-gray-300">
                    {entry.category}
                  </td>
                  <td className="p-2 block md:table-cell  text-center font-normal text-slate-500 text-[12px] border-r border-gray-300">
                    {Array.isArray(entry.locationandoperation)
                      ? entry.locationandoperation.join(", ")
                      : entry.locationandoperation}
                  </td>
                  <td className="p-2 block md:table-cell  text-center font-normal text-slate-500 text-[12px] border-r border-gray-300">
                    {entry.women_to_men}
                  </td>
                  <td className="p-2 block md:table-cell  text-center font-normal text-slate-500 text-[12px] border-r border-gray-300">
                    {entry.non_binary_to_men}
                  </td>
                  <td className="p-2 block md:table-cell  text-center font-normal text-slate-500 text-[12px] border-r border-gray-300">
                    {entry.non_binary_to_women}
                  </td>
                </tr>
              ))
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table4;
