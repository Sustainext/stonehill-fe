'use client';
import React, { useState, useEffect } from 'react';
import { MdOutlineClear, MdInfoOutline, MdChevronRight } from 'react-icons/md';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GovernanceHeader2 from '../../GovernanceHeader2';
import { Socialdata } from '../../../social/data/socialgriinfo';
import Screen1 from './screen1';

import GovernancesTopBar from '../../governancesTopBar';
const Tcfdmanagementrole = ({ setMobileopen }) => {
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
  const tcfd = [
    {
      tagName: 'TCFD-GOV-B',
      toggle: '141',
      id: 'tooltip-$tcfd1',
      content: 'TCFD-Governance-B Disclosure',
    },
  ];

  return (
    <>
      <ToastContainer style={{ fontSize: '12px' }} />
      <div className='flex flex-col justify-start overflow-x-hidden '>
        <GovernancesTopBar
          toggleDrawer={toggleDrawer}
          tcfd={tcfd}
          title={'Governance'}
          setMobileopen={setMobileopen}
        />

        <div className='ml-3 flex relative'>
          <h6 className='text-[17px] mb-4 font-semibold flex'>
            Management’s role in assessing and managing climate related issues
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
                  <div className='ml-2 h-[90px]'>{program.header}</div>
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

      <Screen1
        selectedOrg={selectedOrg}
        selectedCorp={selectedCorp}
        location={location}
        year={year}
        month={activeMonth}
        togglestatus={togglestatus}
      />
    </>
  );
};
export default Tcfdmanagementrole;
