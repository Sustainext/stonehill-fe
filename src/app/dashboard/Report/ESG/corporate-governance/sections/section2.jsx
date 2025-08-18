"use client";
import { useState, useRef, useEffect } from "react";
import HighestGovernanceTable from "../tables/highestGovernanceTable";
import STARSVG from "../../../../../../../public/star.svg";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import {
  setBoardGov,
  setRemunerationPolicies,
  setPolicyPublic,
} from "../../../../../../lib/redux/features/ESGSlice/screen9Slice";

const Section2 = ({ section9_1Ref, section9_1_1Ref, data,
  sectionNumber = "9.1.1",
  sectionTitle = 'Governance structure and composition',
  sectionOrder = 9,
 }) => {
  const board_gov_statement = useSelector(
    (state) => state.screen9Slice.board_gov_statement
  );
  const dispatch = useDispatch();
  const loadContent = () => {
    dispatch(
      setBoardGov(
        `Our Board of Directors comprises a diverse group of experienced professionals who bring a broad range of expertise and perspectives. The Board is structured to provide balanced oversight and strategic guidance, with committees dedicated to specific areas such as audit, risk management, and sustainability.`
      )
    );
  };

  const handleEditorChange = (e) => {
    dispatch(setBoardGov(e.target.value));
  };

  const tableData = data["2_9_b"] ? Object.values(data["2_9_b"]) : [];

  return (
    <>
      
      <div id="section9_1_1" ref={section9_1_1Ref}>
        <h3 className="text-[15px] text-[#344054] mb-4 text-left font-semibold">
          {sectionNumber} {sectionTitle}
        </h3>
        <div className="xl:flex lg:flex md:flex 4k:flex 2k:flex 2xl:flex justify-between">
          <p className="text-[15px] text-[#344054] mb-2 mt-3">
            Add statement about company’s board of directors
          </p>
          <button
            className="px-2 py-2 text-[#007EEF] border border-[#007EEF] text-[12px] rounded-md mb-2 flex"
            onClick={loadContent}
          >
            {/* <MdOutlinePlaylistAdd className="mr-1 w-[20px] h-[20px]"/> */}
            <Image src={STARSVG} className="w-5 h-5 mr-1.5" alt="star" />
            Auto Fill
          </button>
        </div>
        <textarea
          value={board_gov_statement}
          onChange={handleEditorChange}
          className={`border appearance-none text-sm border-gray-400 text-[#667085] pl-2 rounded-md py-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-400 cursor-pointer w-full mb-4 `}
          rows={4}
        />
        <p className="text-[15px] text-[#344054] mb-2 font-semibold">
        Governance structure (including the committees of the highest governance body)
        </p>
        <p className="text-sm mb-4">
          {data["2_9_a"] ? data["2_9_a"] : "No data available"}
        </p>
        <p className="text-[15px] text-[#344054] mb-2 font-semibold">
          Committees of the highest governance body
        </p>
        {data["2_9_b"] ? (
          <div className="shadow-md rounded-md mb-4">
            <div
              style={{ maxHeight: "400px", overflowY: "auto" }}
              className="mb-2"
            >
              <table className="w-full border border-gray-200 rounded-md overflow-hidden">
                <tbody>
                  {tableData?.map((rowData, rowIndex) => (
                    <tr key={rowIndex} className="text-[13px]">
                      {(Array.isArray(rowData) ? rowData : [rowData]).map((cellData, colIndex) => (
                        <td
                          key={colIndex}
                          className="border-t border-r border-gray-200 p-4 text-center"
                        >
                          {cellData || "No data available"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p className="text-sm mb-4">No data available</p>
        )}

        <p className="text-[15px] text-[#344054] mb-2 font-semibold">
          Composition of the highest governance body
        </p>

        <div className="mb-4 shadow-md rounded-md">
          <HighestGovernanceTable tableData={data} />
        </div>
      </div>
    </>
  );
};

export default Section2;
