'use client';
import React, { useState, useEffect } from 'react';
import EmissionsHeader from './emissionsheader';
import Emissionsnbody from './emissions-body';
import { EmissionsProvider } from './EmissionsContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import {
  setLocation,
  setYear,
  setMonth,
} from '@/lib/redux/features/emissionSlice';
import { Energydata } from '../../../shared/data/Energydata';
import {
  MdOutlineClear,
  MdChevronRight,
  MdOutlineFileUpload,
} from 'react-icons/md';
import EmissionTopBar from './emissionTopbar';
import BulkImportModal from './bulkImportModal';
import ToastMessage from '../../../shared/components/Toast';
const Emissions = ({
  open,
  apiData,
  setMobileopen,
  frameworkId,
  disclosures,
}) => {
  const dispatch = useDispatch();
  const { location, year, month } = useSelector((state) => state.emissions);
  const countryCode = useSelector((state) => state.emissions.countryCode);
  const [locationname, setLocationname] = useState('');
  const [locationError, setLocationError] = useState('');
  const [yearError, setYearError] = useState('');
  // GRI content
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState('');
  const [data, setData] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastQueue, setToastQueue] = useState([]);
  console.log(isModalOpen, 'set isModalOpen');
  const toggleDrawerclose = () => {
    setIsOpen(!isOpen);
  };
  const toggleDrawer = (selected) => {
    setIsOpen(!isOpen);
    setCategory(selected);
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

  const showToast = (header, body, gradient, duration = 3000) => {
    const id = Date.now();
    setToastQueue((prev) => [...prev, { id, header, body, gradient }]);

    setTimeout(() => {
      setToastQueue((prev) => prev.filter((toast) => toast.id !== id));
    }, duration);
  };
  const griData = [
    {
      tagName: 'GRI 305 - 1',
      toggle: '43',
      textColor: '#007EEF',
      bgColor: 'bg-slate-200',
    },

    {
      tagName: 'GRI 305 - 2',
      toggle: '44',
      textColor: '#007EEF',
      bgColor: 'bg-slate-200',
    },
    {
      tagName: 'GRI 305 - 3',
      toggle: '45',
      textColor: '#007EEF',
      bgColor: 'bg-slate-200',
    },
  ];

  const brsr = [
    {
      tagName: 'BRSR C-P6-E7',
      id: 'tooltip-$brsr1',
      content: 'BRSR-Section C-Principle 6-Essential Indicators-7',
    },
    {
      tagName: 'BRSR C-P6-L2',
      id: 'tooltip-$brsr2',
      content: 'BRSR-Section C-Principle 6-Leadership  Indicators-2',
    },
  ];
  const sdgData = [
    {
      tagName: 'SDG 3',
      toggle: 'sd5',
      textColor: '#fff',
      bgColor: 'bg-[#4C9F38]',
    },
    {
      tagName: 'SDG 12',
      toggle: 'sd35',
      textColor: '#fff',
      bgColor: 'bg-[#BF8B2E]',
    },
    {
      tagName: 'SDG 13',
      toggle: 'sd4',
      textColor: '#fff',
      bgColor: 'bg-lime-900',
    },
    {
      tagName: 'SDG 14',
      toggle: 'sd24',
      textColor: '#fff',
      bgColor: 'bg-[#007DBC]',
    },
    {
      tagName: 'SDG 15',
      toggle: 'sd38',
      textColor: '#fff',
      bgColor: 'bg-[#40AE49]',
    },
  ];
  const tcfd = [];

  if (frameworkId === '6' && disclosures?.['Metrics & Targets']?.disclosures) {
    const govDisclosures = disclosures['Metrics & Targets'].disclosures;

    const hasMTA = govDisclosures.some((d) => d.id === 9 && d.selected);

    if (hasMTA) {
      tcfd.push({
        tagName: 'TCFD-M&T-B',
        toggle: '59',
        id: 'tooltip-$tcfd1',
        content: 'TCFD-Metrics and Targets-B Disclosure',
      });
    }
  }

  return (
    <>
      <EmissionsProvider>
        <ToastContainer style={{ fontSize: '12px' }} />
        <>
          <div className='flex flex-col justify-start overflow-x-hidden '>
            <EmissionTopBar
              toggleDrawer={toggleDrawer}
              apiData={apiData}
              sdgData={sdgData}
              griData={griData}
              brsr={brsr}
              tcfd={tcfd}
              setMobileopen={setMobileopen}
            />
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

                    {/* Data Content */}

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
          <EmissionsHeader
            activeMonth={month}
            setActiveMonth={(newMonth) => dispatch(setMonth(newMonth))}
            location={location}
            setLocation={(newLocation) => dispatch(setLocation(newLocation))}
            year={year}
            setYear={(newYear) => dispatch(setYear(newYear))}
            locationError={locationError}
            setLocationError={setLocationError}
            yearError={yearError}
            setYearError={setYearError}
            setLocationname={setLocationname}
          />

          {/* <div className='mb-4'>
            <button
              onClick={() => setIsModalOpen(true)}
              className='flex bg-transparent text-[#007EEF] text-[13px] ml-6'
            >
              <MdOutlineFileUpload
                className='mt-1'
                style={{ fontSize: '13px' }}
              />
              <p className='ml-2 text-[#727272]'>
                <span className='text-[#007EEF] mr-0.5'>Bulk import data</span>{' '}
                from a template
              </p>
            </button>

            <BulkImportModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              setIsModalOpen={setIsModalOpen}
              showToast={showToast}
            />
          </div> */}
          <Emissionsnbody
            open={open}
            location={location}
            year={year}
            month={month}
            countryCode={countryCode}
            setLocationError={setLocationError}
            setYearError={setYearError}
            locationname={locationname}
          />
        </>
      </EmissionsProvider>
      <div className='fixed top-36 lg:top-20 xl:top-20 2xl:top-20 2k:top-20 4k:top-20 right-4 z-[9999] space-y-3'>
        {toastQueue.map((toast) => (
          <ToastMessage
            key={toast.id}
            message={{ header: toast.header, body: toast.body }}
            gradient={toast.gradient}
            onClose={() =>
              setToastQueue((prev) => prev.filter((t) => t.id !== toast.id))
            }
          />
        ))}
      </div>
    </>
  );
};

export default Emissions;