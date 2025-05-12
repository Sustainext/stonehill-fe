"use client";

import {
  forwardRef,
  useImperativeHandle,
  useEffect,
  useState,
  useRef,
} from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../../../utils/axiosMiddleware";
import Screen1 from "./sections/section1";
import Screen2 from "./sections/section2";
import { useDispatch, useSelector } from "react-redux";
import {
  setMessage,
  setMessageimage,
  setCompanyname,
  setCeoname,
  setSignatureimage,
} from "../../../../../lib/redux/features/ESGSlice/screen1Slice";
import { Oval } from "react-loader-spinner";
const MessageFromCeo = forwardRef(({ onSubmitSuccess }, ref) => {
  const [loopen, setLoOpen] = useState(false);
  const [selectedCEOfile, setSelectedCEOFile] = useState("");
  const [selectedSignfile, setSelectedSignFile] = useState("");
  const reportid =
    typeof window !== "undefined" ? localStorage.getItem("reportid") : "";
  const orgname =
    typeof window !== "undefined" ? localStorage.getItem("reportorgname") : "";
  const apiCalledRef = useRef(false);
  const content = useSelector((state) => state.screen1Slice.message);
  const imageceo = useSelector((state) => state.screen1Slice.message_image); // Assuming imageceo is a File object
  const companyName = useSelector((state) => state.screen1Slice.company_name);
  const ceoname = useSelector((state) => state.screen1Slice.ceo_name);
  const imagesing = useSelector((state) => state.screen1Slice.signature_image); // Assuming signature image is a file too
  const dispatch = useDispatch();
  // Expose submitForm using the ref
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
    localStorage.setItem("reportorgname", companyName);
    const formData = new FormData();
    formData.append(
      "message",
      JSON.stringify({
        page: "screen_one",
        label: "1. Message from CEO",
        subLabel: "Add message from CEO",
        type: "richTextarea",
        content: content,
        field: "message",
        isSkipped: false,
      })
    );
    formData.append("message_image", imageceo); // If imageceo is a file, this will work
    formData.append(
      "ceo_name",
      JSON.stringify({
        page: "screen_one",
        label: "CEO’s Name",
        subLabel: "Add CEO's name",
        type: "input",
        content: ceoname,
        field: "ceo_name",
        isSkipped: false,
      })
    );
    formData.append("company_name", companyName);
    formData.append("signature_image", imagesing);
    formData.append(
      "signature_image_name",
      selectedSignfile ? selectedSignfile.name : ""
    );
    formData.append(
      "message_image_name",
      selectedCEOfile ? selectedCEOfile.name : ""
    );

    const url = `${process.env.BACKEND_API_URL}/esg_report/screen_one/${reportid}/`;

    try {
      const response = await axiosInstance.put(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Ensure multipart request
        },
      });

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
    dispatch(setMessage(""));
    dispatch(setMessageimage());
    dispatch(setCeoname(""));
    dispatch(setCompanyname(orgname));
    dispatch(setSignatureimage());
    const url = `${process.env.BACKEND_API_URL}/esg_report/screen_one/${reportid}/`;
    try {
      const response = await axiosInstance.get(url);
      if (response.data) {
        dispatch(setMessage(response.data.message?.content || ""));
        dispatch(setMessageimage(response.data.message_image));
        dispatch(setCompanyname(response.data.company_name));
        dispatch(setCeoname(response.data.ceo_name?.content || ""));
        dispatch(setSignatureimage(response.data.signature_image));
        setSelectedCEOFile({ name: response.data.message_image_name });
        setSelectedSignFile({ name: response.data.signature_image_name });
      } else {
        setSelectedCEOFile({ name: "" });
        setSelectedSignFile({ name: "" });
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
          1. Message from CEO
        </h3>
        <div className="flex gap-4">
          <div className="xl:w-[80%] md:w-[75%] lg:w-[80%]  2k:w-[80%] 4k:w-[80%] 2xl:w-[80%]  w-full">
            <Screen1
              orgName={orgname}
              selectedfile={selectedCEOfile}
              setSelectedFile={setSelectedCEOFile}
            />
            <Screen2
              orgName={orgname}
              selectedfile={selectedSignfile}
              setSelectedFile={setSelectedSignFile}
            />
          </div>
          <div className="p-4 border border-r-2 border-b-2 shadow-lg rounded-lg h-[500px] top-36 sticky mt-2 w-[20%] md:w-[25%] lg:w-[20%] xl:sticky xl:top-36 lg:sticky lg:top-36  md:fixed 
  md:top-[19rem]
  md:right-4  hidden xl:block md:block lg:block 2k:block 4k:block 2xl:block">
            <p className="text-[11px] text-[#727272] mb-2 uppercase">
              1. Message from CEO
            </p>
            <p className="text-[12px] text-blue-400 mb-2">
              1. Message from CEO
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

export default MessageFromCeo;
