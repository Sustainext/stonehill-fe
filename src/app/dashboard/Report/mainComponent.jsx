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
import { useDispatch,useSelector } from "react-redux";
import { FaExclamationTriangle } from "react-icons/fa";
import { GoArrowRight } from "react-icons/go";
import { IoIosWarning } from "react-icons/io";
import Link from "next/link";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import {
  setReportName,
  setReportType,
  setReportBy,
  setSelectedOrganization,
  setSelectedCorporate,
  setStartDate,
  setEndDate,
  setIncludeMaterialTopics,
  setIncludeContentIndex,
  setInvestmentCorporates,
  toggleInvestmentCorporate,
  setOwnershipRatio,
  setSelectedAssessmentId,
  setOrganizations,
  setCorporates,
  setErrors,
  setLoading,
  setReportExists,
  resetForm,
  selectReportName,
  selectReportType,
  selectReportBy,
  selectSelectedOrganization,
  selectSelectedCorporate,
  selectStartDate,
  selectEndDate,
  selectIncludeMaterialTopics,
  selectIncludeContentIndex,
  selectInvestmentCorporates,
  selectSelectedAssessmentId,
  selectOrganizations,
  selectCorporates,
  selectErrors,
  selectIsLoading,
  resetToggleToDefaults,
  selectReportExists,
  selectSelectedOrgName,
  selectSelectedCorpName,
  selectIsFormValid,
  selectFormData,
} from "../../../lib/redux/features/reportCreationSlice"; // Adjust import path
import {initializeForCustomReport,resetToDefaults,fetchReportBuilderData} from '../../../lib/redux/features/reportBuilderSlice'
import {setActivesection} from '../../../lib/redux/features/TCFD/TcfdSlice'
import { isTCFDAvailable } from '../../utils/frameworkChecker'

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
  const [massgename, setMassgename] = useState("");
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(null);
  const [materialityAssessmentLen, setMaterialityAssessmentLen] = useState([]);
  const [assessment_id, setAssessmentId] = useState(null);
  const [reportExist, setReportExist] = useState(false);
  const [selectedOrgName, setSelectedOrgName] = useState("");
  const [selectedCorpName, setSelectedCorpName] = useState("");
  const [showInvestmentMessage, setshowInvestmentMessage] = useState(false);
  const [corpName,setCorpName]=useState('')
  const [orgName,setOrgName]=useState('')
  const [selectedYear, setSelectedYear] = useState("");
  const includeMaterialTopics = useSelector(selectIncludeMaterialTopics);
  const includeContentIndex = useSelector(selectIncludeContentIndex);

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
  const handleYearChange = (event) => {
    const year = event.target.value;
    setSelectedYear(year);
    setStartdate(`${year}-01-01`);
    setEnddate(`${year}-12-31`);
  };
  const getMaterialityAssessment = async () => {
    if (firstSelection && startdate && enddate && selectedOrg) {
      try {
        const response = await axiosInstance.get(
          `${
            process.env.BACKEND_API_URL
          }/materiality_dashboard/get_materiality_assessment_for_report/?start_date=${startdate}&end_date=${enddate}&organization_id=${selectedOrg}&report_by=${firstSelection}&&approach=${reporttype=='GRI Report: With Reference to'?'reference':'accordance'}&corporate_id=${
            selectedCorp ? selectedCorp : null
          }`,
          axiosConfig
        );
        if (response.status == 200) {
          setMaterialityAssessmentLen(response.data);
          if (response.data.length == 1) {
            setAssessmentId(response.data[0].id);
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const getReportExist = async () => {
    if (
      firstSelection &&
      startdate &&
      enddate &&
      selectedOrg &&
      reporttype &&
      firstSelection
    ) {
      try {
        const response = await axiosInstance.get(
          `${
            process.env.BACKEND_API_URL
          }/sustainapp/report_exists/?start_date=${startdate}&end_date=${enddate}&report_type=${reporttype}&report_by=${firstSelection}&organization=${selectedOrg}&corporate=${
            selectedCorp ? selectedCorp : ""
          }`,
          axiosConfig
        );
        if (response.status == 200) {
          if (response.data.message == "Report Found") {
            setReportExist(true);
            setSelectedCorpName(response.data.corporate);
            setSelectedOrgName(response.data.organization);
          } else {
            setReportExist(false);
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    if(['GRI Report: With Reference to','GRI Report: In accordance With'].includes(reporttype)){
      getMaterialityAssessment();
    }   
   getReportExist();
    setMassgeshow(false);
    setMassgename("");
  }, [
    firstSelection,
    startdate,
    enddate,
    selectedOrg,
    selectedCorp,
    reporttype,
  ]);

  useEffect(() => {
    dispatch(setHeadertext1(""));
    dispatch(setHeaderdisplay("none"));
    dispatch(setHeadertext2("Report"));
  }, [dispatch]);
  const handleCheckboxChange = (index, hasData) => {
    const newEntities = [...entities];
    newEntities[index].checked = !newEntities[index].checked;
    newEntities[index].ownershipRatio = "";
    setEntities(newEntities);
    // setshowInvestmentMessage(hasData)
  };

  // const handleOwnershipRatioChange = (index, value) => {
  //   const newValue = Number(value);
  //   if (newValue >= 1 && newValue <= 100) {
  //     const newEntities = [...entities];
  //     newEntities[index].ownershipRatio = newValue;
  //     setEntities(newEntities);
  //   }
  // };

  const handleOwnershipRatioChange = (index, input) => {
    // Remove % if pasted in
    const sanitized = input.replace("%", "");

    // Allow empty input
    if (sanitized === "") {
      const updatedEntities = [...entities];
      updatedEntities[index].ownershipRatio = "";
      setEntities(updatedEntities);
      return;
    }

    // Allow decimals, e.g., "25", "25.5", "25."
    if (!/^\d{0,3}(\.\d{0,2})?$/.test(sanitized)) return;

    const numericValue = Number(sanitized);

    // Reject if 0 or over 100
    if (numericValue === 0 || numericValue > 100) return;

    const updatedEntities = [...entities];
    updatedEntities[index].ownershipRatio = sanitized;
    setEntities(updatedEntities);
  };

  const handleChangeallcrop = async (event) => {
    const selectedId = event.target.value;
    setSelectedOrg(selectedId);
  };

  const fetchInvestementCorporate = async () => {
    try {
      const response = await axiosInstance.get(
        `/sustainapp/all_corporate_list/`,
        {
          params: {
            organisation: selectedOrg,
            corporate: selectedCorp,
            start: startdate,
            end: enddate,
            reportBy: firstSelection,
          },
        }
      );
      setEntities(response.data);
    } catch (e) {
      console.log("failed fetching organization", e);
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
    if (selectedOrg && startdate && enddate) {
      fetchInvestementCorporate();
    }
  }, [selectedOrg, startdate, enddate, selectedCorp]);

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
    const selected = organisations.find((org) => org.id == selectedId);
    setOrgName(selected?.name || "");

    // Perform the API call with the selected ID
    try {
      const response = await axiosInstance.get(`/corporate/`, {
        params: { organization_id: selectedId },
      });

      // console.log("Corporates:", response.data);
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
    setSelectedCorp();
    setSelectedOrg();
    setReportExist(false);
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
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = monthNames[now.getMonth()];
    const year = now.getFullYear();

    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const ampm = hours >= 12 ? "pm" : "am";
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
        ownership_ratio: parseInt(entity.ownershipRatio),
      }));

      
      let sendData={}
    if(reporttype==='Custom ESG Report'){
       sendData = {
        name: reportname,
        report_type: reporttype,
        report_by: firstSelection,
        start_date: startdate,
        end_date: enddate,
        organization: selectedOrg,
        corporate: selectedCorp,
        investment_corporates: selectedEntities,
        assessment_id:assessment_id?assessment_id:null,
        include_management_material_topics: includeMaterialTopics,
        include_content_index:includeContentIndex
      };
    }  
    else{
       sendData = {
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
    }
    

    await post(`/sustainapp/report_create/`, sendData)
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
          if(response.data.report_by=='Organization'){
            window.localStorage.setItem(
              "reportorgname",
              response.data.organization_name
            );
          }
          else if (response.data.report_by=='Corporate'){
            window.localStorage.setItem(
              "reportCorpName",
              response.data.organization_name
            );
            window.localStorage.setItem(
              "reportorgname",
              orgName
            );
          }
         
          window.localStorage.setItem(
            "reportstartdate",
            response.data.start_date
          );
          window.localStorage.setItem("reportenddate", response.data.end_date);
          window.localStorage.setItem(
            "reportCreatedOn",
            response.data.created_at
          );
          window.localStorage.setItem(
            "organizationcountry",
            response.data.organization_country
          );
          window.localStorage.setItem("reportType", reporttype);
          window.localStorage.setItem('reportby',firstSelection)
          window.localStorage.setItem('reportCorpName',corpName)
          if (
            reporttype == "GRI Report: In accordance With" ||
            reporttype == "GRI Report: With Reference to" ||
            reporttype === 'Custom ESG Report'
          ) {
            router.push("/dashboard/Report/ESG");
          } else if (reporttype == "canada_bill_s211_v2") {
            router.push("/dashboard/Report/Bills211");
          } else if (reporttype == "TCFD") {
            router.push("/dashboard/Report/TCFD");
          }
           else {
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
        const responseData = error.response?.data;

        if (
          error.response?.status === 400 &&
          responseData?.message?.report_type
        ) {
          LoaderClose();
          setMassgeshow(true);
          setMassgename(responseData.message.report_type);
          // You could also store the error text if needed:
          // setErrorMessage(responseData.message.data);
        } else {
          const errorMessage =
            responseData?.message || "An unexpected error occurred";
          toast.error(errorMessage, {
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
          setFirstSelection();
          LoaderClose();
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

    // if (
    //   reporttype === "GHG Report - Investments" &&
    //   entities?.length > 0
    // ) {
    //   const validCheckedEntities = entities.filter(
    //     (entity) =>
    //       entity.emission_data &&
    //       entity.checked &&
    //       entity.ownershipRatio !== "" &&
    //       !isNaN(entity.ownershipRatio) &&
    //       Number(entity.ownershipRatio) > 0 &&
    //       Number(entity.ownershipRatio) <= 100
    //   );
  
    //   if (validCheckedEntities.length === 0) {
    //     newErrors.investmentEntities = "Please check and enter ownership ratio (1–100%) for at least one investment corporate with data.";
    //   }
    // }
    if (
      reporttype === "GHG Report - Investments" &&
      entities?.length > 0
    ) {
      const checkedEntities = entities.filter(entity => entity.checked);
      
      if (checkedEntities.length === 0) {
        newErrors.investmentEntities = "Please select at least one investment corporate.";
      } else {
        const allCheckedHaveValidOwnership = checkedEntities.every(
          entity =>
            entity.emission_data &&
            entity.ownershipRatio !== "" &&
            !isNaN(entity.ownershipRatio) &&
            Number(entity.ownershipRatio) > 0 &&
            Number(entity.ownershipRatio) <= 100
        );
    
        if (!allCheckedHaveValidOwnership) {
          newErrors.investmentEntities = checkedEntities.length === 1
            ? "Please enter a valid ownership ratio (1–100%) for the selected corporate with data."
            : "Please enter valid ownership ratios (1–100%) for all selected corporates with data.";
        }
      }
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
        <div className="grid grid-cols-1 mb-3">
           <label
                htmlFor="cname"
                className="text-neutral-800 text-[12px] font-normal"
              >
                Select Organization
              </label>
          <select
            className="block w-full mt-2 rounded-md border-0 py-1.5 xl:pl-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            value={selectedOrg}
            onChange={handleChangeallcrop}
            // onChange={(e) => setSelectedOrg(e.target.value)}
          >
            <option value="" disabled selected hidden>--Select Organization--- </option>
            {organisations?.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}{" "}
          </select>
          {error.selectedOrgrs && (
            <p className="text-red-500 ml-1 text-sm">{error.selectedOrgrs}</p>
          )}
        </div>
      );
    } else if (firstSelection === "Corporate") {
      return (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 mb-3">
            <div className="lg:mr-2">
              <label
                htmlFor="cname"
                className="text-neutral-800 text-[12px] font-normal"
              >
                Select Organization
              </label>
              <div className="mt-2 xl:mr-2">
                <select
                  className="block w-full rounded-md border-0 py-1.5 xl:pl-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={selectedOrg}
                  // onChange={(e) => setSelectedOrg(e.target.value)}
                  onChange={handleChangecrop}
                >
                  <option value="" disabled selected hidden>--Select Organization--- </option>
                  {organisations?.map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.name}
                    </option>
                  ))}{" "}
                </select>

                {error.selectedOrgs && (
                  <p className="text-red-500 ml-1 text-sm">{error.selectedOrgs}</p>
                )}
              </div>
            </div>
            <div className="lg:ml-2">
              <label
                htmlFor="cname"
                className="text-neutral-800 text-[12px] font-normal"
              >
                Select Corporate
              </label>
              <div className="mt-2">
                <select
                  className="block w-full rounded-md border-0 py-1.5 xl:pl-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={selectedCorp}
                  // onChange={(e) => setSelectedCorp(e.target.value)}
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    const selected = corporates.find((corp) => corp.id == selectedId);
                    setSelectedCorp(selectedId);
                    setCorpName(selected?.name || "");
                  }}
                >
                  <option value="" disabled selected hidden>--Select Corporate--- </option>
                  {corporates?.map((corp) => (
                    <option key={corp.id} value={corp.id}>
                      {corp.name}
                    </option>
                  ))}{" "}
                </select>
                {error.selectedCorp && (
                  <p className="text-red-500 ml-1 text-sm">{error.selectedCorp}</p>
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
    // console.log("newValue:", newValue);
    setValue(newValue);
  };
  const handleClick = () => {
    setIsExpandednext(!isExpandednext);
    setIsExpandedpage(!isExpandedpage);
  };

  const handlePass = (link, step) => {
    router.push(link); // Navigate to the provided link
    dispatch(setActivesection(step)); // Set the current section (like "Structure")
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setMassgeshow(false);
    window.localStorage.setItem("reportCorpName", '');
    window.localStorage.setItem("reportby", '');
    setIsMenuOpen(false);
    // dispatch(
    //   setIncludeMaterialTopics(false)
    // )
    // dispatch(
    //   setIncludeContentIndex(false)
    // )
     dispatch(resetToDefaults())
    dispatch(resetToggleToDefaults())
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
    setMaterialityAssessmentLen([]);
    setError({});
    setMassgename(""),
    setReportExist(false);
    setEntities([]);
    setSelectedYear("");
    dispatch(resetToDefaults())
    dispatch(resetToggleToDefaults())
    // dispatch(
    //   setIncludeMaterialTopics(false)
    // )
    // dispatch(
    //   setIncludeContentIndex(false)
    // )
    // setshowInvestmentMessage(false)
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
                <>
                  {massgename === "canada_bill_s211_v2" && (
                    <div className="mt-5 xl:px-7 lg:px-5 ">
                      <div className="flex items-start p-2 border-t-2 border-[#F98845] rounded shadow-md">
                        <div className="flex-shrink-0">
                          <FaExclamationTriangle className="text-[#F98845] w-6 h-6" />
                        </div>
                        <div className="ml-3">
                          <p className="font-bold text-left text-[#0D024D]">
                            Data Incomplete
                          </p>
                          <p className="text-[12px] text-[#0D024D] mt-1 text-start">
                            The Bill S-211 questionnaire data for the selected
                            year is incomplete. Please answer all the mandatory
                            questions to continue.
                          </p>
                          <div className="mt-2 text-left flex gap-2">
                            <p className="text-[#0D024D] text-[12px]">
                              Proceed to
                            </p>
                            <Link
                              href="/dashboard/social"
                              className="text-blue-500 text-sm font-semibold flex"
                            >
                              Collect &gt; Social &gt; Bill S-211
                              <GoArrowRight className="font-bold mt-1 ml-2" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {massgename === "esg_report" && (
                    <div className="mt-5 xl:px-7 lg:px-5 ">
                      <div className="flex items-start p-2 border-t-2 border-[#F98845] rounded shadow-md">
                        <div className="flex-shrink-0">
                          <FaExclamationTriangle className="text-[#F98845] w-6 h-6" />
                        </div>
                        <div className="ml-3">
                          <p className="font-bold text-left text-[#0D024D]">
                            Mandatory GRI: General Disclosures missing
                          </p>
                          <p className="text-[12px] text-[#0D024D] mt-1 text-start">
                            Please fill the missing disclosures of GRI Reporting
                            Info under
                            <strong> Collect &gt; General</strong> section to
                            proceed.
                          </p>
                          <div className="mt-2 text-left flex">
                            <p className="text-[#0D024D] text-[12px]">
                              Proceed to Collect &gt;
                            </p>
                            <p
                              // href="/dashboard/general"
                              onClick={()=>{
                                handlePass('/dashboard/general','Org Details')
                              }}
                              className="text-blue-500 text-sm font-semibold flex cursor-pointer"
                            >
                              General &gt; GRI Reporting Info
                              <GoArrowRight className="font-bold mt-1 ml-2" />
                            </p>
                          </div>
                        </div>
                        <div className="ml-auto">
                          <p
                            className="text-sm text-blue-500 ml-4"
                            data-tooltip-id="tooltip-$e86"
                            data-tooltip-html="<p>Requirement 2 as per GRI: General Disclosures 2021 states that reasons for omission are not permitted for Disclosures 2-1, 2-2, 2-3, 2-4, and 2-5, as reporting on these disclosures is mandatory. Please fill the data here:</p> <br> <p>COLLECT&gt;GENERAL&gt;GRI Reporting Info before creating the report.</p>"
                          >
                            Learn more
                          </p>
                          <ReactTooltip
                            id="tooltip-$e86"
                            place="top"
                            effect="solid"
                            style={{
                              width: "290px",
                              backgroundColor: "#FFF",
                              color: "#000",
                              fontSize: "12px",
                              borderRadius: "8px",
                              textAlign: "left",
                              zIndex: 100,
                              boxShadow:
                                "rgba(149, 157, 165, 0.2) 0px 8px 24px",
                              opacity: 1,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {reportExist && (
                <div className="mt-5 px-7 ">
                  <div className="flex items-start p-4  border-t-2 border-[#F98845] rounded shadow-md">
                    <div className="flex-shrink-0">
                      <FaExclamationTriangle className="text-[#F98845] w-5 h-5 mt-1" />
                    </div>
                    <div className="ml-3">
                      <p className="text-left text-[#0D024D] text-[15px]">
                        A report already exists for {selectedOrgName}{" "}
                        {selectedCorpName ? `and ${selectedCorpName}` : ""} for
                        the selected period. Do you want to create another
                        report?
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {/* validation code end */}
              <div className="mt-2 xl:px-7 py-3">
                <form className="w-full text-left">
                  <div className="lg:mr-2 mb-3 w-[101%]">
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
                      <p className="text-red-500 text-sm ml-1">
                        {error.reportname}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4 lg:gap-0 xl:gap-0 2xl:gap-0 4k:gap-0 mb-3">
                    <div className="xl:mr-2">
                      <label
                        htmlFor="sdate"
                        className="block text-neutral-800 text-[13px] font-normal"
                      >
                        Select Type Of Report
                      </label>
                      <div className="mt-2 xl:mr-2">
                        <select
                          className="block w-full rounded-md border-0 py-1.5 xl:pl-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          onChange={handleChangeReporttype}
                          value={reporttype}
                          name="Reporttype"
                        >
                          <option value='' disabled selected hidden>Select Report Type</option>
                          <option>GHG Accounting Report</option>
                          <option>GHG Report - Investments</option>
                          {/* <option>GRI Report: In accordance With</option>
                          <option>GRI Report: With Reference to</option> */}
                          {/* <option value="canada_bill_s211_v2">
                            Bill S-211
                          </option> */}
                          {/* { isTCFDAvailable() && <option value="TCFD">TCFD</option>}
                          <option>Custom ESG Report</option> */}
                        </select>
                        {error.reporttype && (
                          <p className="text-red-500 text-sm ml-1">
                            {error.reporttype}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="xl:ml-2 mt-2 md:mt-0">
                      <label
                        htmlFor="cname"
                        className="block text-neutral-800 text-[13px] font-normal"
                      >
                        Report by
                      </label>
                      <div className="mt-2">
                        <select
                          className="block w-full rounded-md border-0 py-1.5 xl:pl-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          onChange={handleFirstSelectChange}
                          value={firstSelection}
                        >
                          <option value='' disabled selected hidden>Select option</option>
                          <option>Organization</option>
                          <option>Corporate</option>
                        </select>{" "}
                      </div>
                      {error.firstSelection && (
                        <p className="text-red-500 text-sm ml-1">
                          {error.firstSelection}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mb-3">
                    {showSecondSelect && renderSecondSelect()}
                  </div>
                  {reporttype === "canada_bill_s211_v2" ? (
                    <div className="mb-4">
                      <label
                        htmlFor="yearSelect"
                        className="block text-neutral-800 text-[13px] font-normal"
                      >
                        Select Year
                      </label>
                      <div className="mt-2">
                        <select
                          id="yearSelect"
                          value={selectedYear}
                          onChange={handleYearChange}
                          className="block w-full rounded-md border-0 py-1.5 pl-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                        >
                          <option value="" disabled selected hidden>Select Year</option>
                          <option value="2024">2024</option>
                          <option value="2025">2025</option>
                        </select>
                        {(error.startdate || error.enddate) && (
                          <p className="text-red-500 text-sm ml-1">
                            {error.startdate || error.enddate}
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4 lg:gap-0 xl:gap-0 2xl:gap-0 4k:gap-0 mb-4">
                      <div className="xl:mr-2">
                        <label
                          htmlFor="sdate"
                          className="block text-neutral-800 text-[13px] font-normal"
                        >
                          Reporting Period (From)
                        </label>
                        <div className="mt-2 xl:mr-2">
                          <input
                            id="sdate"
                            name="startdate"
                            type="date"
                            autoComplete="sdate"
                            value={startdate}
                            onChange={handleChangeStartdate}
                            required
                            placeholder="Select Fiscal Year"
                            className="block w-full px-1 rounded-md border-0 py-1.5 pl-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                          />
                        </div>
                        {error.startdate && (
                          <p className="text-red-500 text-sm ml-1">
                            {error.startdate}
                          </p>
                        )}
                      </div>
                      <div className="xl:ml-2 mt-2 md:mt-0">
                        <label
                          htmlFor="edate"
                          className="block text-neutral-800 text-[13px] font-normal"
                        >
                          Reporting Period (To)
                        </label>
                        <div className="mt-2">
                          <input
                            id="edate"
                            name="enddate"
                            type="date"
                            autoComplete="edate"
                            value={enddate}
                            onChange={handleChangeEnddate}
                            required
                            placeholder="End date"
                            className="block w-full px-1 rounded-md border-0 py-1.5 pl-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                          />
                        </div>
                        {error.enddate && (
                          <p className="text-red-500 text-sm ml-1">
                            {error.enddate}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4 lg:gap-0 xl:gap-0 2xl:gap-0 4k:gap-0 mb-4">
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
                        <p className="text-red-500 text-sm ml-1">
                          {error.startdate}
                        </p>
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
                        <p className="text-red-500 text-sm ml-1">
                          {error.enddate}
                        </p>
                      )}
                    </div>
                  </div> */}

                  {/* investment corporate */}
                  {reporttype === "GHG Report - Investments" &&
                  entities?.length > 0 ? (
                    <div className={``}>
                      <label
                        htmlFor="sdate"
                        className="block text-neutral-800 text-[13px] font-normal"
                      >
                        Select Investment Corporate
                      </label>
                      <div
                        className={`mt-2 border border-gray-300 rounded-md ${
                          entities?.length > 0 ? "h-[200px]" : "h-auto"
                        } overflow-y-auto table-scrollbar`}
                      >
                        <div className="p-3">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="text-gray-400 font-semibold text-[13px]">
                              Investment Corporate
                            </div>
                            <div className="text-gray-400 font-semibold text-[13px]">
                              Ownership Ratio %
                            </div>

                            {entities.map((entity, index) => (
                              <React.Fragment key={index}>
                                <div
                                  className={`flex relative items-center space-x-2 ${
                                    !entity.emission_data ? "opacity-30" : ""
                                  }`}
                                >
                                  <input
                                    id={entity.id}
                                    type="checkbox"
                                    disabled={!entity.emission_data}
                                    checked={entity.checked}
                                    onChange={() =>
                                      handleCheckboxChange(
                                        index,
                                        entity.emission_data
                                      )
                                    }
                                    className="form-checkbox h-4 w-4 green-checkbox"
                                    value={entity.id}
                                  />
                                  <label
                                    htmlFor={entity.id}
                                    className="text-gray-800 text-[13px] cursor-pointer"
                                    data-tooltip-id={`tooltip-${entity.id}`}
                                    data-tooltip-html={`${
                                      !entity.emission_data
                                        ? "<p>No data available for the selected Reporting period</p>"
                                        : ""
                                    }`}
                                  >
                                    {entity.name}
                                  </label>
                                </div>
                                <ReactTooltip
                                  id={`tooltip-${entity.id}`}
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
                                    boxShadow:
                                      "rgba(149, 157, 165, 0.2) 0px 8px 24px",
                                    opacity: 1,
                                  }}
                                ></ReactTooltip>
                                {/* <input
                                  type="number"
                                  placeholder="Enter Ownership Ratio %"
                                  className={`border-b p-2 rounded w-full text-[13px] ${!entity.checked?'opacity-35':''}`}
                                  disabled={!entity.checked}
                                  value={entity.ownershipRatio}
                                  onChange={(e) =>
                                    handleOwnershipRatioChange(
                                      index,
                                      e.target.value
                                    )
                                  }
                                /> */}
                                <div className="relative w-full">
                                  <input
                                    type="text"
                                    placeholder="Enter Ownership Ratio"
                                    className={`border-b p-2 rounded w-full text-[13px] pr-6 ${
                                      !entity.checked ? "opacity-35" : ""
                                    }`}
                                    disabled={!entity.checked}
                                    value={entity.ownershipRatio}
                                    onChange={(e) =>
                                      handleOwnershipRatioChange(
                                        index,
                                        e.target.value
                                      )
                                    }
                                  />
                                  <span className="absolute right-2 top-2 text-[13px] text-gray-500 pointer-events-none">
                                    %
                                  </span>
                                </div>
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                      </div>
                      {error.investmentEntities && (
                        <p className="text-red-500 text-sm mt-1 ml-1">
                          {error.investmentEntities}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div>
                      {/* {showInvestmentMessage && (
                      <div className="flex gap-2 mb-2">
                      <IoIosWarning className="text-[#F98845] w-5 h-5" />
                    <p className="text-[14px] text-[#F98845] font-[500]">No Investment corporate data is available for the selected Corporate</p>
                    </div>
                    )} */}
                    </div>
                  )}
                  {/* materiality assessment */}
                  {materialityAssessmentLen &&
                  materialityAssessmentLen.length > 1 ? (
                    <div>
                      <div className="flex gap-2 mb-2">
                        <IoIosWarning className="text-[#F98845] w-5 h-5" />
                        <p className="text-[14px] text-[#F98845] font-[500]">
                          More than one materiality assessment is present in the
                          selected date range
                        </p>
                      </div>
                      <div>
                        <p className="text-neutral-800 text-[13px] font-normal">
                          Select Materiality Assessment *
                        </p>
                        <select
                          className="mt-1 block w-[34%] py-2 bg-white rounded-md focus:outline-none sm:text-sm mb-2"
                          onChange={(e) => setAssessmentId(e.target.value)}
                        >
                          <option value="" disabled selected>
                            Select Assessment
                          </option>
                          {materialityAssessmentLen &&
                            materialityAssessmentLen.map((val) => (
                              <option
                                class="text-black text-sm hover:bg-blue-100"
                                value={val.id}
                              >{`${formatDate(val.start_date)} - ${formatDate(
                                val.end_date
                              )}`}</option>
                            ))}
                        </select>
                        <p className="text-[#ACACAC] text-[12px] font-normal">
                          Select one of the materiality assessment found in the
                          date range
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div></div>
                  )}

{reporttype === "Custom ESG Report" && (
                    <div className="border border-gray-300 p-4 rounded-lg space-y-4">
                      {/* Include Management of Material Topics */}
                      <div className="flex items-start gap-3">
                        <div className="flex items-center pt-0.5">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={includeMaterialTopics}
                              onChange={(e) =>
                                dispatch(
                                  setIncludeMaterialTopics(e.target.checked)
                                )
                              }
                              className="sr-only"
                            />
                            <div
                              className={`w-11 h-6 rounded-full transition-colors duration-200 ease-in-out ${
                                includeMaterialTopics
                                  ? "bg-green-500"
                                  : "bg-gray-300"
                              }`}
                            >
                              <div
                                className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ease-in-out ${
                                  includeMaterialTopics
                                    ? "translate-x-5"
                                    : "translate-x-0"
                                } mt-0.5 ml-0.5`}
                              ></div>
                            </div>
                          </label>
                        </div>
                        <div className="flex-1">
                          <label className="text-sm font-medium text-gray-900 block leading-6">
                            Include Management of Material Topics
                          </label>
                          <p className="text-sm text-gray-600 mt-1">
                            Checking this option will include the disclosures on
                            management of material topics for all selected
                            sections.
                          </p>
                        </div>
                      </div>

                      {/* Include Content Index */}
                      <div className="flex items-start gap-3">
                        <div className="flex items-center pt-0.5">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={includeContentIndex}
                              onChange={(e) =>
                                dispatch(
                                  setIncludeContentIndex(e.target.checked)
                                )
                              }
                              className="sr-only"
                            />
                            <div
                              className={`w-11 h-6 rounded-full transition-colors duration-200 ease-in-out ${
                                includeContentIndex
                                  ? "bg-green-500"
                                  : "bg-gray-300"
                              }`}
                            >
                              <div
                                className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ease-in-out ${
                                  includeContentIndex
                                    ? "translate-x-5"
                                    : "translate-x-0"
                                } mt-0.5 ml-0.5`}
                              ></div>
                            </div>
                          </label>
                        </div>
                        <div className="flex-1">
                          <label className="text-sm font-medium text-gray-900 block leading-6">
                            Include Content Index
                          </label>
                          <p className="text-sm text-gray-600 mt-1">
                            Checking this option will add a GRI content index at
                            the end of the report
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                 
                  <div className="flex justify-center mt-5">
                    <div className="">
                      <button
                        type="submit"
                        // value="Create Report"
                        className={`w-[100%] ${massgename === "esg_report" && reporttype==='GRI Report: In accordance With'?'opacity-30 cursor-not-allowed':'cursor-pointe'} bg-sky-600 h-[31px] mb-2 px-[22px] py-2  rounded shadow flex-col justify-center items-center inline-flex text-white`}
                        onClick={handleSubmit}
                        disabled={massgename === "esg_report" && reporttype==='GRI Report: In accordance With'}
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