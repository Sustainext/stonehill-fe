"use client";
import {
  createRef,
  forwardRef,
  useImperativeHandle,
  useState,
  useRef,
  useEffect,
} from "react";
import Section1 from "./sections/section1";
import Section2 from "./sections/section2";
import Section3 from "./sections/section3";
import Section4 from "./sections/section4";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { Oval } from "react-loader-spinner";
import axiosInstance from "../../../../utils/axiosMiddleware";
import {
  setAboutTheCompany,
  setBusinessRelation,
  setEntitiesInclude,
  setSupplyChain,
} from "../../../../../lib/redux/features/ESGSlice/screen2Slice";

const Companyoperations = forwardRef(
  (
    {
      onSubmitSuccess,
      subsections = [],
      sectionOrder = 2,
      sectionId,
      sectionTitle,
      hasChanges
    },
    ref
  ) => {
   
    // const reportid =
    //   typeof window !== "undefined" ? localStorage.getItem("reportid") : "";
    // const reportType =
    //   typeof window !== "undefined" ? localStorage.getItem("reportType") : "";
    // const orgName =
    //   typeof window !== "undefined"
    //     ? localStorage.getItem("reportorgname")
    //     : "";

    const [reportid, setReportid] = useState("");
const [reportType, setReportType] = useState("");
const [orgName, setOrgname] = useState("");

// Update after mount on client only
useEffect(() => {
  setReportid(localStorage.getItem("reportid") || "");
  setReportType(localStorage.getItem("reportType") || "");
  setOrgname(localStorage.getItem("reportorgname") || "");
}, []);

    const [activeSection, setActiveSection] = useState("business_model");
    const [screenTwoData, setScreentwoData] = useState("");
    const [loopen, setLoOpen] = useState(false);
    const apiCalledRef = useRef(false);
    const [isScrolling, setIsScrolling] = useState(false);
    const [initialData, setInitialData] = useState({});

    // Dynamic refs based on subsections
    const sectionRefs = useRef({});

    const about_the_company = useSelector(
      (state) => state.screen2Slice.about_the_company
    );
    const business_relations = useSelector(
      (state) => state.screen2Slice.business_relations
    );
    const entities_included = useSelector(
      (state) => state.screen2Slice.entities_included
    );
    const supply_chain_description = useSelector(
      (state) => state.screen2Slice.supply_chain_description
    );
    const dispatch = useDispatch();
    const groupedSubsections = [
      {
        groupId: "business_model",
        title: "Business Model and Impact",
        children: [{ id: "value_chain" }, { id: "entities_included" }],
      },
      {
        id: "supply_chain",
        title: "Supply Chain",
      },
    ];

    const subsectionMapping = {
      business_model: {
        component: ({section2_1Ref,sectionNumber='2.1',sectionTitle='Business Model and Impact'})=>{
          return(
            <div className="mb-2" id="setion2_1" ref={section2_1Ref}>
        <h3 className="text-[17px] text-[#344054] mb-4 text-left font-semibold">
            {sectionNumber} {sectionTitle}
        </h3>
      </div>
          )
        },
        title: "Business Model and Impact",
        subSections: [],
      },
      value_chain: {
        component: Section2,
        title: "Activities, Value Chain, and Other Business Relationships",
        subTitle: "",
        subSections: [],
      },
      entities_included: {
        component: Section3,
        title: "Entities Included in the Organization's Sustainability Reporting",
        subTitle:
          "",
        subSections: [],
      },
      supply_chain: {
        component: Section4,
        title: "Supply Chain",
        subSections: [],
      },
    };

    
    const getSubsectionsToShow = () => {
      if (reportType === "Custom ESG Report") {
        const userSelected = Array.isArray(subsections) ? subsections : [];

        // Get default order
        const defaultOrder = [
          "business_model",
          "value_chain",
          "entities_included",
          "supply_chain",
        ];

        // Return sorted list based on fixed order
        return defaultOrder.filter((id) => userSelected.includes(id));
      } else {
        return [
          "business_model",
          "value_chain",
          "entities_included",
          "supply_chain",
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

    // Map subsection IDs to their corresponding components and data

    // For non-custom reports, show all subsections
    // const getSubsectionsToShow = () => {
    //   if (reportType === 'Custom ESG Report') {
    //     // Use provided subsections for custom reports
    //     return Array.isArray(subsections) ? subsections : [];
    //   } else {
    //     // Show all available subsections for non-custom reports
    //     return ['business_model', 'value_chain', 'entities_included', 'supply_chain'];
    //   }
    // };

    // Set initial active section
    useEffect(() => {
      if (selectedSubsections.length > 0 && !activeSection) {
        setActiveSection(selectedSubsections[0].id);
      }
    }, [selectedSubsections, activeSection]);

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

    const dynamicSectionNumberMap = numberedSubsections.reduce((acc, item) => {
      acc[item.id] = item.sectionNumber;
      return acc;
    }, {});

    const currentData={
      about_the_company,
      business_relations,
      entities_included,
      supply_chain_description
    }
    

    const submitForm = async (type) => {
      LoaderOpen();

      if (!hasChanges(initialData, currentData)) {
        LoaderClose();
        return false;
      }

      // Only submit data for selected subsections
      const data = {};

      // if (subsectionsToShow.includes("business_model")) {
        data.about_the_company = {
          page: "screen_two",
          label: `${sectionOrder}. About the company and operations`,
          subLabel: "Add statement about stakeholder engagement",
          type: "richTextarea",
          content: about_the_company,
          field: "about_the_company",
          isSkipped: false,
        };
      // }
      
      if (subsectionsToShow.includes("value_chain")) {
        const sectionNumber = dynamicSectionNumberMap["value_chain"];
        data.business_relations = {
          page: "screen_two",
          label: `${sectionNumber} Activities, Value Chain, and Other Business Relationships`,
          subLabel: "Add Introduction about company's domain",
          type: "richTextarea",
          content: business_relations,
          field: "business_relations",
          isSkipped: false,
        };
      }
      
      if (subsectionsToShow.includes("entities_included")) {
        const sectionNumber = dynamicSectionNumberMap["entities_included"];
        data.entities_included = {
          page: "screen_two",
          label: `${sectionNumber} Entities Included in the Organization's Sustainability Reporting`,
          subLabel:
            "Add statement about sustainability performance data for all entities",
          type: "richTextarea",
          content: entities_included,
          field: "entities_included",
          isSkipped: false,
        };
      }
      
      if (subsectionsToShow.includes("supply_chain")) {
        const sectionNumber = dynamicSectionNumberMap["supply_chain"];
        data.supply_chain_description = {
          page: "screen_two",
          label: `${sectionNumber} Supply Chain`,
          subLabel: "Add statement about company's supply chain process",
          type: "richTextarea",
          content: supply_chain_description,
          field: "supply_chain_description",
          isSkipped: false,
        };
      }
      

      const url = `${process.env.BACKEND_API_URL}/esg_report/screen_two/${reportid}/`;
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
      dispatch(setAboutTheCompany(""));
      dispatch(setBusinessRelation(""));
      dispatch(setEntitiesInclude(""));
      dispatch(setSupplyChain(""));

      const url = `${process.env.BACKEND_API_URL}/esg_report/screen_two/${reportid}/`;
      try {
        const response = await axiosInstance.get(url);
        if (response.data) {
          const flatData = {};
  Object.keys(response.data).forEach((key) => {
    flatData[key] = response.data[key]?.content || "";
  });

  setInitialData(flatData);
          setScreentwoData(response.data);
          dispatch(
            setAboutTheCompany(response.data.about_the_company?.content || "")
          );
          dispatch(
            setBusinessRelation(response.data.business_relations?.content || "")
          );
          dispatch(
            setEntitiesInclude(response.data.entities_included?.content || "")
          );
          dispatch(
            setSupplyChain(
              response.data.supply_chain_description?.content || ""
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
      if (!apiCalledRef.current && reportid) {
        apiCalledRef.current = true;
        loadFormData();
      }
    }, [reportid]);

    // Create refs for each selected subsection
    useEffect(() => {
      // Always create ref for business_model (Section1)
      if (!sectionRefs.current["business_model"]) {
        sectionRefs.current["business_model"] = createRef();
      }
      
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
                   data:screenTwoData,
                   sectionNumber: section.sectionNumber,
                   sectionOrder,
                   reportType
                 };
           
                 if (!SectionComponent) return null;
           
                 return (
                   <div key={section.id} id={section.id} ref={ref}>
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

    

    // Don't render anything if no subsections are selected (for custom reports)
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

    return (
      <>
        <div className="mx-2 p-2">
          <div>
            <h3 className="text-[22px] text-[#344054] mb-4 text-left font-semibold">
              {sectionOrder}. About the company and operations
            </h3>
          </div>
          <div className="flex gap-4">
            <div className="xl:w-[80%] md:w-[75%] lg:w-[80%] 2k:w-[80%] 4k:w-[80%] 2xl:w-[80%] w-full">
              {/* {selectedSubsections.map(section => renderSection(section))} */}
              {/* {subsectionMapping.business_model && (
                <div ref={sectionRefs.current["business_model"] || createRef()}>
                  
                </div>
              )} */}
              <div id="business_model" ref={sectionRefs.current["business_model"] || createRef()}>
                <Section1
                      orgName={orgName}
                      data={screenTwoData}
                      sectionOrder={sectionOrder}
                      sectionNumber={null} // Not numbered
                    />
              </div>
              {numberedSubsections.map((section) => renderSection(section))}
            </div>

            {/* Page sidebar - only show if there are subsections */}
            {selectedSubsections.length > 0 && (
              <div className="p-4 border border-r-2 border-b-2 shadow-lg rounded-lg h-[500px] top-36 sticky mt-2 w-[20%] md:w-[25%] lg:w-[20%] xl:sticky xl:top-36 lg:sticky lg:top-36 md:fixed md:top-[19rem] md:right-4 hidden xl:block md:block lg:block 2k:block 4k:block 2xl:block z-10 bg-white">
                <p className="text-[11px] text-[#727272] mb-2 uppercase">
                  {sectionOrder}. About the company and operations
                </p>

                {(() => {
                  let groupIndex = 1;

                  const groupedSidebar = [
                    {
                      groupId: "business_model",
                      title: "Business Model and Impact",
                      children: [
                        {
                          id: "value_chain",
                          label:
                            "Activities, Value Chain, and Other Business Relationships",
                        },
                        {
                          id: "entities_included",
                          label:
                            "Entities Included in the Organization's Sustainability Reporting",
                        },
                      ],
                    },
                    {
                      id: "supply_chain",
                      label: "Supply Chain",
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
  }
);

Companyoperations.displayName = "Companyoperations";

export default Companyoperations;
