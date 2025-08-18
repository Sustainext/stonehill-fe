'use client';
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Energydata } from '../../../../shared/data/Energydata';
import { MdOutlineClear } from 'react-icons/md';
import Socialheader2 from '../../socialheader2';
import Screen1 from './Screen1';
import { MdChevronRight, MdKeyboardArrowDown } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
const OHSMaterialtopic = ({ apiData, setMobileopen }) => {
  const {
    corporate_id,
    organization_id,
    materiality_year,
    start_date,
    end_date,
    loading,
    error,
  } = useSelector((state) => state.materialitySlice);
  const materialityEnvData = apiData && apiData.social ? apiData.social : {};
  const [year, setYear] = useState(materiality_year ? materiality_year : '');
  const [selectedOrg, setSelectedOrg] = useState(
    organization_id ? organization_id : ''
  );
  const [selectedCorp, setSelectedCorp] = useState(
    corporate_id ? corporate_id : ''
  );

  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState('');
  const [data, setData] = useState();
  const [togglestatus, setToggleStatus] = useState('Organization');
  const toggleDrawerclose = () => {
    setIsOpen(!isOpen);
  };
  const toggleDrawer = (selected) => {
    setIsOpen(!isOpen);
    setCategory(selected);
  };
  const toggleSidebar = () => {
    setMobileopen(true);
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

  return (
    <>
      <ToastContainer style={{ fontSize: '12px' }} />

      <div className='flex flex-col justify-start overflow-x-hidden '>
        <div className='hidden xl:block lg:block md:hidden 2xl:block 4k:block'>
          <div className='flex justify-between items-center border-b border-gray-200 mb-5 w-full'>
            <div className='w-full'>
              <div className='text-left mb-4 ml-3 pt-5'>
                <p className='text-[11px]'>Social</p>
                <div className='flex h-[28px]'>
                  <div className='h-[28px]'>
                    <p className='gradient-text text-[22px] font-bold h-[28px] pt-1'>
                      Occupational Health and Safety
                    </p>
                  </div>
                  {materialityEnvData &&
                  materialityEnvData.SocHealthSafety?.is_material_topic ? (
                    <div className='bg-gray-100 h-[22px] w-[100px]  mx-2 mt-2 rounded-md'>
                      <p className='text-gray-500 text-[12px] pt-0.5 px-2'>
                        Material Topic
                      </p>
                    </div>
                  ) : (
                    <div></div>
                  )}
                </div>
              </div>
            </div>
            <div className='w-full float-end me-2'>
              <div className='float-end border-l'>
                <div className='flex mb-2'>
                  <div>
                    <button
                      className='text-[#007EEF] bg-slate-200 rounded-full text-[11px] w-[72px] h-[22px] ml-2 text-center pt-0.5'
                      onClick={() => toggleDrawer('51')}
                    >
                      GRI 3-3
                    </button>
                  </div>
                  <div className=' relative'>
                    <button
                      data-tooltip-id={`tooltip-$brsr1`}
                      data-tooltip-content='BRSR-Section C-Principle 1-Essential Indicators-4'
                      className='text-[#18736B] bg-slate-200 rounded-full text-[11px] w-[90px] h-[22px] ml-2 text-center pt-0.5'
                      // onClick={() => toggleDrawer("92")}
                    >
                      BRSR C-P1-E4
                    </button>
                    <ReactTooltip
                      id={`tooltip-$brsr1`}
                      place='bottom'
                      effect='solid'
                      style={{
                        width: '290px',
                        backgroundColor: '#000',
                        color: 'white',
                        fontSize: '12px',
                        boxShadow: 3,
                        borderRadius: '8px',
                        textAlign: 'center',
                        zIndex: '100',
                      }}
                    ></ReactTooltip>
                  </div>
                  <div className=' relative'>
                    <button
                      data-tooltip-id={`tooltip-$brsr2`}
                      data-tooltip-content='BRSR-Section C-Principle 6-Essential Indicators-10'
                      className='text-[#18736B] bg-slate-200 rounded-full text-[11px] w-[90px] h-[22px] ml-2 text-center pt-0.5'
                      // onClick={() => toggleDrawer("92")}
                    >
                      BRSR C-P6-E10
                    </button>
                    <ReactTooltip
                      id={`tooltip-$brsr2`}
                      place='bottom'
                      effect='solid'
                      style={{
                        width: '290px',
                        backgroundColor: '#000',
                        color: 'white',
                        fontSize: '12px',
                        boxShadow: 3,
                        borderRadius: '8px',
                        textAlign: 'center',
                      }}
                    ></ReactTooltip>
                  </div>
                  <div className=' relative'>
                    <button
                      data-tooltip-id={`tooltip-$brsr3`}
                      data-tooltip-content='BRSR-Section A-VII-26'
                      className='text-[#18736B] bg-slate-200 rounded-full text-[11px] w-[90px] h-[22px] ml-2 text-center pt-0.5'
                      // onClick={() => toggleDrawer("92")}
                    >
                      BRSR A-VII-26
                    </button>
                    <ReactTooltip
                      id={`tooltip-$brsr3`}
                      place='bottom'
                      effect='solid'
                      style={{
                        width: '290px',
                        backgroundColor: '#000',
                        color: 'white',
                        fontSize: '12px',
                        boxShadow: 3,
                        borderRadius: '8px',
                        textAlign: 'center',
                      }}
                    ></ReactTooltip>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* mobile version */}
        <div className='block justify-between items-center border-b border-gray-200 mb-5 w-full xl:hidden lg:hidden md:block  2xl:hidden 4k:hidden'>
          <div
            className='w-full  py-4 h-[100px]  rounded-md  shadow-[0px_6px_12px_0px_rgba(0,0,0,0.08),0px_1px_3px_0px_rgba(0,0,0,0.10)]'
            onClick={toggleSidebar}
          >
            <div className='text-left mb-2 ml-3 pt-0 flex justify-between'>
              <div className=''>
                <p className='text-[11px]'>Social</p>
                <div className='h-[28px]'>
                  <div className='h-[28px]'>
                    <p className='gradient-text text-[22px] font-bold h-[28px] pt-1'>
                      Occupational Health and Safety
                    </p>
                  </div>
                  {materialityEnvData &&
                  materialityEnvData.SocHealthSafety?.is_material_topic ? (
                    <div className='bg-gray-100 h-[22px] w-[100px]  mx-2 mt-2 rounded-md'>
                      <p className='text-gray-500 text-[12px] pt-0.5 px-2'>
                        Material Topic
                      </p>
                    </div>
                  ) : (
                    <div></div>
                  )}
                </div>
              </div>

              <div className='flex items-center me-5'>
                <MdKeyboardArrowDown className={`text-2xl float-end `} />
              </div>
            </div>
          </div>
          <div className='w-full me-2 my-4'>
            <div className=''>
              <div className='flex mb-2'>
                <div>
                  <button
                    className='text-[#007EEF] bg-slate-200 rounded-full text-[11px] w-[72px] h-[22px] ml-2 text-center pt-0.5'
                    onClick={() => toggleDrawer('51')}
                  >
                    GRI 3-3
                  </button>
                </div>
                <div className=' relative'>
                  <button
                    data-tooltip-id={`tooltip-$brsr1`}
                    data-tooltip-content='BRSR-Section C-Principle 1-Essential Indicators-4'
                    className='text-[#18736B] bg-slate-200 rounded-full text-[11px] w-[90px] h-[22px] ml-2 text-center pt-0.5'
                    // onClick={() => toggleDrawer("92")}
                  >
                    BRSR C-P1-E4
                  </button>
                  <ReactTooltip
                    id={`tooltip-$brsr1`}
                    place='bottom'
                    effect='solid'
                    style={{
                      width: '290px',
                      backgroundColor: '#000',
                      color: 'white',
                      fontSize: '12px',
                      boxShadow: 3,
                      borderRadius: '8px',
                      textAlign: 'center',
                      zIndex: '100',
                    }}
                  ></ReactTooltip>
                </div>
                <div className=' relative'>
                  <button
                    data-tooltip-id={`tooltip-$brsr2`}
                    data-tooltip-content='BRSR-Section C-Principle 6-Essential Indicators-10'
                    className='text-[#18736B] bg-slate-200 rounded-full text-[11px] w-[90px] h-[22px] ml-2 text-center pt-0.5'
                    // onClick={() => toggleDrawer("92")}
                  >
                    BRSR C-P6-E10
                  </button>
                  <ReactTooltip
                    id={`tooltip-$brsr2`}
                    place='bottom'
                    effect='solid'
                    style={{
                      width: '290px',
                      backgroundColor: '#000',
                      color: 'white',
                      fontSize: '12px',
                      boxShadow: 3,
                      borderRadius: '8px',
                      textAlign: 'center',
                    }}
                  ></ReactTooltip>
                </div>
                <div className=' relative'>
                  <button
                    data-tooltip-id={`tooltip-$brsr3`}
                    data-tooltip-content='BRSR-Section A-VII-26'
                    className='text-[#18736B] bg-slate-200 rounded-full text-[11px] w-[90px] h-[22px] ml-2 text-center pt-0.5'
                    // onClick={() => toggleDrawer("92")}
                  >
                    BRSR A-VII-26
                  </button>
                  <ReactTooltip
                    id={`tooltip-$brsr3`}
                    place='bottom'
                    effect='solid'
                    style={{
                      width: '290px',
                      backgroundColor: '#000',
                      color: 'white',
                      fontSize: '12px',
                      boxShadow: 3,
                      borderRadius: '8px',
                      textAlign: 'center',
                    }}
                  ></ReactTooltip>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='ml-3 flex relative'>
          <h6 className='text-[17px] mb-4 font-semibold flex'>
            Management of Material Topic
          </h6>
        </div>
        <div
          className={`${
            isOpen
              ? 'translate-x-[15%] block top-16'
              : 'translate-x-[120%] hidden top-16'
          }
fixed right-[51px]  w-[360px] h-[92%] bg-white  rounded-md
transition-transform duration-300 ease-in-out z-[100] shadow-2xl px-2`}
        >
          {data &&
            data.map((program, index) => (
              <div key={index}>
                {/* Header */}
                <div className='flex justify-between p-2 pt-5 pb-4 border-b-2 '>
                  <div className='ml-2 h-[38px]'>{program.header}</div>
                  <div className='ml-2 float-right '>
                    <h5
                      className='text-[#727272] text-[17px] font-bold cursor-pointer'
                      onClick={toggleDrawerclose}
                    >
                      <MdOutlineClear />
                    </h5>
                  </div>
                </div>

                <div className='hidden xl:block lg:block md:block 2xl:block 4k:block 2k:block 3xl:block'>
                  <div className='h-[calc(100vh-180px)] overflow-y-auto custom-scrollbar p-2'>
                    {program.data}
                  </div>
                </div>
                <div className='block xl:hidden lg:hidden md:hidden 2xl:hidden 4k:hidden 2k:hidden 3xl:hidden'>
                  <div className='h-[calc(90vh-180px)] overflow-y-auto custom-scrollbar p-2'>
                    {program.data}
                  </div>
                </div>

                {/* Footer (Learn more link) */}
                <div className='pt-2 pb-4 ml-4'>
                  <a
                    className='text-[14px] text-[#2196F3] pt-1 inline-flex'
                    href={program.link}
                    target='_blank'
                  >
                    Learn more <MdChevronRight className='text-lg pt-1' />
                  </a>
                </div>
              </div>
            ))}
        </div>
      </div>

      <Socialheader2
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
        year={year}
        togglestatus={togglestatus}
      />
    </>
  );
};

export default OHSMaterialtopic;
