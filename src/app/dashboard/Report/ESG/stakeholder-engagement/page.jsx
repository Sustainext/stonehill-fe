"use client";
import {
  forwardRef,
  useImperativeHandle,
  useState,
  useRef,
  useEffect,
} from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Oval } from "react-loader-spinner";
import dynamic from "next/dynamic";
import {
  MdDownload,
  MdDelete,
  MdKeyboardArrowDown,
  MdFileDownload,
} from "react-icons/md";
import axiosInstance, { patch } from "../../../../utils/axiosMiddleware";
import Link from "next/link";
import { GlobalState } from "@/Context/page";
import Section1 from "./sections/section1";
import { useDispatch, useSelector } from "react-redux";
import { setdescription } from "../../../../../lib/redux/features/ESGSlice/screen6Slice";

const StakeholderEngagement = forwardRef(({ onSubmitSuccess }, ref) => {
  const orgName =
    typeof window !== "undefined" ? localStorage.getItem("reportorgname") : "";
  const reportid =
    typeof window !== "undefined" ? localStorage.getItem("reportid") : "";
  const apiCalledRef = useRef(false);
  const [loopen, setLoOpen] = useState(false);
  const [data, setData] = useState("");
  const description = useSelector((state) => state.screen6Slice.description);
  const dispatch = useDispatch();
  useImperativeHandle(ref, () => ({
    submitForm,
  }));

  const LoaderOpen = () => {
    setLoOpen(true);
  };

  const LoaderClose = () => {
    setLoOpen(false);
  };
  const submitForm = async (type) => {
    LoaderOpen();
    const data = {
      description: {
        page: "screen_six",
        label: "6. Stakeholder Engagement",
        subLabel: "Add statement about stakeholder engagement",
        type: "textarea",
        content: description,
        field: "description",
        isSkipped: false,
      },
    };

    const url = `${process.env.BACKEND_API_URL}/esg_report/screen_six/${reportid}/`;
    try {
      const response = await axiosInstance.put(url, data);

      if (response.status === 200) {
        if (type == "next") {
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
        }

        if (onSubmitSuccess) {
          onSubmitSuccess(true); // Notify the parent of successful submission
        }
        LoaderClose();
        return true;
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
        return false;
      }
    } catch (error) {
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
      return false; // Indicate failure
    }
  };

  const loadFormData = async () => {
    LoaderOpen();
    dispatch(setdescription(""));
    const url = `${process.env.BACKEND_API_URL}/esg_report/screen_six/${reportid}/`;
    try {
      const response = await axiosInstance.get(url);
      if (response.data) {
        setData(response.data);
        dispatch(setdescription(response.data.description?.content || ""));
      }

      LoaderClose();
    } catch (error) {
      console.error("API call failed:", error);
      LoaderClose();
    }
  };

  useEffect(() => {
    // Ensure API is only called once
    if (!apiCalledRef.current && reportid) {
      apiCalledRef.current = true; // Set the flag to true to prevent future calls
      loadFormData(); // Call the API only once
    }
  }, [reportid]);

  return (
    <>
      <div className="mx-2 p-2">
        <h3 className="text-[22px] text-[#344054] mb-4 text-left font-semibold">
          6. Stakeholder Engagement 
        </h3>
        <div className="flex gap-4">
          <div className="xl:w-[80%] md:w-[80%] lg:w-[80%]  2k:w-[80%] 4k:w-[80%] 2xl:w-[80%]  w-full">
            <Section1 orgName={orgName} data={data} />
          </div>
          {/* page sidebar */}
          <div className="p-4 border border-r-2 border-b-2 shadow-lg rounded-lg h-[500px] top-36 sticky mt-2 w-[20%] hidden xl:block md:block lg:block 2k:block 4k:block 2xl:block">
            <p className="text-[11px] text-[#727272] mb-2 uppercase">
              6. Stakeholder Engagement 
            </p>
            <p className="text-[12px] text-blue-400 mb-2">
              6.1 Approach to stakeholder engagement. 
            </p>
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
});

export default StakeholderEngagement;
