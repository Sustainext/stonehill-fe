"use client";
import { useState, useCallback } from "react";
import { MdKeyboardArrowDown, MdInfoOutline } from "react-icons/md";
import { GlobalState } from "../../../../../Context/page";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import Screen1 from "./screen1";
import { useDispatch } from "react-redux";
import { f_setTabName } from "../../../../../lib/redux/features/FileInfoSlice";

const AccordionItem = ({
  title,
  children,
  tooltiptext,
  sdg,
  display,
  location,
  setLocationMessage,
  year,
  setYearMessage,
  selectedOrg,
  isOpen,
  setIsOpen
}) => {

  const { open } = GlobalState();
  const dispatch = useDispatch();
  const handleClick = () => {
    if (!selectedOrg || !year) {
      return; // Prevent opening if selectedOrg or year is not selected
    }

    setIsOpen(!isOpen);
    dispatch(f_setTabName(title));
  };

  return (
    <div
      className={`shadow-md py-1 mb-4 rounded-[8px] cursor-pointer border border-b-3 border-neutral-200 `}
    >
      <button
        className="py-3 text-left flex w-[100%]"
        onClick={handleClick} // Unique ID for the tooltip, spaces replaced by dashes
      >
        <div className="flex w-full">
          <div className={`flex ${open ? "w-[75%]" : "w-[75%]"}`}>
            <div className="flex items-center">
              <h5 className="text-[15px] text-[#344054] px-3 font-[500]">
                {title}
              </h5>
            </div>

            <div className="flex items-center justify-center relative">
              <MdInfoOutline
                data-tooltip-id={`tooltip-${title.replace(/\s+/g, "-")}`}
                data-tooltip-content={tooltiptext}
                className="mt-1 text-[14px]"
                style={{ display: display }}
              />
              {/* Tooltip */}
              <ReactTooltip
                id={`tooltip-${title.replace(/\s+/g, "-")}`}
                place="top"
                effect="solid"
                style={{
                  width: "300px",
                  backgroundColor: "#000",
                  color: "white",
                  fontSize: "12px",
                  boxShadow: 3,
                  borderRadius: "8px",
                  zIndex:"100"
                }}
              ></ReactTooltip>
            </div>
          </div>
          <div className=" w-[25%] ">
            <div className={`flex float-end`}>
              {isOpen ? (
                <>
                  {sdg &&
                    sdg.map((sdgItem, index) => (
                      <div
                        key={index}
                        className="bg-sky-100 h-[25px] w-[70px] rounded-md mx-2"
                        style={{ display: display }}
                      >
                        <p className="text-[#0057A5] text-[10px] inline-block align-middle px-2 font-semibold">
                          {sdgItem}
                        </p>
                      </div>
                    ))}
                </>
              ) : (
                <>
                  {sdg &&
                    sdg.map((sdgItem, index) => (
                      <div
                        key={index}
                        className="bg-sky-100 h-[25px] w-[70px] rounded-md mx-2"
                      >
                        <p className="text-[#0057A5] text-[10px] inline-block align-middle px-2 font-semibold">
                          {sdgItem}
                        </p>
                      </div>
                    ))}
                </>
              )}
              <MdKeyboardArrowDown
                className={`text-2xl ${isOpen ? "rotate-180" : ""}`}
              />
            </div>
          </div>
        </div>
      </button>
      {isOpen && <div className="py-4 px-3">{children}</div>}
    </div>
  );
};

const Emissionreductioninitiativesbody = ({
  selectedOrg,
  selectedCorp,
  year,
  togglestatus,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div className="mx-3">
        <AccordionItem
          title="GHG Emission Reduction Initiatives"
          tooltiptext={`This section documents the data corresponding to 
the GHG emission reduction initiatives.
Exclude: Reductions resulting from reduced 
production capacity or
outsourcing.`}
          sdg={["GRI 302-5a", "GRI 302-5b", "GRI 302-5d"]}
          display="block"
          selectedOrg={selectedOrg}
          selectedCorp={selectedCorp}
          year={year}
          togglestatus={togglestatus}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        >
          <Screen1
            selectedOrg={selectedOrg}
            selectedCorp={selectedCorp}
            year={year}
            togglestatus={togglestatus}
            setIsOpen={setIsOpen}
          />
        </AccordionItem>
      </div>
    </>
  );
};

export default Emissionreductioninitiativesbody;
