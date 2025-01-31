'use client';
import { useState,useCallback } from "react";
import { MdKeyboardArrowDown, MdInfoOutline } from "react-icons/md";
import ConsumedFuel from "./Consumed-fuel/Consumed-fuel";
import { GlobalState } from "../../../../../Context/page";
import { Tooltip as ReactTooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css'
import Purchased from "./Purchased/purchased";
import Selfgenerated from "./Self-generated/self-generated"
import Energysold from "./Energy-sold/energy-sold"
import Standards from "./Standards/standards"
import Source from "./Source/source";
import { useDispatch } from "react-redux";
import {f_setTabName} from '../../../../../lib/redux/features/FileInfoSlice'

const AccordionItem = ({ title, children, tooltiptext, sdg, display,location,setLocationMessage,year, setYearMessage  }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { open } = GlobalState();
  const dispatch = useDispatch();
  const handleClick = () => {
    if (!location) {
      setLocationMessage("Please select location")

      return;
    }
    if (!year) {
      setYearMessage("Please select year")

      return;
    }
    setIsOpen(!isOpen);
    dispatch(f_setTabName(title))
  };
  return (
    <div className={`shadow-md py-1 mb-4 rounded-[8px] cursor-pointer border border-b-3 border-neutral-200 `}>
      <button
        className="py-3 text-left flex w-[100%]"
        onClick={handleClick}// Unique ID for the tooltip, spaces replaced by dashes
      >
        <div className="flex w-full">
        <div className={`flex ${open ? "w-[75%]" : "w-[75%]"}`}>
        <div className="flex items-center">
          <h5 className="text-[15px] text-[#344054] px-3 font-[500]">{title}</h5>
        </div>

        <div className="flex items-center justify-center relative">
          <MdInfoOutline
            data-tooltip-id={`tooltip-${title.replace(/\s+/g, '-')}`} data-tooltip-content={tooltiptext} className="mt-1 text-[14px]" style={{display:display}} />
          {/* Tooltip */}
          <ReactTooltip id={`tooltip-${title.replace(/\s+/g, '-')}`} place="top" effect="solid" style={{
            width: "300px", backgroundColor: "#000",
            color: "white",
            fontSize: "12px",
            boxShadow: 3,
            borderRadius: "8px",
          }}>

          </ReactTooltip>
        </div>
        </div>
       <div className=" w-[25%] ">
       <div className={`flex float-end`}>
        {isOpen ? (
            <>
              {sdg && sdg.map((sdgItem, index) => (
                <div key={index} className="bg-sky-100 h-[25px] w-[70px] rounded-md mx-2" style={{ display: display }} >
                  <p className="text-[#0057A5] text-[10px] inline-block align-middle px-2 font-semibold">{sdgItem}</p>
                </div>
              ))}
            </>
          ) : (
            <>
              {sdg && sdg.map((sdgItem, index) => (
                <div key={index} className="bg-sky-100 h-[25px] w-[70px] rounded-md mx-2">
                  <p className="text-[#0057A5] text-[10px] inline-block align-middle px-2 font-semibold">{sdgItem}</p>
                </div>
              ))}
            </>
          )}
          <MdKeyboardArrowDown className={`text-2xl ${isOpen ? "rotate-180" : ""}`} />
        </div>
       </div>
        </div>


      </button>
      {isOpen && <div className="py-4 px-3">{children}</div>}
    </div>
  );
};

const EnergyConsumedBody = ({location, year, month,setLocationMessage, setYearMessage,locationname,monthname}) => {

  return (
    <>
      <div className="mx-3">
      <AccordionItem
       title="Direct Purchased Heating, Cooling, Electricity and Steam"
          tooltiptext={`This section documents data corresponding to Energy Purchased
          for use within the Organization. Include: Input data related only
          to directly purchased heating, electricity, steam and cooling inside
           the organization.  Exclude: Do not include data relating to fuel consumption. `}
          sdg={['GRI 302-1a', 'GRI 302-1b']}
          display="block"
          location={location}
          setLocationMessage={setLocationMessage}
          year={year}
          setYearMessage={setYearMessage}
        >
       
          <Purchased  location={location} year={year} month={month}  locationname={locationname}
        monthname={monthname}/>
       
         
        </AccordionItem>
        <AccordionItem
          title="Consumed fuel and energy, including self generated"
          tooltiptext={`This section documents data corresponding to energy consumed - including fuels.
          Include:
          Self-Generated Energy shall be incorporated in this context.
          Exclude: Direct purchased Heating, Cooling, Electricity, and Steam.`}
          sdg={['GRI 302-1c', 'GRI 302-1e']}
          display="block"
          location={location}
          setLocationMessage={setLocationMessage}
          year={year}
          setYearMessage={setYearMessage}
        >
          <ConsumedFuel location={location} year={year} month={month}/>
        </AccordionItem>
        <AccordionItem
       title="Self generated - not consumed or sold"
          tooltiptext={`This section documents data corresponding to energy
          generated by the organization (self-generated energy) that
          remains unconsumed or unsold.`}
           sdg={['GRI 302-1']}
           display="block"
           location={location}
           setLocationMessage={setLocationMessage}
           year={year}
          setYearMessage={setYearMessage}
        >
          <Selfgenerated location={location} year={year} month={month}/>
        </AccordionItem>
        <AccordionItem
       title="Energy sold"
          tooltiptext={`This section documents data corresponding
          to energy that is sold, regardless of whether
          it is procured or self-generated. `}
          sdg={['GRI 302-1d']}
          display="block"
          location={location}
          setLocationMessage={setLocationMessage}
          year={year}
          setYearMessage={setYearMessage}
        >
          <Energysold location={location} year={year} month={month}/>
        </AccordionItem>
        {/* <AccordionItem
       title="Standards, methodologies, assumptions and calculation tools used"
          tooltiptext={`Standards, methodologies, assumptions and calculation tools used`}
          sdg={['GRI 302-1f']}
          display="none"
          location={location}
          setLocationMessage={setLocationMessage}
          year={year}
          setYearMessage={setYearMessage}
        >
          <Standards location={location} year={year} month={month}/>
        </AccordionItem> */}
        {/* <AccordionItem
       title="Source of  conversion factor"
          tooltiptext={`Source of  conversion factor `}
          sdg={['GRI 302-1g']}
          display="none"
          location={location}
          setLocationMessage={setLocationMessage}
          year={year}
          setYearMessage={setYearMessage}
        >
          <Source  location={location} year={year} month={month}/>
        </AccordionItem> */}
        {/* Add more accordion items here */}
      </div>

    </>
  );
};

export default EnergyConsumedBody;
