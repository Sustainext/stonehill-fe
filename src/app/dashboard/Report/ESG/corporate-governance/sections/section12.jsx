"use client";
import { useState, useRef, useEffect } from "react";

const Section12 = ({ section9_3_6Ref, data,

  sectionNumber = "9.3.6",
  sectionTitle = 'Evaluation of the Performance of the Highest Governance Body',
  sectionOrder = 9,
 }) => {
  
  return (
    <>
      <div id="section9_3_6" ref={section9_3_6Ref}>
        <h3 className="text-[15px] text-[#344054] mb-4 text-left font-semibold">
         {sectionNumber} {sectionTitle}
        </h3>
        <p className="text-[15px] text-[#344054] mb-2 text-left font-semibold">
          Processes for evaluating the performance of the highest governance
          body:
        </p>
        
        <p className="text-sm mb-4">
        {data["2_18_a"] ? data["2_18_a"]?.Q1 : "No data available"}
        </p>
        <p className="text-[15px] text-[#344054] mb-2 text-left font-semibold">
          Frequency of the evaluations:
        </p>
        <p className="text-sm mb-4">
          {data["2_18_b"]
            ? data["2_18_b"]?.evaluations_independent=="No"?'No':data["2_18_b"]?.evaluation_frequency
            : "No data available"}
        </p>
        <p className="text-[15px] text-[#344054] mb-2 text-left font-semibold">
          Actions taken in response to the evaluations:
        </p>
        <p className="text-sm mb-4">
          {data["2_18_c"] ? data["2_18_c"] : "No data available"}
        </p>
      </div>
    </>
  );
};

export default Section12;
