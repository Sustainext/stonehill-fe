"use client";
import {
  forwardRef,
  useImperativeHandle,
  useState,
  useRef,
  useEffect,
} from "react";
import Section1 from "./sections/section1";
import Section2 from "./sections/section2";
import axiosInstance, { patch } from "../../../../utils/axiosMiddleware";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { Oval } from "react-loader-spinner";
import { setdescription } from "../../../../../lib/redux/features/ESGSlice/screen8Slice";

const ReferenceMateriality = forwardRef(({ onSubmitSuccess,hasChanges }, ref) => {
  // const orgName =
  //   typeof window !== "undefined" ? localStorage.getItem("reportorgname") : "";
  // const reportid =
  //   typeof window !== "undefined" ? localStorage.getItem("reportid") : "";
  const [reportid, setReportid] = useState("");
  const [reportType, setReportType] = useState("");
  const [orgName, setOrgname] = useState("");
  
  // Update after mount on client only
  useEffect(() => {
    setReportid(localStorage.getItem("reportid") || "");
    setReportType(localStorage.getItem("reportType") || "");
    setOrgname(localStorage.getItem("reportorgname") || "");
  }, []);
  
  const apiCalledRef = useRef(false);
  const [loopen, setLoOpen] = useState(false);
  const [initialData, setInitialData] = useState({});
  const [data, setData] = useState("");
  const description = useSelector((state) => state.screen8Slice.description);
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
  const currentData = {
    statement: description,
  };
  const submitForm = async (type) => {
    LoaderOpen();
    if (!hasChanges(initialData, currentData)) {
      LoaderClose();
      return false;
    }
    const data = {
      statement: {
        page: "screen_eight",
        label: "8. Materiality",
        subLabel: "Add statement about company’s materiality assessment",
        type: "textarea",
        content: description,
        field: "statement",
        isSkipped: false,
      },
    };

    const url = `${process.env.BACKEND_API_URL}/esg_report/screen_eight/${reportid}/`;
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
    const url = `${process.env.BACKEND_API_URL}/esg_report/screen_eight/${reportid}/`;
    try {
      const response = await axiosInstance.get(url);
      if (response.data) {
        const flatData = {};
  Object.keys(response.data).forEach((key) => {
    flatData[key] = response.data[key]?.content || "";
  });

  setInitialData(flatData);
        setData(response.data);
        dispatch(setdescription(response.data.statement?.content || ""));
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

  const [activeSection, setActiveSection] = useState("section8_1");

  const section8_1Ref = useRef(null);
  const section8_1_1Ref = useRef(null);
  const section8_1_2Ref = useRef(null);
  const section8_1_3Ref = useRef(null);
  const section8_1_4Ref = useRef(null);

  const scrollToSection = (sectionRef, sectionId) => {
    setActiveSection(sectionId);

    // Find the dashboard's main scroll container
    const scrollContainer = document.getElementById('main-scroll-container');
    
    if (sectionRef?.current) {
      const containerRect = scrollContainer?.getBoundingClientRect() || { top: 0 };
      const elementRect = sectionRef.current.getBoundingClientRect();
      const scrollTop = elementRect.top - containerRect.top + (scrollContainer?.scrollTop || 0) - 100;
      
      if (scrollContainer) {
        scrollContainer.scrollTo({
          top: scrollTop,
          behavior: "smooth",
        });
      } else {
        // Fallback to window scroll if container not found
        window.scrollTo({
          top: elementRect.top + window.pageYOffset - 100,
          behavior: "smooth",
        });
      }
    }
  };

  // useEffect(() => {
  //   const observerCallback = (entries) => {
  //     entries.forEach((entry) => {
  //       if (entry.isIntersecting) {
  //         setActiveSection(entry.target.id); // Update the active section based on its id
  //       }
  //     });
  //   };

  //   const observerOptions = {
  //     root: null, // Use the viewport as the root
  //     rootMargin: '-100px 0px -50% 0px', // Adjust margin to trigger at a different point
  //     threshold: 0.2, // Trigger when 20% of the section is visible
  //   };

  //   const observer = new IntersectionObserver(observerCallback, observerOptions);

  //   // Attach observer to each section
  //   if (section8_1Ref.current) observer.observe(section8_1Ref.current);
  //   if (section8_1_1Ref.current) observer.observe(section8_1_1Ref.current);
  //   if (section8_1_2Ref.current) observer.observe(section8_1_2Ref.current);
  //   if (section8_1_3Ref.current) observer.observe(section8_1_3Ref.current);
  //   if (section8_1_4Ref.current) observer.observe(section8_1_4Ref.current);

  //   return () => {
  //     // Cleanup observer on unmount
  //     observer.disconnect();
  //   };
  // }, []);

  return (
    <>
      <div className="mx-2 p-2">
        <h3 className="text-[22px] text-[#344054] mb-4 text-left font-semibold">
          8. Materiality
        </h3>
        <div className="flex gap-4">
          <div className="xl:w-[80%] md:w-[75%] lg:w-[80%]  2k:w-[80%] 4k:w-[80%] 2xl:w-[80%]  w-full">
            <Section1 section8_1Ref={section8_1Ref} orgName={orgName} />
            <Section2
              section8_1_1Ref={section8_1_1Ref}
              orgName={orgName}
              data={data}
            />
          </div>
          {/* page sidebar */}

          <div className="p-4 border border-r-2 border-b-2 shadow-lg rounded-lg h-[500px] top-20 sticky mt-2 w-[20%] md:w-[25%] lg:w-[20%] xl:sticky xl:top-36 lg:sticky lg:top-36  md:fixed 
  md:top-[19rem]
  md:right-4  hidden xl:block md:block lg:block 2k:block 4k:block 2xl:block">
            <p className="text-[11px] text-[#727272] mb-2 uppercase">
              8. Materiality
            </p>
            <p
              className={`text-[12px] mb-2 cursor-pointer ${
                activeSection === "section8_1" ? "text-blue-400" : ""
              }`}
              onClick={() => scrollToSection(section8_1Ref, "section8_1")}
            >
              8.1. Materiality Assessment 
            </p>
            <p
              className={`text-[11px] mb-2 ml-2 cursor-pointer ${
                activeSection === "section8_1_1" ? "text-blue-400" : ""
              }`}
              onClick={() => scrollToSection(section8_1_1Ref, "section8_1_1")}
            >
              8.1.1. List of material topics 
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

export default ReferenceMateriality;