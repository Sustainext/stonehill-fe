"use client";
import { useState, useRef, useEffect } from "react";

const Section8 = ({ section9_3_2Ref, data,
  sectionNumber = "9.3.2",
  sectionTitle = 'Collective knowledge of the highest governance body',
  sectionOrder = 9,
 }) => {

  return (
    <>
      <div id="section9_3_2" ref={section9_3_2Ref}>
        <h3 className="text-[15px] text-[#344054] mb-4 text-left font-semibold">
         {sectionNumber} {sectionTitle}
        </h3>
        <p className="text-sm mb-4">
          {data["2_17_a"] ? data["2_17_a"] : "No data available"}
        </p>
      </div>
    </>
  );
};

export default Section8;