import { useState, useEffect } from 'react';
import { Energydata } from './../../../shared/data/Energydata';
import {
  MdOutlineClear,
  MdInfoOutline,
  MdChevronRight,
  MdKeyboardArrowDown,
} from 'react-icons/md';
import { toast } from 'react-toastify';
import { patch } from '../../../utils/axiosMiddleware';
const Header = ({ activeTab, setIsBoxOpen, setMobileopen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState('');
  const [data, setData] = useState([]);

  const toggleDrawerClose = () => {
    setIsOpen(!isOpen);
    setIsBoxOpen((prev) => !prev);
  };

  const toggleDrawer = (selected) => {
    setIsOpen(!isOpen);
    setCategory(selected);
    setIsBoxOpen((prev) => !prev);
  };

  useEffect(() => {
    const newData = Energydata.filter((program) =>
      program.category.includes(category)
    );
    setData(newData);
  }, [category]);

  const gri = [
    {
      category: 'Tab1',
      tag: 'GRI 2',
      data: [{ tagid: '7', infoid: '41' }],
    },
    {
      category: 'Tab2',
      tag: 'GRI 2',
      data: [{ tagid: '30', infoid: '42' }],
    },
  ];
  const sdg = [
    {
      category: 'Tab1',
      data: [
        { id: 'sd12', label: 'SDG 8', bgColor: 'bg-red-900' },
        { id: 'sd13', label: 'SDG 10', bgColor: 'bg-[#DD1367]' },
      ],
    },
    {
      category: 'Tab2',
      data: [{ id: 'sd15', label: 'SDG 8', bgColor: 'bg-red-900' }],
    },
  ];
  const toggleSidebar = () => {
    setMobileopen(true);
  };
  return (
    <>
      <div className='flex justify-between items-center  xl:border-b border-gray-200 pb-4 xl:z-[100] relative'>
        <div className='hidden xl:block lg:block md:hidden 2xl:block 4k:block '>
          <div className='h-[46px] flex-col justify-start items-start gap-0.5 inline-flex ms-4 mt-8'>
            <div className="text-black text-opacity-50 text-[11px] font-semibold font-['Manrope'] capitalize leading-[14px]">
              General
            </div>
            <div className='h-[30px]'>
              <div className=' flex justify-start items-end gap-3'>
                <div className="h-[28px] gradient-text text-opacity-20 text-[22px] font-medium font-['Manrope'] leading-[1.425rem] pt-1">
                  {activeTab === 'Tab1'
                    ? 'Employees'
                    : activeTab === 'Tab2'
                    ? 'Strategy, policies and practices'
                    : ''}
                </div>

                <div className='w-[95px] pl-1 pr-0.5 bg-slate-200 rounded justify-center items-center flex'>
                  <div className="text-zinc-600 text-xs font-normal font-['Manrope'] leading-[21px]">
                    Material Topic
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='flex flex-col border-l border-gray-200 pl-4 gap-2 absolute right-4 top-8'>
            <div className='flex justify-end'>
              {gri
                .filter((g) => g.category === activeTab)
                .map((g) =>
                  g.data.map((item) => (
                    <button
                      key={item.tagid}
                      className={`text-[#007EEF] bg-slate-200 rounded-full text-[11px] ${
                        item.tagid == '3, 2016' ? 'w-[100px]' : 'w-[72px]'
                      } h-[22px] ml-2 text-center pt-0.5`}
                      onClick={() => toggleDrawer(item.infoid)}
                    >
                      {g.tag} - {item.tagid}
                    </button>
                  ))
                )}
            </div>
            <div className='flex justify-end'>
              {sdg
                .filter((s) => s.category === activeTab)
                .map((s) =>
                  s.data.map((item) => (
                    <button
                      key={item.id}
                      className={`text-[#fff] ${item.bgColor} rounded-full text-[11px] w-[72px] h-[22px] ml-2 text-center pt-0.5`}
                      onClick={() => toggleDrawer(item.id)}
                    >
                      {item.label}
                    </button>
                  ))
                )}
            </div>
          </div>
        </div>
        {/* mobile version */}
        <div className='block justify-between items-center border-b border-gray-200 mb-5 w-full xl:hidden lg:hidden md:block  2xl:hidden 4k:hidden'>
          <div
            className='w-full  py-4 h-auto  rounded-md  shadow-[0px_6px_12px_0px_rgba(0,0,0,0.08),0px_1px_3px_0px_rgba(0,0,0,0.10)]'
            onClick={toggleSidebar}
          >
            <div className='text-left mb-2 ml-3 pt-0 flex justify-between'>
              <div className=''>
                <p className='text-[11px]'>General</p>
                <div className=''>
                  <div className=''>
                    <p className='gradient-text text-[22px] font-bold  pt-1'>
                      {activeTab === 'Tab1'
                        ? 'Employees'
                        : activeTab === 'Tab2'
                        ? 'Strategy, policies and practices'
                        : ''}
                    </p>
                  </div>

                  <div className='w-[95px] pl-1 pr-0.5 mt-2 bg-slate-200 rounded justify-center items-center flex'>
                    <div className="text-zinc-600 text-xs font-normal font-['Manrope'] leading-[21px]">
                      Material Topic
                    </div>
                  </div>
                </div>
              </div>

              <div className='flex items-center me-5'>
                <MdKeyboardArrowDown className={`text-2xl float-end `} />
              </div>
            </div>
          </div>

          <div className='w-full float-end pt-2 me-1 my-4'>
            <div className=''>
              <div className='flex mb-2'>
                {gri
                  .filter((g) => g.category === activeTab)
                  .map((g) =>
                    g.data.map((item) => (
                      <button
                        key={item.tagid}
                        className={`text-[#007EEF] bg-slate-200 rounded-full text-[11px] ${
                          item.tagid == '3, 2016' ? 'w-[100px]' : 'w-[72px]'
                        } h-[22px] ml-2 text-center pt-0.5`}
                        onClick={() => toggleDrawer(item.infoid)}
                      >
                        {g.tag} - {item.tagid}
                      </button>
                    ))
                  )}
                {sdg
                  .filter((s) => s.category === activeTab)
                  .map((s) =>
                    s.data.map((item) => (
                      <button
                        key={item.id}
                        className={`text-[#fff] ${item.bgColor} rounded-full text-[11px] w-[72px] h-[22px] ml-2 text-center pt-0.5`}
                        onClick={() => toggleDrawer(item.id)}
                      >
                        {item.label}
                      </button>
                    ))
                  )}
              </div>
            </div>
          </div>
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
                      onClick={toggleDrawerClose}
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
    </>
  );
};

export default Header;
