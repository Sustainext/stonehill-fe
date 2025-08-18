"use client";
import React, { useState, useEffect } from "react";
import { MdOutlineClear, MdInfoOutline,MdChevronRight } from "react-icons/md";
import { Socialdata } from "../../data/socialgriinfo";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import Socialheader2 from "../../socialheader2";
import Forcedorcompulsorylabourscreen from "./forcedor";
import { useSelector } from "react-redux";
import SocialTopBar from '../../socialTopBar'

const Forcedorcompulsorylabour = ({apiData,setMobileopen}) => {
  const { corporate_id, organization_id,materiality_year, start_date, end_date, loading, error } = useSelector(
    (state) => state.materialitySlice
  );
  const [year, setYear] = useState(materiality_year?materiality_year:'');
  const [selectedOrg, setSelectedOrg] = useState(organization_id?organization_id:'');
  const [selectedCorp, setSelectedCorp] = useState(corporate_id?corporate_id:'');
  const [activeMonth, setActiveMonth] = useState(1);
  const [location, setLocation] = useState("");
  const [data, setData] = useState();
  const [category, setCategory] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [togglestatus,setToggleStatus] = useState("Organization");
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

  const sdgData=[
    {
        tagName:'GRI 409-1',
        toggle:'16',
        textColor:"#007EEF",
        bgColor:"bg-slate-200"
    },
    {
        tagName:'SDG 5',
        toggle:'17',
        textColor:"#fff",
        bgColor:"bg-orange-600"
    },
    {
        tagName:'SDG 8',
        toggle:'18',
        textColor:"#fff",
        bgColor:"bg-red-900"
    },
   
]

  return (
    <>
      <div className="flex flex-col justify-start overflow-x-hidden ">
        <SocialTopBar toggleDrawer={toggleDrawer} sdgData={sdgData} apiData={apiData} title={'Child and Forced Labour'} topic={'SocChildLabour'} setMobileopen={setMobileopen} />
        <div className="ml-3 flex">
          <h6 className="text-[17px] mb-4 font-semibold flex">
          Operations and suppliers at significant risk for incidents of forced or compulsory labor
            {/* <MdInfoOutline data-tooltip-id={`tooltip-$e1`}
                            data-tooltip-content="This section documents data corresponding to total water
                            withdrawn and total water discharged from areas with water stress." className="mt-1.5 ml-2 text-[15px]" />
                        <ReactTooltip id={`tooltip-$e1`} place="top" effect="solid" style={{
                            width: "290px", backgroundColor: "#000",
                            color: "white",
                            fontSize: "12px",
                            boxShadow: 3,
                            borderRadius: "8px",
                            textAlign: 'left',
                        }}>

                        </ReactTooltip> */}
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
      <Socialheader2
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
      <Forcedorcompulsorylabourscreen
        selectedOrg={selectedOrg}
        selectedCorp={selectedCorp}
        year={year}
        togglestatus={togglestatus}
      />
    </>
  );
};
export default Forcedorcompulsorylabour;
