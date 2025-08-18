"use client";
import React, { useState, useEffect, useRef } from "react";
import EnvironmentHeader from "../../environmentheader";
import EnergyConsumedBody from "./energy-consumed-body";
import { MdOutlineClear, MdInfoOutline, MdChevronRight } from "react-icons/md";
import { Energydata } from "../../data/griinfo";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EnergyTopBar from '../energyTopBar'

const Energyconsumed = ({ open,apiData,setMobileopen,mobileopen }) => {
  const [activeMonth, setActiveMonth] = useState(1);
  const [location, setLocation] = useState("");
  const [year, setYear] = useState();
  const [data, setData] = useState();
  const [category, setCategory] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [locationMessage, setLocationMessage] = useState("");
  const [yearMessage, setYearMessage] = useState("");
  const [locationname,setLocationname] =useState("");
  const [monthname,setMonthname] =useState("Jan");
  const drawerRef = useRef(null); // Ref for the drawer

  const toggleDrawerclose = () => {
    setIsOpen(false);
  };

  const toggleDrawer = (selected) => {
    setIsOpen(!isOpen);
    setCategory(selected);
  };

  useEffect(() => {
    const newData = Energydata.filter((program) =>
      program.category.includes(category)
    );
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
  const griData = [
    {
      tagName:'GRI 302-1',
      toggle:'1',
      textColor:"#007EEF",
      bgColor:"bg-slate-200"
  },
  ];

  const brsr = [
    {
      tagName: "BRSR C-P6-E1",
      id: "tooltip-$brsr1",
      content: "BRSR-Section C-Principle 6-Essential Indicators-1",
    },
  ];
  const sdgData=[

    {
        tagName:'SDG 7',
        toggle:'2',
        textColor:"#fff",
        bgColor:"bg-amber-400"
    },
    {
        tagName:'SDG 8',
        toggle:'3',
        textColor:"#fff",
        bgColor:"bg-red-900"
    },
    {
        tagName:'SDG 12',
        toggle:'4',
        textColor:"#fff",
        bgColor:"bg-yellow-600"
    },
    
    {
        tagName:'SDG 13',
        toggle:'5',
        textColor:"#fff",
        bgColor:"bg-lime-900"
    },
]

  return (
    <>
      <ToastContainer style={{ fontSize: "12px" }} />
      <div className="flex flex-col justify-start overflow-x-hidden ">
        <EnergyTopBar toggleDrawer={toggleDrawer} sdgData={sdgData} apiData={apiData} brsr={brsr} griData={griData} setMobileopen={setMobileopen} />

        <div className="ml-3 flex relative">
          <h6 className="text-[17px] mb-4 font-semibold flex">
            Energy consumed inside the organization
            <MdInfoOutline
              data-tooltip-id={`tooltip-$e1`}
              data-tooltip-content="This section documents data corresponding to the energy consumption within the organisation"
              className="mt-1.5 ml-2 text-[15px]"
            />
            <ReactTooltip
              id={`tooltip-$e1`}
              place="top"
              effect="solid"
              style={{
                width: "290px",
                backgroundColor: "#000",
                color: "white",
                fontSize: "12px",
                boxShadow: 3,
                borderRadius: "8px",
                textAlign: "center",
              }}
            ></ReactTooltip>
          </h6>
        </div>
        <div
          ref={drawerRef} // Attach ref to the drawer
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

      <EnvironmentHeader
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
        // setLocationname={setLocationname}
        // setMonthname={setMonthname}
      />
      <EnergyConsumedBody
        location={location}
        year={year}
        month={activeMonth}
        setLocationMessage={setLocationMessage}
        setYearMessage={setYearMessage}
        locationname={locationname}
        monthname={monthname}
      />
    </>
  );
};

export default Energyconsumed;
