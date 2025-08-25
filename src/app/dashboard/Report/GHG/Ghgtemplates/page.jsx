"use client";
import { useState, useRef, useEffect } from "react";
import CoverSheet from "../cover-sheet";
import Aboutthereport from "../Introduction/about-the-report";
import Executivesummary from "../executive-summary";
import Carbonaccountingobjectives from "../carbon-accounting-objectives/carbon-accounting-objectives";
import Organizationalboundaries from "../boundaries/organizational-boundaries";
import Datacollection from "../data-collection/data-collection";
import Results from "../results";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Oval } from "react-loader-spinner";
import {
  MdDownload,
  MdDelete,
  MdKeyboardArrowDown,
  MdFileDownload,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
} from "react-icons/md";
import axiosInstance, { patch } from "../../../../utils/axiosMiddleware";
import Link from "next/link";
import { GlobalState } from "@/Context/page";
function Ghgtemplates() {
  const { open } = GlobalState();
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [isPrintableVisible, setIsPrintableVisible] = useState(false);
  const printRef = useRef(null);
  const printComponentRef = useRef();
  const [loopen, setLoOpen] = useState(false);
  const [exdata, setExdata] = useState([]);
  const [locatiodata, setLocationdata] = useState();
  const [souresdata, setSouresdata] = useState();
  const [totalContributionScope, setTotalContributionScope] = useState(0);
  const [highestContributionSource, setHighestContributionSource] = useState(
    []
  );
  const [reportingdateform, setReportingdateform] = useState("");
  const [reportingdateto, setReportingdateto] = useState("");
  const [reportingcy, setReportingCy] = useState("");
  const [firstSelection, setFirstSelection] = useState("");
  const [content, setContent] = useState("");
  const [roles, setRoles] = useState("");
  const [childValue, setChildValue] = useState("");
  const [boundaries, setBoundaries] = useState("");
  const [excludedsources, setExcludedsources] = useState("");
  const [selectedOptions, setSelectedOptions] = useState({});
  const [imageSrc, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState();
  const isMounted = useRef(true);
  const [isOpenmobile, setIsOpenmobile] = useState(false);
  const orgName =
    typeof window !== "undefined" ? localStorage.getItem("reportorgname") : "";
  const corpName =
    typeof window !== "undefined" ? localStorage.getItem("reportCorpName") : "";
  const reportname =
    typeof window !== "undefined" ? localStorage.getItem("reportname") : "";
  const reportstartdateStr =
    typeof window !== "undefined"
      ? localStorage.getItem("reportstartdate")
      : "";
  const reportenddateStr =
    typeof window !== "undefined" ? localStorage.getItem("reportenddate") : "";

  const reportId =
    typeof window !== "undefined" ? localStorage.getItem("reportid") : "";
  const reportType =
    typeof window !== "undefined" ? localStorage.getItem("reportType") : "";
  const reportstartdate = reportstartdateStr
    ? new Date(reportstartdateStr)
    : null;
  const reportenddate = reportenddateStr ? new Date(reportenddateStr) : null;
  const startYear = reportstartdate ? reportstartdate.getFullYear() : null;
  const endYear = reportenddate ? reportenddate.getFullYear() : null;

  let display;

  if (startYear === endYear) {
    display = `${startYear}`;
  } else {
    display = `${startYear} - ${endYear}`;
  }

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
  const LoaderOpen = () => {
    setLoOpen(true);
  };

  const LoaderClose = () => {
    setLoOpen(false);
  };

  const fetchExecutive = async () => {
    LoaderOpen();
    const response = await axiosInstance.get(
      `/sustainapp/report_data/${reportId}`
    );
    setExdata(response.data.data);
    setLocationdata(response.data.data);
    setSouresdata(response.data.data);
    const corporatesData = response.data.data;
    // const total = corporatesData.reduce((acc, corporate) => {
    //   const scopesTotal = corporate.scopes.reduce((scopeAcc, scope) => {
    //     const totalCo2e = parseFloat(scope.total_co2e);
    //     return scopeAcc + totalCo2e;
    //   }, 0);
    //   return acc + scopesTotal;
    // }, 0);
    // const roundedTotal = parseFloat(total.toFixed(2));
    const total = corporatesData.reduce((acc, corporate) => {
      const scopesTotal = corporate.scopes.reduce((scopeAcc, scope) => {
        // Skip Scope-3 if corporate_type is "Investment"
        if (
          corporate.corporate_type === "Investment" &&
          scope.scope_name === "Scope-3"
        ) {
          return scopeAcc; // Skip adding Scope-3
        }
        const totalCo2e = parseFloat(scope.total_co2e);
        return scopeAcc + totalCo2e;
      }, 0);
      return acc + scopesTotal;
    }, 0);
    const roundedTotal = parseFloat(total.toFixed(2));
    setTotalContributionScope(roundedTotal);
    const corporates = response.data.data;
    const sourcesData = response.data.data.flatMap(
      (corporate) => corporate.sources
    );
    // if (sourcesData.length > 0) {
    //   const maxContribution = Math.max(
    //     ...sourcesData.map((source) => parseFloat(source.contribution_source))
    //   );
    //   const highestSources = sourcesData.filter(
    //     (source) => parseFloat(source.contribution_source) === maxContribution
    //   );
    //   const highestSourceNames = highestSources
    //     .map((source) => source.source_name)
    //     .join(", ");
    //   setHighestContributionSource(highestSourceNames);
    // }
    if (sourcesData.length > 0) {
      const maxContribution = Math.max(
        ...sourcesData.map((source) => parseFloat(source.contribution_source))
      );

      const highestSources = sourcesData.filter(
        (source) => parseFloat(source.contribution_source) === maxContribution
      );

      const highestSourceNames = highestSources
        .map((source) => {
          // Find the matching corporate by source_name
          const matchingCorporate = corporates.find(
            (corp) =>
              corp.corporate_name === source.source_name &&
              corp.sources.some((s) => s.source_name === source.source_name)
          );

          // Add " (Investments)" if it's an Investment corporate
          if (matchingCorporate?.corporate_type === "Investment") {
            return `Investments`;
          } else {
            return source.source_name;
          }
        })
        .join(", ");

      setHighestContributionSource(highestSourceNames);
    }

    LoaderClose();
  };

  const fetchDatareport = async () => {
    LoaderOpen();
    const response = await axiosInstance.get(
      `/sustainapp/ghgreport/${reportId}`
    );
    setReportingdateform(response.data.from_year);
    setReportingdateto(response.data.to_year);
    setReportingCy(response.data.calender_year);
    setFirstSelection(response.data.reporting_period_name);
    setContent(response.data.about_the_organization);
    setRoles(response.data.roles_and_responsibilities);
    setChildValue(response.data.designation_of_organizational_admin);
    setBoundaries(response.data.organizational_boundries);
    setExcludedsources(response.data.excluded_sources);
    setSelectedOptions(response.data.data_source || {});
    setImage(response.data.org_logo);
    LoaderClose();
  };

  useEffect(() => {
    if (isMounted.current) {
      fetchExecutive();
      fetchDatareport();
      isMounted.current = false;
    }
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handlePrevious = () => {
    setActiveStep(activeStep - 1);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const submitForm = async () => {
    LoaderOpen();
    const formData = new FormData();
    formData.append("org_logo", imageSrc);
    const sandData = {
      about_the_organization: content,
      roles_and_responsibilities: roles,
      organizational_boundries: boundaries,
      excluded_sources: excludedsources,
      data_source: selectedOptions,
      designation_of_organizational_admin: childValue,
      reporting_period_name: firstSelection,
      from_year: reportingdateform === "" ? null : reportingdateform,
      to_year: reportingdateto === "" ? null : reportingdateto,
      calender_year: reportingcy === "" ? null : reportingcy,
    };
    formData.append("data", JSON.stringify(sandData));
    await patch(`/sustainapp/ghgreport/${reportId}/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
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
          openModal();
          setSelectedImage();
          setImage();
        } else {
          toast.error("Error", {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          LoaderClose();
        }
      })
      .catch((error) => {
        const errorMessage =
          error.response && error.response.data && error.response.data.message
            ? error.response.data.message
            : "An unexpected error occurred";
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

        LoaderClose();
        setSelectedImage();
      });
  };

  const handleDownloadpdf = async () => {
    // Set loading to true for the specific item
    setLoading(true);
    setIsOpen(false);

    try {
      const response = await fetch(
        `${process.env.BACKEND_API_URL}/sustainapp/report_pdf/${reportId}/?download=true`,
        axiosConfig
      );
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", `${reportname}.pdf`); // Setting the file name dynamically
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading the file:", error);
    } finally {
      // Set loading to false for the specific item

      setIsOpen(null);
      setLoading(false);
    }
  };

  const handleDownloaddocx = async () => {
    setLoading(true);
    setIsOpen(false);
    try {
      const response = await fetch(
        `${process.env.BACKEND_API_URL}/sustainapp/report_word_download/${reportId}/`,
        axiosConfig
      );

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", `${reportname}.docx`); // Setting the file name dynamically
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading the file:", error);
    } finally {
      // Set loading to false for the specific item
      setLoading(false);
      setIsOpen(null);
    }
  };
  return (
    <>
      <ToastContainer style={{ fontSize: "12px" }} />
      {/* mobile section */}
      <div className="block xl:hidden -mt-2">
        <div className="relative min-h-screen">
          {/* Sidebar Overlay */}
          {isOpenmobile && (
            <div
              className="fixed inset-0 bg-black bg-opacity-30 z-40"
              onClick={() => setIsOpenmobile(false)}
            ></div>
          )}

          {/* Sidebar */}
          <div
            className={`bg-white shadow-lg z-50 fixed top-[7rem] left-0 h-full transition-all duration-300 ease-in-out ${
              isOpenmobile ? "w-80" : "w-0"
            } overflow-hidden`}
          >
            <div className="p-4 h-full flex flex-col">
              <div className="">
                <section className="flex min-h-screen justify-center">
                  <div className="w-full">
                    <div className="flex">
                      <h2 className="text-xl text-[#727272]  text-left flex">
                        <b>PRESENTATION</b>
                      </h2>
                      <button
                        onClick={() => setIsOpenmobile(false)}
                        className="text-gray-700 w-full"
                      >
                        <MdKeyboardArrowLeft className="h-6 w-6 float-end" />
                      </button>
                    </div>
                    <h2 className="text-gray-700 mb-3 mt-8 text-left">
                      Templates
                    </h2>
                    <ul>
                      <li className="relative flex items-baseline gap-6 pb-5">
                        <div
                          className={`${
                            activeStep === 1
                              ? "before:absolute before:left-[5.5px] before:h-full before:w-[1px] before:bg-sky-800 font-bold"
                              : "before:absolute before:left-[5.5px] before:h-full before:w-[1px] before:bg-gray-400"
                          } `}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            className={`${
                              activeStep === 1
                                ? "bi bi-circle-fill fill-sky-800 font-bold"
                                : "bi bi-circle-fill fill-gray-400"
                            } `}
                            viewBox="0 0 16 16"
                          >
                            <circle cx="8" cy="8" r="8" />
                          </svg>
                        </div>
                        <div>
                          <p
                            className={`${
                              activeStep === 1
                                ? "text-sm text-sky-800 font-bold"
                                : "text-sm text-gray-600"
                            } `}
                          >
                            Cover Sheet
                          </p>
                        </div>
                      </li>
                      <li className="relative flex items-baseline gap-6 pb-5">
                        <div
                          className={`${
                            activeStep === 2
                              ? "before:absolute before:left-[5.5px] before:h-full before:w-[1px] before:bg-sky-800 font-bold"
                              : "before:absolute before:left-[5.5px] before:h-full before:w-[1px] before:bg-gray-400"
                          } `}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            className={`${
                              activeStep === 2
                                ? "bi bi-circle-fill fill-sky-800 font-bold"
                                : "bi bi-circle-fill fill-gray-400"
                            } `}
                            viewBox="0 0 16 16"
                          >
                            <circle cx="8" cy="8" r="8" />
                          </svg>
                        </div>
                        <div>
                          <p
                            className={`${
                              activeStep === 2
                                ? "text-sm text-sky-800 font-bold"
                                : "text-sm text-gray-600"
                            } `}
                          >
                            Executive summary
                          </p>
                        </div>
                      </li>
                      <li className="relative flex items-baseline gap-6 pb-5">
                        <div
                          className={`${
                            activeStep === 3
                              ? "before:absolute before:left-[5.5px] before:h-full before:w-[1px] before:bg-sky-800 font-bold"
                              : "before:absolute before:left-[5.5px] before:h-full before:w-[1px] before:bg-gray-400"
                          } `}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            className={`${
                              activeStep === 3
                                ? "bi bi-circle-fill fill-sky-800 font-bold"
                                : "bi bi-circle-fill fill-gray-400"
                            } `}
                            viewBox="0 0 16 16"
                          >
                            <circle cx="8" cy="8" r="8" />
                          </svg>
                        </div>
                        <div>
                          <p
                            className={`${
                              activeStep === 3
                                ? "text-sm text-sky-800 font-bold"
                                : "text-sm text-gray-600"
                            } `}
                          >
                            Introduction
                          </p>
                        </div>
                      </li>
                      <li className="relative flex items-baseline gap-6 pb-5">
                        <div
                          className={`${
                            activeStep === 4
                              ? "before:absolute before:left-[5.5px] before:h-full before:w-[1px] before:bg-sky-800 font-bold"
                              : "before:absolute before:left-[5.5px] before:h-full before:w-[1px] before:bg-gray-400"
                          } `}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            className={`${
                              activeStep === 4
                                ? "bi bi-circle-fill fill-sky-800 font-bold"
                                : "bi bi-circle-fill fill-gray-400"
                            } `}
                            viewBox="0 0 16 16"
                          >
                            <circle cx="8" cy="8" r="8" />
                          </svg>
                        </div>
                        <div>
                          <p
                            className={`${
                              activeStep === 4
                                ? "text-sm text-sky-800 font-bold"
                                : "text-sm text-gray-600"
                            } `}
                          >
                            Carbon accounting objectives
                          </p>
                        </div>
                      </li>
                      <li className="relative flex items-baseline gap-6 pb-5">
                        <div
                          className={`${
                            activeStep === 5
                              ? "before:absolute before:left-[5.5px] before:h-full before:w-[1px] before:bg-sky-800 font-bold"
                              : "before:absolute before:left-[5.5px] before:h-full before:w-[1px] before:bg-gray-400"
                          } `}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            className={`${
                              activeStep === 5
                                ? "bi bi-circle-fill fill-sky-800 font-bold"
                                : "bi bi-circle-fill fill-gray-400"
                            } `}
                            viewBox="0 0 16 16"
                          >
                            <circle cx="8" cy="8" r="8" />
                          </svg>
                        </div>
                        <div>
                          <p
                            className={`${
                              activeStep === 5
                                ? "text-sm text-sky-800 font-bold"
                                : "text-sm text-gray-600"
                            } `}
                          >
                            Boundaries
                          </p>
                        </div>
                      </li>
                      <li className="relative flex items-baseline gap-6 pb-5">
                        <div
                          className={`${
                            activeStep === 6
                              ? "before:absolute before:left-[5.5px] before:h-full before:w-[1px] before:bg-sky-800 font-bold"
                              : "before:absolute before:left-[5.5px] before:h-full before:w-[1px] before:bg-gray-400"
                          } `}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            className={`${
                              activeStep === 6
                                ? "bi bi-circle-fill fill-sky-800 font-bold"
                                : "bi bi-circle-fill fill-gray-400"
                            } `}
                            viewBox="0 0 16 16"
                          >
                            <circle cx="8" cy="8" r="8" />
                          </svg>
                        </div>
                        <div>
                          <p
                            className={`${
                              activeStep === 6
                                ? "text-sm text-sky-800 font-bold"
                                : "text-sm text-gray-600"
                            } `}
                          >
                            Data collection
                          </p>
                        </div>
                      </li>
                      <li className="relative flex items-baseline gap-6 pb-5">
                        <div>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            className={`${
                              activeStep === 7
                                ? "bi bi-circle-fill fill-sky-800 font-bold"
                                : "bi bi-circle-fill fill-gray-400"
                            } `}
                            viewBox="0 0 16 16"
                          >
                            <circle cx="8" cy="8" r="8" />
                          </svg>
                        </div>
                        <div>
                          <p
                            className={`${
                              activeStep === 7
                                ? "text-sm text-sky-800 font-bold"
                                : "text-sm text-gray-600"
                            } `}
                          >
                            Results
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </section>
              </div>
            </div>
          </div>

          {/* Floating Open Button */}

          {/* Main Content - No ml-64 shift anymore */}
          <div className="relative z-10">
            <div className="w-full mb-5">
              <div className="shadow-md border-gray-100  py-2">
                <div className="flex ">
                  {!isOpenmobile && (
                    <button onClick={() => setIsOpenmobile(true)}>
                      <MdKeyboardArrowRight className="h-6 w-6 text-black" />
                    </button>
                  )}
                  <h1 className="text-lg text-left mb-2">
                    <p className="ml-3">
                      {reportType == "GHG Report - Investments"
                        ? "Investments - Carbon Accounting Report"
                        : "Carbon Accounting Report"}
                    </p>
                    <p className="text-[#667085] text-[13px] ml-3">
                      Organization
                      {corpName ? " / Corporate" : ""}: {orgName}{" "}
                      {corpName ? " / " : ""}
                      {corpName}{" "}
                      {/* {groupId?.corporate?.length > 0
                        ? "/ " + groupId?.corporate.join(", ")
                        : ""} */}
                    </p>
                  </h1>
                </div>
              </div>
              <div>
                <div className="w-full py-4 flex justify-end ">
                  <div className="w-full flex justify-end ">
                    <button
                      style={{
                        display: activeStep === 1 ? "none" : "inline-block",
                      }}
                      className={`${
                        activeStep === 1 ? "" : "text-blue-500"
                      } px-3 py-1.5 rounded font-bold`}
                      onClick={handlePrevious}
                      disabled={activeStep === 1}
                    >
                      &lt; Previous
                    </button>

                    {activeStep < 7 ? (
                      <button
                        className={`${
                          activeStep === 7
                            ? "bg-gray-300"
                            : "bg-blue-500 text-white"
                        } px-3 py-1.5 rounded ml-2 font-bold w-[100px]`}
                        onClick={handleNext}
                        disabled={activeStep === 7}
                      >
                        Next &gt;
                      </button>
                    ) : (
                      <button
                        className="flex w-[120px] justify-center rounded-md bg-blue-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ml-2"
                        onClick={submitForm}
                      >
                        Submit
                      </button>
                    )}
                  </div>
                </div>
                <div className="h-auto overflow-y-auto mt-2">
                  {/* Step 1 */}
                  {activeStep === 1 && (
                    <>
                      <div>
                        <CoverSheet
                          display={display}
                          imageSrc={imageSrc}
                          setImage={setImage}
                          setSelectedImage={setSelectedImage}
                          selectedImage={selectedImage}
                        />
                      </div>
                    </>
                  )}
                  {/* Step 2 */}
                  {activeStep === 2 && (
                    <div>
                      <Executivesummary
                        exdata={exdata}
                        totalContributionScope={totalContributionScope}
                        highestContributionSource={highestContributionSource}
                      />
                      {/* Your Step 2 form content goes here */}
                    </div>
                  )}

                  {/* Step 3 */}
                  {activeStep === 3 && (
                    <div>
                      <div className="mb-4">
                        <Aboutthereport
                          reportingdateform={reportingdateform}
                          setReportingdateform={setReportingdateform}
                          reportingdateto={reportingdateto}
                          setReportingdateto={setReportingdateto}
                          reportingcy={reportingcy}
                          setReportingCy={setReportingCy}
                          firstSelection={firstSelection}
                          setFirstSelection={setFirstSelection}
                          content={content}
                          setContent={setContent}
                        />
                      </div>
                    </div>
                  )}
                  {activeStep === 4 && (
                    <div>
                      <div className="mb-4">
                        <Carbonaccountingobjectives
                          value={childValue}
                          setValue={setChildValue}
                          roles={roles}
                          setRoles={setRoles}
                        />
                      </div>
                    </div>
                  )}
                  {activeStep === 5 && (
                    <div>
                      <div className="mb-4">
                        <Organizationalboundaries
                          locatiodata={locatiodata}
                          boundaries={boundaries}
                          setBoundaries={setBoundaries}
                        />
                      </div>
                    </div>
                  )}
                  {activeStep === 6 && (
                    <div>
                      <div className="mb-4">
                        <Datacollection
                          souresdata={souresdata}
                          display={display}
                          selectedOptions={selectedOptions}
                          setSelectedOptions={setSelectedOptions}
                          excludedsources={excludedsources}
                          setExcludedsources={setExcludedsources}
                        />
                      </div>
                    </div>
                  )}
                  {activeStep === 7 && (
                    <div>
                      <>
                        <div className="mb-4">
                          <Results
                            exdata={exdata}
                            totalContributionScope={totalContributionScope}
                            souresdata={souresdata}
                            locatiodata={locatiodata}
                          />
                        </div>
                      </>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* desktop section */}
      <div className="hidden xl:block">
        <div className={` flex `}>
          <div className="bg-[#f2f2f2] items-start py-4 px-3 ml-1 min-w-[270px] min-h-[100vh] rounded-lg text-sm">
            <section className="flex min-h-screen justify-center">
              <div className="w-80">
                <h2 className="text-xl text-[#727272] mb-2 text-left">
                  <b>PRESENTATION</b>
                </h2>
                <h2 className="text-gray-700 mb-3 mt-8 text-left">Templates</h2>
                <ul>
                  <li className="relative flex items-baseline gap-6 pb-5">
                    <div
                      className={`${
                        activeStep === 1
                          ? "before:absolute before:left-[5.5px] before:h-full before:w-[1px] before:bg-sky-800 font-bold"
                          : "before:absolute before:left-[5.5px] before:h-full before:w-[1px] before:bg-gray-400"
                      } `}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        className={`${
                          activeStep === 1
                            ? "bi bi-circle-fill fill-sky-800 font-bold"
                            : "bi bi-circle-fill fill-gray-400"
                        } `}
                        viewBox="0 0 16 16"
                      >
                        <circle cx="8" cy="8" r="8" />
                      </svg>
                    </div>
                    <div>
                      <p
                        className={`${
                          activeStep === 1
                            ? "text-sm text-sky-800 font-bold"
                            : "text-sm text-gray-600"
                        } `}
                      >
                        Cover Sheet
                      </p>
                    </div>
                  </li>
                  <li className="relative flex items-baseline gap-6 pb-5">
                    <div
                      className={`${
                        activeStep === 2
                          ? "before:absolute before:left-[5.5px] before:h-full before:w-[1px] before:bg-sky-800 font-bold"
                          : "before:absolute before:left-[5.5px] before:h-full before:w-[1px] before:bg-gray-400"
                      } `}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        className={`${
                          activeStep === 2
                            ? "bi bi-circle-fill fill-sky-800 font-bold"
                            : "bi bi-circle-fill fill-gray-400"
                        } `}
                        viewBox="0 0 16 16"
                      >
                        <circle cx="8" cy="8" r="8" />
                      </svg>
                    </div>
                    <div>
                      <p
                        className={`${
                          activeStep === 2
                            ? "text-sm text-sky-800 font-bold"
                            : "text-sm text-gray-600"
                        } `}
                      >
                        Executive summary
                      </p>
                    </div>
                  </li>
                  <li className="relative flex items-baseline gap-6 pb-5">
                    <div
                      className={`${
                        activeStep === 3
                          ? "before:absolute before:left-[5.5px] before:h-full before:w-[1px] before:bg-sky-800 font-bold"
                          : "before:absolute before:left-[5.5px] before:h-full before:w-[1px] before:bg-gray-400"
                      } `}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        className={`${
                          activeStep === 3
                            ? "bi bi-circle-fill fill-sky-800 font-bold"
                            : "bi bi-circle-fill fill-gray-400"
                        } `}
                        viewBox="0 0 16 16"
                      >
                        <circle cx="8" cy="8" r="8" />
                      </svg>
                    </div>
                    <div>
                      <p
                        className={`${
                          activeStep === 3
                            ? "text-sm text-sky-800 font-bold"
                            : "text-sm text-gray-600"
                        } `}
                      >
                        Introduction
                      </p>
                    </div>
                  </li>
                  <li className="relative flex items-baseline gap-6 pb-5">
                    <div
                      className={`${
                        activeStep === 4
                          ? "before:absolute before:left-[5.5px] before:h-full before:w-[1px] before:bg-sky-800 font-bold"
                          : "before:absolute before:left-[5.5px] before:h-full before:w-[1px] before:bg-gray-400"
                      } `}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        className={`${
                          activeStep === 4
                            ? "bi bi-circle-fill fill-sky-800 font-bold"
                            : "bi bi-circle-fill fill-gray-400"
                        } `}
                        viewBox="0 0 16 16"
                      >
                        <circle cx="8" cy="8" r="8" />
                      </svg>
                    </div>
                    <div>
                      <p
                        className={`${
                          activeStep === 4
                            ? "text-sm text-sky-800 font-bold"
                            : "text-sm text-gray-600"
                        } `}
                      >
                        Carbon accounting objectives
                      </p>
                    </div>
                  </li>
                  <li className="relative flex items-baseline gap-6 pb-5">
                    <div
                      className={`${
                        activeStep === 5
                          ? "before:absolute before:left-[5.5px] before:h-full before:w-[1px] before:bg-sky-800 font-bold"
                          : "before:absolute before:left-[5.5px] before:h-full before:w-[1px] before:bg-gray-400"
                      } `}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        className={`${
                          activeStep === 5
                            ? "bi bi-circle-fill fill-sky-800 font-bold"
                            : "bi bi-circle-fill fill-gray-400"
                        } `}
                        viewBox="0 0 16 16"
                      >
                        <circle cx="8" cy="8" r="8" />
                      </svg>
                    </div>
                    <div>
                      <p
                        className={`${
                          activeStep === 5
                            ? "text-sm text-sky-800 font-bold"
                            : "text-sm text-gray-600"
                        } `}
                      >
                        Boundaries
                      </p>
                    </div>
                  </li>
                  <li className="relative flex items-baseline gap-6 pb-5">
                    <div
                      className={`${
                        activeStep === 6
                          ? "before:absolute before:left-[5.5px] before:h-full before:w-[1px] before:bg-sky-800 font-bold"
                          : "before:absolute before:left-[5.5px] before:h-full before:w-[1px] before:bg-gray-400"
                      } `}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        className={`${
                          activeStep === 6
                            ? "bi bi-circle-fill fill-sky-800 font-bold"
                            : "bi bi-circle-fill fill-gray-400"
                        } `}
                        viewBox="0 0 16 16"
                      >
                        <circle cx="8" cy="8" r="8" />
                      </svg>
                    </div>
                    <div>
                      <p
                        className={`${
                          activeStep === 6
                            ? "text-sm text-sky-800 font-bold"
                            : "text-sm text-gray-600"
                        } `}
                      >
                        Data collection
                      </p>
                    </div>
                  </li>
                  <li className="relative flex items-baseline gap-6 pb-5">
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        className={`${
                          activeStep === 7
                            ? "bi bi-circle-fill fill-sky-800 font-bold"
                            : "bi bi-circle-fill fill-gray-400"
                        } `}
                        viewBox="0 0 16 16"
                      >
                        <circle cx="8" cy="8" r="8" />
                      </svg>
                    </div>
                    <div>
                      <p
                        className={`${
                          activeStep === 7
                            ? "text-sm text-sky-800 font-bold"
                            : "text-sm text-gray-600"
                        } `}
                      >
                        Results
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </section>
          </div>
          <div className="w-full mb-5">
            <div className="flex justify-between shadow-md border-gray-100 mt-4 py-2">
              <div className="flex items-center justify-center">
                <h1 className="text-lg text-left">
                  <p className="ml-3">
                    {reportType == "GHG Report - Investments"
                      ? "Investments - Carbon Accounting Report"
                      : "Carbon Accounting Report"}
                  </p>
                  <p className="text-[#667085] text-[13px] ml-3">
                    Organization
                    {corpName ? " / Corporate" : ""}: {orgName}{" "}
                    {corpName ? " / " : ""}
                    {corpName}{" "}
                    {/* {groupId?.corporate?.length > 0
                        ? "/ " + groupId?.corporate.join(", ")
                        : ""} */}
                  </p>
                </h1>
              </div>
              <div className="float-right mr-2 flex items-center justify-center ">
                <div className="flex items-center justify-center">
                  <button
                    style={{
                      display: activeStep === 1 ? "none" : "inline-block",
                    }}
                    className={`${
                      activeStep === 1 ? "" : "text-blue-500"
                    } px-3 py-1.5 rounded font-bold`}
                    onClick={handlePrevious}
                    disabled={activeStep === 1}
                  >
                    &lt; Previous
                  </button>

                  {activeStep < 7 ? (
                    <button
                      className={`${
                        activeStep === 7
                          ? "bg-gray-300"
                          : "bg-blue-500 text-white"
                      } px-3 py-1.5 rounded ml-2 font-bold w-[100px]`}
                      onClick={handleNext}
                      disabled={activeStep === 7}
                    >
                      Next &gt;
                    </button>
                  ) : (
                    <button
                      className="flex w-[120px] justify-center rounded-md bg-blue-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ml-2"
                      onClick={submitForm}
                    >
                      Submit
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="mx-3 my-2">
              <div className="h-auto overflow-y-auto">
                {/* Step 1 */}
                {activeStep === 1 && (
                  <>
                    <div>
                      <CoverSheet
                        display={display}
                        imageSrc={imageSrc}
                        setImage={setImage}
                        setSelectedImage={setSelectedImage}
                        selectedImage={selectedImage}
                      />
                    </div>
                  </>
                )}
                {/* Step 2 */}
                {activeStep === 2 && (
                  <div>
                    <Executivesummary
                      exdata={exdata}
                      totalContributionScope={totalContributionScope}
                      highestContributionSource={highestContributionSource}
                    />
                    {/* Your Step 2 form content goes here */}
                  </div>
                )}

                {/* Step 3 */}
                {activeStep === 3 && (
                  <div>
                    <div className="mb-4">
                      <Aboutthereport
                        reportingdateform={reportingdateform}
                        setReportingdateform={setReportingdateform}
                        reportingdateto={reportingdateto}
                        setReportingdateto={setReportingdateto}
                        reportingcy={reportingcy}
                        setReportingCy={setReportingCy}
                        firstSelection={firstSelection}
                        setFirstSelection={setFirstSelection}
                        content={content}
                        setContent={setContent}
                      />
                    </div>
                  </div>
                )}
                {activeStep === 4 && (
                  <div>
                    <div className="mb-4">
                      <Carbonaccountingobjectives
                        value={childValue}
                        setValue={setChildValue}
                        roles={roles}
                        setRoles={setRoles}
                      />
                    </div>
                  </div>
                )}
                {activeStep === 5 && (
                  <div>
                    <div className="mb-4">
                      <Organizationalboundaries
                        locatiodata={locatiodata}
                        boundaries={boundaries}
                        setBoundaries={setBoundaries}
                      />
                    </div>
                  </div>
                )}
                {activeStep === 6 && (
                  <div>
                    <div className="mb-4">
                      <Datacollection
                        souresdata={souresdata}
                        display={display}
                        selectedOptions={selectedOptions}
                        setSelectedOptions={setSelectedOptions}
                        excludedsources={excludedsources}
                        setExcludedsources={setExcludedsources}
                      />
                    </div>
                  </div>
                )}
                {activeStep === 7 && (
                  <div>
                    <>
                      <div className="mb-4">
                        <Results
                          exdata={exdata}
                          totalContributionScope={totalContributionScope}
                          souresdata={souresdata}
                          locatiodata={locatiodata}
                        />
                      </div>
                    </>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg h-[250px]">
            <div>
              <div className="text-left text-lg font-semibold">
                Report has been created
              </div>
              <div className="text-left text-sm text-gray-500 mb-8">
                The report has been created
              </div>
            </div>
            <div>
              <div className="text-left text-sm">Report Name</div>
              <div className="text-left text-sm text-blue-500 mb-8">
                {reportname}
              </div>
            </div>

            <div className="flex">
              <div className="px-4 py-1 border border-gary-400 me-4 text-black rounded-md h-[36px] w-[175px] text-center">
                <Link
                  href="/dashboard/Report"
                  className="text-black text-sm leading-[15px]"
                >
                  Back to Report
                </Link>
              </div>
              <div
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md shadow-md w-[175px] cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
              >
                <div className="w-[10%]">
                  <MdDownload />
                </div>

                {loading ? (
                  <button className="font-bold px-2 flex justify-between">
                    <Oval
                      height={20}
                      width={20}
                      color="#fff"
                      margin
                      secondaryColor="#fff"
                      strokeWidth={2}
                      strokeWidthSecondary={2}
                    />
                    <p className="ml-2">Download</p>
                  </button>
                ) : (
                  <button className="font-bold mx-4">Download</button>
                )}
                <div className="w-[15%]">
                  <MdKeyboardArrowDown />
                </div>
              </div>
            </div>
            {isOpen && (
              <div className="w-[11.3rem] bg-white shadow-xl z-10 float-right">
                <div className="px-3 mb-1 py-2">
                  {reportType !== "GHG Report - Investments" && (
                    <div className="mb-2">
                      <h5
                        className="text-blue-500 cursor-pointer text-sm flex"
                        onClick={handleDownloaddocx}
                      >
                        <MdFileDownload className="text-[18px]" /> Download as
                        Docx
                      </h5>
                    </div>
                  )}
                  <div>
                    <h5
                      className="text-blue-500 cursor-pointer text-sm flex"
                      onClick={handleDownloadpdf}
                    >
                      <MdFileDownload className="text-[18px]" /> Download as PDF
                    </h5>
                  </div>
                </div>
              </div>
            )}
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
}

export default Ghgtemplates;