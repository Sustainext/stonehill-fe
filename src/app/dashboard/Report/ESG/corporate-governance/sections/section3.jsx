"use client";
import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import HighestGovernanceTable from "../tables/highestGovernanceTable";
import NominationTable from "../tables/nominationTable";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const Section3 = ({ section9_2Ref, section9_2_1Ref, data,
  sectionNumber = "9.2.1",
  sectionTitle = 'Nomination, Selection of the Highest Governance Body',
  sectionOrder = 9,
 }) => {
  const rowLabels = [
    "Views of stakeholders (including shareholders)",
    "Diversity",
    "Independence",
    "Competencies relevant to the impacts of the Organization",
  ];
  const tableData = Array.isArray(data?.["2_10_b"]?.governance_body_nomination_criteria)
    ? data["2_10_b"].governance_body_nomination_criteria.map(
        (item, index) => {
          return {
            ...item,
            Label: rowLabels[index],
          };
        }
      )
    : [];

  return (
    <>
      
      <div id="section9_2_1" ref={section9_2_1Ref}>
        <h3 className="text-[15px] text-[#344054] mb-4 text-left font-semibold">
          {sectionNumber} {sectionTitle}
        </h3>
        <p className="text-sm mb-4">
          {data["2_10_a"] ? data["2_10_a"] : "No data available"}
        </p>
        <p className="text-[15px] text-[#344054] mb-4 font-semibold">
          Criteria used for nomination and selection of highest governance body
          member
        </p>
        <p className="text-sm mb-4">
          {data["2_10_b"]
            ? data["2_10_b"].criteria
              ? data["2_10_b"].criteria
              : "No data available"
            : "No data available"}
        </p>
        <p className="text-[15px] text-[#344054] mb-2 font-semibold">
          Criteria considered for nomination and selection of the highest
          governance body 
        </p>
        <div className="mb-4 shadow-md rounded-md">
          <NominationTable tableData={tableData} />
        </div>
      </div>
    </>
  );
};

export default Section3;
