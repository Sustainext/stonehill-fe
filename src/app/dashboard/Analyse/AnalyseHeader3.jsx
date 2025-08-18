'use client';
import { useEffect, useState } from 'react';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { yearInfo } from '@/app/shared/data/yearInfo';
import axiosInstance from '@/app/utils/axiosMiddleware';

const AnalyseHeader3 = ({
  selectedLocation,
  setSelectedLocation,
  year,
  setYear,
}) => {
  const [formState, setFormState] = useState({
    location: selectedLocation,
    year: year,
  });

  const [locations, setLocations] = useState([]);
  const [errors, setErrors] = useState({
    location: selectedLocation ? '' : 'Please select location',
    year: year ? '' : 'Please select year',
  });

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axiosInstance.get('/sustainapp/get_location');
        setLocations(response.data);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    fetchLocations();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === 'location') {
      setSelectedLocation(Number(value));
      setYear('');
      setErrors((prevErrors) => ({
        ...prevErrors,
        location: value ? '' : 'Please select location',
        year: 'Please select year',
      }));
    } else if (name === 'year') {
      setYear(value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        year: value ? '' : 'Please select year',
      }));
    }
  };

  useEffect(() => {
    setFormState({
      location: selectedLocation,
      year: year,
    });
  }, [selectedLocation, year]);

  return (
    <>
      <div className='mx-4 mb-5 mt-5'>
        <div className='flex mb-5 gap-4'>
          {/* Location Selector */}
          <div className='w-[20%] relative'>
            <label
              htmlFor='location'
              className='block text-neutral-800 text-[12px] font-normal mb-1'
            >
              Select Location
            </label>
            <select
              name='location'
              className='faulty border w-full text-[12px] text-neutral-500 appearance-none pr-8 rounded-md py-2 pl-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
              value={formState.location}
              onChange={handleChange}
            >
              <option value=''>Select location</option>
              {locations.map((location, index) => (
                <option key={index} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
            <div
              className='absolute inset-y-0 right-2 flex items-center pointer-events-none'
              style={{ top: '50%', transform: 'translateY(-50%)' }}
            >
              {<MdKeyboardArrowDown
                className="text-neutral-500"
                style={{ fontSize: "16px" }}
              />
                
            </div>
            {errors.location && (
              <p className='text-[#007EEF] text-[12px] mt-1 ml-1'>
                {errors.location}
              </p>
            )}
          </div>

          <div className='w-[20%] relative'>
            <label
              htmlFor='dateRange'
              className='block text-neutral-800 text-[12px] font-normal mb-1'
            >
              Select Year
            </label>
            <select
              name='year'
              className='faulty border w-full text-[12px] text-neutral-500 appearance-none pr-8 rounded-md py-2 pl-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
              value={formState.year}
              onChange={handleChange}
            >
              <option value=''>Select year</option>
              {yearInfo.map((item) => (
                <option value={item.slice(0, 4)} key={item}>
                  {item.slice(0, 4)}
                </option>
              ))}
            </select>
            <div
              className='absolute inset-y-0 right-2 flex items-center pointer-events-none'
              style={{ top: '50%', transform: 'translateY(-50%)' }}
            >
              {<MdKeyboardArrowDown
                className="text-neutral-500"
                style={{ fontSize: "16px" }}
              />
                
            </div>
            {errors.year && (
              <p className='text-[#007EEF] text-[12px] mt-1 ml-1'>
                {errors.year}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AnalyseHeader3;
