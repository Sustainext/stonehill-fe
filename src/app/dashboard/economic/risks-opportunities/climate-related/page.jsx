'use client';
import React, { useState, useEffect } from 'react';
import { MdOutlineClear, MdInfoOutline, MdChevronRight } from 'react-icons/md';
import { Socialdata } from '../../../social/data/socialgriinfo.js';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EconomicHeader5 from '../../EconomicHeader5';
import EconomicTopBar from '../../economicTopBar.jsx';

import Screen1 from './screen1';
const Climaterelated = ({
  apiData,
  setMobileopen,
  frameworkId,
  disclosures,
}) => {
  const [activeMonth, setActiveMonth] = useState(1);
  const [location, setLocation] = useState('');
  const [year, setYear] = useState();
  const [data, setData] = useState();
  const [category, setCategory] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState('');
  const [selectedCorp, setSelectedCorp] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
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
  const griData = [
    {
      tagName: 'GRI 201 - 2',
      toggle: '118',
      textColor: '#007EEF',
      bgColor: 'bg-slate-200',
    },
  ];
  const sdgData = [
    {
      tagName: 'SDG 13',
      toggle: '119',
      textColor: '#fff',
      bgColor: 'bg-[#48773C]',
    },
  ];
  const tcfd = [];
  const tcfdtag = [];
  const selectedDisclosure =
    frameworkId === '6' &&
    disclosures?.Strategy?.disclosures?.find((d) => d.id === 3 && d.selected);
  const selectid = selectedDisclosure ? selectedDisclosure.id : null;

  if (frameworkId === '6' && disclosures?.Strategy?.disclosures) {
    const govDisclosures = disclosures.Strategy.disclosures;

    const hasSTGA = govDisclosures.some((d) => d.id === 3 && d.selected);

    if (hasSTGA) {
      tcfd.push({
        tagName: 'TCFD-STG-A',
        toggle: '145',
        id: 'tooltip-$tcfd1',
        content: 'TCFD-Strategy-A Disclosure',
      });
      tcfdtag.push({
        tagName: 'TCFD-STG-A',
      });
    }
  }
  return (
    <>
      <ToastContainer style={{ fontSize: '12px' }} />
      <div className='flex flex-col justify-start overflow-x-hidden '>
        <EconomicTopBar
          toggleDrawer={toggleDrawer}
          sdgData={sdgData}
          griData={griData}
          tcfd={tcfd}
          apiData={apiData}
          title={'Climate Risks and Opportunities'}
          topic={'ClimateRisksAndOpportunities'}
          setMobileopen={setMobileopen}
        />

        <div className='ml-3 flex relative'>
          <h6 className='text-[17px] mb-4 font-semibold flex'>
            Climate Related Opportunities
            <MdInfoOutline
              data-tooltip-id={`tooltip-$e10`}
              data-tooltip-content='This section documents the data corresponding to the climate related opportunities.'
              className='mt-1.5 ml-2 text-[15px]'
            />
            <ReactTooltip
              id={`tooltip-$e10`}
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
                  <div
                    className={`ml-2 ${
                      program.category.includes('145') ? 'h-[75px]' : 'h-[38px]'
                    }`}
                  >
                    {program.header}
                  </div>
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
      <EconomicHeader5
        selectedOrg={selectedOrg}
        setSelectedOrg={setSelectedOrg}
        selectedCorp={selectedCorp}
        setSelectedCorp={setSelectedCorp}
        year={year}
        setYear={setYear}
        setSelectedLocation={setSelectedLocation}
        selectedLocation={selectedLocation}
        setToggleStatus={setToggleStatus}
      />
      <Screen1
        selectedOrg={selectedOrg}
        selectedCorp={selectedCorp}
        year={year}
        selectedLocation={selectedLocation}
        togglestatus={togglestatus}
        tcfdtag={tcfdtag}
        frameworkId={frameworkId}
        selectid={selectid}
      />
    </>
  );
};
export default Climaterelated;
