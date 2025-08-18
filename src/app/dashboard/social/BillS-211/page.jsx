"use client";
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  MdKeyboardArrowDown,
  MdOutlineInfo,
  MdOutlineCheck,
  MdOutlineClear,
  MdInfoOutline,
  MdChevronRight,
} from "react-icons/md";
import {
  HiArrowRight,
  HiArrowLeft,
  HiExclamationCircle,
} from "react-icons/hi2";
import { HiOutlineDownload } from "react-icons/hi";
import { Oval } from "react-loader-spinner";
import { useDispatch } from "react-redux";
import SocialBillS211Header from "../socialBillS211Header";
import { setReportTypes } from "../../../../lib/redux/features/Bills201";
import axiosInstance from "../../../utils/axiosMiddleware";
import Identifyinginformation from "./Identifying-information/page";
import Annualreport from "./annual-report/page";
import CircularProgressBar from "./CircularProgressBar";
import { Socialdata } from "../data/socialgriinfo";
const BILLs201 = ({ setMobileopen, handleTabClick }) => {
  const dispatch = useDispatch();
  const [data, setData] = useState();
  const [category, setCategory] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [year, setYear] = useState("");
  const [selectedOrg, setSelectedOrg] = useState("");
  const [selectedCorp, setSelectedCorp] = useState("");
  const [reportType, setReportType] = useState("Organization");
  const [loopen, setLoOpen] = useState(false);
  const [view, setView] = useState("home");
  const [stape, setStep] = useState({
    submission_information: [],
    reporting_for_entities: [],
  });

  const LoaderOpen = () => setLoOpen(true);
  const LoaderClose = () => setLoOpen(false);
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
  const toggleDrawerclose = () => {
    setIsOpen(!isOpen);
  };
  const toggleDrawer = (selected) => {
    setIsOpen(!isOpen);
    setCategory(selected);
  };
  // Determine if each section is complete and calculate percentage
  const getProgress = (screens = []) => {
    const total = screens.length;
    const completed = screens.filter(
      (screen) => screen.status === "completed"
    ).length;
    return {
      isComplete: completed === total && total > 0,
      percentage: total ? Math.round((completed / total) * 100) : 0,
    };
  };

  const submissionProgress = getProgress(stape.submission_information);
  const reportProgress = getProgress(stape.reporting_for_entities);

  const isSubmissionEnabled =
    reportType === "Organization"
      ? selectedOrg && year
      : selectedOrg && selectedCorp && year;

  const isReportEnabled = isSubmissionEnabled && submissionProgress.isComplete;
  const isDownloadEnabled = isReportEnabled && reportProgress.isComplete;

  const fetchBillstep = async () => {
    LoaderOpen();
    try {
      const response = await axiosInstance.get(
        `${process.env.BACKEND_API_URL}/canada_bill_s211/v2/status-report/?corporate=${selectedCorp}&organization=${selectedOrg}&year=${year}`
      );
      if (response.status === 200) {
        setStep(response.data);
      } else {
        toast.error("Oops, something went wrong");
      }
    } catch (error) {
      toast.error("Failed to fetch status");
    } finally {
      LoaderClose();
    }
  };

  useEffect(() => {
    dispatch(setReportTypes("Organization"));
  }, []);

  useEffect(() => {
    if (view === "home") {
      if (reportType === "Organization" && selectedOrg && year) {
        fetchBillstep();
      } else if (
        reportType !== "Organization" &&
        selectedOrg &&
        selectedCorp &&
        year
      ) {
        fetchBillstep();
      }
    }
  }, [view, selectedOrg, selectedCorp, year, reportType]);

  const toggleSidebar = () => setMobileopen(true);
  const handleDownload = async () => {
    LoaderOpen();
    try {
      const response = await axiosInstance.get(
        `${process.env.BACKEND_API_URL}/canada_bill_s211/v2/get-report/?organization=${selectedOrg}&corporate=${selectedCorp}&year=${year}`,
        {
          responseType: "blob", // VERY IMPORTANT for file downloads
        }
      );

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", "Canada Bill S211 Response Sheet.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      toast.error(error?.message || "Download failed", {
        position: "top-right",
        autoClose: 7000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } finally {
      LoaderClose();
    }
  };

  return (
    <>
      {view === "home" && (
        <>
          <div className="hidden xl:block lg:block md:hidden 2xl:block 4k:block">
            <div className="flex justify-between items-center border-b border-gray-200 mb-5 w-full">
              <div className="w-full">
                <div className="text-left mb-2 ml-3 pt-5">
                  <p className="text-[11px]">Social</p>
                  <div className="flex">
                    <p className="gradient-text text-[22px] h-[30px] font-bold pt-1">
                      Bill S-211
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-full float-end me-2">
                <div className="float-end">
                  <div className="flex">
                    <div>
                      <button
                        className=" text-white bg-[#FF0000] border border-zinc-200 rounded-full text-[11px] w-[72px] h-[22px] ml-2 text-center pt-0.5"
                        onClick={() => toggleDrawer("139")}
                      >
                        Bill S-211
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Header */}
          <div className="block xl:hidden lg:hidden md:block 2xl:hidden 4k:hidden">
            <div className="flex justify-between items-center border-b border-gray-200 mb-5 w-full">
              <div
                className="w-full py-4 rounded-md shadow-[0px_6px_12px_0px_rgba(0,0,0,0.08),0px_1px_3px_0px_rgba(0,0,0,0.10)]"
                onClick={toggleSidebar}
              >
                <div className="text-left mb-2 ml-3">
                  <p className="text-[11px]">Social</p>
                  <div className="flex justify-between">
                    <div>
                      <p className="gradient-text text-[16px] md:text-[20px] font-bold pt-1">
                        Bill S-211
                      </p>
                    </div>
                    <div className="float-end me-5">
                      <MdKeyboardArrowDown
                        className={`text-2xl  md:-mt-[18px] `}
                      />
                    </div>
                  </div>
                       <button
                        className=" text-white bg-[#FF0000] rounded-full text-[11px] w-[72px] h-[22px]  text-center pt-0.5 mt-2"
                        onClick={() => toggleDrawer("139")}
                      >
                        Bill S-211
                      </button>
                </div>
              </div>
            </div>
          </div>
          <div
            className={`${
              isOpen
                ? "translate-x-[15%] block top-16"
                : "translate-x-[120%] hidden top-16"
            }
fixed right-[51px]  w-[360px] h-[92%] bg-white  rounded-md
transition-transform duration-300 ease-in-out z-[100] shadow-2xl px-2`}
          >
            {data &&
              data.map((program, index) => (
                <div key={index}>
                  {/* Header */}
                  <div className="flex justify-between p-2 pt-5 pb-4 border-b-2 ">
                    <div className="ml-2 h-[38px]">{program.header}</div>
                    <div className="ml-2 float-right ">
                      <h5
                        className="text-[#727272] text-[17px] font-bold cursor-pointer"
                        onClick={toggleDrawerclose}
                      >
                        <MdOutlineClear />
                      </h5>
                    </div>
                  </div>

                  <div className="hidden xl:block lg:block md:block 2xl:block 4k:block 2k:block 3xl:block">
                    <div className="h-[calc(100vh-180px)] overflow-y-auto custom-scrollbar p-2">
                      {program.data}
                    </div>
                  </div>
                  <div className="block xl:hidden lg:hidden md:hidden 2xl:hidden 4k:hidden 2k:hidden 3xl:hidden">
                    <div className="h-[calc(68vh-30px)] overflow-y-auto custom-scrollbar p-2">
                      {program.data}
                    </div>
                  </div>

                  {/* Footer (Learn more link) */}
                  <div className="pt-2 pb-4 ml-4">
                    <a
                      className="text-[14px] text-[#2196F3] pt-1 inline-flex"
                      href={program.link}
                      target="_blank"
                    >
                      Learn more <MdChevronRight className="text-lg pt-1" />
                    </a>
                  </div>
                </div>
              ))}
          </div>
          {/* Info Section */}
          <div className="container mx-auto mt-5">
            <p className="font-400 text-[17px] mb-4 mx-4 text-[#101828]">
              Fighting Against Forced Labour and Child Labour in Supply Chains
              Act (Bill S-211)
            </p>
            <p className="text-[12px] mb-4 mx-4 text-[#6D6D6D]">
              Bill S-211 requires Canadian businesses to disclose efforts to
              prevent forced or child labor in their operations and supply
              chains. This module helps you collect and format mandatory annual
              reporting data.
            </p>
          </div>

          <SocialBillS211Header
            selectedOrg={selectedOrg}
            setSelectedOrg={setSelectedOrg}
            selectedCorp={selectedCorp}
            setSelectedCorp={setSelectedCorp}
            year={year}
            setYear={setYear}
            reportType={reportType}
            setReportType={setReportType}
          />

          {/* Info Banner */}
          <div className="bg-sky-100 mx-2 rounded-md mb-4">
            <div className="flex px-4 py-3">
              <MdOutlineInfo className="text-blue-500" />
              <p className="text-[12px] text-[#101828] ml-4">
                The submission information is mandatory and has to be completed
                before filling out the reporting for entities.
              </p>
            </div>
          </div>

          {/* Step Panels */}
          {year <= 2023 && year !== "" ? (
            <div className="xl:flex lg:flex md:flex 4k:flex 2xl:flex mx-4 gap-10 mt-10 ">
              {/* Step 1: Submission Info */}
              <div className="bils201box rounded-2xl p-4 xl:w-[400px] lg:w-[400px] 2xl:w-[400px] 4k:w-[400px] w-full shadow-lg mb-4">
                <div className="flex justify-between mb-4">
                  <div className="border rounded-full w-5 h-5 text-center text-[11px]">
                    1
                  </div>
                  {/* <CircularProgressBar
                  percentage={submissionProgress.percentage}
                /> */}
                </div>
                <div className="mb-4">
                  <p className="text-[14px] text-[#101828] font-medium">
                    Submission Information
                  </p>
                  <p className="text-[11px] text-[#101828] font-medium mb-2">
                    Please fill out the submission information.
                  </p>
                </div>
                {/* <div className="my-4">
                <span
                  className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                    submissionProgress.isComplete
                      ? "bg-green-100 text-green-800"
                      : "bg-orange-100 text-[#F98845]"
                  }`}
                >
                  {submissionProgress.isComplete ? (
                    <MdOutlineCheck className="w-4 h-4 mr-1" />
                  ) : (
                    <HiExclamationCircle className="w-4 h-4 mr-1" />
                  )}
                  {submissionProgress.isComplete ? "Completed" : "Incomplete"}
                </span>
              </div> */}
                <button
                  onClick={() => setView("submission")}
                  disabled={!(selectedOrg && year)}
                  className={`w-[220px] inline-flex items-center px-4 py-2 border text-[12px] font-medium rounded-md text-white  ${
                    reportType == "Organization"
                      ? !(selectedOrg && year)
                        ? "bg-blue-200 hover:bg-blue-200 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                      : !(selectedOrg && year && selectedCorp)
                      ? "bg-blue-200 hover:bg-blue-200 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  } `}
                >
                  <>
                    Add Submission Information{" "}
                    <HiArrowRight className="ml-2 w-4 h-4" />
                  </>
                </button>
              </div>

              {/* Step 2: Reporting for Entities */}
              <div className="bils201box rounded-2xl p-4 xl:w-[400px] lg:w-[400px] 2xl:w-[400px] 4k:w-[400px] w-full shadow-lg mb-4">
                <div className="flex justify-between mb-4">
                  <div className="border rounded-full w-5 h-5 text-center text-[11px]">
                    2
                  </div>
                  {/* <CircularProgressBar percentage={reportProgress.percentage} /> */}
                </div>
                <div className="mb-4">
                  <p className="text-[14px] text-[#101828] font-medium">
                    Reporting for Entities
                  </p>
                  <p className="text-[11px] text-[#101828] font-medium mb-2">
                    Please fill out the Reporting for Entities.
                  </p>
                </div>
                {/* <div className="my-4">
                <span
                  className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                    reportProgress.isComplete
                      ? "bg-green-100 text-green-800"
                      : "bg-orange-100 text-[#F98845]"
                  }`}
                >
                  {reportProgress.isComplete ? (
                    <MdOutlineCheck className="w-4 h-4 mr-1" />
                  ) : (
                    <HiExclamationCircle className="w-4 h-4 mr-1" />
                  )}
                  {reportProgress.isComplete ? "Completed" : "Incomplete"}
                </span>
              </div> */}
                <button
                  onClick={() => setView("report")}
                  disabled={!(selectedOrg && year)}
                  className={`w-[210px] inline-flex items-center px-4 py-2 border text-[12px] font-medium rounded-md text-white  ${
                    reportType == "Organization"
                      ? !(selectedOrg && year)
                        ? "bg-blue-200 hover:bg-blue-200 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                      : !(selectedOrg && year && selectedCorp)
                      ? "bg-blue-200 hover:bg-blue-200 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  } `}
                >
                  <>
                    Add Reporting for Entities{" "}
                    <HiArrowRight className="ml-2 w-4 h-4" />
                  </>
                </button>
              </div>
            </div>
          ) : (
            <div className="xl:flex lg:flex md:flex 4k:flex 2xl:flex mx-4 gap-6 mt-10 mb-4 ">
              {/* Step 1: Submission Info */}
              <div className="bils201box rounded-2xl p-4 w-full shadow-lg mb-4">
                <div className="h-[125px]">
                  <div className="flex justify-between">
                    <div className="border rounded-full w-5 h-5 text-center text-[11px]">
                      1
                    </div>
                    <CircularProgressBar
                      percentage={submissionProgress.percentage}
                    />
                  </div>
                  <div>
                    <p className="text-[14px] text-[#101828] font-medium">
                      Submission Information
                    </p>
                    <p className="text-[11px] text-[#101828] font-medium mb-2">
                      Please fill out the submission information.
                    </p>
                  </div>
                  <div className="my-4">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                        submissionProgress.isComplete
                          ? "bg-green-100 text-green-800"
                          : "bg-orange-100 text-[#F98845]"
                      }`}
                    >
                      {submissionProgress.isComplete ? (
                        <MdOutlineCheck className="w-4 h-4 mr-1" />
                      ) : (
                        <HiExclamationCircle className="w-4 h-4 mr-1" />
                      )}
                      {submissionProgress.isComplete
                        ? "Completed"
                        : "Incomplete"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setView("submission")}
                  disabled={!isSubmissionEnabled}
                  className={`w-[220px] inline-flex items-center px-4 py-2 border text-[12px] font-medium rounded-md text-white ${
                    isSubmissionEnabled
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-blue-200 cursor-not-allowed"
                  }`}
                >
                  {submissionProgress.isComplete ? (
                    <>
                      Edit Submission Information{" "}
                      <HiArrowRight className="ml-2 w-4 h-4" />
                    </>
                  ) : (
                    <>
                      Add Submission Information{" "}
                      <HiArrowRight className="ml-2 w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {/* Step 2: Reporting for Entities */}
              <div className="bils201box rounded-2xl p-4 w-full shadow-lg mb-4">
                <div className="h-[125px]">
                  <div className="flex justify-between">
                    <div className="border rounded-full w-5 h-5 text-center text-[11px]">
                      2
                    </div>
                    <CircularProgressBar
                      percentage={reportProgress.percentage}
                    />
                  </div>
                  <div>
                    <p className="text-[14px] text-[#101828] font-medium">
                      Reporting for Entities
                    </p>
                    <p className="text-[11px] text-[#101828] font-medium mb-2">
                      Please fill out the Reporting for Entities.
                    </p>
                  </div>
                  <div className="my-4">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                        reportProgress.isComplete
                          ? "bg-green-100 text-green-800"
                          : "bg-orange-100 text-[#F98845]"
                      }`}
                    >
                      {reportProgress.isComplete ? (
                        <MdOutlineCheck className="w-4 h-4 mr-1" />
                      ) : (
                        <HiExclamationCircle className="w-4 h-4 mr-1" />
                      )}
                      {reportProgress.isComplete ? "Completed" : "Incomplete"}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setView("report")}
                  disabled={!isReportEnabled}
                  className={`w-[210px] inline-flex items-center px-4 py-2 border text-[12px] font-medium rounded-md text-white ${
                    isReportEnabled
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-blue-200 cursor-not-allowed"
                  }`}
                >
                  {reportProgress.isComplete ? (
                    <>
                      Edit Reporting for Entities{" "}
                      <HiArrowRight className="ml-2 w-4 h-4" />
                    </>
                  ) : (
                    <>
                      Add Reporting for Entities{" "}
                      <HiArrowRight className="ml-2 w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {/* Step 3: Download Report */}
              <div className="bils201box rounded-2xl p-4 w-full shadow-lg mb-4">
                <div className="h-[125px]">
                  <div className="flex justify-between mb-1">
                    <div className="border rounded-full w-5 h-5 text-center text-[11px]">
                      3
                    </div>
                  </div>
                  <div>
                    <p className="text-[14px] text-[#101828] font-medium">
                      Response sheet
                    </p>
                    <p className="text-[11px] text-[#101828] font-medium mb-2">
                      Response sheet is ready for download when first two steps
                      are complete
                    </p>
                  </div>
                </div>

                <button
                  disabled={!isDownloadEnabled}
                  onClick={handleDownload}
                  className={`w-[220px] inline-flex items-center px-4 py-2 border text-[12px] font-medium rounded-md text-white ${
                    isDownloadEnabled
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-blue-200 cursor-not-allowed"
                  }`}
                >
                  <HiOutlineDownload className="mr-2 w-4 h-4" />
                  Download Response sheet
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Forms */}
      {view === "submission" && (
        <div className="mt-6 xl:mx-4 lg:mx-4 md:mx-4 2xl:mx-4 4k:mx-4 ">
          <Identifyinginformation
            handleTabClick={handleTabClick}
            setView={setView}
            setMobileopen={setMobileopen}
          />
        </div>
      )}
      {view === "report" && (
        <div className="mt-6 xl:mx-4 lg:mx-4 md:mx-4 2xl:mx-4 4k:mx-4">
          <Annualreport
            handleTabClick={handleTabClick}
            setView={setView}
            setMobileopen={setMobileopen}
          />
        </div>
      )}

      {/* Toast + Loader */}
      <ToastContainer style={{ fontSize: "12px" }} />
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

export default BILLs201;
