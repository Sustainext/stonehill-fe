'use client';
import React, { useState, useEffect } from 'react';
import { MdInfoOutline, MdOutlineClear, MdChevronRight } from 'react-icons/md';
import 'react-tooltip/dist/react-tooltip.css';
import GovernanceHeader2 from '../../GovernanceHeader2';
import { Socialdata } from '../../../social/data/socialgriinfo';
import { ToastContainer } from 'react-toastify';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import Process from './Process/page';
import ResultsOfVotes from './ResultsOfVotes/page';
import GovernancesTopBar from '../../governancesTopBar';
const DetermineRemuneration = ({ setMobileopen }) => {
  const [activeMonth, setActiveMonth] = useState(1);
  const [location, setLocation] = useState('');
  const [year, setYear] = useState();
  const [data, setData] = useState();
  const [category, setCategory] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState('');
  const [selectedCorp, setSelectedCorp] = useState('');
  const [togglestatus, setToggleStatus] = useState('Organization');
  const toggleDrawerclose = () => {
    setIsOpen(false);
  };

  const toggleDrawer = (selected) => {
    setIsOpen(true);
    setCategory(selected);
  };

  useEffect(() => {
    const newData = [];
    Socialdata.forEach((program) => {
      program.category.forEach((tag) => {
        if (tag === category) {
          newData.push(program);
        }
      });
    });
    setData(newData);
  }, [category]);
  const griData = [
    {
      tagName: 'GRI 2 - 20',
      toggle: '86',
      textColor: '#007EEF',
      bgColor: 'bg-slate-200',
    },
  ];
  return (
    <>
      <ToastContainer style={{ fontSize: '12px' }} />
      <div className='flex flex-col justify-start overflow-x-hidden'>
        <GovernancesTopBar
          toggleDrawer={toggleDrawer}
          // sdgData={sdgData}
          griData={griData}
          title={'Performance and Renumerationss'}
          setMobileopen={setMobileopen}
        />
        {/* <div className="flex justify-between items-center border-b border-gray-200 mb-5 w-full">
          <div className="w-full">
           <div className="text-left mb-2 ml-3 pt-5">
              <p className="text-sm">Governance</p>
              <div className="flex">
                         <div className="h-[29px]">
                  <p className="gradient-text text-[22px] h-[52px] font-bold pt-1">
                    Determine Remuneration
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full float-end">
            <div className="flex float-end border-l">
              <button
                className="text-[#007EEF] bg-slate-200 rounded-full text-[11px] w-[72px] h-[22px] ml-2 text-center pt-0.5"
                onClick={() => toggleDrawer("86")}
              >
                GRI 2 - 20
              </button>
            </div>
          </div>
        </div> */}

        <div className='ml-3 flex relative'>
          <h6 className='text-[17px] mb-4 font-semibold flex'>
            Process to determine remuneration
          </h6>
          <MdInfoOutline
            data-tooltip-id={`tooltip-$e1`}
            data-tooltip-content='This section documents the data corresponding to the process to determine remuneration.'
            className='mt-1.5 ml-2 text-[15px]'
          />
          <ReactTooltip
            id={`tooltip-$e1`}
            place='top'
            effect='solid'
            style={{
              width: '290px',
              backgroundColor: '#000',
              color: 'white',
              fontSize: '12px',
              boxShadow: 3,
              borderRadius: '8px',
              textAlign: 'left',
            }}
          ></ReactTooltip>
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
      <GovernanceHeader2
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
      <Process
        selectedOrg={selectedOrg}
        selectedCorp={selectedCorp}
        location={location}
        year={year}
        togglestatus={togglestatus}
      />
      <ResultsOfVotes
        selectedOrg={selectedOrg}
        selectedCorp={selectedCorp}
        location={location}
        year={year}
        togglestatus={togglestatus}
      />
    </>
  );
};

export default DetermineRemuneration;
