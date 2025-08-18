"use client";
import { useState, useRef, useEffect } from "react";
import RatioTable from "../tables/ratioTable";

const Section7 = ({ section9_3Ref, section9_3_1Ref, data,
  sectionNumber = "9.3.1",
  sectionTitle = 'Role of the Highest Governance Body',
  sectionOrder = 9,
 }) => {
  const col = [
    "The organization's purpose",
    "Value or mission statements",
    "Strategies",
    "Policies",
    "Goals related to sustainable development",
  ];
  const tableData = data["2_12_a"] ? Object.values(data["2_12_a"]) : [];
  return (
    <>
     
      <div id="section9_3_1" ref={section9_3_1Ref}>
        <h3 className="text-[15px] text-[#344054] mb-4 text-left font-semibold">
          {sectionNumber} {sectionTitle}
        </h3>
        {data["2_12_a"] ? (
          <div className="rounded-md shadow-md mb-4">
            <RatioTable col={col} tableData={tableData} />
          </div>
        ) : (
          <p className="text-sm mb-4">No data available</p>
        )}

        {/* <p className="text-[15px] text-[#344054] mb-2 text-left font-semibold">
          Role of the highest governance body and of senior executives in
          overseeing the organization's due diligence and other processes to
          identify and manage the organization's impact on the economy,
          environment and people:
        </p> */}
        <p className="text-sm mb-4">
          {data["2_12_b"] ? data["2_12_b"].Q1 : "No data available"}
        </p>

        {/* <p className="text-[15px] text-[#344054] mb-2 text-left font-semibold">
          How the highest governance body engage with stakeholders to support
          these processes:{" "}
        </p> */}
        <p className="text-sm mb-4">
          {data["2_12_b"]
            ? data["2_12_b"].Q3
              ? data["2_12_b"].Q3
              : ""
            : ""}
        </p>

        {/* <p className="text-[15px] text-[#344054] mb-2 text-left font-semibold">
          How the highest governance body considers the outcomes of these
          processes:
        </p> */}
        <p className="text-sm mb-4">
          {data["2_12_b"] ? data["2_12_b"].Q4 : ""}
        </p>

        <p className="text-[15px] text-[#344054] mb-2 text-left font-semibold">
         Role of the highest governance body in reviewing the effectiveness of the organization's processes
        </p>
        <p className="text-sm mb-4">
          {data["2_12_c"] ? data["2_12_c"] || "No data available" : "No data available"}
        </p>
      </div>
    </>
  );
};

export default Section7;
