"use client";
import { useState } from "react";
import {
  MdOutlineGroup,
  MdPublic,
  MdOutlineDiversity1,
  MdKeyboardArrowLeft,
  MdMenu,
} from "react-icons/md";

// Optional icon mapping
const tabIcons = {
  Environment: <MdPublic className="w-5 h-5 mr-3" />,
  // Social: <MdOutlineGroup className="w-5 h-5 mr-3" />,
  // Governance: <MdOutlineDiversity1 className="w-5 h-5 mr-3" />,
  // General: <MdOutlineDiversity1 className="w-5 h-5 mr-3" />,
  // Economic: <MdOutlineDiversity1 className="w-5 h-5 mr-3" />,
};

const AsideContent = ({ activeTab, handleTabClick, closeMobile }) => {
  const tabs = ["Environment"];

  return (
    <div className="flex flex-col font-medium w-full">
      {/* Mobile header */}
      <div className="flex items-center justify-between mb-4 xl:hidden md:hidden lg:hidden ">
        <span className="text-[15px] font-semibold text-[#727272] ml-2">
          Track
        </span>
        <button onClick={closeMobile} className="text-gray-700 p-2">
          <MdKeyboardArrowLeft className="h-6 w-6" />
        </button>
      </div>

      {/* Desktop header */}
      <div className="hidden xl:flex md:flex lg:flex items-center px-4 py-2 text-[#727272] font-bold uppercase tracking-wide">
        Track
      </div>

      {/* Tab list */}
      <div className="mt-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              handleTabClick(tab);
              closeMobile?.();
            }}
            className={`flex items-center w-full text-left px-4 py-2 mb-1 text-[13px] transition-colors duration-150 rounded ${
              activeTab === tab
                ? "bg-[#007eef0d] text-[#007EEF]"
                : "text-[#727272] hover:bg-blue-100 hover:text-[#007EEF]"
            }`}
          >
            {tabIcons[tab] || <MdOutlineDiversity1 className="w-5 h-5 mr-3" />}
            <span>{tab}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

const Aside = ({ activeTab, handleTabClick }) => {
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  return (
    <>
      {/* Desktop Aside */}
      <div className="m-3 ml-2 p-2 border border-r-2 border-b-2 shadow-lg rounded-lg hidden xl:block md:block min-w-[200px] max-w-[351px]">
        <div className="flex flex-col py-4 min-h-[84vh] text-sm overflow-x-hidden">
          <AsideContent activeTab={activeTab} handleTabClick={handleTabClick} />
        </div>
      </div>

      {/* Mobile toggle button (put this in your header or nav) */}
      <button
        className="xl:hidden md:hidden lg:hidden fixed top-32 left-4 z-50 bg-white  shadow rounded-sm flex p-2"
        onClick={() => setIsOpenMobile(true)}
      >
        <MdMenu className="text-2xl" />  Track
      </button>

      {/* Mobile overlay */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40"
          onClick={() => setIsOpenMobile(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={`fixed top-28 left-0 h-full z-50 bg-white shadow-lg transform transition-transform duration-300 ease-in-out w-72 ${
          isOpenMobile ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 pt-6">
          <AsideContent
            activeTab={activeTab}
            handleTabClick={handleTabClick}
            closeMobile={() => setIsOpenMobile(false)}
          />
        </div>
      </div>
    </>
  );
};

export default Aside;
