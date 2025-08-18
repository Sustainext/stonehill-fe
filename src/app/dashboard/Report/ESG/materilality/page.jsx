"use client";
import {
  forwardRef,
  createRef,
  useImperativeHandle,
  useState,
  useRef,
  useEffect,
} from "react";
import Section1 from "./sections/section1";
import Section2 from "./sections/section2";
import Section3 from "./sections/section3";
import Section4 from "./sections/section4";
import Section5 from "./sections/section5";
import axiosInstance, { patch } from "../../../../utils/axiosMiddleware";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { Oval } from "react-loader-spinner";
import { setdescription } from "../../../../../lib/redux/features/ESGSlice/screen8Slice";

const Materiality = forwardRef(({
  onSubmitSuccess,
  subsections = [],
  sectionOrder = 8,
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
  const [initialData, setInitialData] = useState({});

  const [data, setData] = useState("");
  const description = useSelector((state) => state.screen8Slice.description);
  const dispatch = useDispatch();
  const [activeSection, setActiveSection] = useState("materiality_assessment");

  const groupedSubsections = [
      {
        groupId: "materiality_assessment",
        title: "Materiality Assessment",
        children: [ 
          { 
          id: 'list_of_material_topic', 
        },
        { 
          id: 'topic_changes', 
        },
        { 
          id: 'materiality_process', 
        },
        { 
          id: 'management_of_material_topic', 
        }
      ],
      },
    ];
  
    const subsectionMapping = {
      materiality_assessment: {
        component: Section1,
        title: "Materiality Assessment",
        subSections: [],
      },
      list_of_material_topic: {
        component: Section2,
        title: "List of material topics",
        // subTitle: "Restatement of information",
        subSections: [],
      },
      topic_changes: {
        component: Section3,
        title: "Changes in the list of material topics",
        subSections: [],
      },
      materiality_process: {
        component: Section4,
        title: "Materiality assessment – Process",
        subSections: [],
      },
      management_of_material_topic: {
        component: Section5,
        title: "Management of material topic",
        subSections: [],
      },
    };
    const getSubsectionsToShow = () => {
      if (reportType === "Custom ESG Report") {
        const userSelected = Array.isArray(subsections) ? subsections : [];
  
        // Get default order
        const defaultOrder = [
          "materiality_assessment",
          "list_of_material_topic",
          "topic_changes",
          "materiality_process",
          "management_of_material_topic"
        ];
  
        // Return sorted list based on fixed order
        return defaultOrder.filter((id) => userSelected.includes(id));
      } else {
        return [
          "materiality_assessment",
          "list_of_material_topic",
          "topic_changes",
          "materiality_process",
          "management_of_material_topic"
        ];
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
        .filter((subId) => {
          const exists = subsectionMapping[subId];
          //console.log(`Subsection ${subId} exists in mapping:`, !!exists);
          return exists;
        })
        .map((subId, index) => {
          const mapped = {
            id: subId,
            ...subsectionMapping[subId],
            order: index + 1,
            sectionNumber: `${sectionOrder}.${index + 1}`,
          };
          //console.log(`Mapped subsection:`, mapped);
          return mapped;
        });
  
      //console.log("Final selected subsections:", result);
      return result;
    };
    const selectedSubsections = getSelectedSubsections();
  
    const getDynamicSectionMap = () => {
      let groupIndex = 1;
      const dynamicMap = [];
  
      groupedSubsections.forEach((group) => {
        if (group.children) {
          const visibleChildren = group.children.filter((child) =>
            selectedSubsections.some((s) => s.id === child.id)
          );
  
          if (visibleChildren.length === 0) return;
  
          let childIndex = 1;
          visibleChildren.forEach((child) => {
            dynamicMap.push({
              id: child.id,
              sectionNumber: `${sectionOrder}.${groupIndex}.${childIndex++}`,
              groupTitle: `${sectionOrder}.${groupIndex} ${group.title}`,
            });
          });
  
          groupIndex++;
        } else {
          const isVisible = selectedSubsections.some((s) => s.id === group.id);
          if (!isVisible) return;
  
          dynamicMap.push({
            id: group.id,
            sectionNumber: `${sectionOrder}.${groupIndex++}`,
          });
        }
      });
  
      return dynamicMap;
    };
  
    const numberedSubsections = getDynamicSectionMap();
  
    
    // Set initial active section
    useEffect(() => {
      if (selectedSubsections.length > 0 && !activeSection) {
        setActiveSection(selectedSubsections[0].id);
      }
    }, [selectedSubsections, activeSection]);
  
   
  
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
    const sectionRefs = useRef({});
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
    const data={};
    if(subsectionsToShow.includes("materiality_assessment")){
      data.statement={
        page: "screen_eight",
          label: `${sectionOrder}. Materiality`,
          subLabel: "Add statement about company’s materiality assessment",
          type: "textarea",
          content: description,
          field: "statement",
          isSkipped: false,
      }
    }
    else{
      return true
    }
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

   useEffect(() => {
          selectedSubsections.forEach((section) => {
            if (!sectionRefs.current[section.id]) {
              sectionRefs.current[section.id] = createRef();
            }
          });
        }, [selectedSubsections]);

  

   const renderSection = (section) => {
          const SectionComponent = subsectionMapping[section.id]?.component;
          const ref = sectionRefs.current[section.id] || createRef();
          sectionRefs.current[section.id] = ref;
    
          const commonProps = {
            orgName,
            data,
            sectionNumber: section.sectionNumber,
            sectionOrder,
          };
    
          if (!SectionComponent) return null;
    
          return (
            <div key={section.id} ref={ref}>
              {section.groupTitle && (
                <div className="mb-2">
                  {/* <h3 className="text-[17px] text-[#344054] mb-4 text-left font-semibold">
                  {section.groupTitle}
                </h3> */}
                </div>
              )}
              <SectionComponent {...commonProps} />
            </div>
          );
        };
  
  
        if (
          reportType === "Custom ESG Report" &&
          selectedSubsections.length === 0
        ) {
          return (
            <div className="mx-2 p-2">
              <div>
                <h3 className="text-[22px] text-[#344054] mb-4 text-left font-semibold">
                  {sectionOrder}. About the company and operations
                </h3>
              </div>
              <div className="text-center py-8">
                <p className="text-gray-500">
                  No subsections selected for this section.
                </p>
              </div>
            </div>
          );
        }

  

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

  // return (
  //   <>
  //     <div className="mx-2 p-2">
  //       <h3 className="text-[22px] text-[#344054] mb-4 text-left font-semibold">
  //         8. Materiality
  //       </h3>
  //       <div className="flex gap-4">
  //         <div className="xl:w-[80%] md:w-[75%] lg:w-[80%]  2k:w-[80%] 4k:w-[80%] 2xl:w-[80%]  w-full">
  //           <Section1 section8_1Ref={section8_1Ref} orgName={orgName} />
  //           <Section2
  //             section8_1_1Ref={section8_1_1Ref}
  //             orgName={orgName}
  //             data={data}
  //           />
  //           <Section3
  //             section8_1_2Ref={section8_1_2Ref}
  //             orgName={orgName}
  //             data={data}
  //           />
  //           <Section4
  //             section8_1_3Ref={section8_1_3Ref}
  //             orgName={orgName}
  //             data={data}
  //           />
  //           <Section5
  //             section8_1_4Ref={section8_1_4Ref}
  //             orgName={orgName}
  //             data={data}
  //           />
  //         </div>
  //         {/* page sidebar */}

  //         <div className="p-4 border border-r-2 border-b-2 shadow-lg rounded-lg h-[500px] top-20 sticky mt-2 w-[20%] md:w-[25%] lg:w-[20%] xl:sticky xl:top-36 lg:sticky lg:top-36  md:fixed 
  // md:top-[19rem]
  // md:right-4  hidden xl:block md:block lg:block 2k:block 4k:block 2xl:block">
  //           <p className="text-[11px] text-[#727272] mb-2 uppercase">
  //             8. Materiality
  //           </p>
  //           <p
  //             className={`text-[12px] mb-2 cursor-pointer ${
  //               activeSection === "section8_1" ? "text-blue-400" : ""
  //             }`}
  //             onClick={() => scrollToSection(section8_1Ref, "section8_1")}
  //           >
  //             8.1. Materiality Assessment 
  //           </p>
  //           <p
  //             className={`text-[11px] mb-2 ml-2 cursor-pointer ${
  //               activeSection === "section8_1_1" ? "text-blue-400" : ""
  //             }`}
  //             onClick={() => scrollToSection(section8_1_1Ref, "section8_1_1")}
  //           >
  //             8.1.1. List of material topics 
  //           </p>
  //           <p
  //             className={`text-[11px] mb-2 ml-2 cursor-pointer ${
  //               activeSection === "section8_1_2" ? "text-blue-400" : ""
  //             }`}
  //             onClick={() => scrollToSection(section8_1_2Ref, "section8_1_2")}
  //           >
  //             8.1.2. Changes in the list of material topics 
  //           </p>
  //           <p
  //             className={`text-[11px] mb-2 ml-2 cursor-pointer ${
  //               activeSection === "section8_1_3" ? "text-blue-400" : ""
  //             }`}
  //             onClick={() => scrollToSection(section8_1_3Ref, "section8_1_3")}
  //           >
  //             8.1.3. Materiality assessment – Process 
  //           </p>
  //           <p
  //             className={`text-[11px] mb-2 ml-2 cursor-pointer ${
  //               activeSection === "section8_1_4" ? "text-blue-400" : ""
  //             }`}
  //             onClick={() => scrollToSection(section8_1_4Ref, "section8_1_4")}
  //           >
  //             8.1.4. Management of material topic
  //           </p>
  //         </div>
  //       </div>
  //     </div>
  //     {loopen && (
  //       <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
  //         <Oval
  //           height={50}
  //           width={50}
  //           color="#00BFFF"
  //           secondaryColor="#f3f3f3"
  //           strokeWidth={2}
  //           strokeWidthSecondary={2}
  //         />
  //       </div>
  //     )}
  //   </>
  // );

   return (
      <>
        <div className="mx-2 p-2">
          <div>
            <h3 className="text-[22px] text-[#344054] mb-4 text-left font-semibold">
              {sectionOrder}. Materiality
            </h3>
          </div>
          <div className="flex gap-4">
            <div className="xl:w-[80%] md:w-[75%] lg:w-[80%] 2k:w-[80%] 4k:w-[80%] 2xl:w-[80%] w-full">
              {/* {selectedSubsections.map(section => renderSection(section))} */}
              {subsectionsToShow.includes("materiality_assessment") && (
                  <div ref={sectionRefs.current["materiality_assessment"] || createRef()}>
                    <Section1
                      orgName={orgName}
                      data={data}
                      sectionOrder={sectionOrder}
                      sectionNumber={null} // Not numbered
                    />
                  </div>
                )}
              {numberedSubsections.map((section) => renderSection(section))}
            </div>
  
            {/* Page sidebar - only show if there are subsections */}
            {selectedSubsections.length > 0 && (
              <div className="p-4 border border-r-2 border-b-2 shadow-lg rounded-lg h-[500px] top-36 sticky mt-2 w-[20%] md:w-[25%] lg:w-[20%] xl:sticky xl:top-36 lg:sticky lg:top-36 md:fixed md:top-[19rem] md:right-4 hidden xl:block md:block lg:block 2k:block 4k:block 2xl:block">
                <p className="text-[11px] text-[#727272] mb-2 uppercase">
                  {sectionOrder}. Materiality 
                </p>
  
                {(() => {
                  let groupIndex = 1;
  
                  const groupedSidebar = [
                    {
                      groupId: "materiality_assessment",
                      title: "Materiality Assessment",
                      children: [
                        { 
                          id: 'list_of_material_topic', 
                          label: 'List of material topics'
                        },
                        { 
                            id: 'topic_changes', 
                            label: 'Changes in the list of material topics',
                          },
                          { 
                            id: 'materiality_process', 
                            label: 'Materiality assessment – Process',
                          },
                          { 
                            id: 'management_of_material_topic', 
                            label: 'Management of material topic',
                          },
                      ],
                    },
                  ];
  
                  return groupedSidebar.map((item) => {
                    if (item.children) {
                      const isGroupSelected = selectedSubsections.some(
                        (sec) => sec.id === item.groupId
                      );
                  
                      const visibleChildren = item.children.filter((child) =>
                        selectedSubsections.some((sec) => sec.id === child.id)
                      );
                  
                      // Show group if parent OR any child is selected
                      if (!isGroupSelected && visibleChildren.length === 0) return null;
                  
                      const currentGroupIndex = groupIndex++;
                      let childIndex = 1;
                  
                      return (
                        <div key={item.groupId} className="mb-2">
                          {/* Show the parent title (group) */}
                          <p
                             className={`text-[12px] mb-2 font-medium cursor-pointer  ${
                              activeSection === item.groupId ? "text-blue-400" : "text-gray-600"
                            }`}
                            onClick={() => scrollToSection(item.groupId)} // optional scroll to parent section
                          >
                            {sectionOrder}.{currentGroupIndex} {item.title}
                          </p>
                  
                          {/* Render selected children */}
                          {visibleChildren.map((child) => {
                            const labelText =
                              child.label?.trim() !== "" ? child.label : item.title;
                  
                            return (
                              <p
                                key={child.id}
                                className={`text-[11px] mb-2 ml-2 cursor-pointer ${
                                  activeSection === child.id ? "text-blue-400" : ""
                                }`}
                                onClick={() => scrollToSection(child.id)}
                              >
                                {sectionOrder}.{currentGroupIndex}.{childIndex++} {labelText}
                              </p>
                            );
                          })}
                        </div>
                      );
                    } else {
                      // Standalone item
                      if (!selectedSubsections.some((sec) => sec.id === item.id)) return null;
                  
                      const label = `${sectionOrder}.${groupIndex++} ${item.label}`;
                      return (
                        <p
                          key={item.id}
                          className={`text-[12px] mb-2 cursor-pointer ${
                            activeSection === item.id ? "text-blue-400" : ""
                          }`}
                          onClick={() => scrollToSection(item.id)}
                        >
                          {label}
                        </p>
                      );
                    }
                  });
                  
                })()}
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
Materiality.displayName = "Materiality";

export default Materiality;
