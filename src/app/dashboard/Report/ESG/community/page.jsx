"use client";
import {forwardRef, useImperativeHandle, useState, useRef, useEffect,createRef } from "react";
import Section1 from "./sections/section1";
import Section2 from "./sections/section2";
import Section3 from "./sections/section3";
import Section4 from './sections/section4'
import axiosInstance,{patch} from "../../../../utils/axiosMiddleware";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { Oval } from "react-loader-spinner";
import { setCommunityEngagementStatement,
  setImpactAssessment,setViolationOfRights,
  setCSRStatement} from "../../../../../lib/redux/features/ESGSlice/screen14Slice"


const Community = forwardRef(({
  onSubmitSuccess,
  subsections = [],
  sectionOrder = 14,
  sectionId,
  sectionTitle,
  hasChanges
}, ref) => {

  const [activeSection, setActiveSection] = useState("community_engagement");
  // const orgName = typeof window !== "undefined" ? localStorage.getItem("reportorgname") : "";
  // const reportid = typeof window !== "undefined" ? localStorage.getItem("reportid") : "";
  // const reportType =
  // typeof window !== "undefined" ? localStorage.getItem("reportType") : "";
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
  const [data,setData]=useState("")
  const [loopen, setLoOpen] = useState(false);
  const community_engagement_statement = useSelector((state) => state.screen14Slice.community_engagement_statement);
  const impact_assessment = useSelector((state) => state.screen14Slice.impact_assessment);
  const csr_statement = useSelector((state) => state.screen14Slice.csr_statement);
  const violation_rights = useSelector((state) => state.screen14Slice.violation_rights);

  const dispatch = useDispatch()

  const isWithReference = reportType === 'GRI Report: With Reference to';

  // Dynamically build groupedSubsections
  const groupedSubsections = [
    {
      groupId: "community_engagement",
      title: "Community Engagement",
      children: [
        !isWithReference && {
          id: 'community_engagement_material_topic_management',
        },
        {
          id: 'violation_rights_indigenous_people',
        }
      ].filter(Boolean),
    },
    {
      id: 'csr',
      label: 'CSR',
    }
  ];
  
  // Dynamically build subsectionMapping
  const subsectionMapping = {
    community_engagement: {
      component: Section1,
      title: "Community Engagement",
      subSections: [],
    },
    ...(!isWithReference && {
      community_engagement_material_topic_management: {
        component: Section2,
        title: "Management of material topic",
        subSections: [],
      }
    }),
    violation_rights_indigenous_people: {
      component: Section3,
      title: "Incidents of Violation of Rights of Indigenous People",
      subSections: [],
    },
    csr: {
      component: Section4,
      title: "CSR",
      subSections: [],
    }
  };
  
  const getSubsectionsToShow = () => {
    if (reportType === "Custom ESG Report") {
      const userSelected = Array.isArray(subsections) ? subsections : [];

      // Get default order
      const defaultOrder = [
        "community_engagement",
        "community_engagement_material_topic_management",
        "violation_rights_indigenous_people",
        "csr"
      ];

      // Return sorted list based on fixed order
      return defaultOrder.filter((id) => userSelected.includes(id));
    } else {
      return [
        "community_engagement",
        "community_engagement_material_topic_management",
        "violation_rights_indigenous_people",
        "csr"
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
      community_engagement:community_engagement_statement,
      impact_assessment,
      csr_policies:csr_statement,
      violation_rights
    }
  const submitForm = async (type) => {
      LoaderOpen();
      if (!hasChanges(initialData, currentData)) {
        LoaderClose();
        return false;
      }
      const data={}
      if(subsectionsToShow.includes("community_engagement")){
        const sectionNumber = dynamicSectionNumberMap["community_engagement"];
        data.community_engagement= {"page":"screen_fourteen","label":`${sectionNumber} Community Engagement`,"subLabel":"Add statement about company’s community engagement","type":"textarea","content":community_engagement_statement,"field":"community_engagement","isSkipped":false} ,
        data.impact_assessment= {"page":"screen_fourteen","label":"Impact Assessment","subLabel":"","type":"textarea","content":impact_assessment,"field":"impact_assessment","isSkipped":false}
      }
      if(subsectionsToShow.includes("violation_rights_indigenous_people")){
        const sectionNumber = dynamicSectionNumberMap["violation_rights_indigenous_people"];
        data.violation_rights= {"page":"screen_fourteen","label":`${sectionNumber} Incidents of Violation of Rights of Indigenous People`,"subLabel":"Add statement about company’s policy on violation of rights of indigenous people","type":"textarea","content":violation_rights,"field":"violation_rights","isSkipped":false}
      }
      if(subsectionsToShow.includes("csr")){
        const sectionNumber = dynamicSectionNumberMap["csr"];
        data.csr_policies= {"page":"screen_fourteen","label":`${sectionNumber}`,"subLabel":"Add statement about company’s Corporate Social Responsibility policies","type":"richTextarea","content":csr_statement,"field":"csr_policies","isSkipped":false}
      }
     
  
      const url = `${process.env.BACKEND_API_URL}/esg_report/screen_fourteen/${reportid}/`;
      try {
          const response = await axiosInstance.put(url, data);
  
          if (response.status === 200) {
              if(type=='next'){
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
      dispatch(setCommunityEngagementStatement(''));
      dispatch(setImpactAssessment(''));
      dispatch(setCSRStatement(''));
      dispatch(setViolationOfRights(''));
      const url = `${process.env.BACKEND_API_URL}/esg_report/screen_fourteen/${reportid}/`;
      try {
          const response = await axiosInstance.get(url);
          if(response.data){
            const flatData = {};
  Object.keys(response.data).forEach((key) => {
    flatData[key] = response.data[key]?.content || "";
  });

  setInitialData(flatData);
            setData(response.data)
            dispatch(setCommunityEngagementStatement(response.data.community_engagement?.content || ""));
            dispatch(setImpactAssessment(response.data.impact_assessment?.content || ""));
            dispatch(setCSRStatement(response.data.csr_policies?.content || ""));
            dispatch(setViolationOfRights(response.data.violation_rights?.content || ""));
            
          }
          
          LoaderClose();
      
      } catch (error) {
          console.error('API call failed:', error);
          LoaderClose();
      }
  };
  
  useEffect(() => {
    // Ensure API is only called once
    if (!apiCalledRef.current && reportid) {
        apiCalledRef.current = true;  // Set the flag to true to prevent future calls
        loadFormData();  // Call the API only once
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
  //       14. Community 
  //       </h3>
  //       <div className="flex gap-4">
  //         <div className="xl:w-[80%] md:w-[75%] lg:w-[80%]  2k:w-[80%] 4k:w-[80%] 2xl:w-[80%]  w-full">
  //           <Section1 section14_1Ref={section14_1Ref} data={data}/>
  //           <Section2  section14_1_1Ref={section14_1_1Ref} section14_1_2Ref={section14_1_2Ref} data={data} orgName={orgName} reportType={reportType} />
  //           <Section3 section14_2Ref={section14_2Ref} data={data} />
        
      
  //         </div>
  //         {/* page sidebar */}

  //         <div className="p-4 border border-r-2 border-b-2 shadow-lg rounded-lg h-[550px] top-20 sticky mt-2 w-[20%] md:w-[25%] lg:w-[20%] xl:sticky xl:top-36 lg:sticky lg:top-36  md:fixed 
  // md:top-[19rem]
  // md:right-4  hidden xl:block md:block lg:block 2k:block 4k:block 2xl:block">
  //           <p className="text-[11px] text-[#727272] mb-2 uppercase">
  //           14. Community
  //           </p>
  //           <p
  //             className={`text-[12px] mb-2 cursor-pointer ${
  //               activeSection === "section14_1" ? "text-blue-400" : ""
  //             }`}
  //             onClick={() => scrollToSection(section14_1Ref, "section14_1")}
  //           >
  //             14.1.  Community Engagement
  //           </p>
  //           {
  //             reportType=='GRI Report: In accordance With'?(
  //               <p
  //               className={`text-[11px] mb-2 ml-2 cursor-pointer ${
  //                 activeSection === "section14_1_1" ? "text-blue-400" : ""
  //               }`}
  //               onClick={() => scrollToSection(section14_1_1Ref, "section14_1_1")}
  //             >
  //              14.1.1  Management of material topic
  //             </p>
  //             ):(
  //               <div></div>
  //             )
  //           }
           
  //           <p
  //             className={`text-[11px] mb-2 ml-2 cursor-pointer ${
  //               activeSection === "section14_1_2" ? "text-blue-400" : ""
  //             }`}
  //             onClick={() => scrollToSection(section14_1_2Ref, "section14_1_2")}
  //           >
  //           {reportType=='GRI Report: In accordance With'?'14.1.2':'14.1.1'}   Incidents of Violation of Rights of Indigenous People
  //           </p>
  //           <p
  //             className={`text-[12px] mb-2 cursor-pointer ${
  //               activeSection === "section14_2" ? "text-blue-400" : ""
  //             }`}
  //             onClick={() => scrollToSection(section14_2Ref, "section14_2")}
  //           >
  //             14.2 CSR  
  //           </p>
  //         </div>
  //       </div>
  //     </div>
  //     {loopen && (
  //         <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
  //           <Oval
  //             height={50}
  //             width={50}
  //             color="#00BFFF"
  //             secondaryColor="#f3f3f3"
  //             strokeWidth={2}
  //             strokeWidthSecondary={2}
  //           />
  //         </div>
  //       )}
  //   </>
  // );

  return (
    <>
      <div className="mx-2 p-2">
        <div>
          <h3 className="text-[22px] text-[#344054] mb-4 text-left font-semibold">
            {sectionOrder}. Community
          </h3>
        </div>
        <div className="flex gap-4">
          <div className="xl:w-[80%] md:w-[75%] lg:w-[80%] 2k:w-[80%] 4k:w-[80%] 2xl:w-[80%] w-full">
            {/* {selectedSubsections.map(section => renderSection(section))} */}
            {/* {subsectionsToShow.includes("materiality_assessment") && (
                <div ref={sectionRefs.current["materiality_assessment"] || createRef()}>
                  <Section1
                    orgName={orgName}
                    data={data}
                    sectionOrder={sectionOrder}
                    sectionNumber={null} // Not numbered
                  />
                </div>
              )} */}
            {numberedSubsections.map((section) => renderSection(section))}
          </div>

          {/* Page sidebar - only show if there are subsections */}
          {selectedSubsections.length > 0 && (
            <div className="p-4 border border-r-2 border-b-2 shadow-lg rounded-lg h-[500px] top-36 sticky mt-2 w-[20%] md:w-[25%] lg:w-[20%] xl:sticky xl:top-36 lg:sticky lg:top-36 md:fixed md:top-[19rem] md:right-4 hidden xl:block md:block lg:block 2k:block 4k:block 2xl:block z-10 bg-white">
              <p className="text-[11px] text-[#727272] mb-2 uppercase">
                {sectionOrder}. Community 
              </p>

              {(() => {
                let groupIndex = 1;

                const groupedSidebar = [
                  {
                    groupId: "community_engagement",
                    title: "Community Engagement",
                    children: [
                      { 
                        id: 'community_engagement_material_topic_management', 
                        label: 'Management of material topic'
                      },
                      { 
                          id: 'violation_rights_indigenous_people', 
                          label: 'Incidents of Violation of Rights of Indigenous People',
                        },
                    ],
                  },
                  {
                    id: 'csr',
                    label: 'CSR',
                  }
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
Community.displayName = "Community";

export default Community;
