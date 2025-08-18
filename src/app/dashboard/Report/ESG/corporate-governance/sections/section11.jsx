"use client";
import { useState, useRef, useEffect } from "react";

const Section11 = ({ section9_3_5Ref, data,
  sectionNumber = "9.3.5",
  sectionTitle = 'Communication of Critical Concerns',
  sectionOrder = 9,
 }) => {
  
  return (
    <>
      <div id="section9_3_5" ref={section9_3_5Ref}>
        <h3 className="text-[15px] text-[#344054] mb-4 text-left font-semibold">
          {sectionNumber} {sectionTitle}
        </h3>
        
        <p className="text-sm mb-4">
        {
            data["2_16_a"]
              ? data["2_16_a"]?.critical_concerns_communication_description
              : "No data available"
          }
        </p>
        <p className="text-[15px] text-[#344054] mb-2 text-left font-semibold">
          Total number of critical concerns that were communicated to the
          highest governance body :
        </p>
        <p className="text-sm mb-4">
          {data["2_16_b"]
            ? data["2_16_b"]?.total_critical_concerns_reported
            : "No data available"}
        </p>
        <p className="text-[15px] text-[#344054] mb-2 text-left font-semibold">
          Nature of the critical concerns that were communicated to the highest
          governance body:
        </p>
        <p className="text-sm mb-4">
          {data["2_16_b"]
            ? data["2_16_b"]?.nature_of_critical_concerns_reported
            : "No data available"}
        </p>
      </div>
    </>
  );
};

export default Section11;
