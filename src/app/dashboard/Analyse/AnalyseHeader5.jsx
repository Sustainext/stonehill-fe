"use client";
import { useEffect, useState } from "react";
import  DateRangePicker  from "../../utils/DatePickerComponent";
import axiosInstance from "../../utils/axiosMiddleware";
import { MdKeyboardArrowDown } from "react-icons/md";

const AnalyseHeader5 = ({
  selectedOrg,
  setSelectedOrg,
  selectedCorp,
  setSelectedCorp,
  dateRange,
  setDateRange,
  setToggleStatus,
}) => {
  const [formState, setFormState] = useState({
    selectedCorp: selectedCorp,
    selectedOrg: selectedOrg,
    start: dateRange.start,
    end: dateRange.end,
  });
  const [reportType, setReportType] = useState("Organization");
  const handleReportTypeChange = (type) => {
    setReportType(type);
    setToggleStatus(type);

    if (type === "Organization") {
      setSelectedCorp(""); // Clear selectedCorp when Organization is chosen
    }
  };
  const [locations, setLocations] = useState([]);
  const [errors, setErrors] = useState({
    organization: "Please select Organisation",
    corporate: "Please select Corporate",
    date:"Please select a date range"
  });

  const [organisations, setOrganisations] = useState([]);
  const [corporates, setCorporates] = useState([]);

  const [isDateRangeValid, setIsDateRangeValid] = useState(false);

  const handleDateChange = (newRange) => {
    setDateRange(newRange);

    let dateError = "";

 if (new Date(newRange.end) < new Date(newRange.start)) {
      setIsDateRangeValid(false);
      setDateRange("")
      dateError = "Please select a valid date range";

    } else {
      setIsDateRangeValid(true);
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      date: dateError
    }));
  };

  useEffect(() => {
    const fetchOrg = async () => {
      try {
        const response = await axiosInstance.get(`/orggetonly`);
        setOrganisations(response.data);
      } catch (e) {
        console.error("Failed fetching organization:", e);
      }
    };

    fetchOrg();
  }, []);

  useEffect(() => {
    const fetchCorporates = async () => {
      if (selectedOrg) {
        try {
          const response = await axiosInstance.get(`/corporate/`, {
            params: { organization_id: selectedOrg },
          });
          setCorporates(response.data);
        } catch (e) {
          if (e.status === 404) {
            setCorporates([]);
          } else {
            console.error("Failed fetching corporates:", e);
          }
        }
      }
    };

    fetchCorporates();
  }, [selectedOrg]);

  useEffect(() => {
    setFormState({
      selectedCorp: selectedCorp,
      selectedOrg: selectedOrg,
      start: dateRange.start,
      end: dateRange.end,
    });
  }, [selectedOrg, selectedCorp,dateRange]);

  const handleOrgChange = (e) => {
    const newOrg = e.target.value;
    setSelectedOrg(newOrg);
    setSelectedCorp("");
    setDateRange("")
    setIsDateRangeValid(false)
    setErrors((prevErrors) => ({
      ...prevErrors,
      organization: newOrg ? "" : "Please select Organisation",
      date:"Please select a date range"
    }));
  };

  const handleCorpChange = (e) => {
    const newCorp = e.target.value;
    setSelectedCorp(newCorp);
    setDateRange("")
    setIsDateRangeValid(false)
    setErrors((prevErrors) => ({
      ...prevErrors,
      corporate: newCorp ? "" : "Please select Corporate",
      date:"Please select a date range"
    }));
  };

  return (
    <>
      <div>
      <div className="flex-col items-center ">
      <div className="mt-4 pb-3 xl:mx-5 lg:mx-5 md:mx-5 2xl:mx-5 4k:mx-5 2k:mx-5 mx-2 text-left">
            <div className="mb-2 flex-col items-center">
              <div className="justify-start items-center gap-4 inline-flex">
                <div className="text-zinc-600 text-[12px] font-semibold font-['Manrope']">
                  View By:
                </div>
                <div className="rounded-lg shadow justify-start items-start flex">
                  <div
                    className={`w-[111px] px-4 py-2.5 border rounded-l-lg border-gray-300 justify-center items-center gap-2 flex cursor-pointer ${
                      reportType === "Organization" ? "bg-[#d2dfeb]" : "bg-white"
                    }`}
                    onClick={() => handleReportTypeChange("Organization")}
                  >
                    <div className="text-slate-800 text-[12px] font-medium font-['Manrope'] leading-tight">
                      Organization
                    </div>
                  </div>
                  <div
                    className={`w-[111px] px-4 py-2.5 border-r border-y border-gray-300 rounded-r-lg justify-center items-center gap-2 flex cursor-pointer ${
                      reportType === "Corporate" ? "bg-[#d2dfeb]" : "bg-white"
                    }`}
                    onClick={() => handleReportTypeChange("Corporate")}
                  >
                    <div className="text-slate-800 text-[12px] font-medium font-['Manrope'] leading-tight">
                      Corporate
                    </div>
                  </div>
                </div>
              </div>
              <div
                     className={`grid grid-cols-1 md:grid-cols-4 xl:w-[80%] lg:w-[80%] 2xl:w-[80%] md:w-[100%] 4k:w-[80%] 2k:w-[80%] w-[100%] mb-2 pt-4 ${
                      reportType !== "" ? "visible" : "hidden"
                    }`}
              >
                <div className="mr-2">
                  <label
                    htmlFor="cname"
                    className="text-neutral-800 text-[12px] font-normal ml-1"
                  >
                    Select Organization*
                  </label>
                  <div className="mt-2">
                    <div className="relative">
                      <select
                        className="faulty block w-full pr-8 rounded-md border-0 py-1.5 pl-4 text-neutral-500 text-[12px] font-normal leading-tight ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 appearance-none"
                        value={selectedOrg}
                        onChange={handleOrgChange}
                      >
                        <option value="01">Select Organization</option>
                        {organisations &&
                          organisations.map((org) => (
                            <option key={org.id} value={org.id}>
                              {org.name}
                            </option>
                          ))}
                      </select>
                      <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                        <MdKeyboardArrowDown
                          className="text-neutral-500"
                          style={{ fontSize: '16px' }}
                        />
                      </div>
                    </div>
                    {errors.organization && (
                      <p className="text-[#007EEF] text-[12px] top=16  left-0 pl-2 mt-2">
                        {errors.organization}
                      </p>
                    )}
                  </div>
                </div>
                {reportType === "Corporate" && (
                  <div className="mr-2">
                    <label
                      htmlFor="cname"
                      className="text-neutral-800 text-[12px] font-normal ml-1"
                    >
                      Select Corporate
                    </label>
                    <div className="mt-2">
                      <div className="relative">
                        <select
                          className="faulty block w-full pr-8 rounded-md border-0 py-1.5 pl-4 text-neutral-500 text-[12px] font-normal leading-tight ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 appearance-none"
                          value={selectedCorp}
                          onChange={handleCorpChange}
                        >
                          <option value="">Select Corporate</option>
                          {corporates &&
                            corporates.map((corp) => (
                              <option key={corp.id} value={corp.id}>
                                {corp.name}
                              </option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                          <MdKeyboardArrowDown
                            className="text-neutral-500"
                            style={{ fontSize: '16px' }}
                          />
                        </div>
                      </div>
                      {errors.corporate && (
                        <p className="text-[#007EEF] text-[12px] top=16  left-0 pl-2 mt-2">
                          {errors.corporate}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="mr-2">
                  <label
                    htmlFor="cname"
                    className="text-neutral-800 text-[12px] font-normal ml-1"
                  >
                    Select Date
                  </label>
                  <div className="mt-2">
                    <DateRangePicker
                      startDate={dateRange.start}
                      endDate={dateRange.end}
                      onDateChange={handleDateChange}
                    />
                    {!isDateRangeValid && (
                      <div className="text-[#007EEF] text-[12px] top=16  left-0 pl-2 mt-2">
                        {errors.date}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AnalyseHeader5;
