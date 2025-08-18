"use client";
import { useState, useRef, useEffect } from "react";

const Section5 = ({ section9_2_3Ref, data,
  sectionNumber = "9.2.3",
  sectionTitle = 'Senior Management Hired from Local Community',
  sectionOrder = 9,

 }) => {

  return (
    <>
      <div id="section9_2_3" ref={section9_2_3Ref}>
        <h3 className="text-[15px] text-[#344054] mb-4 text-left font-semibold">
          {sectionNumber} {sectionTitle}
        </h3>

        <p className="text-[15px] text-[#344054] mb-2 font-semibold">
          Percentage of senior management at significant locations of operation
          that are hired from the local community
        </p>
        <p className="text-sm mb-4">
          {data["202_2a"] ? data["202_2a"] : "No data available"}
        </p>
        <p className="text-[15px] text-[#344054] mb-2 font-semibold">
          The definition used for 'senior management'
        </p>
        <p className="text-sm mb-4">
          {data["202_2b"] ? data["202_2b"] : "No data available"}
        </p>
        <p className="text-[15px] text-[#344054] mb-2 font-semibold">
          The organization's geographical definition of 'local'
        </p>
        <p className="text-sm mb-4">
          {data["202_2c"] ? data["202_2c"] : "No data available"}
        </p>
        <p className="text-[15px] text-[#344054] mb-2 font-semibold">
          The definition used for "significant locations of operation"
        </p>
        <p className="text-sm mb-4">
          {data["202_2d"] ? data["202_2d"] : "No data available"}
        </p>
      </div>
    </>
  );
};

export default Section5;
