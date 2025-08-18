"use client";
import { useState, useRef, useEffect } from "react";

const Section9 = ({ section9_3_3Ref, data,
  sectionNumber = "9.3.3",
  sectionTitle = 'Role of the highest governance body in sustainability reporting',
 }) => {
  return (
    <>
      <div id="section9_3_3" ref={section9_3_3Ref}>
        <h3 className="text-[15px] text-[#344054] mb-4 text-left font-semibold">
         {sectionNumber} {sectionTitle}
        </h3>
        
        <p className="text-sm mb-4">
          {data["2_14_a_and_b"]
            ? data["2_14_a_and_b"].reason_for_yes
              ? data["2_14_a_and_b"].reason_for_yes
              : data["2_14_a_and_b"].reason_for_no
            : ""}
        </p>
      </div>
    </>
  );
};

export default Section9;
