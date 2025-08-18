"use client";
import {
  forwardRef,
  createRef,
  useImperativeHandle,
  useState,
  useRef,
  useEffect,
} from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
import { Oval } from "react-loader-spinner";
import { setMission } from "../../../../../lib/redux/features/ESGSlice/screen3Slice";

const MissionVission = forwardRef(({
  onSubmitSuccess, 
  subsections = [], 
  sectionOrder = 3,
  sectionId,
  sectionTitle,
  hasChanges 

 }, ref) => {
  // const orgName =
  //   typeof window !== "undefined" ? localStorage.getItem("reportorgname") : "";
  // const reportid =
  //   typeof window !== "undefined" ? localStorage.getItem("reportid") : "";
  //   const reportType = 
  //   typeof window !== "undefined" ? localStorage.getItem("reportType") : "";
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
  const mission = useSelector((state) => state.screen3Slice.mission);
  const dispatch = useDispatch();
  const [activeSection, setActiveSection] = useState("");
  const [initialData, setInitialData] = useState({});

  const subsectionMapping = {
    mission_vision: {
      component: Section1,
      title: "Mission, Vision, and Values",
      subSections: []
    },
  };

  // For non-custom reports, show all subsections
  const getSubsectionsToShow = () => {
    if (reportType === 'Custom ESG Report') {
      // Use provided subsections for custom reports
      return Array.isArray(subsections) ? subsections : [];
    } else {
      // Show all available subsections for non-custom reports
      return ['mission_vision'];
    }
  };

  const subsectionsToShow = getSubsectionsToShow();

  // Filter and organize selected subsections
  const getSelectedSubsections = () => {
    //console.log("Processing subsections:", subsectionsToShow);
    
    if (!subsectionsToShow || subsectionsToShow.length === 0) {
      //console.log("No subsections found");
      return [];
    }
    
    const result = subsectionsToShow
      .filter(subId => {
        const exists = subsectionMapping[subId];
        //console.log(`Subsection ${subId} exists in mapping:`, !!exists);
        return exists;
      })
      .map((subId, index) => {
        const mapped = {
          id: subId,
          ...subsectionMapping[subId],
          order: index + 1,
          sectionNumber: `${sectionOrder}.${index + 1}`
        };
        //console.log(`Mapped subsection:`, mapped);
        return mapped;
      });
    
    //console.log("Final selected subsections:", result);
    return result;
  };

  const selectedSubsections = getSelectedSubsections();

  // Set initial active section
  useEffect(() => {
    if (selectedSubsections.length > 0 && !activeSection) {
      setActiveSection(selectedSubsections[0].id);
    }
  }, [selectedSubsections, activeSection]);

  const sectionRefs = useRef({});

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    
    // Find the dashboard's main scroll container
    const scrollContainer = document.getElementById('main-scroll-container');
    
    // First try using refs
    const sectionRef = sectionRefs.current[sectionId];
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
          top: elementRect.top + window.pageYOffset - 250,
          behavior: "smooth",
        });
      }
      return;
    }

    // Fallback: try to find element by ID
    const element = document.getElementById(sectionId);
    if (element) {
      const containerRect = scrollContainer?.getBoundingClientRect() || { top: 0 };
      const elementRect = element.getBoundingClientRect();
      const scrollTop = elementRect.top - containerRect.top + (scrollContainer?.scrollTop || 0) - 100;
      
      if (scrollContainer) {
        scrollContainer.scrollTo({
          top: scrollTop,
          behavior: "smooth",
        });
      } else {
        // Fallback to window scroll if container not found
        window.scrollTo({
          top: elementRect.top + window.pageYOffset - 250,
          behavior: "smooth",
        });
      }
    }
  };

  useImperativeHandle(ref, () => ({
    submitForm,
  }));

  const LoaderOpen = () => {
    setLoOpen(true);
  };

  const LoaderClose = () => {
    setLoOpen(false);
  };

  const currentData={
    mission
  }
  const submitForm = async (type) => {
    LoaderOpen();
    if (!hasChanges(initialData, currentData)) {
      LoaderClose();
      return false;
    }
    let data={}
    if(subsectionsToShow.includes('mission_vision')){
      
        data.mission={
          page: "screen_three",
          label: `${sectionOrder}. Mission, Vision, and Values`,
          subLabel:
            "Add statement about Mission, Vision and Values of the company",
          type: "richTextarea",
          content: mission,
          field: "mission",
          isSkipped: false,
        }
      
    }
     else{
          LoaderClose();
          toast.error("No,subsection selected", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          return false;
        }
    

    const url = `${process.env.BACKEND_API_URL}/esg_report/screen_three/${reportid}/`;
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
    dispatch(setMission(""));
    const url = `${process.env.BACKEND_API_URL}/esg_report/screen_three/${reportid}/`;
    try {
      const response = await axiosInstance.get(url);
      if (response.data) {
        const flatData = {};
        Object.keys(response.data).forEach((key) => {
          flatData[key] = response.data[key]?.content || "";
        });
      
        setInitialData(flatData);
        dispatch(setMission(response.data.mission?.content || ""));
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

   useEffect(() => {
      selectedSubsections.forEach(section => {
        if (!sectionRefs.current[section.id]) {
          sectionRefs.current[section.id] = createRef();
        }
      });
    }, [selectedSubsections]);

     const renderSection = (section) => {
        const SectionComponent = section.component;
        const ref = sectionRefs.current[section.id] || createRef();
        sectionRefs.current[section.id] = ref;
      
        return (
          <div key={section.id} ref={ref}>
            <SectionComponent orgName={orgName} />
          </div>
        );
      };

      if (reportType === 'Custom ESG Report' && selectedSubsections.length === 0) {
        return (
          <div className="mx-2 p-2">
            <div>
              <h3 className="text-[22px] text-[#344054] mb-4 text-left font-semibold">
                {sectionOrder}. Mission, Vision, and Values
              </h3>
            </div>
            <div className="text-center py-8">
              <p className="text-gray-500">No subsections selected for this section.</p>
            </div>
          </div>
        );
      }

  return (
    <>
    <div className="mx-2 p-2">
      <div>
        <h3 className="text-[22px] text-[#344054] mb-4 text-left font-semibold">
          {sectionOrder}.Mission, Vision, and Values
        </h3>
      </div>
      <div className="flex gap-4">
        <div className="xl:w-[80%] md:w-[75%] lg:w-[80%] 2k:w-[80%] 4k:w-[80%] 2xl:w-[80%] w-full">
          {selectedSubsections.map(section => renderSection(section))}
        </div>

        {/* Page sidebar - only show if there are subsections */}
        {selectedSubsections.length > 0 && (
          <div className="p-4 border border-r-2 border-b-2 shadow-lg rounded-lg h-[500px] top-36 sticky mt-2 w-[20%] md:w-[25%] lg:w-[20%] xl:sticky xl:top-36 lg:sticky lg:top-36 md:fixed md:top-[19rem] md:right-4 hidden xl:block md:block lg:block 2k:block 4k:block 2xl:block z-10 bg-white">
            <p className="text-[11px] text-[#727272] mb-2 uppercase">
              {sectionOrder}. Mission, Vision, and Values
            </p>
            
            {selectedSubsections.map((section, index) => (
              <p
                key={section.id}
                className={`text-[12px] mb-2 cursor-pointer ${
                  activeSection === section.id ? "text-blue-400" : ""
                }`}
                onClick={() => scrollToSection(section.id)}
              >
                {section.sectionNumber} {section.title}
              </p>
            ))}
          </div>
        )}
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
MissionVission.displayName = 'MissionVission';

export default MissionVission;
