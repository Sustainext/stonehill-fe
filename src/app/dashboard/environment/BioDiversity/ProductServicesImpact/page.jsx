"use client";
import React, { useState, useEffect, useRef } from "react";
import EnvironmentHeade3 from "../../environmentheader3";
// import Standardsmethodologybody from "./standards-methodology-body";
import { MdOutlineClear, MdInfoOutline, MdChevronRight } from "react-icons/md";
import { Energydata } from "../../data/griinfo";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BioDiversityTopBar from "../bioDiversityTopBar";
import Screen1 from './screen1'
import Screen2 from "./screen2";
import Screen3 from './screen3'
import Screen4 from "./screen4";
import Screen5 from "./screen5";

const LocationWithSignificantImpact = ({ open, apiData, setMobileopen }) => {
  const [activeMonth, setActiveMonth] = useState(1);
  const [location, setLocation] = useState("");
  const [year, setYear] = useState();
  const [data, setData] = useState();
  const [category, setCategory] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [locationMessage, setLocationMessage] = useState("");
  const [yearMessage, setYearMessage] = useState("");
  const drawerRef = useRef(null);
  const toggleDrawerclose = () => {
    setIsOpen(!isOpen);
  };
  const toggleDrawer = (selected) => {
    setIsOpen(!isOpen);
    setCategory(selected);
  };
  useEffect(() => {
    var newData = [];
    Energydata.map((program) => {
      program.category.map((tag) => {
        if (tag === category) {
          newData.push(program);
        }
      });
    });
    // //console.log(newData);
    setData(newData);
  }, [category]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        setIsOpen(false); // Close drawer when clicking outside
      }
    };

    // Attach event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Cleanup event listener
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const sdgData = [
    // {
    //   tagName: "GRI 302-1",
    //   toggle: "1",
    //   textColor: "#007EEF",
    //   bgColor: "bg-slate-200",
    // },
    // {
    //   tagName: "GRI 302-2",
    //   toggle: "15",
    //   textColor: "#007EEF",
    //   bgColor: "bg-slate-200",
    // },
    // {
    //   tagName: "GRI 302-4",
    //   toggle: "17",
    //   textColor: "#007EEF",
    //   bgColor: "bg-slate-200",
    // },
    // {
    //   tagName: "GRI 302-5",
    //   toggle: "18",
    //   textColor: "#007EEF",
    //   bgColor: "bg-slate-200",
    // },
  ];
  const griData = [
    {
      tagName: "GRI 101-5",
      toggle: "78",
      textColor: "#007EEF",
      bgColor: "bg-slate-200",
    },
    {
        tagName: "GRI 101-6",
        toggle: "77",
        textColor: "#007EEF",
        bgColor: "bg-slate-200",
      },
  ];

  return (
    <>
      <ToastContainer style={{ fontSize: "12px" }} />
      <div className="flex flex-col justify-start overflow-x-hidden ">
      <BioDiversityTopBar
          toggleDrawer={toggleDrawer}
          sdgData={sdgData}
          apiData={apiData}
          griData={griData}
          setMobileopen={setMobileopen}
        />

        <div className="ml-3 relative">
          <h6 className="text-[17px] mb-1 font-semibold flex">
         Products/Services with impact on Biodiversity
          </h6>
        </div>
        <div
          ref={drawerRef}
          className={`${
            isOpen
              ? "translate-x-[15%] block top-16"
              : "translate-x-[120%] hidden top-16"
          }
fixed right-[51px]  w-[360px] h-[92%] bg-white  rounded-md
transition-transform duration-300 ease-in-out z-[100] shadow-2xl px-2`}
        >
          {data &&
            data.map((program, index) => (
              <div key={index}>
                {/* Header */}
                <div className="flex justify-between p-2 pt-5 pb-4 border-b-2 ">
                  <div className="ml-2 h-[38px]">{program.header}</div>
                  <div className="ml-2 float-right ">
                    <h5
                      className="text-[#727272] text-[17px] font-bold cursor-pointer"
                      onClick={toggleDrawerclose}
                    >
                      <MdOutlineClear />
                    </h5>
                  </div>
                </div>

                    <div className="hidden xl:block lg:block md:block 2xl:block 4k:block 2k:block 3xl:block">
                <div className="h-[calc(100vh-180px)] overflow-y-auto custom-scrollbar p-2">
                  {program.data}
                </div>
                </div>
                <div className="block xl:hidden lg:hidden md:hidden 2xl:hidden 4k:hidden 2k:hidden 3xl:hidden">
                <div className="h-[calc(90vh-180px)] overflow-y-auto custom-scrollbar p-2">
                  {program.data}
                </div>
                </div>

                {/* Footer (Learn more link) */}
                <div className="pt-2 pb-4 ml-4" onClick={toggleDrawerclose}>
                  <a
                    className="text-[14px] text-[#2196F3] pt-1 inline-flex"
                    href={program.link}
                    target="_blank"
                  >
                    Learn more <MdChevronRight className="text-lg pt-1" />
                  </a>
                </div>
              </div>
            ))}
        </div>
      </div>
      <EnvironmentHeade3
        activeMonth={activeMonth}
        setActiveMonth={setActiveMonth}
        location={location}
        setLocation={setLocation}
        year={year}
        setYear={setYear}
        locationMessage={locationMessage}
        setLocationMessage={setLocationMessage}
        yearMessage={yearMessage}
        setYearMessage={setYearMessage}
      />
      <Screen1
        location={location}
        year={year}
        month={activeMonth}
        setLocationMessage={setLocationMessage}
        setYearMessage={setYearMessage}
      />
       <Screen2
        location={location}
        year={year}
        month={activeMonth}
        setLocationMessage={setLocationMessage}
        setYearMessage={setYearMessage}
      />
      <Screen3
        location={location}
        year={year}
        month={activeMonth}
        setLocationMessage={setLocationMessage}
        setYearMessage={setYearMessage}
      />
      <Screen4
        location={location}
        year={year}
        month={activeMonth}
        setLocationMessage={setLocationMessage}
        setYearMessage={setYearMessage}
      />
      <Screen5
        location={location}
        year={year}
        month={activeMonth}
        setLocationMessage={setLocationMessage}
        setYearMessage={setYearMessage}
      />
    </>
  );
};

export default LocationWithSignificantImpact;
