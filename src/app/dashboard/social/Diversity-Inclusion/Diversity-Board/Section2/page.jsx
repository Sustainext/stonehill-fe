'use client';
import React, { useState, useEffect } from 'react';
import {
  MdOutlineClear,
  MdInfoOutline,
  MdChevronRight,
  MdKeyboardArrowDown,
} from 'react-icons/md';
import { Socialdata } from '../../../data/socialgriinfo';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import Socialheader from '../../../socialheader';
import Screen1 from './Screen1';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Diversityemploy = ({ setMobileopen }) => {
  const [activeMonth, setActiveMonth] = useState(1);
  const [location, setLocation] = useState('');
  const [year, setYear] = useState();
  const [data, setData] = useState();
  const [category, setCategory] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => {
    setMobileopen(true);
  };
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

  return (
    <>
      <ToastContainer style={{ fontSize: '12px' }} />
      <div className='flex flex-col justify-start overflow-x-hidden '>
        <div className='hidden xl:block lg:block md:hidden 2xl:block 4k:block'>
          <div className='flex justify-between items-center border-b border-gray-200 mb-5 w-full'>
            <div className='w-full'>
              <div className='text-left mb-2 ml-3 pt-5'>
                <p className='text-[11px]'>Social</p>
                <div className='flex'>
                  <div className='h-[29px]'>
                    <p className='gradient-text text-[22px] h-[52px] font-bold pt-1'>
                      Employment
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className='w-full float-end '>
              <div className='flex float-end border-l'>
                <div>
                  <button
                    className='text-[#007EEF] bg-slate-200 rounded-full text-[11px] w-[72px] h-[22px] ml-2 text-center pt-0.5'
                    onClick={() => toggleDrawer('50')}
                  >
                    GRI 405 - 1
                  </button>
                </div>

                <div className=' relative'>
                  <button
                    data-tooltip-id={`tooltip-$brsr1`}
                    data-tooltip-content='BRSR-Section A-IV-21'
                    className='text-[#18736B] bg-slate-200 rounded-full text-[11px] w-[90px] h-[22px] ml-2 text-center pt-0.5'
                    // onClick={() => toggleDrawer("92")}
                  >
                    BRSR A-IV-21
                  </button>
                  <ReactTooltip
                    id={`tooltip-$brsr1`}
                    place='bottom'
                    effect='solid'
                    style={{
                      width: '170px',
                      backgroundColor: '#000',
                      color: 'white',
                      fontSize: '12px',
                      boxShadow: 3,
                      borderRadius: '8px',
                      textAlign: 'center',
                    }}
                  ></ReactTooltip>
                </div>

                <div>
                  <button
                    className='text-[#fff] bg-orange-600 rounded-full text-[11px] w-[72px] h-[22px] ml-2 text-center pt-0.5'
                    onClick={() => toggleDrawer('51')}
                  >
                    SDG 5
                  </button>
                </div>
                <div>
                  <button
                    className='text-[#fff] bg-red-900 rounded-full text-[11px] w-[72px] h-[22px] ml-2 text-center pt-0.5'
                    onClick={() => toggleDrawer('26')}
                  >
                    SDG 8
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* mobile version */}
        <div className='block justify-between items-center border-b border-gray-200 mb-5 w-full xl:hidden lg:hidden md:block  2xl:hidden 4k:hidden'>
          <div
            className='w-full  py-4  rounded-md  shadow-[0px_6px_12px_0px_rgba(0,0,0,0.08),0px_1px_3px_0px_rgba(0,0,0,0.10)]'
            onClick={toggleSidebar}
          >
            <div className='text-left mb-2 ml-3 pt-0 flex justify-between'>
              <div className=''>
                <p className='text-[11px]'>Environment</p>
                <div className='flex h-[28px]'>
                  <div className='h-[28px]'>
                    <p className='gradient-text text-[22px] font-bold h-[28px] pt-1'>
                      Employment
                    </p>
                  </div>
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
                    onClick={() => toggleDrawer('50')}
                  >
                    GRI 405 - 1
                  </button>
                </div>

                <div className=' relative'>
                  <button
                    data-tooltip-id={`tooltip-$brsr1`}
                    data-tooltip-content='BRSR-Section A-IV-21'
                    className='text-[#18736B] bg-slate-200 rounded-full text-[11px] w-[90px] h-[22px] ml-2 text-center pt-0.5'
                    // onClick={() => toggleDrawer("92")}
                  >
                    BRSR A-IV-21
                  </button>
                  <ReactTooltip
                    id={`tooltip-$brsr1`}
                    place='bottom'
                    effect='solid'
                    style={{
                      width: '170px',
                      backgroundColor: '#000',
                      color: 'white',
                      fontSize: '12px',
                      boxShadow: 3,
                      borderRadius: '8px',
                      textAlign: 'center',
                    }}
                  ></ReactTooltip>
                </div>
                <div>
                  <button
                    className='text-[#fff] bg-orange-600 rounded-full text-[11px] w-[72px] h-[22px] ml-2 text-center pt-0.5'
                    onClick={() => toggleDrawer('51')}
                  >
                    SDG 5
                  </button>
                </div>
                <div>
                  <button
                    className='text-[#fff] bg-red-900 rounded-full text-[11px] w-[72px] h-[22px] ml-2 text-center pt-0.5'
                    onClick={() => toggleDrawer('26')}
                  >
                    SDG 8
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='ml-3 flex relative'>
          <h6 className='text-[17px] mb-4 font-semibold flex'>
            Diversity of Employees
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
      <Socialheader
        activeMonth={activeMonth}
        setActiveMonth={setActiveMonth}
        location={location}
        setLocation={setLocation}
        year={year}
        setYear={setYear}
      />
      <Screen1 location={location} year={year} month={activeMonth} />
    </>
  );
};
export default Diversityemploy;
