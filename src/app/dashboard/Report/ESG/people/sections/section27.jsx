"use client";
import { useState, useRef, useEffect } from "react";
import LeaveTable from "../tables/leaveTable";
import STARSVG from "../../../../../../../public/star.svg";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { setOHSManagementSystem } from "../../../../../../lib/redux/features/ESGSlice/screen13Slice";

const Section27 = ({ section13_6_10Ref, data, reportType,
  sectionNumber = reportType=='GRI Report: In accordance With' || reportType==='Custom ESG Report'?'13.6.10':'13.6.9',
  sectionTitle = "Workers Covered by OHS Management System", 
  sectionOrder = 13
 }) => {
  const content = useSelector(
    (state) => state.screen13Slice.ohs_management_system
  );
  const dispatch = useDispatch();
  const loadContent = () => {
    dispatch(
      setOHSManagementSystem(
        `We ensure that all workers, including contractors and temporary workers, are covered by our OHS management system.`
      )
    );
  };

  const handleEditorChange = (e) => {
    dispatch(setOHSManagementSystem(e.target.value));
  };

  const col1 = [
    "",
    "Percentage of all Employees ",
    "Percentage of workers who are not employees but whose work and/or workplace is controlled by the organization ",
  ];

  const Tabledata = data["get_403_analyse"]
    ? data["get_403_analyse"][
        "workers_covered_by_an_occupational_health_and_safety_management_system"
      ].length > 0
      ? data["get_403_analyse"][
          "workers_covered_by_an_occupational_health_and_safety_management_system"
        ].map((val, index) => {
          return {
            "": val[""],
            "Percentage of all Employees ": val["Percentage of all Employees"],
            "Percentage of workers who are not employees but whose work and/or workplace is controlled by the organization ":
              val[
                "Percentage of workers who are not employees but whose work and/or workplace is controlled by the organization"
              ],
          };
        })
      : [
          {
            "": "",
            "Percentage of all Employees ": "No data available",
            "Percentage of workers who are not employees but whose work and/or workplace is controlled by the organization ":
              "No data available",
          },
        ]
    : [
        {
          "": "",
          "Percentage of all Employees ": "No data available",
          "Percentage of workers who are not employees but whose work and/or workplace is controlled by the organization ":
            "No data available",
        },
      ];

  return (
    <>
      <div id="section13_6_10" ref={section13_6_10Ref}>
        <h3 className="text-[15px] text-[#344054] mb-4 text-left font-semibold">
        {sectionNumber} {sectionTitle}
        </h3>
        <div className="xl:flex lg:flex md:flex 4k:flex 2k:flex justify-between">
          <p className="text-[15px] text-[#344054] mb-2 mt-3">
            Add statement about company’s OHS management system
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
          onChange={handleEditorChange}
          value={content}
          className={`border appearance-none text-sm border-gray-400 text-[#667085] pl-2 rounded-md py-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-400 cursor-pointer w-full mb-4 `}
          rows={4}
        />

        <p className="text-[15px]  mb-2 font-semibold">
          Workers excluded & type of workers excluded
        </p>
        <p className="text-sm mb-2">
          {data["403-8b"]
            ? data["403-8b"].data
              ? data["403-8b"].data.length > 0
                ? data["403-8b"].data[0].Q1
                  ? data["403-8b"].data[0].Q1 == "No"
                    ? data["403-8b"].data[0].Q1
                    : ""
                  : "No data available"
                : "No data available"
              : "No data available"
            : "No data available"}
        </p>
        <p className="text-sm mb-2">
          {data["403-8b"]
            ? data["403-8b"].data
              ? data["403-8b"].data.length > 0
                ? data["403-8b"].data[0].Q2
                  ? data["403-8b"].data[0].Q2
                  : "No data available"
                : "No data available"
              : "No data available"
            : "No data available"}
        </p>
        <p className="text-sm mb-4">
          {data["403-8b"]
            ? data["403-8b"].data
              ? data["403-8b"].data.length > 0
                ? data["403-8b"].data[0].Q3
                  ? data["403-8b"].data[0].Q3
                  : "No data available"
                : "No data available"
              : "No data available"
            : "No data available"}
        </p>

        <p className="text-[15px]  mb-2 font-semibold">
          Standards, methodologies, and assumptions used
        </p>
        <p className="text-sm mb-2">
          {data["403-8c"]
            ? data["403-8c"].data
              ? data["403-8c"].data.length > 0
                ? data["403-8c"].data[0].Q1
                  ? data["403-8c"].data[0].Q1
                  : "No data available"
                : "No data available"
              : "No data available"
            : "No data available"}
        </p>
        <p className="text-sm mb-2">
          {data["403-8c"]
            ? data["403-8c"].data
              ? data["403-8c"].data.length > 0
                ? data["403-8c"].data[0].Q2
                  ? data["403-8c"].data[0].Q2
                  : "No data available"
                : "No data available"
              : "No data available"
            : "No data available"}
        </p>
        <p className="text-sm mb-4">
          {data["403-8c"]
            ? data["403-8c"].data
              ? data["403-8c"].data.length > 0
                ? data["403-8c"].data[0].Q3
                  ? data["403-8c"].data[0].Q3
                  : "No data available"
                : "No data available"
              : "No data available"
            : "No data available"}
        </p>

        <p className="text-[15px]  mb-2 font-semibold">
          Percentage of emplyoees/workers who are not employees 
        </p>

        <div className="rounded-md mb-4 shadow-md">
          <LeaveTable columns={col1} data={Tabledata} />
        </div>
      </div>
    </>
  );
};

export default Section27;
