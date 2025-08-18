"use client";
import {
  forwardRef,
  useImperativeHandle,
  useState,
  createRef,
  useRef,
  useEffect,
} from "react";
import Section1 from "./sections/section1";
import Section2 from "./sections/section2";
import Section3 from "./sections/section3";
import Section4 from "./sections/section4";
import Section5 from "./sections/section5";
import Section6 from "./sections/section6";
import Section7 from "./sections/section7";
import axiosInstance, { patch } from "../../../../utils/axiosMiddleware";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { Oval } from "react-loader-spinner";
import {
  setCompanyStatement,
  setApproachSustainability,
  setSustainabilityGoals,
  setSupplyChainSustainability,
} from "../../../../../lib/redux/features/ESGSlice/screen10Slice";

const SustainibilityJourney = forwardRef(({
  onSubmitSuccess,
  subsections = [],
  sectionOrder = 10,
  sectionId,
  sectionTitle,
  hasChanges
}, ref) => {
  const [activeSection, setActiveSection] = useState("sustainability_management_approach");

 
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
  const [initialData, setInitialData] = useState({});
  const [data, setData] = useState("");
  const [loopen, setLoOpen] = useState(false);
  const company_sustainability_statement = useSelector(
    (state) => state.screen10Slice.company_sustainability_statement
  );
  const approach_for_sustainability = useSelector(
    (state) => state.screen10Slice.approach_for_sustainability
  );
  const sustainability_goals = useSelector(
    (state) => state.screen10Slice.sustainability_goals
  );
  const approach_to_supply_chain_sustainability = useSelector(
    (state) => state.screen10Slice.approach_to_supply_chain_sustainability
  );

  const dispatch = useDispatch();

  const isWithReference = reportType === "GRI Report: With Reference to";

  const groupedSubsections = [
    
    { 
      id: 'sustainability_management_approach', 
      title: 'Management approach for sustainability/ESG topics',
    },
    { 
      id: 'company_sustainability', 
      title: "Company's Sustainability",
    },
    {
      groupId: "supply_chain_sustainability",
      title: "Supply Chain Sustainability",
      children: [ 
        !isWithReference &&{
          id: 'supply_chain_material_topic_management',
          label: 'Management of material topic',
        },
        {
          id: 'local_suppliers',
          label: 'Local Suppliers',
        },
        {
          id: 'negative_impacts_in_supply_chain',
          label: 'Negative environmental & social impacts in the supply chain',
        }  
      ].filter(Boolean),
    }
  ];

  const subsectionMapping = {
    sustainability_management_approach: {
      component: Section2,
      title: "Management approach for sustainability/ESG topics",
      subSections: [],
    },
    company_sustainability: {
      component: Section3,
      title: "Company's Sustainability ",
      // subTitle: "Restatement of information",
      subSections: [],
    },
    supply_chain_sustainability: {
      component: Section4,
      title: "Supply Chain Sustainability",
      subSections: [],
    },
    ...(!isWithReference && {supply_chain_material_topic_management: {
      component: Section5,
      title: "Management of material topic",
      subSections: [],
    }}),
    local_suppliers: {
      component: Section6,
      title: "Local Suppliers",
      subSections: [],
    },
    negative_impacts_in_supply_chain: {
      component: Section7,
      title: "Negative environmental & social impacts in the supply chain",
      subSections: [],
    },
  };
  const getSubsectionsToShow = () => {
    if (reportType === "Custom ESG Report") {
      const userSelected = Array.isArray(subsections) ? subsections : [];

      // Get default order
      const defaultOrder = [
        "sustainability_management_approach",
        "company_sustainability",
        "supply_chain_sustainability",
        "supply_chain_material_topic_management",
        "local_suppliers",
        "negative_impacts_in_supply_chain"
      ];

      // Return sorted list based on fixed order
      return defaultOrder.filter((id) => userSelected.includes(id));
    } else {
      return  [
        "sustainability_management_approach",
        "company_sustainability",
        "supply_chain_sustainability",
        "supply_chain_material_topic_management",
        "local_suppliers",
        "negative_impacts_in_supply_chain"
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
        const parentSelected = selectedSubsections.some((s) => s.id === group.groupId);
        const visibleChildren = group.children.filter((child) =>
          selectedSubsections.some((s) => s.id === child.id)
        );
  
        // Render the parent (if selected)
        if (parentSelected) {
          dynamicMap.push({
            id: group.groupId,
            sectionNumber: `${sectionOrder}.${groupIndex}`,
            groupTitle: `${sectionOrder}.${groupIndex} ${group.title}`,
          });
        }
  
        // Render children (if any selected)
        if (visibleChildren.length > 0) {
          let childIndex = 1;
          visibleChildren.forEach((child) => {
            dynamicMap.push({
              id: child.id,
              sectionNumber: `${sectionOrder}.${groupIndex}.${childIndex++}`,
              groupTitle: `${sectionOrder}.${groupIndex} ${group.title}`,
            });
          });
        }
  
        // Increase group index if either parent or children are rendered
        if (parentSelected || visibleChildren.length > 0) {
          groupIndex++;
        }
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
  const dynamicSectionNumberMap = numberedSubsections.reduce((acc, item) => {
    acc[item.id] = item.sectionNumber;
    return acc;
  }, {});
  const currentData={
    company_sustainability_statement,
    approach_for_sustainability,
    sustainability_goals,
    approach_to_supply_chain_sustainability
  }
  const submitForm = async (type) => {
    LoaderOpen();
    if (!hasChanges(initialData, currentData)) {
      LoaderClose();
      return false;
    }
    const data={};
    data.company_sustainability_statement= {
      page: "screen_ten",
      label: `${sectionOrder}. Sustainability Journey`,
      subLabel: "Add statement about company’s sustainability journey",
      type: "textarea",
      content: company_sustainability_statement,
      field: "company_sustainability_statement",
      isSkipped: false,
    }
    if(subsectionsToShow.includes("sustainability_management_approach")){
      const sectionNumber = dynamicSectionNumberMap["sustainability_management_approach"];
      data.approach_for_sustainability={
        page: "screen_ten",
        label: `${sectionNumber} Management approach for sustainability/ESG topics`,
        subLabel: "Add statement about company’s approach for sustainability",
        type: "textarea",
        content: approach_for_sustainability,
        field: "approach_for_sustainability",
        isSkipped: false,
      }
    }
    if(subsectionsToShow.includes("company_sustainability")){
      const sectionNumber = dynamicSectionNumberMap["company_sustainability"];
      data.sustainability_goals= {
        page: "screen_ten",
        label: `${sectionNumber} Company’s Sustainability Goals`,
        subLabel: "Add statement about company’s sustainability goals",
        type: "textarea",
        content: sustainability_goals,
        field: "sustainability_goals",
        isSkipped: false,
      }
    }
    if(subsectionsToShow.includes("supply_chain_sustainability")){
      const sectionNumber = dynamicSectionNumberMap["supply_chain_sustainability"];
      data.approach_to_supply_chain_sustainability={
        page: "screen_ten",
        label: `${sectionNumber} Supply Chain Sustainability`,
        subLabel:
          "Add statement about company’s approach to supply chain sustainability",
        type: "textarea",
        content: approach_to_supply_chain_sustainability,
        field: "approach_to_supply_chain_sustainability",
        isSkipped: false,
      }
    }
  

    const url = `${process.env.BACKEND_API_URL}/esg_report/screen_ten/${reportid}/`;
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
    dispatch(setCompanyStatement(""));
    dispatch(setApproachSustainability(""));
    dispatch(setSustainabilityGoals(""));
    dispatch(setSupplyChainSustainability(""));
    const url = `${process.env.BACKEND_API_URL}/esg_report/screen_ten/${reportid}/`;
    try {
      const response = await axiosInstance.get(url);
      if (response.data) {
        const flatData = {};
        Object.keys(response.data).forEach((key) => {
          flatData[key] = response.data[key]?.content || "";
        });
      
        setInitialData(flatData);
        setData(response.data);
        dispatch(
          setCompanyStatement(
            response.data.company_sustainability_statement?.content || ""
          )
        );
        dispatch(
          setApproachSustainability(
            response.data.approach_for_sustainability?.content || ""
          )
        );
        dispatch(
          setSustainabilityGoals(
            response.data.sustainability_goals?.content || ""
          )
        );
        dispatch(
          setSupplyChainSustainability(
            response.data.approach_to_supply_chain_sustainability?.content || ""
          )
        );
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
      reportType
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


  // return (
  //   <>
  //     <div className="mx-2 p-2">
  //       <h3 className="text-[22px] text-[#344054] mb-4 text-left font-semibold">
  //         10. Sustainability Journey 
  //       </h3>
  //       <div className="flex gap-4">
  //         <div className="xl:w-[80%] md:w-[75%] lg:w-[80%]  2k:w-[80%] 4k:w-[80%] 2xl:w-[80%]  w-full">
  //           <Section1 orgName={orgName} data={data} />
  //           <Section2 section10_1Ref={section10_1Ref} data={data} />
  //           <Section3 section10_2Ref={section10_2Ref} data={data} />
  //           <Section4 section10_3Ref={section10_3Ref} data={data} />
  //          { reportType=='GRI Report: In accordance With' && <Section5 section10_3_1Ref={section10_3_1Ref} data={data} /> } 
  //           <Section6 section10_3_2Ref={section10_3_2Ref} data={data} reportType={reportType} />
  //           <Section7 section10_3_3Ref={section10_3_3Ref} data={data} reportType={reportType} />
  //         </div>
  //         {/* page sidebar */}

  //         <div className="p-4 border border-r-2 border-b-2 shadow-lg rounded-lg h-[500px] top-20 sticky mt-2 w-[20%] md:w-[25%] lg:w-[20%] xl:sticky xl:top-36 lg:sticky lg:top-36  md:fixed 
  // md:top-[19rem]
  // md:right-4  hidden xl:block md:block lg:block 2k:block 4k:block 2xl:block">
  //           <p className="text-[11px] text-[#727272] mb-2 uppercase">
  //             10. Sustainability Journey 
  //           </p>
  //           <p
  //             className={`text-[12px] mb-2 cursor-pointer ${
  //               activeSection === "section10_1" ? "text-blue-400" : ""
  //             }`}
  //             onClick={() => scrollToSection(section10_1Ref, "section10_1")}
  //           >
  //             10.1.Management approach for sustainability/ESG topics
  //           </p>
  //           <p
  //             className={`text-[12px] mb-2 cursor-pointer ${
  //               activeSection === "section10_2" ? "text-blue-400" : ""
  //             }`}
  //             onClick={() => scrollToSection(section10_2Ref, "section10_2")}
  //           >
  //             10.2. Company's Sustainability 
  //           </p>
  //           <p
  //             className={`text-[12px] mb-2 cursor-pointer ${
  //               activeSection === "section10_3" ? "text-blue-400" : ""
  //             }`}
  //             onClick={() => scrollToSection(section10_3Ref, "section10_3")}
  //           >
  //             10.3 Supply Chain Sustainability
  //           </p>
  //           { reportType=='GRI Report: In accordance With' && 
  //            <p
  //            className={`text-[11px] mb-2 ml-2 cursor-pointer ${
  //              activeSection === "section10_3_1" ? "text-blue-400" : ""
  //            }`}
  //            onClick={() => scrollToSection(section10_3_1Ref, "section10_3_1")}
  //          >
  //            10.3.1. Management of material topic 
  //          </p>
  //           }
           
  //           <p
  //             className={`text-[11px] mb-2 ml-2 cursor-pointer ${
  //               activeSection === "section10_3_2" ? "text-blue-400" : ""
  //             }`}
  //             onClick={() => scrollToSection(section10_3_2Ref, "section10_3_2")}
  //           >
  //            { reportType=='GRI Report: In accordance With'?'10.3.2.':'10.3.1.'}  Local Suppliers
  //           </p>
  //           <p
  //             className={`text-[11px] mb-2 ml-2 cursor-pointer ${
  //               activeSection === "section10_3_3" ? "text-blue-400" : ""
  //             }`}
  //             onClick={() => scrollToSection(section10_3_3Ref, "section10_3_3")}
  //           >
  //            { reportType=='GRI Report: In accordance With'?'10.3.3.':'10.3.2.'} Negative environmental & social impacts in the supply
  //             chain
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
            {sectionOrder}. Sustainability Journey
          </h3>
        </div>
        <div className="flex gap-4">
          <div className="xl:w-[80%] md:w-[75%] lg:w-[80%] 2k:w-[80%] 4k:w-[80%] 2xl:w-[80%] w-full">
            {/* {selectedSubsections.map(section => renderSection(section))} */}
            {/* {subsectionsToShow.includes("materiality_assessment") && (
                <div ref={sectionRefs.current["materiality_assessment"] || createRef()}>
                  
                </div>
              )} */}
              <Section1
                    orgName={orgName}
                    data={data}
                    sectionOrder={sectionOrder}
                    sectionNumber={null} // Not numbered
                  />
            {numberedSubsections.map((section) => renderSection(section))}
          </div>

          {/* Page sidebar - only show if there are subsections */}
          {selectedSubsections.length > 0 && (
            <div className="p-4 border border-r-2 border-b-2 shadow-lg rounded-lg h-[500px] top-36 sticky mt-2 w-[20%] md:w-[25%] lg:w-[20%] xl:sticky xl:top-36 lg:sticky lg:top-36 md:fixed md:top-[19rem] md:right-4 hidden xl:block md:block lg:block 2k:block 4k:block 2xl:block z-10 bg-white">
              <p className="text-[11px] text-[#727272] mb-2 uppercase">
                {sectionOrder}. Sustainability Journey 
              </p>

              {(() => {
                let groupIndex = 1;

               

                const groupedSidebar = [
    
                  { 
                    id: 'sustainability_management_approach', 
                    label: 'Management approach for sustainability/ESG topics',
                  },
                  { 
                    id: 'company_sustainability', 
                    label: "Company's Sustainability",
                  },
                  {
                    groupId: "supply_chain_sustainability",
                    label: "Supply Chain Sustainability",
                    children: [ 
                      {
                        id: 'supply_chain_material_topic_management',
                        label: 'Management of material topic',
                      },
                      {
                        id: 'local_suppliers',
                        label: 'Local Suppliers',
                      },
                      {
                        id: 'negative_impacts_in_supply_chain',
                        label: 'Negative environmental & social impacts in the supply chain',
                      }  
                    ],
                  }
                ];

                return groupedSidebar.map((item) => {
                  if (item.children) {
                    const parentSelected = selectedSubsections.some(s => s.id === item.groupId);
                    const visibleChildren = item.children.filter(child => 
                      selectedSubsections.some(s => s.id === child.id)
                    );
                
                    if (!parentSelected && visibleChildren.length === 0) return null;
                
                    const currentGroupIndex = groupIndex++;
                    const elements = [];
                
                    if (parentSelected) {
                      elements.push(
                        <p
                          key={item.groupId}
                          className={`text-[12px] mb-2 font-medium cursor-pointer  ${
                            activeSection === item.groupId ? "text-blue-400" : "text-gray-600"
                          }`}
                          onClick={() => scrollToSection(item.groupId)}
                        >
                          {sectionOrder}.{currentGroupIndex} {item.label}
                        </p>
                      );
                    }
                
                    let childIndex = 1;
                    visibleChildren.forEach((child) => {
                      elements.push(
                        <p
                          key={child.id}
                          className={`text-[11px] mb-2 ml-2 cursor-pointer ${
                            activeSection === child.id ? "text-blue-400" : ""
                          }`}
                          onClick={() => scrollToSection(child.id)}
                        >
                          {sectionOrder}.{currentGroupIndex}.{childIndex++} {child.label}
                        </p>
                      );
                    });
                
                    return <div key={item.groupId}>{elements}</div>;
                  } else {
                    if (!selectedSubsections.some(s => s.id === item.id)) return null;
                    const currentIndex = groupIndex++;
                    return (
                      <p
                        key={item.id}
                        className={`text-[12px] mb-2 cursor-pointer ${
                          activeSection === item.id ? "text-blue-400" : ""
                        }`}
                        onClick={() => scrollToSection(item.id)}
                      >
                        {sectionOrder}.{currentIndex} {item.label}
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

SustainibilityJourney.displayName = "SustainibilityJourney";

export default SustainibilityJourney;

