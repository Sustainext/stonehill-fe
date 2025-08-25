"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  MdDownload,
  MdEdit,
  MdDeleteOutline,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdOutlineWarningAmber,
  MdMoreVert,
  MdOutlineEmail,
} from "react-icons/md";
import { LuListFilter } from "react-icons/lu";
import {
  BsFileEarmarkPdf,
  BsFileEarmarkWord,
  BsDownload,
} from "react-icons/bs";
import { ImFileExcel } from "react-icons/im";
import { AiOutlineEdit } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Oval } from "react-loader-spinner";
import FilterComponent from "./FilterComponent";
import {
  initializeForCustomReport,
  resetToDefaults,
  fetchReportBuilderData,
} from "../../../../lib/redux/features/reportBuilderSlice";
import { resetToggleToDefaults } from "../../../../lib/redux/features/reportCreationSlice";
import { useDispatch } from "react-redux";

import axiosInstance, { del } from "@/app/utils/axiosMiddleware";

const TableWithPagination = ({
  data,
  defaultItemsPerPage,
  fetchReoprts,
  isMenuOpen,
  setIsMenuOpen,
  setData,
}) => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);
  const [totalPages, setTotalPages] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataDelete, setDelete] = useState({});
  const [loopen, setLoOpen] = useState(false);
  const [sort, setSort] = useState({ column: null, direction: "asc" });
  const [loadingByIdpdf, setLoadingByIdpdf] = useState({});
  const [loadingById, setLoadingById] = useState({});
  const [isOpen, setIsOpen] = useState(null);
  const [reportid, setReportid] = useState();
  const [reporttepname, setReportTepname] = useState();
  const [isCIDownloading, setIsCIDownloading] = useState(false);
  const [isCIXLDownloading, setIsCIXLDownloading] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedCreators, setSelectedCreators] = useState([]);
  const [filteredData, setFilterData] = useState([]);
  const [menuDirection, setMenuDirection] = useState("down");

  useEffect(() => {
    if (selectedCreators.length > 0) {
      const filteredData = data.filter((item) =>
        selectedCreators.includes(item.created_by)
      );
      setFilterData(filteredData);
    } else {
      setFilterData(data);
    }
  }, [data, selectedCreators]);
  // Add this function with other download handlers
  const handleTCFDDownloadpdf = async (id, name) => {
    setLoadingByIdpdf((prevState) => ({ ...prevState, [id]: true }));

    try {
      const response = await fetch(
        `${process.env.BACKEND_API_URL}/tcfd_framework/get-tcfd-report-pdf/${id}/?download=true`,
        axiosConfig
      );
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", `${name}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading TCFD file:", error);
      toast.error("Error downloading the file", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } finally {
      setLoadingByIdpdf((prevState) => ({ ...prevState, [id]: false }));
      setIsMenuOpen(false);
    }
  };

  const ActionMenu = ({ item }) => {
    const isGRIReport =
      item.report_type === "GRI Report: In accordance With" ||
      item.report_type === "GRI Report: With Reference to" ||
      item.report_type == "Custom ESG Report";

    const isTCFDReport = item.report_type === "TCFD";

    return (
      <div
        className={`absolute bg-white shadow-lg rounded-lg py-2 w-[211px] z-10 right-8 ${
          menuDirection === "up" ? "bottom-full mb-2" : " top-full mt-2"
        }`}
      >
        {item.report_type === "canada_bill_s211_v2" ? (
          <>
            <button
              className="flex items-center p-2 w-full text-left text-[#344054] gradient-sky-blue"
              onClick={() => {
                handleBills211Downloadpdf(item.id, item.name);
              }}
            >
              <BsFileEarmarkPdf className="mr-2 w-4 h-4" />
              Download Report PDF
            </button>

            <button
              className="flex items-center p-2 w-full text-left text-[#d1d5db] cursor-not-allowed"
              disabled
            >
              <BsFileEarmarkWord className="mr-2 w-4 h-4" />
              Download Report Word
            </button>
          </>
        ) : isTCFDReport ? (
          <>
            <button
              className="flex items-center p-2 w-full text-left text-[#344054] gradient-sky-blue"
              onClick={() => {
                handleTCFDDownloadpdf(item.id, item.name);
              }}
            >
              {loadingByIdpdf[item.id] ? (
                <Oval height={20} width={20} color="#00BFFF" />
              ) : (
                <BsFileEarmarkPdf className="mr-2 w-4 h-4" />
              )}
              Download Report PDF
            </button>

            <button
              className="flex items-center p-2 w-full text-left text-[#d1d5db] cursor-not-allowed"
              disabled
            >
              <BsFileEarmarkWord className="mr-2 w-4 h-4" />
              Download Report Word
            </button>
          </>
        ) : (
          <>
            <button
              className="flex items-center p-2 w-full text-left text-[#344054] gradient-sky-blue"
              onClick={() => {
                if (isGRIReport) {
                  handleDownloadESGpdf(item.id, item.name, false);
                } else {
                  handleDownloadpdf(item.id, item.name);
                }
              }}
            >
              {loadingByIdpdf[item.id] ? (
                <Oval height={20} width={20} color="#00BFFF" />
              ) : (
                <BsFileEarmarkPdf className="mr-2 w-4 h-4" />
              )}
              Download Report PDF
            </button>
            {[
              "GRI Report: In accordance With",
              "GRI Report: With Reference to",
              "Custom ESG Report",
            ].includes(item.report_type) ? (
              <button
                className="flex items-center p-2 w-full text-left text-[#d1d5db] cursor-not-allowed"
                disabled
              >
                <BsFileEarmarkWord className="mr-2 w-4 h-4" />
                Download Report Word
              </button>
            ) : item.report_type !== "GHG Report - Investments" ? (
              <button
                className="flex items-center p-2 w-full text-left text-[#344054] gradient-sky-blue"
                onClick={() => handleDownloaddocx(item.id, item.name)}
              >
                {loadingById[item.id] ? (
                  <Oval height={20} width={20} color="#00BFFF" />
                ) : (
                  <BsFileEarmarkWord className="mr-2 w-4 h-4" />
                )}
                Download Report Word
              </button>
            ) : null}
          </>
        )}

        {/* Conditional Rendering for Additional GRI Options */}
        {isGRIReport && (
          <>
            <button
              className={
                "flex items-center p-2 w-full text-left h text-[#344054] gradient-sky-blue"
              }
              onClick={() => handleDownloadESGpdf(item.id, item.name, true)}
            >
              {isCIDownloading ? (
                <Oval
                  height={20}
                  width={20}
                  color="#00BFFF"
                  secondaryColor="#f3f3f3"
                  strokeWidth={2}
                  strokeWidthSecondary={2}
                />
              ) : (
                <BsFileEarmarkPdf className="mr-2 text-[#344054] w-4 h-4" />
              )}
              Download Content Index PDF
            </button>
            <button
              className={
                "flex items-center p-2 w-full text-left h text-[#344054] gradient-sky-blue"
              }
              onClick={() =>
                handleDownloadExcel(item.id, item.name, item.report_type)
              }
            >
              {isCIXLDownloading ? (
                <Oval
                  height={20}
                  width={20}
                  color="#00BFFF"
                  secondaryColor="#f3f3f3"
                  strokeWidth={2}
                  strokeWidthSecondary={2}
                />
              ) : (
                <ImFileExcel className="mr-2 text-[#344054] w-4 h-4" />
              )}
              Download Content Index Excel
            </button>
            {item.report_type === "GRI Report: In accordance With" && (
              <button
                // onClick={() => console.log("Notify GRI")}
                className="flex items-center p-2 w-full text-left  text-[#d1d5db] cursor-not-allowed"
              >
                <MdOutlineEmail className="mr-2 text-[#d1d5db] w-4 h-4" />{" "}
                Notify GRI
              </button>
            )}
          </>
        )}

        <button
          className={`flex items-center p-2 w-full text-left gradient-sky-blue  text-[#344054]`}
          onClick={() => {
            if (isGRIReport) {
              handleSetESGdata(
                item.id,
                item.organization_name,
                item.start_date,
                item.end_date,
                item.organization_country,
                item.name,
                item.created_at,
                item.report_type,
                item.corporate_name,
                item.gri_email_sent_count
              );
            } else {
              handleSetdata(
                item.id,
                item.organization_name,
                item.start_date,
                item.end_date,
                item.organization_country,
                item.name,
                item.report_by,
                item.corporate_name,
                item.report_type
              );
            }
          }}
        >
          <AiOutlineEdit className="mr-2 w-4 h-4" /> Edit Report
        </button>

        <button
          className="flex items-center p-2 w-full text-left gradient-sky-blue  text-[#344054]"
          onClick={() =>
            openModal(item.id, item.name, item.report_type, item.start_date)
          }
        >
          <MdDeleteOutline className="mr-2 w-4 h-4" /> Delete Report
        </button>
      </div>
    );
  };

  const toggleMenu = (itemId) => {
    setIsMenuOpen(itemId === isMenuOpen ? null : itemId);
  };

  let timeoutId;

  const handleMouseEnter = (itemId, itemsPerPage, index, e) => {
    const rect = e?.currentTarget?.getBoundingClientRect();

    // if (rect) {
    //   const spaceBelow = window.innerHeight - rect.bottom;
    //   const spaceAbove = rect.top;

    //   if (spaceBelow < 250 && spaceAbove > 250) {
    //     setMenuDirection("up"); // not enough space below, open upward
    //   } else {
    //     setMenuDirection("down"); // open downward
    //   }
    // }

    if (itemsPerPage <= 5) {
      setMenuDirection("down");
      clearTimeout(timeoutId);
      setIsMenuOpen(itemId);
      return;
    }

    const splitPoint = Math.ceil(itemsPerPage / 2) + 1;

    if (index < splitPoint) {
      setMenuDirection("down");
    } else {
      setMenuDirection("up");
    }

    clearTimeout(timeoutId);
    setIsMenuOpen(itemId);
  };

  const handleMouseLeave = () => {
    // Add a delay before hiding the menu
    timeoutId = setTimeout(() => {
      setIsMenuOpen(null);
    }, 500); // Adjust delay as needed
  };

  const togglePopup = (itemId, itemName) => {
    setIsOpen((currentOpenPopupId) =>
      currentOpenPopupId === itemId ? null : itemId
    );
    setReportid(itemId);
    setReportTepname(itemName);
  };
  const LoaderOpen = () => {
    setLoOpen(true);
  };
  const LoaderClose = () => {
    setLoOpen(false);
  };
  const openModal = (id, name, report_type, start_date) => {
    setIsModalOpen(true);
    setDelete({ id, name, report_type, start_date });
    setIsMenuOpen(false);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Function to handle the download

  const handleSetdata = (
    id,
    organization_name,
    startdate,
    enddate,
    organization_country,
    name,
    report_by,
    corporate_name,
    report_type
  ) => {
    const newdata = {
      id: id,
      organization_name: organization_name,
      start_date: startdate,
      end_date: enddate,
      country_name: organization_country,
      reportname: name,
      report_by: report_by,
    };
    window.localStorage.setItem("reportid", id);

    window.localStorage.setItem("reportstartdate", startdate);
    window.localStorage.setItem("reportenddate", enddate);
    window.localStorage.setItem("organizationcountry", organization_country);
    window.localStorage.setItem("reportby", report_by);
    window.localStorage.setItem("reportType", report_type);
    window.localStorage.setItem(
      "reportCorpName",
      corporate_name ? corporate_name : ""
    );
    window.localStorage.setItem("reportorgname", organization_name);
    // if (report_by == "Corporate") {
    //   if (corporate_name == undefined) {
    //     window.localStorage.setItem("reportorgname", organization_name);
    //   } else {
    //     window.localStorage.setItem("reportCorpName", corporate_name);
    //     window.localStorage.setItem("reportorgname", organization_name);
    //   }
    // } else {
    //   window.localStorage.setItem("reportorgname", organization_name);
    // }
    // sessionStorage.setItem('reportData',newdata);
    if (report_type === "canada_bill_s211_v2") {
      router.push("/dashboard/Report/Bills211");
    } else if (report_type === "TCFD") {
      router.push("/dashboard/Report/TCFD");
    } else {
      router.push("/dashboard/Report/GHG/Ghgtemplates");
    }

    window.localStorage.setItem("reportname", name);
  };

  const handleSetESGdata = (
    id,
    organization_name,
    startdate,
    enddate,
    organization_country,
    name,
    created_at,
    report_type,
    corporate_name,
    gri_email_sent_count
  ) => {
    const newdata = {
      id: id,
      organization_name: organization_name,
      start_date: startdate,
      end_date: enddate,
      country_name: organization_country,
      reportname: name,
    };
    window.localStorage.setItem("reportid", id);
    window.localStorage.setItem("reportorgname", organization_name);
    window.localStorage.setItem("reportstartdate", startdate);
    window.localStorage.setItem("reportenddate", enddate);
    window.localStorage.setItem("organizationcountry", organization_country);
    window.localStorage.setItem("reportCreatedOn", created_at);
    window.localStorage.setItem("reportType", report_type);
    window.localStorage.setItem("reportname", name);
    if (gri_email_sent_count) {
      window.localStorage.setItem("notifyGRICount", gri_email_sent_count);
    }
    // sessionStorage.setItem('reportData',newdata);
    // if (corporate_name !== undefined){
    // }
    window.localStorage.setItem(
      "reportCorpName",
      corporate_name ? corporate_name : ""
    );
    if (report_type === "Custom ESG Report") {
      // dispatch(initializeForCustomReport());
      dispatch(resetToDefaults());
      dispatch(resetToggleToDefaults());
      dispatch(fetchReportBuilderData(id));
    }
    router.push("/dashboard/Report/ESG");
  };

  useEffect(() => {
    setTotalPages(Math.ceil(data.length / itemsPerPage));
  }, [data.length, itemsPerPage]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Change items per page
  const onItemsPerPageChange = (event) => {
    setItemsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1); // Reset to first page
  };

  const firstItemIndex = (currentPage - 1) * itemsPerPage + 1;
  const lastItemIndex = Math.min(currentPage * itemsPerPage, data.length);

  const handleDelete = async () => {
    LoaderOpen();
    const reportId = dataDelete.id;

    await axiosInstance
      .delete(`/sustainapp/ghgreport/${reportId}`)
      .then((response) => {
        if (response.status === 204) {
          const { name, report_type, start_date } = dataDelete;
          const year = new Date(start_date).getFullYear();

          toast.error(
            <div>
              <div className="mb-2 flex">
                <div className="bg-[#fff1f2] rounded-full p-2">
                  <MdDeleteOutline
                    className="text-[#D64564]"
                    fontSize="large"
                  />
                </div>
                <div className="ml-2 flex items-center">
                  <p className="text-[#344054] text-[14px]">Report Deleted</p>
                </div>
              </div>
              <div>
                <p className="text-[#344054] text-[12px] ml-2">{`${name} ${report_type} ${year} has been successfully deleted.`}</p>
              </div>
            </div>,
            {
              position: "top-right",
              autoClose: 4000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
              icon: false,
            }
          );

          LoaderClose();
          fetchReoprts();
          closeModal();
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
          fetchReoprts();
          closeModal();
        }
      });
  };
  const handleSort = (column) => {
    const isAsc = sort.column === column && sort.direction === "asc";
    setSort({ column, direction: isAsc ? "desc" : "asc" });
  };

  // Sorting data
  // // Sorting data
  // const sortedData = useMemo(() => {
  //   if (sort.column) {
  //     return [...filteredData].sort((a, b) => {
  //       const columnA = a[sort.column];
  //       const columnB = b[sort.column];
  //       if (columnA < columnB) {
  //         return sort.direction === "asc" ? -1 : 1;
  //       }
  //       if (columnA > columnB) {
  //         return sort.direction === "asc" ? 1 : -1;
  //       }
  //       return 0;
  //     });
  //   } else {
  //     // If no column is selected for sorting, return the original data
  //     return filteredData;
  //   }
  // }, [filteredData, sort]);
  const sortedData = useMemo(() => {
    if (sort.column) {
      return [...filteredData].sort((a, b) => {
        const columnA = a[sort.column];
        const columnB = b[sort.column];

        // Check if the value is a valid date
        const isDateA = !isNaN(Date.parse(columnA));
        const isDateB = !isNaN(Date.parse(columnB));

        if (isDateA && isDateB) {
          // Sort by date (oldest to newest or newest to oldest)
          const dateA = new Date(columnA);
          const dateB = new Date(columnB);
          return sort.direction === "asc"
            ? dateA - dateB // Oldest to Newest
            : dateB - dateA; // Newest to Oldest
        }

        // Case-insensitive string comparison
        if (typeof columnA === "string" && typeof columnB === "string") {
          return (
            columnA.localeCompare(columnB, undefined, { sensitivity: "base" }) *
            (sort.direction === "asc" ? 1 : -1)
          );
        }

        // Default fallback (if values are neither dates nor strings)
        if (columnA < columnB) {
          return sort.direction === "asc" ? -1 : 1;
        }
        if (columnA > columnB) {
          return sort.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    } else {
      // If no column is selected for sorting, return the original filtered data
      return filteredData;
    }
  }, [filteredData, sort]);

  const currentItems = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
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

  const handleDownloadESGpdf = async (id, name, contentIndex) => {
    if (contentIndex) {
      setIsCIDownloading(true);
    } else {
      setLoadingByIdpdf((prevState) => ({ ...prevState, [id]: true }));
    }

    try {
      const response = await fetch(
        `${process.env.BACKEND_API_URL}/esg_report/esg_report_pdf/${id}/?content_index=${contentIndex}&download=true`,
        axiosConfig
      );

      if (!response.ok) {
        if (contentIndex) {
          setIsCIDownloading(false);
        } else {
          setLoadingByIdpdf((prevState) => ({ ...prevState, [id]: false }));
        }
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute(
        "download",
        `${name} ${contentIndex ? " Content Index" : ""}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      if (contentIndex) {
        setIsCIDownloading(false);
      } else {
        setLoadingByIdpdf((prevState) => ({ ...prevState, [id]: false }));
      }
      setIsMenuOpen(false);
    } catch (error) {
      console.error("Error downloading the file:", error);
      toast.error("Error downloading the file", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };
  const handleDownloadExcel = async (id, name, report_type) => {
    setIsCIXLDownloading(true);
    let url = "";
    if (report_type && report_type == "GRI Report: With Reference to") {
      url = `${process.env.BACKEND_API_URL}/esg_report/content_index_reference_excel/${id}/?download=true`;
    } else {
      url = `${process.env.BACKEND_API_URL}/esg_report/content_index_excel/${id}/?download=true`;
    }

    try {
      const response = await fetch(url, axiosConfig);

      if (!response.ok) {
        setIsCIXLDownloading(false);
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", `${name} Content Index.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsCIXLDownloading(false);
    } catch (error) {
      console.error("Error downloading the file:", error);
      toast.error("Error downloading the file", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  const handleBills211Downloadpdf = async (id, name) => {
    // Set loading to true for the specific item
    setLoadingByIdpdf((prevState) => ({ ...prevState, [id]: true }));

    try {
      const response = await fetch(
        `${process.env.BACKEND_API_URL}/canada_bill_s211/v2/get-report-pdf/${id}/?download=true`,
        axiosConfig
      );
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", `${name}.pdf`); // Setting the file name dynamically
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading the file:", error);
    } finally {
      // Set loading to false for the specific item
      setLoadingByIdpdf((prevState) => ({ ...prevState, [id]: false }));
      setIsMenuOpen(false);
    }
  };
  const handleDownloadpdf = async (id, name) => {
    // Set loading to true for the specific item
    setLoadingByIdpdf((prevState) => ({ ...prevState, [id]: true }));

    try {
      const response = await fetch(
        `${process.env.BACKEND_API_URL}/sustainapp/report_pdf/${id}/?download=true`,
        axiosConfig
      );
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", `${name}.pdf`); // Setting the file name dynamically
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading the file:", error);
    } finally {
      // Set loading to false for the specific item
      setLoadingByIdpdf((prevState) => ({ ...prevState, [id]: false }));
      setIsMenuOpen(false);
    }
  };
  const handleDownloaddocx = async (id, name) => {
    setLoadingById((prevState) => ({ ...prevState, [id]: true }));

    try {
      const response = await fetch(
        `${process.env.BACKEND_API_URL}/sustainapp/report_word_download/${id}/`,
        axiosConfig
      );

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", `${name}.docx`); // Setting the file name dynamically
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading the file:", error);
    } finally {
      // Set loading to false for the specific item
      setLoadingById((prevState) => ({ ...prevState, [id]: false }));
      setIsMenuOpen(false);
    }
  };

  const handleESGDownloaddocx = async () => {
    setLoadingById((prevState) => ({ ...prevState, [reportid]: true }));

    try {
      const response = await fetch(
        `${process.env.BACKEND_API_URL}/sustainapp/report_word_download/${reportid}/`,
        axiosConfig
      );

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", `${reporttepname}.docx`); // Setting the file name dynamically
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading the file:", error);
    } finally {
      // Set loading to false for the specific item
      setLoadingById((prevState) => ({ ...prevState, [reportid]: false }));
      setIsOpen(null);
    }
  };

  return (
    <>
      <div
        style={{
          display: "block",
          overflowX: "auto",
          // overflowY:"hidden",
          maxWidth: "100%",
          minWidth: "100%",
          width: "30vw",
        }}
        className="rounded-md table-scrollbar h-[500px]"
      >
        <table className="min-w-max w-full table-auto">
          <thead className="py-3 px-6 text-center text-[#727272] text-[13px] font-extrabold leading-none gradient-background">
            <tr>
              <th
                className="py-3 px-6 text-center  whitespace-nowrap font-[400] text-[12px]"
                onClick={() => handleSort("name")}
              >
                <div className="flex justify-center">
                  Report Name
                  {sort.column === "name" ? (
                    sort.direction === "asc" ? (
                      <MdKeyboardArrowUp />
                    ) : (
                      <MdKeyboardArrowDown />
                    )
                  ) : (
                    <MdKeyboardArrowDown />
                  )}
                </div>
              </th>
              <th
                className="py-3 px-6 text-center  whitespace-nowrap font-[400] text-[12px]"
                onClick={() => handleSort("report_type")}
              >
                <div className="flex justify-center">
                  Report type{" "}
                  {sort.column === "report_type" ? (
                    sort.direction === "asc" ? (
                      <MdKeyboardArrowUp />
                    ) : (
                      <MdKeyboardArrowDown />
                    )
                  ) : (
                    <MdKeyboardArrowDown />
                  )}
                </div>
              </th>
              <th
                className="py-3 px-6 text-center  whitespace-nowrap font-[400] text-[12px]"
                onClick={() => handleSort("organization_name")}
              >
                <div className="flex justify-center">
                  Organization{" "}
                  {sort.column === "organization_name" ? (
                    sort.direction === "asc" ? (
                      <MdKeyboardArrowUp />
                    ) : (
                      <MdKeyboardArrowDown />
                    )
                  ) : (
                    <MdKeyboardArrowDown />
                  )}
                </div>
              </th>
              <th
                className="py-3 px-6 text-center  whitespace-nowrap font-[400] text-[12px]"
                onClick={() => handleSort("corporate_name")}
              >
                <div className="flex justify-center">
                  Corporate{" "}
                  {sort.column === "corporate_name" ? (
                    sort.direction === "asc" ? (
                      <MdKeyboardArrowUp />
                    ) : (
                      <MdKeyboardArrowDown />
                    )
                  ) : (
                    <MdKeyboardArrowDown />
                  )}
                </div>
              </th>
              <th
                className="py-3 px-6 text-center  whitespace-nowrap font-[400] text-[12px]"
                onClick={() => handleSort("start_date")}
              >
                <div className="flex justify-center">
                  Time Period{" "}
                  {sort.column === "start_date" ? (
                    sort.direction === "asc" ? (
                      <MdKeyboardArrowUp />
                    ) : (
                      <MdKeyboardArrowDown />
                    )
                  ) : (
                    <MdKeyboardArrowDown />
                  )}
                </div>
              </th>
              <th className="py-3 px-6 text-center  whitespace-nowrap font-[400] text-[12px]">
                <div className="flex justify-center gap-2">
                  Created by
                  <LuListFilter
                    className="text-[18px] -mt-1 cursor-pointer"
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                  />
                </div>
                {isFilterOpen && (
                  <div className="relative inline-block">
                    <FilterComponent
                      data={filteredData}
                      setData={setFilterData}
                      search={search}
                      setSearch={setSearch}
                      selectedCreators={selectedCreators}
                      setSelectedCreators={setSelectedCreators}
                      originalData={data}
                      setIsFilterOpen={setIsFilterOpen}
                    />
                  </div>
                )}
              </th>
              <th
                className="py-3 px-6 text-center  whitespace-nowrap font-[400] text-[12px]"
                onClick={() => handleSort("updated_at")}
              >
                <div className="flex justify-center">
                  Last Edited on{" "}
                  {sort.column === "updated_at" ? (
                    sort.direction === "asc" ? (
                      <MdKeyboardArrowUp />
                    ) : (
                      <MdKeyboardArrowDown />
                    )
                  ) : (
                    <MdKeyboardArrowDown />
                  )}{" "}
                </div>
              </th>
              <th className="py-3 px-6 text-center  whitespace-nowrap font-[400] text-[12px]">
                <div className="flex justify-center">Last Edited by </div>
              </th>
              <th className="py-3 px-6 text-center whitespace-nowrap font-extrabold flex justify-center text-[12px]">
                Action{" "}
              </th>
            </tr>
          </thead>

          <tbody className="text-gray-600 text-sm font-light">
            {filteredData.length > 0 &&
              currentItems.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200  text-center"
                >
                  <td className="py-3 px-6 text-center whitespace-nowrap text-[12px] text-[#343A40]">
                    {item.name}
                  </td>
                  <td className="py-3 px-6 text-center whitespace-nowrap text-[12px] text-[#343A40]">
                    {item.report_type}
                  </td>
                  <td className="py-3 px-6 text-center whitespace-nowrap text-[12px] text-[#343A40]">
                    {item.organization_name}
                  </td>
                  <td className="py-3 px-6 text-center whitespace-nowrap text-[12px] text-[#343A40]">
                    {item.corporate_name ? item.corporate_name : "Not Selected"}
                  </td>
                  <td className="py-3 px-6 text-center whitespace-nowrap text-[12px] text-[#343A40]">
                    {item.start_date} to {item.end_date}
                  </td>
                  <td className="py-3 px-6 text-center whitespace-nowrap text-[12px] text-[#343A40]">
                    {item.created_by}
                  </td>

                  <td className="py-3 px-6 text-center whitespace-nowrap text-[12px] text-[#343A40]">
                    {item.updated_at}
                  </td>
                  <td className="py-3 px-6 text-center whitespace-nowrap text-[12px] text-[#343A40]">
                    {item.last_updated_by}
                  </td>
                  <td className="py-3 px-6 relative text-center flex justify-center">
                    <MdMoreVert
                      className="cursor-pointer"
                      onMouseEnter={() =>
                        handleMouseEnter(item.id, itemsPerPage, index)
                      }
                      onMouseLeave={handleMouseLeave}
                    />
                    {isMenuOpen === item.id && (
                      <div
                        onMouseEnter={(e) =>
                          handleMouseEnter(item.id, itemsPerPage, index, e)
                        } // Ensure menu stays open
                        onMouseLeave={handleMouseLeave} // Allow menu to close
                      >
                        <ActionMenu item={item} />
                      </div>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className="justify-end items-center gap-2 flex w-[100%] mt-4">
        <div>
          <label className="text-black text-opacity-60 text-xs font-normal leading-[15px] text-[15px]">
            Rows per page:
          </label>
          <select
            value={itemsPerPage}
            onChange={onItemsPerPageChange}
            className="text-black  text-xs font-normal leading-[15px]"
          >
            {[5, 10, 15, 20].map((number) => (
              <option key={number} value={number}>
                {number}
              </option>
            ))}
          </select>
        </div>

        <div className="ml-4 flex mr-1">
          <div>
            <span className="text-black  text-xs font-normal leading-[15px] text-[15px]">{`${firstItemIndex}-${lastItemIndex} of ${data.length}`}</span>
          </div>

          <div className="ml-4 mt-1">
            <button
              onClick={() => paginate(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="text-black   font-normal leading-[15px] text-[25px]"
            >
              {"<"}
            </button>
            <button
              onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="text-black  font-normal leading-[15px] text-[25px]"
            >
              {">"}
            </button>
          </div>
        </div>
      </div>
      {/* <div className="mt-16">
      <table className="min-w-max w-full table-auto ">
        <thead className="py-3 px-6 text-center text-neutral-500 text-[13px] font-extrabold leading-none">
          <tr>
            {columns.map((columns) => (
              <th className="py-3 px-6 text-center whitespace-nowrap font-extrabold flex">
                {columns.Header} <KeyboardArrowDownIcon/>
              </th>
            ))}
 
 
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
 
            <tr
 
              className="border-b border-gray-200 hover:bg-[#e0f2fe] text-center"
            >
              <td className="py-3 px-6 text-center whitespace-nowrap">
              sustinext new
              </td>
              <td className="py-3 px-6 text-center whitespace-nowrap">
              GHG Accounting Report
              </td>
              <td className="py-3 px-6 text-center whitespace-nowrap">
              2022-01-06
              </td>
              <td className="py-3 px-6 text-center whitespace-nowrap">
              2022-12-06
              </td>
 
              <td className="py-3 px-6 text-center whitespace-nowrap">
              2024-02-06
              </td>
              <td className="py-3 px-6 text-center whitespace-nowrap">
 
              <a href="https://sustainextstorage1.blob.core.windows.net/sustainext/new-report-file.pdf" target="_blank" download="filename.pdf"> <DownloadIcon/></a>
              </td>
            </tr>
 
        </tbody>
      </table>
 
 
    </div>  */}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6  rounded-lg shadow-lg ml-40 w-[513px]">
            <div>
              <div className="mb-2 flex">
                <div className="bg-[#fff1f2] rounded-full p-2">
                  <MdDeleteOutline
                    className="text-[#D64564] "
                    fontSize="large"
                  />
                </div>
                <div className="ml-2 flex items-center">
                  <p className="text-[#344054] text-[18px]"> Delete Report</p>
                </div>
              </div>
              <div className="text-left mt-4 text-[14px] font-[400] mb-4  text-[#667085]">
                This process will delete the report and the action is
                irreversible. Are you sure you want to delete this report?
              </div>
            </div>

            <div className="flex gap-5">
              <div className="w-[50%]">
                <button
                  className="px-4 py-2 border border-[#727272]  w-full text-[#727272] font-bold rounded text-[12px]"
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </div>

              <div className="w-[50%]">
                <button
                  className="px-4 py-2 border border-[#EF5350] w-full text-white bg-[#EF5350] font-bold rounded text-[12px]"
                  onClick={handleDelete}
                >
                  Yes, Delete
                </button>
              </div>
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

export default TableWithPagination;