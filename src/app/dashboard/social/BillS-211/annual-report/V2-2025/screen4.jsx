"use client";
import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../../../../../utils/axiosMiddleware";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdOutlineModeEditOutline, MdClose } from "react-icons/md";
import { IoSaveOutline } from "react-icons/io5";
import { GlobalState } from "../../../../../../Context/page";
import { Oval } from "react-loader-spinner";

const Screenfour = ({
  nextStep,
  prevStep,
  selectedCorp,
  selectedOrg,
  year,
  reportType,
  status,
}) => {
  const { open } = GlobalState();
  const [error, setError] = useState({});
  const [reportradio, setReportnradio] = useState("");
  const [loopen, setLoOpen] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const screenId = 4;

  const fetchBillSfour = async () => {
    LoaderOpen(); // Assume this is to show some loading UI

    try {
      // or use a dynamic value
      const response = await axiosInstance.get(
        `${process.env.BACKEND_API_URL}/canada_bill_s211/v2/reporting-for-entities/${screenId}/?corporate=${selectedCorp}&organization=${selectedOrg}&year=${year}`
      );

      if (response.status === 200) {
        setReportnradio(response.data.data.screen4_q1);

        if (response.data.data.screen4_q2 == null) {
          setSelectedOptions([]);
        } else {
          setSelectedOptions(response.data.data.screen4_q2);
        }

        LoaderClose();
      } else {
        LoaderClose();
        toast.error("Oops, something went wrong", {
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
    } catch (error) {
      LoaderClose();
    } finally {
      LoaderClose();
    }
  };
  useEffect(() => {
    // if (isMounted.current) {

    //   isMounted.current = false;
    // }
    // return () => {
    //   isMounted.current = false;
    // };
    if (reportType == "Organization") {
      if (selectedOrg && year) {
        fetchBillSfour();
      }
    } else {
      if (selectedOrg && year && selectedCorp) {
        fetchBillSfour();
      }
    }
    setReportnradio("");
    setSelectedOptions([]);
  }, [selectedCorp, selectedOrg, year]);

  const options = [
    {
      label: "The sector or industry it operates in",
      value: "The sector or industry it operates in",
    },
    {
      label: "The types of products it produces or imports",
      value: "The types of products it produces or imports",
    },
    {
      label: "The locations of its activities, operations or factories",
      value: "The locations of its activities, operations or factories",
    },
    {
      label: "The types of products it sources",
      value: "The types of products it sources",
    },
    {
      label: "The raw materials or commodities used in its supply chains",
      value: "The raw materials or commodities used in its supply chains",
    },
    {
      label: "Tier one (direct) suppliers",
      value: "Tier one (direct) suppliers",
    },
    { label: "Tier two suppliers", value: "Tier two suppliers" },
    { label: "Tier three suppliers", value: "Tier three suppliers" },
    {
      label: "Suppliers further down the supply chain than tier three",
      value: "Suppliers further down the supply chain than tier three",
    },
    {
      label: "The use of outsourced, contracted or subcontracted labour",
      value: "The use of outsourced, contracted or subcontracted labour",
    },
    { label: "The use of migrant labour", value: "The use of migrant labour" },
    { label: "The use of forced labour", value: "The use of forced labour" },
    { label: "The use of child labour", value: "The use of child labour" },
    { label: "None of the above", value: "None of the above" },
  ];

  const handleCheckboxChange = (event) => {
    const value = event.target.value;
    const newSelectedOptions = event.target.checked
      ? [...selectedOptions, value]
      : selectedOptions.filter((option) => option !== value);

    setSelectedOptions(newSelectedOptions);

    // Optionally clear the error for checkboxes when at least one option is selected
    if (newSelectedOptions.length > 0 && error.checkboxes) {
      setError((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors.checkboxes;
        return newErrors;
      });
    }
  };

  const handleReportnradio = (event) => {
    setReportnradio(event.target.value);
    setError((prev) => ({ ...prev, reportradio: "" }));
  };

  const LoaderOpen = () => {
    setLoOpen(true);
  };
  const LoaderClose = () => {
    setLoOpen(false);
  };
  const stepsubmitForm = async () => {
    const stepscreenId = 5;
    const stepdata = status[4].status;
    const newStatus = stepdata === "completed" ? "completed" : "in_progress";
    try {
      const sendData = {
        organization: selectedOrg,
        corporate: selectedCorp,
        year: year,
        status: newStatus,
      };
      const response = await axiosInstance.put(
        `${process.env.BACKEND_API_URL}/canada_bill_s211/v2/reporting-for-entities/${stepscreenId}/`,
        sendData
      );
      if (response.status == "200") {
        console.log("API call susfully:");
        nextStep();
      }
    } catch (error) {
      console.error("API call failed:", error);
    }
  };
  const submitForm = async () => {
    try {
      LoaderOpen();

      const sendData = {
        data: {
          screen4_q1: reportradio,
          screen4_q2: selectedOptions,
        },
        organization: selectedOrg,
        corporate: selectedCorp,
        year: year,
        status: "completed",
      };
      const response = await axiosInstance.put(
        `${process.env.BACKEND_API_URL}/canada_bill_s211/v2/reporting-for-entities/${screenId}/`,
        sendData
      );
      if (response.status == "200") {
        toast.success("Data added successfully", {
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
        stepsubmitForm();
      } else {
        toast.error("Oops, something went wrong", {
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
    } catch (error) {
      LoaderClose();
      console.error("API call failed:", error);
      toast.error("Oops, something went wrong", {
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
  const continueToNextStep = () => {
    let newErrors = {};

    if (!reportradio) {
      newErrors.reportradio = "This field is required.";
    }
    if (reportradio === "Yes" || reportradio === "Yesone") {
      if (selectedOptions.length === 0) {
        newErrors.checkboxes = "Please select at least one option.";
      }
    }

    if (Object.keys(newErrors).length === 0) {
      setError({});
      submitForm();
    } else {
      setError(newErrors);
    }
  };

  return (
    <>
      <div className="xl:mx-4 lg:mx-4 md:mx-4 2xl:mx-4 4k:mx-4 2k:mx-4 mx-2 mt-2">
        <div className="h-[36rem] overflow-y-auto scrollable-content">
          <form className="xl:w-[80%] lg:w-[80%] 2xl:w-[80%] md:w-[80%] 2k:w-[80%] 4k:w-[80%] w-[99%] text-left">
            <div className="mb-5">
              <label
                className="block text-gray-700 text-[14px] font-[500] mb-2 ml-1"
                htmlFor="username"
              >
                6. Has the entity identified parts of its activities and supply
                chains that carry a risk of forced labour or child labour being
                used?*
              </label>
              <div className="relative mb-1">
                <div className="mb-3">
                   {" "}
                  <input
                    type="radio"
                    id="Yes"
                    name="radio"
                    value="Yes"
                    checked={reportradio === "Yes"}
                    onChange={handleReportnradio}
                  />
                   {" "}
                  <label htmlFor="Yes" className="text-[14px] text-gray-700">
                    Yes, we have identified parts of our activities and/or
                    supply chains that carry risks to the best of our knowledge
                    and will continue to identify emerging risks.
                  </label>
                  <br />
                </div>
                <div className="mb-3">
                   {" "}
                  <input
                    type="radio"
                    id="Yesone"
                    name="radio"
                    value="Yesone"
                    checked={reportradio === "Yesone"}
                    onChange={handleReportnradio}
                  />
                   {" "}
                  <label htmlFor="Yesone" className="text-[14px] text-gray-700">
                    Yes, we have started the process of identifying parts of our
                    activities and/or supply chains that carry risks, but there
                    are still gaps in our assessments.
                  </label>
                  <br />
                </div>
                <div className="mb-3">
                   {" "}
                  <input
                    type="radio"
                    id="No"
                    name="radio"
                    value="No"
                    checked={reportradio === "No"}
                    onChange={handleReportnradio}
                  />
                   {" "}
                  <label htmlFor="No" className="text-[14px] text-gray-700 ">
                    No, we have not started the process of identifying parts of
                    our activities and/or supply chains that carry risks of
                    forced labour or child labour being used.
                  </label>
                  <br />
                </div>
              </div>
              {error.reportradio && (
                <p className="text-red-500 ml-1 text-[12px] mt-1">
                  {error.reportradio}
                </p>
              )}
            </div>
            {(reportradio === "Yes" || reportradio === "Yesone") && (
              <div className="mb-5">
                <label
                  className="block text-gray-700 text-[14px] font-[500] mb-2 ml-1"
                  htmlFor="username"
                >
                  6.1 If yes, has the entity identified forced labour or child
                  labour risks related to any of the following aspects of its
                  activities and supply chains? Select all that apply *
                </label>
                <div className="grid grid-cols-1 xl:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-2 4k:grid-cols-2 2k:grid-cols-2  md:grid-cols-2">
                  {options.map((option, index) => (
                    <div key={index} className="mb-1 ml-2">
                      <label className="text-[14px] text-gray-600">
                        <input
                          type="checkbox"
                          value={option.label}
                          checked={selectedOptions.includes(option.label)}
                          onChange={handleCheckboxChange}
                          className="mr-3"
                        />
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
                {error.checkboxes && (
                  <div className="text-red-500 ml-1 text-[12px] mt-1">
                    {error.checkboxes}
                  </div>
                )}
              </div>
            )}
          </form>
        </div>
        <div className="xl:w-[80%]  lg:w-[80%]   2xl:w-[80%]   md:w-[80%]   2k:w-[80%]   4k:w-[80%]  w-full mb-5">
          <div className="float-right">
            <button
              className="px-3 py-1.5 rounded ml-2 font-semibold w-[120px] text-gray-600 text-[14px]"
              onClick={prevStep}
            >
              &lt; Previous
            </button>

            <button
              type="button"
              onClick={continueToNextStep}
              disabled={!(selectedOrg && year)}
              className={`px-3 py-1.5 font-semibold rounded ml-2 w-[80px] text-[12px] bg-blue-500 text-white ${
                reportType == "Organization"
                  ? !(selectedOrg && year)
                    ? "opacity-30 cursor-not-allowed"
                    : ""
                  : !(selectedOrg && year && selectedCorp)
                  ? "opacity-30 cursor-not-allowed"
                  : ""
              }`}
            >
              {" "}
              Next &gt;
            </button>
          </div>
        </div>
      </div>
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

export default Screenfour;
