"use client";
import React, { useState, useEffect, useRef } from "react";
import EnvironmentHeader from "../../environmentheader";
import { MdOutlineClear, MdInfoOutline, MdChevronRight } from "react-icons/md";
import { Energydata } from "../../data/griinfo";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import Reclaimedproductsbody from "./reclaimed-products-body";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MaterialTopBar from "../../Materials/materialTopBar";

const Reclaimedproducts = ({ apiData, setMobileopen }) => {
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
  const griData = [
    {
      tagName: " GRI 301-3",
      toggle: "41",
      textColor: "#007EEF",
      bgColor: "bg-slate-200",
    },
  ];

  const brsr = [
    {
      tagName: "BRSR C-P2-L5",
      id: "tooltip-$brsr1",
      content: "BRSR-Section C-Principle 2-Leadership  Indicators-5",
    },
  ];
  const sdgData = [
    {
      tagName: "SDG 8",
      toggle: "42",
      textColor: "#fff",
      bgColor: "bg-red-900",
    },
    {
      tagName: "SDG 12",
      toggle: "43",
      textColor: "#fff",
      bgColor: "bg-yellow-600",
    },
  ];
  return (
    <>
      <ToastContainer style={{ fontSize: "12px" }} />
      <div className="flex flex-col justify-start overflow-x-hidden ">
        <MaterialTopBar
          toggleDrawer={toggleDrawer}
          sdgData={sdgData}
          apiData={apiData}
          brsr={brsr}
          griData={griData}
          title={"Packaging Material"}
          setMobileopen={setMobileopen}
        />

        <div className="ml-3 flex relative">
          <h6 className="text-[17px] mb-4 font-semibold flex">
            Disclosure 301-3-a,b Reclaimed products and their packaging
            materials
            <MdInfoOutline
              data-tooltip-id={`tooltip-$e1`}
              data-tooltip-content="This section documents data corresponding to the amount of recycled material used
                            for packaging of the goods/services during the reporting period.
                           Reclaimed products are products that have been used and then collected,
                           processed, and marketed for reuse. They can be reused in their original form
                            or they can be used to manufacture new products.
                           Examples include refurbished electronics, recycled clothing, reclaimed wood, and
                           reclaimed building materials.
                           Exclude: rejects and recalls of products"
              className="mt-1.5 ml-2 text-[15px]"
            />
            <ReactTooltip
              id={`tooltip-$e1`}
              place="top"
              effect="solid"
              style={{
                width: "550px",
                backgroundColor: "#000",
                color: "white",
                fontSize: "12px",
                boxShadow: 3,
                borderRadius: "8px",
                textAlign: "left",
                zIndex: 1000,
              }}
            ></ReactTooltip>
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
      />
      <Reclaimedproductsbody
        location={location}
        year={year}
        month={activeMonth}
        setLocationMessage={setLocationMessage}
        setYearMessage={setYearMessage}
      />
    </>
  );
};
export default Reclaimedproducts;
