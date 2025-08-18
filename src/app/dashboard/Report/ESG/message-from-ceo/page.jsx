"use client";

import {
  createRef,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useState,
  useRef,
} from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../../../utils/axiosMiddleware";
import Section1 from "./sections/section1";
import Section2 from "./sections/section2";
import { useDispatch, useSelector } from "react-redux";
import {
  setMessage,
  setMessageimage,
  setCompanyname,
  setCeoname,
  setSignatureimage,
} from "../../../../../lib/redux/features/ESGSlice/screen1Slice";
import { Oval } from "react-loader-spinner";

const MessageFromCeo = forwardRef(({ 
  onSubmitSuccess, 
  subsections = [], 
  sectionOrder = 1,
  sectionId,
  sectionTitle,
}, ref) => {

  const CombinedSection = ({ 
    orgName, 
    sectionNumber, 
    sectionOrder, 
    selectedCEOfile, 
    setSelectedCEOFile, 
    selectedSignfile, 
    setSelectedSignFile 
  }) => {
    return (
      <>
        <Section1
          orgName={orgName}
          sectionNumber={sectionNumber}
          sectionOrder={sectionOrder}
          selectedfile={selectedCEOfile}
          setSelectedFile={setSelectedCEOFile}
        />
        <Section2
          orgName={orgName}
          sectionNumber={sectionNumber}
          sectionOrder={sectionOrder}
          selectedfile={selectedSignfile}
          setSelectedFile={setSelectedSignFile}
        />
      </>
    );
  };

  const [loopen, setLoOpen] = useState(false);
  const [selectedCEOfile, setSelectedCEOFile] = useState("");
  const [selectedSignfile, setSelectedSignFile] = useState("");
  const [activeSection, setActiveSection] = useState("");
  
  // Dynamic refs based on subsections
  const sectionRefs = useRef({});
  
  // const reportid =
  //   typeof window !== "undefined" ? localStorage.getItem("reportid") : "";
  // const reportType = 
  //   typeof window !== "undefined" ? localStorage.getItem("reportType") : "";
  // const orgname =
  //   typeof window !== "undefined" ? localStorage.getItem("reportorgname") : "";

const [reportid, setReportid] = useState("");
const [reportType, setReportType] = useState("");
const [orgname, setOrgname] = useState("");

// Update after mount on client only
useEffect(() => {
  setReportid(localStorage.getItem("reportid") || "");
  setReportType(localStorage.getItem("reportType") || "");
  setOrgname(localStorage.getItem("reportorgname") || "");
}, []);
  
  const apiCalledRef = useRef(false);
  
  const content = useSelector((state) => state.screen1Slice.message);
  const imageceo = useSelector((state) => state.screen1Slice.message_image);
  const companyName = useSelector((state) => state.screen1Slice.company_name);
  const ceoname = useSelector((state) => state.screen1Slice.ceo_name);
  const imagesing = useSelector((state) => state.screen1Slice.signature_image);
  const dispatch = useDispatch();
  const [initialData, setInitialData] = useState({});

  // Map subsection IDs to their corresponding components and data
  const subsectionMapping = {
    chief_executive_message: {
      component: CombinedSection,
      title: "Message from CEO",
      subSections: []
    },
    // board_message: {
    //   component: Section2,
    //   title: "Board Message",
    //   subSections: []
    // }
  };

  // For non-custom reports, show all subsections
  const getSubsectionsToShow = () => {
    if (reportType === 'Custom ESG Report') {
      // Use provided subsections for custom reports
      return Array.isArray(subsections) ? subsections : [];
    } else {
      // Show all available subsections for non-custom reports
      return ['chief_executive_message'];
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

  // Expose submitForm using the ref
  useImperativeHandle(ref, () => ({
    submitForm,
  }));

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

  const LoaderOpen = () => {
    setLoOpen(true);
  };

  const LoaderClose = () => {
    setLoOpen(false);
  };

  const currentData = {
    message: content,
    ceo_name: ceoname,
    company_name: companyName,
    message_image_name: selectedCEOfile?.name || "",
    signature_image_name: selectedSignfile?.name || "",
  };

  const hasChanges = (initialData, currentData) => {
    if (!initialData || !currentData) return false;
  
    const isTextChanged =
      initialData.message !== currentData.message ||
      initialData.ceo_name !== currentData.ceo_name ||
      initialData.company_name !== currentData.company_name ||
      initialData.message_image_name !== currentData.message_image_name||
      initialData.signature_image_name !== currentData.signature_image_name;
  
    return isTextChanged
  };

  const submitForm = async (type) => {
    LoaderOpen();
    if (!hasChanges(initialData, currentData)) {
      LoaderClose();
      return false;
    }
    localStorage.setItem("reportorgname", companyName);
    
    const formData = new FormData();
    
    // Only submit data for selected subsections
    if (subsectionsToShow.includes('chief_executive_message')) {
      formData.append(
        "message",
        JSON.stringify({
          page: "screen_one",
          label: `${sectionOrder}. Message from CEO`,
          subLabel: "Add message from CEO",
          type: "richTextarea",
          content: content,
          field: "message",
          isSkipped: false,
        })
      );
      formData.append("message_image", imageceo);
      formData.append(
        "message_image_name",
        selectedCEOfile ? selectedCEOfile.name : ""
      );
      formData.append(
        "ceo_name",
        JSON.stringify({
          page: "screen_one",
          label: `${sectionOrder}.1 CEO's Name`,
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

    const url = `${process.env.BACKEND_API_URL}/esg_report/screen_one/${reportid}/`;

    try {
      const response = await axiosInstance.put(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
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
          onSubmitSuccess(true);
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
      return false;
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
        const flatData = {
          message: response.data.message?.content || "",
          ceo_name: response.data.ceo_name?.content || "",
          company_name: response.data.company_name || "",
          message_image_name: response.data.message_image_name || "",
          signature_image_name: response.data.signature_image_name || "",
        };
        setInitialData(flatData);
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
    if (!apiCalledRef.current && reportid) {
      apiCalledRef.current = true;
      loadFormData();
    }
  }, [reportid]);

  // Create refs for each selected subsection
  useEffect(() => {
    selectedSubsections.forEach(section => {
      if (!sectionRefs.current[section.id]) {
        sectionRefs.current[section.id] = createRef();
      }
    });
  }, [selectedSubsections]);

  // const renderSection = (section) => {
  //   const SectionComponent = section.component;
  //   const ref = sectionRefs.current[section.id] || createRef();
  //   sectionRefs.current[section.id] = ref;

  //   const commonProps = {
  //     orgName: orgname,
  //     sectionNumber: section.sectionNumber,
  //     sectionOrder
  //   };

  //   switch (section.id) {
  //     case 'message':
  //       return (
  //         <div key={section.id} ref={ref}>
  //           <SectionComponent 
  //             {...commonProps}
  //             selectedfile={selectedCEOfile}
  //             setSelectedFile={setSelectedCEOFile}
  //           />
  //           <SectionComponent 
  //             {...commonProps}
  //             selectedfile={selectedSignfile}
  //             setSelectedFile={setSelectedSignFile}
  //           />
  //         </div>
  //       );
  //     default:
  //       return null;
  //   }
  // };

  const renderSection = (section) => {
    const SectionComponent = section.component;
    const ref = sectionRefs.current[section.id] || createRef();
    sectionRefs.current[section.id] = ref;
  
    return (
      <div key={section.id} ref={ref}>
        <SectionComponent
          orgName={orgname}
          sectionNumber={section.sectionNumber}
          sectionOrder={sectionOrder}
          selectedCEOfile={selectedCEOfile}
          setSelectedCEOFile={setSelectedCEOFile}
          selectedSignfile={selectedSignfile}
          setSelectedSignFile={setSelectedSignFile}
        />
      </div>
    );
  };
  
  //console.log("Final check - selectedSubsections:", selectedSubsections);

  // Don't render anything if no subsections are selected (for custom reports)
  if (reportType === 'Custom ESG Report' && selectedSubsections.length === 0) {
    return (
      <div className="mx-2 p-2">
        <div>
          <h3 className="text-[22px] text-[#344054] mb-4 text-left font-semibold">
            {sectionOrder}. Message from CEO
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
            {sectionOrder}. Message from CEO
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
                {sectionOrder}. Message from CEO
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

MessageFromCeo.displayName = 'MessageFromCeo';

export default MessageFromCeo;