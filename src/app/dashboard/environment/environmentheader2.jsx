// organisations,corporates and year///
"use client";
import { useEffect, useState } from "react";
import { yearInfo, months } from "@/app/shared/data/yearInfo";
import axiosInstance from "@/app/utils/axiosMiddleware";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMaterialityData,
  setCorpID,
  setOrgID,
  setOrgName,
  setCorpName,
  setYear,
  setStartDate,
  setEndDate,
  setMaterialityYear,
  setIsYearChanged,
} from "../../../lib/redux/features/materialitySlice";
import { MdKeyboardArrowDown } from "react-icons/md";

const EnvironmentHeade2 = ({
  activeMonth,
  setActiveMonth,
  selectedOrg,
  setSelectedOrg,
  selectedCorp,
  setSelectedCorp,
  year,
  setYear,
  setToggleStatus,
}) => {
  const dispatch = useDispatch();
  const {
    corporate_id,
    organization_id,
    materiality_year,
    start_date,
    end_date,
    data,
    assessment_year,
    is_year_changed,
    loading,
    error,
  } = useSelector((state) => state.materialitySlice);

  const [formState, setFormState] = useState({
    selectedCorp: selectedCorp,
    selectedOrg: selectedOrg,
    year: year,
    month: activeMonth,
  });
  // const[isYearChanged,setIsyearChanged]=useState(false)
  const [reportType, setReportType] = useState("Organization");
  const handleReportTypeChange = (type) => {
    setReportType(type);
    setToggleStatus(type);

    if (type === "Organization") {
      setSelectedCorp(""); // Clear selectedCorp when Organization is chosen
      dispatch(setCorpID("")); // Reset corporate ID in Redux store
      dispatch(setCorpName("")); // Reset corporate name in Redux store
    }
  };
  const [errors, setErrors] = useState({});

  const [organisations, setOrganisations] = useState([]);
  const [corporates, setCorporates] = useState([]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === "month") {
      setActiveMonth(monthMapping[value]);
    } else if (name === "year") {
      setYear(value);
      // setIsyearChanged(true)
      dispatch(setIsYearChanged(true));
      dispatch(setMaterialityYear(value));
      setErrors((prevErrors) => ({
        ...prevErrors,
        year: value ? "" : "Please select year",
      }));
    } else if (name === "selectedOrg") {
      setSelectedOrg(value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        organization: value ? "" : "Please select Organisation",
      }));
    } else if (name === "selectedCorp") {
      setSelectedCorp(value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        corporate: value ? "" : "Please select Corporate",
      }));
    }
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

  const loadMaterialityDashboard = () => {
    if (selectedOrg && year) {
      dispatch(
        fetchMaterialityData({
          corporate: selectedCorp,
          organization: selectedOrg,
          start_date: year ? `${year}-01-01` : "",
          end_date: year ? `${year}-12-31` : "",
          // start_date: year==assessment_year?start_date?start_date:`${year}-01-01`:is_year_changed?`${year}-01-01`:start_date?start_date:`${year}-01-01`,
          //   end_date: year==assessment_year?end_date?end_date:`${year}-12-31`:is_year_changed?`${year}-12-31`:end_date?end_date:`${year}-12-31`,
        })
      );
    } else {
      dispatch(
        fetchMaterialityData({
          corporate: "",
          organization: "",
          start_date: "",
          end_date: "",
        })
      );
    }
  };

  useEffect(() => {
    if (organization_id) {
      setSelectedOrg(organization_id);
    }
    if (corporate_id) {
      setSelectedCorp(corporate_id);
    }
    if (materiality_year) {
      setYear(materiality_year);
    }
    setErrors({
      organization:
        organization_id || selectedOrg ? "" : "Please select Organisation",
      corporate: corporate_id || selectedCorp ? "" : "Please select Corporate",
      year: materiality_year || year ? "" : "Please select year",
    });
  }, [organization_id, corporate_id, materiality_year]);

  useEffect(() => {
    setFormState({
      selectedCorp: selectedCorp,
      selectedOrg: selectedOrg,
      year: year,
      month: activeMonth,
    });
    dispatch(setOrgID(selectedOrg));
    dispatch(setCorpID(selectedCorp));
    dispatch(setMaterialityYear(year));
    loadMaterialityDashboard();
  }, [selectedOrg, selectedCorp, year]);

  const handleOrgChange = (e) => {
    const newOrg = e.target.value;
    const selectedOption = e.target.selectedOptions[0];
    const newOrgName = selectedOption.getAttribute("name");
    setSelectedOrg(newOrg);
    dispatch(setOrgID(newOrg));
    dispatch(setOrgName(newOrgName));
    dispatch(setCorpID(""));
    dispatch(setCorpName(""));
    setSelectedCorp("");
    setErrors((prevErrors) => ({
      ...prevErrors,
      organization: newOrg ? "" : "Please select Organisation",
    }));
  };

  const handleCorpChange = (e) => {
    const newCorp = e.target.value;
    const selectedOption = e.target.selectedOptions[0];
    const newCorpName = selectedOption.getAttribute("name");
    setSelectedCorp(newCorp);
    dispatch(setCorpID(newCorp));
    dispatch(setCorpName(newCorpName));
    setErrors((prevErrors) => ({
      ...prevErrors,
      corporate: newCorp ? "" : "Please select Corporate",
    }));
  };
  useEffect(() => {
    if (selectedCorp) {
      setReportType("Corporate");
      // console.log(selectedCorp,"test crop id");
    }
  }, [selectedCorp]);
  return (
    <>
      <div>
        <div className="flex-col items-center ">
          <div className="mt-4 pb-3 xl:mx-5 lg:mx-5 md:mx-5 2xl:mx-5 4k:mx-5 2k:mx-5 mx-2 text-left">
            <div className="mb-2 flex-col items-center">
              <div className="justify-start items-center gap-4 inline-flex">
                <div className="text-zinc-600 text-[12px] font-semibold font-['Manrope']">
                  Add By:
                </div>
                <div className="rounded-lg shadow  justify-start items-start flex">
                  <div
                    className={`w-[111px] px-4 py-2.5 border rounded-l-lg border-gray-300 justify-center items-center gap-2 flex cursor-pointer ${
                      reportType === "Organization"
                        ? "bg-[#d2dfeb]"
                        : "bg-white"
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
                className={`grid grid-cols-1 md:grid-cols-4 xl:w-[80%] lg:w-[80%] 2xl:w-[80%] md:w-[80%] 4k:w-[80%] 2k:w-[80%] w-[100%] mb-2 pt-4 ${
                  reportType !== "" ? "visible" : "hidden"
                }`}
              >
                <div className="mr-2 relative">
                  <label
                    htmlFor="cname"
                    className="text-neutral-800 text-[12px] font-normal ml-1"
                  >
                    Select Organization*
                  </label>
                  <div className="mt-2">
                    <select
                      className="block w-full rounded-md border-0 pr-3 py-1.5 pl-4 text-neutral-500 text-[12px] font-normal leading-tight ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                      value={selectedOrg}
                      onChange={handleOrgChange}
                    >
                      <option value="01">Select Organization</option>
                      {organisations &&
                        organisations.map((org) => (
                          <option key={org.id} value={org.id} name={org.name}>
                            {org.name}
                          </option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 top-2  right-2 flex items-center pl-3 pointer-events-none">
                      <MdKeyboardArrowDown
                        className="text-neutral-500"
                        style={{ fontSize: "16px" }}
                      />{" "}
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
                      className="text-neutral-800 text-[12px] pr-7 font-normal ml-1"
                    >
                      Select Corporate
                    </label>
                    <div className="mt-2 relative">
                      <select
                        className="block w-full pr-3 rounded-md border-0 py-1.5 pl-4 text-neutral-500 text-[12px] font-normal leading-tight ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                        value={selectedCorp}
                        onChange={handleCorpChange}
                      >
                        <option value="">Select Corporate </option>
                        {corporates &&
                          corporates.map((corp) => (
                            <option
                              key={corp.id}
                              value={corp.id}
                              name={corp.name}
                            >
                              {corp.name}
                            </option>
                          ))}
                      </select>
                      <div className="absolute inset-y-0 top-2  right-2 flex items-center pl-3 pointer-events-none">
                        <MdKeyboardArrowDown
                          className="text-neutral-500"
                          style={{ fontSize: "16px" }}
                        />{" "}
                      </div>
                      {errors.corporate && (
                        <p className="text-[#007EEF] text-[12px] top=16  left-0 pl-2 mt-2">
                          {errors.corporate}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="mr-2 relative">
                  <label
                    htmlFor="cname"
                    className="text-neutral-800 text-[12px] font-normal ml-1"
                  >
                    Select year
                  </label>
                  <div className="mt-2">
                    <select
                      name="year"
                      className="block w-full rounded-md border-0 py-1.5 pl-4 text-neutral-500 text-[12px] font-normal leading-tight ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                      value={formState.year}
                      onChange={handleChange}
                    >
                      <option value="">Select year</option>
                      {yearInfo.map((item) => (
                        <option value={item.slice(0, 4)} key={item}>
                          {item.slice(0, 4)}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 top-2  right-2 flex items-center pl-3 pointer-events-none">
                      <MdKeyboardArrowDown
                        className="text-neutral-500"
                        style={{ fontSize: "16px" }}
                      />{" "}
                    </div>
                    {errors.year && (
                      <p className="text-[#007EEF] text-[12px] top=16  left-0 pl-2 mt-2">
                        {errors.year}
                      </p>
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

export default EnvironmentHeade2;
