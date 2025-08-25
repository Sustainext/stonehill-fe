import React from 'react';
import {
  IoBusinessOutline,
  IoTrashOutline,
  IoBulbOutline,
  IoWaterOutline,
  IoLeafOutline,
} from 'react-icons/io5';
import { LuPackage } from 'react-icons/lu';
import { MdOutlineWarehouse } from 'react-icons/md';
import material from '../../../../../public/material.svg';
import effluents from '../../../../../public/effluents.svg';
import activeeffluents from '../../../../../public/activeeffluents.svg';
import Image from 'next/image';
import { GiWoodPile, GiWaterfall } from 'react-icons/gi';
import { MdOutlineAir, MdClose } from 'react-icons/md';

const Aside = ({ activeTab, handleTabClick, setMobileopen }) => {
  const toggleSidebar = () => {
    setMobileopen(false);
  };
  return (
    <div
      className={`m-3 ml-2 p-2 border border-r-2 border-b-2 shadow-lg rounded-lg fixed  `}
    >
      <div className='flex items-start py-4 xl:min-w-[200px] lg:min-w-[200px] md:min-w-[400px] 4k:min-w-[200px] 2k:min-w-[200px] 2xl:min-w-[200px] min-w-[422px] h-[calc(100vh-150px)] overflow-y-auto scrollable-content rounded-lg text-[0.875rem]'>
        <div className='flex flex-col w-full font-medium'>
          <div className='flex  items-start gap-2 mb-8 w-full'>
            <div className='w-full'>
              <div className="text-neutral-500 text-[10px] font-normal font-['Manrope'] uppercase leading-none tracking-wide">
                Analyse
              </div>
              <div className="text-neutral-500 text-base font-semibold font-['Manrope'] leading-none">
                Environment
              </div>
            </div>

            <div className='float-end block xl:hidden md:block lg:hidden 2xl:hidden 4k:hidden'>
              <MdClose onClick={toggleSidebar} className='text-3xl' />
            </div>
          </div>
          <button
            className={`flex items-center justify-start px-2 py-2 mb-2 focus:outline-none w-full ${
              activeTab === 'Emissions'
                ? 'text-[#007EEF] border-l-4 border-[#007EEF]'
                : 'bg-transparent text-[#727272] hover:bg-blue-400 hover:text-white'
            }`}
            onClick={() => handleTabClick('Emissions')}
          >
            <IoBusinessOutline className='w-5 h-5 mr-5' />
            <span className='mr-7'>Emissions</span>
          </button>
          {/* <div>
            <button
              className={`flex items-center justify-start px-2 py-2 mb-2 focus:outline-none w-full ${
                activeTab === 'Energy'
                  ? 'text-[#007EEF] border-l-4 border-[#007EEF]'
                  : 'bg-transparent text-[#727272] hover:bg-blue-400 hover:text-white'
              }`}
              onClick={() => handleTabClick('Energy')}
            >
              <IoBulbOutline className='w-5 h-5 mr-5' />
              <span className='mr-12'>Energy</span>
              <div className='inset-y-0 -right-2 flex items-center pointer-events-none'></div>
            </button>
          </div> */}

          {/* <button
            className={`flex items-center justify-start px-2 py-2 mb-2 focus:outline-none w-full ${
              activeTab === 'Waste Management'
                ? 'text-[#007EEF] border-l-4 border-[#007EEF]'
                : 'bg-transparent text-[#727272] hover:bg-blue-400 hover:text-white'
            }`}
            onClick={() => handleTabClick('Waste Management')}
          >
            <IoTrashOutline className='w-5 h-5 mr-5' />
            <span className=''>Waste Management</span>
          </button> */}

          {/* <button
            className={`flex items-center justify-start px-2 py-2 mb-2 focus:outline-none w-full ${
              activeTab === "Effluents"
                ? "text-[#007EEF] border-l-4 border-[#007EEF]"
                : "bg-transparent text-[#727272] hover:bg-blue-400 hover:text-white"
            }`}
            onClick={() => handleTabClick("Effluents")}
          >
            {activeTab === "Effluents" ? (
              <Image
                src={activeeffluents}
                alt="Active Effluents Icon"
                className="w-5 h-5 mr-5"
              />
            ) : (
              <Image
                src={effluents}
                alt="Effluents Icon"
                className="w-5 h-5 mr-5"
              />
            )}

            <span className="mr-12">Effluents</span>
          </button> */}
{/* 
          <button
            className={`flex justify-start px-2 py-1 mb-2 focus:outline-none w-full ${
              activeTab === 'Material Use and Efficiency'
                ? 'text-[#007EEF] border-l-4 border-[#007EEF]'
                : 'bg-transparent text-[#727272] hover:bg-blue-400 hover:text-white'
            }`}
            onClick={() => handleTabClick('Material Use and Efficiency')}
          >
            <GiWoodPile className='w-5 h-5 mr-5 mt-1' />
            <span className='text-left sm:w-[92px] md:w-[92px] lg:w-[92px] xl:w-[92px] 2xl:w-[92px] 3xl:w-[198px]'>
              Material Use and Efficiency
            </span>
          </button> */}
          {/* packaging material */}
          {/* <button
            className={`flex justify-start px-2 py-1 mb-2 focus:outline-none w-full ${
              activeTab === 'Packaging Materials'
                ? 'text-[#007EEF] border-l-4 border-[#007EEF]'
                : 'bg-transparent text-[#727272] hover:bg-blue-400 hover:text-white'
            }`}
            onClick={() => handleTabClick('Packaging Materials')}
          >
            <LuPackage className='w-5 h-5 mr-5 mt-1' />
            <span className='text-left sm:w-[92px] md:w-[92px] lg:w-[92px] xl:w-[92px] 2xl:w-[92px] 3xl:w-[198px]'>
              Packaging Material
            </span>
          </button>
          <button
            className={`flex items-center justify-start px-2 py-2 mb-2 focus:outline-none w-full ${
              activeTab === 'Water and effluents'
                ? 'text-[#007EEF] border-l-4 border-[#007EEF]'
                : 'bg-transparent text-[#727272] hover:bg-blue-400 hover:text-white'
            }`}
            onClick={() => handleTabClick('Water and effluents')}
          >
            <IoWaterOutline className='w-5 h-5 mr-5' />
            <span className=''>Water and effluents</span>
          </button> */}
          {/* <button
            className={`flex items-center justify-start  px-2 py-2 mb-2 focus:outline-none ${
              activeTab === "Bio diversity"
                ? "text-[#007EEF] border-l-4 border-[#007EEF]"
                : "bg-transparent text-[#727272] hover:bg-blue-400 hover:text-white"
            }`}
            onClick={() => handleTabClick("Bio diversity")}
          >
            <IoLeafOutline className="w-5 h-5 mr-5" />
            <span className="mr-4">Bio diversity</span>
          </button> */}

          {/* <button
            className={`flex justify-start px-2 py-1 mb-2 focus:outline-none w-full ${
              activeTab === 'Supplier Environmental Assessment'
                ? 'text-[#007EEF] border-l-4 border-[#007EEF]'
                : 'bg-white text-[#727272] '
            }`}
            onClick={() => handleTabClick('Supplier Environmental Assessment')}
          >
            <MdOutlineWarehouse className='w-5 h-5 mr-5' />
            <span className='text-left sm:w-[92px] md:w-[92px] lg:w-[92px] xl:w-[92px] 2xl:w-[92px] 3xl:w-[198px]'>
              Supplier Environmental Assessment
            </span>
            <div className='inset-y-0 -right-2 flex items-center pointer-events-none'>
             
            </div>
          </button> */}

          {/* <button
            className={`flex justify-start px-2 py-1 mb-2 focus:outline-none w-full ${
              activeTab === 'Air Quality & other emissions'
                ? 'text-[#007EEF] border-l-4 border-[#007EEF]'
                : 'bg-white text-[#727272] '
            }`}
            onClick={() => handleTabClick('Air Quality & other emissions')}
          >
            <MdOutlineAir className='w-5 h-5 mr-5' />
            <span className='text-left sm:w-[92px] md:w-[92px] lg:w-[92px] xl:w-[92px] 2xl:w-[92px] 3xl:w-[198px]'>
              Air Quality & other emissions
            </span>
            <div className='inset-y-0 -right-2 flex items-center pointer-events-none'>
             
            </div>
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default Aside;
