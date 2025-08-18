"use client";
import React, { useState, useEffect, useRef } from "react";
import { MdOutlineClear, MdInfoOutline, MdChevronRight } from "react-icons/md";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Socialdata } from "../../../social/data/socialgriinfo";
import GeneralHeader2 from "../../GeneralHeader2";
import Screen1 from "./screen1";
import Screen2 from "./screen2";
import Screen3 from "./screen3";
import BRSRScreen1 from './BRSRScreens/screen1'
import { Oval } from "react-loader-spinner";
import GeneralTopBar from "../../generalTopBar";
const Entities = ({setMobileopen,brsrFrameworkId}) => {
  const [activeMonth, setActiveMonth] = useState(1);
  const [location, setLocation] = useState("");
  const [year, setYear] = useState();
  const [data, setData] = useState();
  const [category, setCategory] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState("");
  const [selectedCorp, setSelectedCorp] = useState("");
  const screen1Ref = useRef(null);
  const screen2Ref = useRef(null);
  const screen3Ref = useRef(null);
  const screen4Ref = useRef(null);
  const [loopen, setLoOpen] = useState(false);
  const [togglestatus, setToggleStatus] = useState("Organization");
  const toggleDrawerclose = () => {
    setIsOpen(!isOpen);
  };
  const toggleDrawer = (selected) => {
    setIsOpen(!isOpen);
    setCategory(selected);
  };
  useEffect(() => {
    var newData = [];
    Socialdata.map((program) => {
      program.category.map((tag) => {
        if (tag === category) {
          newData.push(program);
        }
      });
    });
    // //console.log(newData);
    setData(newData);
  }, [category]);
  const handleSubmit = async () => {
    LoaderOpen(); // Show loader
    try {
      const promises = [];
      if (screen1Ref.current) {
        promises.push(screen1Ref.current());
      }
      if (screen2Ref.current) {
        promises.push(screen2Ref.current());
      }
      if (screen3Ref.current) {
        promises.push(screen3Ref.current());
      }
       if (screen4Ref.current) {
        promises.push(screen4Ref.current());
      }

      await Promise.all(promises); // Wait for all submissions to complete

      toast.success("Data submitted successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      toast.error("Failed to submit data. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      LoaderClose(); // Hide loader
    }
  };
  const LoaderOpen = () => setLoOpen(true); // Show loader
  const LoaderClose = () => setLoOpen(false); // Hide loader
  const griData = [
    {
      tagName: "GRI 2 - 2",
      toggle: "93",
      textColor: "#007EEF",
      bgColor: "bg-slate-200",
    },
  ];

  const brsr = [
    // {
    //   tagName: "BRSR A-I-13",
    //   id: "tooltip-$brsr1",
    //   content: "BRSR-Section A-I-13",
    // },
    {
      tagName: "BRSR-A-V-23-a",
      id: "tooltip-$brsr2",
      content: "BRSR-Section-A-V-23-a",
    },
 
  ];
  return (
    <>
      <ToastContainer style={{ fontSize: "12px" }} />
      <div className="flex flex-col justify-start overflow-x-hidden ">
      <GeneralTopBar
          toggleDrawer={toggleDrawer}
          brsr={brsr}
          griData={griData}
          title={"Entities"}
          setMobileopen={setMobileopen}
        />
        {/* <div className="flex justify-between items-center border-b border-gray-200 mb-5 w-full">
          <div className="w-full">
            <div className="text-left mb-2 ml-3 pt-5">
              <p className="text-sm">General</p>
              <div className="flex">
                <div className="h-[29px]">
                  <p className="gradient-text text-[22px] h-[52px] font-bold pt-1">
                    Entities
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full float-end ">
            <div className="flex float-end border-l">
              <div>
                <button
                  className="text-[#007EEF] bg-slate-200 rounded-full text-[11px] w-[72px] h-[22px] ml-2 text-center pt-0.5"
                  onClick={() => toggleDrawer("93")}
                >
                  GRI 2 - 2
                </button>
              </div>

              <div className=" relative">
                <button
                  data-tooltip-id={`tooltip-$brsr1`}
                  data-tooltip-content="BRSR-Section A-I-13"
                  className="text-[#18736B] bg-slate-200 rounded-full text-[11px] w-[90px] h-[22px] ml-2 text-center pt-0.5"
                  // onClick={() => toggleDrawer("92")}
                >
                  BRSR A-I-13
                </button>
                <ReactTooltip
                  id={`tooltip-$brsr1`}
                  place="bottom"
                  effect="solid"
                  style={{
                    width: "170px",
                    backgroundColor: "#000",
                    color: "white",
                    fontSize: "12px",
                    boxShadow: 3,
                    borderRadius: "8px",
                    textAlign: "center",
                  }}
                ></ReactTooltip>
              </div>
              <div className=" relative">
                <button
                  data-tooltip-id={`tooltip-$brsr2`}
                  data-tooltip-content="BRSR-Section A-V-23a"
                  className="text-[#18736B] bg-slate-200 rounded-full text-[11px] w-[90px] h-[22px] ml-2 text-center pt-0.5"
                  // onClick={() => toggleDrawer("92")}
                >
                  BRSR A-V-23a
                </button>

                <ReactTooltip
                  id={`tooltip-$brsr2`}
                  place="bottom"
                  effect="solid"
                  style={{
                    width: "170px",
                    backgroundColor: "#000",
                    color: "white",
                    fontSize: "12px",
                    boxShadow: 3,
                    borderRadius: "8px",
                    textAlign: "center",
                  }}
                ></ReactTooltip>
              </div>
            </div>
          </div>
        </div> */}

        <div className="ml-3 flex relative">
          <h6 className="text-[17px] mb-4 font-semibold flex">
            Entities included in the organization's sustainability reporting
            <MdInfoOutline
              data-tooltip-id={`tooltip-$e10`}
              data-tooltip-content="This section documents the data corresponding to the  entities included in the organization’s
sustainability report."
              className="mt-1.5 ml-2 text-[15px]"
            />
            <ReactTooltip
              id={`tooltip-$e10`}
              place="top"
              effect="solid"
              style={{
                width: "290px",
                backgroundColor: "#000",
                color: "white",
                fontSize: "12px",
                boxShadow: 3,
                borderRadius: "8px",
                textAlign: "left",
              }}
            ></ReactTooltip>
          </h6>
        </div>
        <div
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
                  <div className="ml-2">{program.header}</div>
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
                <div className="pt-2 pb-4 ml-4">
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
      <GeneralHeader2
        activeMonth={activeMonth}
        setActiveMonth={setActiveMonth}
        selectedOrg={selectedOrg}
        setSelectedOrg={setSelectedOrg}
        selectedCorp={selectedCorp}
        setSelectedCorp={setSelectedCorp}
        year={year}
        setYear={setYear}
        setToggleStatus={setToggleStatus}
      />
      <Screen1
        selectedOrg={selectedOrg}
        selectedCorp={selectedCorp}
        location={location}
        year={year}
        month={activeMonth}
        ref={screen1Ref}
        togglestatus={togglestatus}
      />
      <Screen2
        selectedOrg={selectedOrg}
        selectedCorp={selectedCorp}
        location={location}
        year={year}
        month={activeMonth}
        ref={screen2Ref}
        togglestatus={togglestatus}
      />
      <Screen3
        selectedOrg={selectedOrg}
        selectedCorp={selectedCorp}
        location={location}
        year={year}
        month={activeMonth}
        ref={screen3Ref}
        togglestatus={togglestatus}
      />
      {
        brsrFrameworkId ==4 && (
           <BRSRScreen1
      selectedOrg={selectedOrg}
        selectedCorp={selectedCorp}
        location={location}
        year={year}
        month={activeMonth}
        ref={screen4Ref}
        togglestatus={togglestatus}
      />
        )
      }
     

      <div className="mt-4 mr-1.5">
        <button
          type="button"
          className={`text-center py-1 text-sm w-[100px] bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline float-end ${
            (!selectedCorp && togglestatus === "Corporate") ||
            !selectedOrg ||
            !year
              ? "cursor-not-allowed opacity-90"
              : ""
          }`}
          onClick={handleSubmit}
          disabled={
            (togglestatus === "Corporate" && !selectedCorp) ||
            (togglestatus !== "Corporate" && (!selectedOrg || !year))
          }
        >
          Submit
        </button>
      </div>
      {loopen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <Oval
            height={50}
            width={50}
            color="#00BFFF"
            secondaryColor="#f3f3f3"
            strokeWidth={2}
            strokeWidthSecondary={2}
          />
        </div>
      )}
    </>
  );
};
export default Entities;
