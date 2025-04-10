"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdAdd } from "react-icons/md";
import TableWithPagination from "./Data-table/TablePagination";
import { Oval } from "react-loader-spinner";
import axiosInstance, { post } from "../../utils/axiosMiddleware";
import {
  setHeadertext1,
  setHeadertext2,
  setHeaderdisplay,
} from "../../../lib/redux/features/topheaderSlice";
import { useDispatch } from "react-redux";
import { FaExclamationTriangle } from "react-icons/fa";
import { GoArrowRight } from "react-icons/go";
import { IoIosWarning } from "react-icons/io";
import Link from "next/link";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
const Report = () => {
  const [isExpandedpage, setIsExpandedpage] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpandednext, setIsExpandednext] = useState(true);
  const [reportname, setReportname] = useState("");
  const [startdate, setStartdate] = useState("");
  const [enddate, setEnddate] = useState("");
  const [reporttype, setReporttype] = useState("");
  const [firstSelection, setFirstSelection] = useState("");
  const [showSecondSelect, setShowSecondSelect] = useState(false);
  const isMounted = useRef(true);
  const [loopen, setLoOpen] = useState(false);
  const [data, setData] = useState([]);
  const [corporates, setCorporates] = useState([]);
  const [organisations, setOrganisations] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState();
  const [selectedCorp, setSelectedCorp] = useState();
  const [error, setError] = useState({});
  const router = useRouter();
  const [entities, setEntities] = useState([]);
  const [massgeshow, setMassgeshow] = useState(false);
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(null);
  const [materialityAssessmentLen,setMaterialityAssessmentLen]=useState([])
  const [assessment_id,setAssessmentId]=useState(null)
  const [reportExist,setReportExist]=useState(false)
  const [selectedOrgName,setSelectedOrgName]=useState("")
  const [selectedCorpName,setSelectedCorpName]=useState("")


  const getAuthToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token")?.replace(/"/g, "");
    }
    return "";
  };
  const token = getAuthToken();

  let axiosConfig = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };
  
  const getMaterialityAssessment= async()=>{
    if(firstSelection&&startdate&&enddate&&selectedOrg){
      try{
        const response = await axiosInstance.get(
          `${
            process.env.BACKEND_API_URL
          }/materiality_dashboard/get_materiality_assessment_for_report/?start_date=${startdate}&end_date=${enddate}&organization_id=${selectedOrg}&report_by=${firstSelection}&corporate_id=${selectedCorp?selectedCorp:null}`,
          axiosConfig
        );
        if(response.status==200){
          console.log(response.data,"look")
          setMaterialityAssessmentLen(response.data)
          if(response.data.length==1){
            setAssessmentId(response.data[0].id)
          }
        }
        
      }
      catch(err){
        console.error(err)
      }
    }
  }

  const getReportExist= async()=>{
    if(firstSelection&&startdate&&enddate&&selectedOrg&&reporttype&&firstSelection){
      try{
        const response = await axiosInstance.get(
          `${
            process.env.BACKEND_API_URL
          }/sustainapp/report_exists/?start_date=${startdate}&end_date=${enddate}&report_type=${reporttype}&report_by=${firstSelection}&organization=${selectedOrg}&corporate=${selectedCorp?selectedCorp:""}`,
          axiosConfig
        );
        if(response.status==200){
          if(response.data.message=="Report Found"){
            setReportExist(true)
            setSelectedCorpName(response.data.corporate)
            setSelectedOrgName(response.data.organization)
          }
          else{
            setReportExist(false)
          }
        }
        
      }
      catch(err){
        console.error(err)
      }
    }
  }

  useEffect(()=>{
    getMaterialityAssessment()
    getReportExist()
    setMassgeshow(false)
  },[firstSelection,startdate,enddate,selectedOrg,selectedCorp,reporttype])

  useEffect(() => {
    dispatch(setHeadertext1(""));
    dispatch(setHeaderdisplay("none"));
    dispatch(setHeadertext2("Report"));
  }, [dispatch]);
  const handleCheckboxChange = (index) => {
    const newEntities = [...entities];
    newEntities[index].checked = !newEntities[index].checked;
    setEntities(newEntities);
  };

  const handleOwnershipRatioChange = (index, value) => {
    const newValue = Number(value);
    if (newValue >= 0 && newValue <= 99) {
      const newEntities = [...entities];
      newEntities[index].ownershipRatio = newValue;
      setEntities(newEntities);
    }
  };
  const handleChangeallcrop = async (event) => {
    const selectedId = event.target.value;
    setSelectedOrg(selectedId);
    try {
      const response = await axiosInstance.get(
        `/sustainapp/all_corporate_list/`,
        {
          params: { organization_id: selectedId },
        }
      );
      setEntities(response.data);
    } catch (e) {
      console.log(
        "failed fetching organization",
        process.env.REACT_APP_BACKEND_URL
      );
    }
  };

  const fetchOrg = async () => {
    try {
      const response = await axiosInstance.get(`/orggetonly`);
      // console.log("orgs:", response.data[0].name);
      setOrganisations(response.data);
      // setSelectedOrg(response.data[0].name);
    } catch (e) {
      console.log(
        "failed fetching organization",
        process.env.REACT_APP_BACKEND_URL
      );
    }
  };
  useEffect(() => {
    if (isMounted.current) {
      fetchOrg();
      fetchReoprts();

      isMounted.current = false;
    }
    return () => {
      isMounted.current = false;
    };
  }, []);
  useEffect(() => {
    // Remove items from local storage when the component mounts
    localStorage.removeItem("reportid");
    localStorage.removeItem("reportorgname");
    localStorage.removeItem("reportstartdate");
    localStorage.removeItem("reportenddate");
    localStorage.removeItem("organizationcountry");
    localStorage.removeItem("reportname");
    localStorage.removeItem("selectedImage");
  }, []);
  const handleChangecrop = async (event) => {
    // Update the state with the new selection
    const selectedId = event.target.value;
    setSelectedOrg(selectedId);

    // Perform the API call with the selected ID
    try {
      const response = await axiosInstance.get(`/corporate/`, {
        params: { organization_id: selectedId },
      });

      console.log("Corporates:", response.data);
      setCorporates(response.data);
    } catch (e) {
      console.log(
        "failed fetching organization",
        process.env.REACT_APP_BACKEND_URL
      );
    }
  };

  const handleFirstSelectChange = (event) => {
    setFirstSelection(event.target.value);
    setSelectedCorp()
    setSelectedOrg()
    setReportExist(false)
    setShowSecondSelect(true); // Show the second select box when an option is selected
  };
  // const handleOrgselect = (event) => {
  //   setOrgselectdata(event.target.value);
  //   // console.log(event.target.value,"orgdata");
  //   // Show the second select box when an option is selected
  // };
  // const handleCorpselect = (event) => {
  //   setCorporateselect(event.target.value);
  //   // console.log(event.target.value,"orgdata");
  //   // Show the second select box when an option is selected
  // };
  const LoaderOpen = () => {
    setLoOpen(true);
  };
  const LoaderClose = () => {
    setLoOpen(false);
  };

  //   LoaderOpen();
  //   const userId = localStorage.getItem("user_id");
  //   // console.log("user id ", localStorage.getItem("user_id"));
  //   const response = await axios.get(
  //     `${
  //       process.env.REACT_APP_BACKEND_URL
  //     }/user_org?username=${localStorage.getItem("email")}`
  //   );

  //   setOrgdata(response.data.org_data);
  //   setCorpoatedata(response.data.corp_data);

  //   LoaderClose();
  // };
  const fetchReoprts = async () => {
    LoaderOpen();

    // console.log("user id ", localStorage.getItem("user_id"));
    const response = await axiosInstance
      .get(`/sustainapp/report_details/`)
      .then((response) => {
        // Handle the response here.
        console.log(response.data, "reprotdetilles");
        // setOrgdata(response.data.org_data);
        // setCorpoatedata(response.data.corp_data);
        setData(response.data);
        LoaderClose();
      })
      .catch((error) => {
        // Handle the error here.
        setData([]);
        LoaderClose();
      });
  };

  const handleChangeName = (event) => {
    setReportname(event.target.value);
    window.localStorage.setItem("reportname", event.target.value);
  };
  const handleChangeStartdate = (event) => {
    setStartdate(event.target.value);
  };
  const handleChangeEnddate = (event) => {
    setEnddate(event.target.value);
  };
  const handleChangeReporttype = (event) => {
    setReporttype(event.target.value);
  };

  function formatCurrentDate() {
    const now = new Date();

    const day = now.getDate();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[now.getMonth()];
    const year = now.getFullYear();

   
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12 || 12; 


    const formattedDate = `${day} ${month} ${year} ${hours}:${minutes}:${seconds} ${ampm}`;
    return formattedDate;
}

  const submitForm = async () => {
    LoaderOpen();
    const selectedEntities = entities
      .filter((entity) => entity.checked)
      .map((entity) => ({
        corporate_id: entity.id,
        ownership_ratio: entity.ownershipRatio,
      }));
    const sandData = {
      name: reportname,
      report_type: reporttype,
      report_by: firstSelection,
      start_date: startdate,
      end_date: enddate,
      organization: selectedOrg,
      corporate: selectedCorp,
      investment_corporates: selectedEntities,
      assessment_id:assessment_id?assessment_id:null
    };

    await post(`/sustainapp/report_create/`, sandData)
      .then((response) => {
        if (response.status == "200") {
          toast.success("Report has been added successfully", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          LoaderClose();
          handleCloseModal();
          fetchReoprts();
          setReportname();
          setReporttype();
          setStartdate();
          setEnddate();
          setSelectedOrg();
          setSelectedCorp();
          setFirstSelection();

          window.localStorage.setItem("reportid", response.data.id);
          window.localStorage.setItem(
            "reportorgname",
            response.data.organization_name
          );
          window.localStorage.setItem(
            "reportstartdate",
            response.data.start_date
          );
          window.localStorage.setItem("reportenddate", response.data.end_date);
          window.localStorage.setItem("reportCreatedOn", response.data.created_at);
          window.localStorage.setItem(
            "organizationcountry",
            response.data.organization_country
          );
          window.localStorage.setItem("reportType", reporttype);
          if (
            reporttype == "GRI Report: In accordance With" ||
            reporttype == "GRI Report: With Reference to"
          ) {
            router.push("/dashboard/Report/ESG");
          } else {
            router.push("/dashboard/Report/GHG/Ghgtemplates");
          }

          //   navigate(`/report/GHGtemplate`, { state: { data: response.data } });
        } else if (response.status == "204") {
          toast.error("No data available for the given corporate IDs", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          LoaderClose();
          handleCloseModal();
          setReportname();
          setReporttype();
          setStartdate();
          setEnddate();
          setSelectedOrg();
          setSelectedCorp();
          setFirstSelection();
        }
      })
      .catch((error) => {
        if (error.status === 400) {
          LoaderClose();
          // setReportname();
          // setReporttype();
          // setStartdate();
          // setEnddate();
          // setSelectedOrg();
          // setSelectedCorp();
          // setFirstSelection();
          setMassgeshow(true);
        } else {
          const errorMessage =
            error.response && error.response.data && error.response.data.message
              ? error.response.data.message
              : "An unexpected error occurred";
          toast.error(errorMessage, {
            // Corrected 'error.message'
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          handleCloseModal();
          setReportname();
          setReporttype();
          setStartdate();
          setEnddate();
          setSelectedOrg();
          setSelectedCorp();
          LoaderClose();
          setFirstSelection();
        }
      });
  };
  const validateForm = () => {
    let newErrors = {};
    if (!reportname) {
      newErrors.reportname = "Name is required.";
    }

    if (!reporttype) {
      newErrors.reporttype = "Please select Type Of Report.";
    }

    if (!firstSelection) {
      newErrors.firstSelection = "Please select Report by";
    }
    if (firstSelection === "Organization") {
      if (!selectedOrg) {
        newErrors.selectedOrgrs = "Please select Organisation.";
      }
    } else if (firstSelection === "Corporate") {
      if (!selectedOrg) {
        newErrors.selectedOrgs = "Please select Organisation";
      }
      if (!selectedCorp) {
        newErrors.selectedCorp = "Please select Corporate.";
      }
    }
    if (!startdate) {
      newErrors.startdate = "Please select a date";
    }
    if (!enddate) {
      newErrors.enddate = "Please select a date";
    }

    return newErrors;
  };
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission

    const formErrors = validateForm();
    if (Object.keys(formErrors).length === 0) {
      setError({}); // Clear any existing errors
      await submitForm(); // Proceed with the form submission
    } else {
      setError(formErrors); // Update the state with the validation errors
    }
  };

  const renderSecondSelect = () => {
    if (firstSelection === "Organization") {
      return (
        <div className="grid grid-cols-1">
          <select
            className="block w-full rounded-md border-0 py-1.5 pl-4 text-neutral-500 text-[12px] font-normal leading-tight ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
            value={selectedOrg}
            onChange={handleChangeallcrop}
            // onChange={(e) => setSelectedOrg(e.target.value)}
          >
            <option value="">--Select Organization--- </option>
            {organisations?.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}{" "}
          </select>
          {error.selectedOrgrs && (
            <p className="text-red-500 ml-1">{error.selectedOrgrs}</p>
          )}
        </div>
      );
    } else if (firstSelection === "Corporate") {
      return (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 mb-4">
            <div className="mr-2">
              <label
                htmlFor="cname"
                className="text-neutral-800 text-[12px] font-normal"
              >
                Select Organization
              </label>
              <div className="mt-2">
                <select
                  className="block w-full rounded-md border-0 py-1.5 pl-4 text-neutral-500 text-[12px] font-normal leading-tight ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                  value={selectedOrg}
                  // onChange={(e) => setSelectedOrg(e.target.value)}
                  onChange={handleChangecrop}
                >
                  <option value="">--Select Organization--- </option>
                  {organisations?.map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.name}
                    </option>
                  ))}{" "}
                </select>

                {error.selectedOrgs && (
                  <p className="text-red-500 ml-1">{error.selectedOrgs}</p>
                )}
              </div>
            </div>
            <div className="ml-2">
              <label
                htmlFor="cname"
                className="text-neutral-800 text-[12px] font-normal"
              >
                Select Corporate
              </label>
              <div className="mt-2">
                <select
                  className="block w-full rounded-md border-0 py-1.5 pl-4 text-neutral-500 text-[12px] font-normal leading-tight ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                  value={selectedCorp}
                  onChange={(e) => setSelectedCorp(e.target.value)}
                >
                  <option value="">--Select Corporate--- </option>
                  {corporates?.map((corp) => (
                    <option key={corp.id} value={corp.id}>
                      {corp.name}
                    </option>
                  ))}{" "}
                </select>
                {error.selectedCorp && (
                  <p className="text-red-500 ml-1">{error.selectedCorp}</p>
                )}
              </div>
            </div>
          </div>
        </>
      );
    } else {
      return null; // Return null if no option or an unknown option is selected
    }
  };
  const [value, setValue] = useState({
    startDate: null,
    endDate: null,
  });

  const handleValueChange = (newValue) => {
    console.log("newValue:", newValue);
    setValue(newValue);
  };
  const handleClick = () => {
    setIsExpandednext(!isExpandednext);
    setIsExpandedpage(!isExpandedpage);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setMassgeshow(false);
    setIsMenuOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setReportname();
    setReporttype();
    setStartdate();
    setEnddate();
    setSelectedOrg();
    setSelectedCorp();
    setFirstSelection();
    setMassgeshow(false);
    setMaterialityAssessmentLen([])
    setError({});
    setReportExist(false)
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "long" }; 
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <>
      <ToastContainer style={{ fontSize: "12px" }} />
      <div className="my-10 pb-5 xl:mx-8 md:mx-8 text-left border border-gray-300 rounded-md">
        <div className="px-3 xl:flex py-4  justify-between">
          <div>
            <h1 className="text-[#101828] mb-1 text-[1.375rem] font-bold">
              Report
            </h1>
            <p className="text-[14px] text-[#667085]">
              All the reports generated for the organization can be accessed
              here
            </p>
          </div>
          <div
            className="flex items-center space-x-2 text-[#007EEF] text-xs font-bold leading-[15px] cursor-pointer xl:ml-2 xl:float-end xl:mt-0 mt-2"
            onClick={handleOpenModal}
          >
            <div className="text-[#007EEF] text-[14px] font-bold leading-[15px]">
              Add Report
            </div>
            <MdAdd className="text-[14px]" />
          </div>
        </div>

        <div className="">
          {/* <div className="mt-3">
          <DataTable data={data}/>
          </div> */}
          <div className="mt-3">
            <TableWithPagination
              data={data}
              setData={setData}
              defaultItemsPerPage={10}
              fetchReoprts={fetchReoprts}
              setIsMenuOpen={setIsMenuOpen}
              isMenuOpen={isMenuOpen}
            />
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="relative top-5  p-5 border xl:w-[50%] w-[95%] shadow-lg rounded-md bg-white xl:ml-40">
            <div className="mt-3 text-center">
              <div className="flex justify-between items-center drop-shadow-lg border-b-2 pt-6 w-full">
                <h2 className="self-stretch text-black text-opacity-90 text-[22px] font-normal leading-relaxed flex space-x-8 items-center ms-6">
                  <span>New Report</span>
                </h2>
                <button
                  className="absolute top-2 right-2 mt-4 text-gray-500 hover:text-gray-700 focus:outline-none"
                  onClick={handleCloseModal}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              {/* validation code */}
              {massgeshow && (
                <div className="mt-5 px-7 ">
                  <div className="flex items-start p-4  border-t-2 border-[#F98845] rounded shadow-md">
                    <div className="flex-shrink-0">
                      <FaExclamationTriangle className="text-[#F98845] w-6 h-6" />
                    </div>
                    <div className="ml-3">
                      <p className="font-bold text-left text-[#0D024D] ">
                        Mandatory GRI: General Disclosures missing
                      </p>
                      <p className="text-[12px] text-[#0D024D]  mt-1">
                        Please fill the missing disclosures of GRI Reporting
                        Info under
                        <strong> Collect &gt; General</strong> section to
                        proceed.
                      </p>
                      <div className="mt-2 text-left flex">
                        <p className="text-[#0D024D] text-[12px]">
                          {" "}
                          Proceed to Collect &gt;
                        </p>
                        <Link
                          href="/dashboard/general"
                          className="text-blue-500  text-sm font-semibold flex"
                        >
                          General &gt; GRI Reporting Info{" "}
                          <GoArrowRight className="font-bold mt-1 ml-2" />
                        </Link>
                      </div>
                    </div>
                    <div className="ml-auto">
                      <p
                        className="text-sm text-blue-500  ml-4"
                        data-tooltip-id={`tooltip-$e86`}
                        data-tooltip-html="<p>Requirement 2 as per GRI: General Disclosures 2021 states that reasons for omission are not permitted for Disclosures 2-1, 2-2, 2-3, 2-4, and 2-5, as reporting on these disclosures is mandatory. Please fill the data here:</p> <br> <p>COLLECT>GENERAL>GRI Reporting Info before creating the report.</p>"
                      >
                        Learn more
                      </p>
                      <ReactTooltip
                        id={`tooltip-$e86`}
                        place="top"
                        effect="solid"
                        style={{
                          width: "290px",
                          backgroundColor: "#FFF",
                          color: "#000",
                          fontSize: "12px",
                          boxShadow: 3,
                          borderRadius: "8px",
                          textAlign: "left",
                          zIndex: 100,
                          boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
                          opacity: 1,
                        }}
                      ></ReactTooltip>
                    </div>
                  </div>
                </div>
              )}
              {reportExist && (
                <div className="mt-5 px-7 ">
                  <div className="flex items-start p-4  border-t-2 border-[#F98845] rounded shadow-md">
                    <div className="flex-shrink-0">
                      <FaExclamationTriangle className="text-[#F98845] w-5 h-5 mt-1" />
                    </div>
                    <div className="ml-3">
                      <p className="text-left text-[#0D024D] text-[15px]">
                      A report already exists for {selectedOrgName} {selectedCorpName?`and ${selectedCorpName}`:''} for the selected period. Do you want to create another report?
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {/* validation code end */}
              <div className="mt-2 xl:px-7 py-3">
                <form className="w-full text-left">
                  <div className="mr-2 mb-4 w-[101%]">
                    <label
                      htmlFor="cname"
                      className="block text-neutral-800 text-[13px] font-normal"
                    >
                      Report Name
                    </label>
                    <div className="mt-2 mr-2">
                      <input
                        id="cname"
                        name="name"
                        type="text"
                        autoComplete="cname"
                        value={reportname}
                        onChange={handleChangeName}
                        required
                        placeholder="Report Name"
                        className="block w-full rounded-md border-0 py-1.5 pl-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    {error.reportname && (
                      <p className="text-red-500 ml-1">{error.reportname}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 mb-4">
                    <div className="xl:mr-2">
                      <label
                        htmlFor="sdate"
                        className="block text-neutral-800 text-[13px] font-normal"
                      >
                        Select Type Of Report
                      </label>
                      <div className="mt-2 xl:mr-2">
                        <select
                          className="block w-full rounded-md border-0 py-2 xl:pl-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          onChange={handleChangeReporttype}
                          value={reporttype}
                          name="Reporttype"
                        >
                          <option>Select Report Type</option>
                          <option>GHG Accounting Report</option>
                          <option>GHG Report - Investments</option>
                          <option>GRI Report: In accordance With</option>
                          {/* <option>GRI Report: With Reference to</option> */}
                        </select>
                        {error.reporttype && (
                          <p className="text-red-500 ml-1">
                            {error.reporttype}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="xl:ml-2">
                      <label
                        htmlFor="cname"
                        className="block text-neutral-800 text-[13px] font-normal"
                      >
                        Report by
                      </label>
                      <div className="mt-2">
                        <select
                          className="block w-full rounded-md border-0 py-2 xl:pl-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          onChange={handleFirstSelectChange}
                          value={firstSelection}
                        >
                          <option>Select option</option>
                          <option>Organization</option>
                          <option>Corporate</option>
                        </select>{" "}
                      </div>
                      {error.firstSelection && (
                        <p className="text-red-500 ml-1">
                          {error.firstSelection}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mb-3">
                    {showSecondSelect && renderSecondSelect()}
                  </div>
                  {reporttype === "GHG Report - Investments" && (
                    <div className="mr-2 h-[250px] overflow-y-auto">
                      <label
                        htmlFor="sdate"
                        className="block text-neutral-800 text-[13px] font-normal"
                      >
                        Select Investment Corporate
                      </label>
                      <div className="mt-2 mr-2">
                        <div className="p-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-gray-400 font-semibold text-[13px]">
                              Investment Corporate
                            </div>
                            <div className="text-gray-400 font-semibold text-[13px]">
                              Ownership Ratio %
                            </div>

                            {entities.map((entity, index) => (
                              <React.Fragment key={index}>
                                <div className="flex items-center space-x-2">
                                  <input
                                    id={entity.id}
                                    type="checkbox"
                                    checked={entity.checked}
                                    onChange={() => handleCheckboxChange(index)}
                                    className="form-checkbox h-5 w-5 text-green-600"
                                    value={entity.id}
                                  />
                                  <label
                                    htmlFor={entity.id}
                                    className="text-gray-800 text-[13px]"
                                  >
                                    {entity.name}
                                  </label>
                                </div>
                                <input
                                  type="number"
                                  placeholder="Enter Ownership Ratio %"
                                  className="border p-2 rounded w-full text-[13px]"
                                  disabled={!entity.checked}
                                  value={entity.ownershipRatio}
                                  onChange={(e) =>
                                    handleOwnershipRatioChange(
                                      index,
                                      e.target.value
                                    )
                                  }
                                />
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 mb-3">
                    <div>
                      <label
                        htmlFor="sdate"
                        className="block text-neutral-800 text-[13px] font-normal"
                      >
                        Reporting Period (From)
                      </label>
                      <div className="mt-2 xl:mr-4">
                        <input
                          id="sdate"
                          name="startdate"
                          type="date"
                          autoComplete="sdate"
                          value={startdate}
                          onChange={handleChangeStartdate}
                          required
                          placeholder="Select Fiscal Year"
                          className="block w-full px-1 rounded-md border-0 py-1.5 pl-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                      {error.startdate && (
                        <p className="text-red-500 ml-1">{error.startdate}</p>
                      )}
                    </div>
                    <div className="xl:ml-3 w-full">
                      <label
                        htmlFor="edate"
                        className="block text-neutral-800 text-[13px] font-normal"
                      >
                        Reporting Period (To)
                      </label>
                      <div className="mt-2 xl:mr-3">
                        <input
                          id="edate"
                          name="enddate"
                          type="date"
                          autoComplete="edate"
                          value={enddate}
                          onChange={handleChangeEnddate}
                          required
                          placeholder="End date"
                          className="block w-full px-1 rounded-md border-0 py-1.5 pl-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                      {error.enddate && (
                        <p className="text-red-500 ml-1">{error.enddate}</p>
                      )}
                    </div>
                  </div>
                  {/* materiality assessment */}
                  {materialityAssessmentLen&&materialityAssessmentLen.length>1?(
                     <div>
                     <div className="flex gap-2 mb-2">
                       <IoIosWarning className="text-[#F98845] w-5 h-5" />
                     <p className="text-[14px] text-[#F98845] font-[500]">More than one materiality assessment is present in the  selected date range</p>
                     </div>
                     <div>
                       <p className="text-neutral-800 text-[13px] font-normal">Select Materiality Assessment *</p>
                       <select className="mt-1 block w-[34%] py-2 bg-white rounded-md focus:outline-none sm:text-sm mb-2"
                       onChange={(e) => setAssessmentId(e.target.value)}
                       >
                       <option  value="" disabled selected>Select Assessment</option>
                       {materialityAssessmentLen&&materialityAssessmentLen.map((val)=>(
                       <option class="text-black text-sm hover:bg-blue-100" value={val.id}>{`${formatDate(val.start_date)} - ${formatDate(val.end_date)}`}</option>
                       ))}
                     </select>
                     <p className="text-[#ACACAC] text-[12px] font-normal">Select one of the materiality assessment found in the date range</p>
                     </div>
                     
                 </div>
                  ):(
                    <div></div>
                  )}
                 
                  <div className="flex justify-center mt-10">
                    <div className="">
                      <button
                        type="submit"
                        // value="Create Report"
                        className="w-[100%] h-[31px] mb-2 px-[22px] py-2 bg-sky-600 rounded shadow flex-col justify-center items-center inline-flex cursor-pointer text-white"
                        onClick={handleSubmit}
                      >
                        Create Report
                      </button>
                    </div>
                  </div>
                  {/* onClick={handleClick} */}
                </form>
              </div>
              {/* <div className="items-center px-4 py-3">
                     <button
                         onClick={onClose}
                         className="px-4 py-2 bg-gray-800 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
                     >
                         Close
                     </button>
                 </div> */}
            </div>
          </div>
        </div>
      )}
      {loopen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <Oval
            height={50}
            width={50}
            color="#00BFFF"
            secondaryColor="#f3f3f3"
            strokeWidth={2}
            strokeWidthSecondary={2}
          />
        </div>
      )}
    </>
  );
};
export default Report;
