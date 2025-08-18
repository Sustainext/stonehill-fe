"use client";
import {
  forwardRef,
  useImperativeHandle,
  useState,
  useRef,
  createRef,
  useEffect,
} from "react";
import Section1 from "./sections/section1";
import Section2 from "./sections/section2";
import Section3 from "./sections/section3";
import Section4 from "./sections/section4";
import Section5 from "./sections/section5";
import Section6 from "./sections/section6";
import Section7 from "./sections/section7";
import Section8 from "./sections/section8";
import Section9 from "./sections/section9";
import Section10 from "./sections/section10";
import axiosInstance, { patch } from "../../../../utils/axiosMiddleware";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { Oval } from "react-loader-spinner";
import {
  setCommitmentStatement,
  setProductInfo,
  setMarketingPractices,
  setConclusion,
  setCustomers
} from "../../../../../lib/redux/features/ESGSlice/screen15Slice";

const CustomerProductService = forwardRef(({
  onSubmitSuccess,
  subsections = [],
  sectionOrder = 15,
  sectionId,
  sectionTitle,
  hasChanges
}, ref) => {
  const [activeSection, setActiveSection] = useState("products_services");

 

  // const orgName =
  //   typeof window !== "undefined" ? localStorage.getItem("reportorgname") : "";
  // const reportid =
  //   typeof window !== "undefined" ? localStorage.getItem("reportid") : "";
  //   const reportType =
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
  const [data, setData] = useState("");
  const [loopen, setLoOpen] = useState(false);
  const commitment_statement = useSelector(
    (state) => state.screen15Slice.commitment_statement
  );
  const product_info_labelling = useSelector(
    (state) => state.screen15Slice.product_info_labelling
  );
  const marketing_practices = useSelector(
    (state) => state.screen15Slice.marketing_practices
  );
  const conclusion = useSelector((state) => state.screen15Slice.conclusion);
  const customers = useSelector((state) => state.screen15Slice.customers);

  const dispatch = useDispatch();

  const isWithReference = reportType === 'GRI Report: With Reference to';

// Dynamically build groupedSubsections
const groupedSubsections = [
  {
    groupId: "products_services",
    title: "Products and Services",
    children: [
      !isWithReference && {
        id: 'products_services_material_topic_management',
      },
      {
        id: 'safety_impact',
      },
      {
        id: 'non_compliance',
      }
    ].filter(Boolean), // remove false values
  },
  {
    groupId: "product_labeling",
    title: "Product and Service Information & Labelling",
    children: [
      !isWithReference && {
        id: 'product_labeling_material_topic_management',
      },
      {
        id: 'marketing',
      }
    ].filter(Boolean),
  },
  {
    groupId: "customers",
    title: "Customers",
    children: [
      !isWithReference && {
        id: 'customers_material_topic_management',
      }
    ].filter(Boolean),
  }
];

// Dynamically build subsectionMapping
const subsectionMapping = {
  products_services: {
    component: Section1,
    title: "Products and Services",
    subSections: [],
  },
  ...(!isWithReference && {
    products_services_material_topic_management: {
      component: Section2,
      title: "Management of material topic",
      subSections: [],
    },
  }),
  safety_impact: {
    component: Section3,
    title: "Health and safety impacts of product and service categories",
    subSections: [],
  },
  non_compliance: {
    component: Section4,
    title: "Incidents of non-compliance",
    subSections: [],
  },
  product_labeling: {
    component: Section5,
    title: "Product and Service Information & Labelling",
    subSections: [],
  },
  ...(!isWithReference && {
    product_labeling_material_topic_management: {
      component: Section6,
      title: "Management of material topic",
      subSections: [],
    },
  }),
  marketing: {
    component: Section7,
    title: "Marketing",
    subSections: [],
  },
  customers: {
    component: Section8,
    title: "Customers",
    subSections: [],
  },
  ...(!isWithReference && {
    customers_material_topic_management: {
      component: Section9,
      title: "Management of material topic",
      subSections: [],
    },
  }),
};


  
    const getSubsectionsToShow = () => {
      if (reportType === "Custom ESG Report") {
        const userSelected = Array.isArray(subsections) ? subsections : [];
  
        // Get default order
        const defaultOrder = [
          "products_services",
          "products_services_material_topic_management",
          "safety_impact",
          "non_compliance",
          "product_labeling",
          "product_labeling_material_topic_management",
          "marketing",
          "customers",
          "customers_material_topic_management"
        ];
  
        // Return sorted list based on fixed order
        return defaultOrder.filter((id) => userSelected.includes(id));
      } else {
        return [
          "products_services",
          "products_services_material_topic_management",
          "safety_impact",
          "non_compliance",
          "product_labeling",
          "product_labeling_material_topic_management",
          "marketing",
          "customers",
          "customers_material_topic_management"
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
    commitment_statement,
    product_info_labelling,
    marketing_practices,
    conclusion,
    customers
  }
  const submitForm = async (type) => {
    LoaderOpen();
    if (!hasChanges(initialData, currentData)) {
      LoaderClose();
      return false;
    }
    const data={};
    if(subsectionsToShow.includes("products_services")){
      const sectionNumber = dynamicSectionNumberMap["products_services"];
      data.commitment_statement={
        page: "screen_fifteen",
        label: `${sectionNumber} Products and Services`,
        subLabel:
          "Add statement about company’s commitment to products and services",
        type: "textarea",
        content: commitment_statement,
        field: "commitment_statement",
        isSkipped: false,
      }
    }
    if(subsectionsToShow.includes("product_labeling")){
      const sectionNumber = dynamicSectionNumberMap["product_labeling"];
      data. product_info_labelling= {
        page: "screen_fifteen",
        label: `${sectionNumber} Product and Service Information and Labelling`,
        subLabel:
          "Add statement about company’s product and service information and labelling",
        type: "textarea",
        content: product_info_labelling,
        field: "product_info_labelling",
        isSkipped: false,
      }
    }
    if(subsectionsToShow.includes("marketing")){
      const sectionNumber = dynamicSectionNumberMap["marketing"];
      data.marketing_practices= {
        page: "screen_fifteen",
        label: `${sectionNumber} Marketing`,
        subLabel: "Add statement about company’s marketing practices",
        type: "textarea",
        content: marketing_practices,
        field: "marketing_practices",
        isSkipped: false,
      }
    }
    if(subsectionsToShow.includes("customers")){
      const sectionNumber = dynamicSectionNumberMap["customers"];
      data.customers={
        page: "screen_fifteen",
        label: `${sectionNumber} Customers`,
        subLabel: "Add statement about customers",
        type: "textarea",
        content: customers,
        field: "customers",
        isSkipped: false,
      }
    }
    if(reportType!=='GRI Report: With Reference to'){
      data.conclusion= {
        page: "screen_fifteen",
        label: "Conclusion",
        subLabel: "Add a conclusion to the report",
        type: "richTextarea",
        content: conclusion,
        field: "conclusion",
        isSkipped: false,
      }
    }

    const url = `${process.env.BACKEND_API_URL}/esg_report/screen_fifteen/${reportid}/`;
    try {
      const response = await axiosInstance.put(url, data);

      if (response.status === 200) {
        if (type == "last") {
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
    dispatch(setCommitmentStatement(""));
    dispatch(setProductInfo(""));
    dispatch(setMarketingPractices(""));
    dispatch(setConclusion(""));
    dispatch(setCustomers(""));
    const url = `${process.env.BACKEND_API_URL}/esg_report/screen_fifteen/${reportid}/`;
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
          setCommitmentStatement(
            response.data.commitment_statement?.content || ""
          )
        );
        dispatch(
          setProductInfo(response.data.product_info_labelling?.content || "")
        );
        dispatch(
          setMarketingPractices(
            response.data.marketing_practices?.content || ""
          )
        );
        dispatch(setConclusion(response.data.conclusion?.content || ""));
        dispatch(setCustomers(response.data.customers?.content || ""));
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
      //console.log(section.sectionNumber,"See the sections")
  
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
  //         15. Customers, Products & Services 
  //       </h3>
  //       <div className="flex gap-4">
  //         <div className="xl:w-[80%] md:w-[75%] lg:w-[80%]  2k:w-[80%] 4k:w-[80%] 2xl:w-[80%]  w-full">
  //           <Section1 section15_1Ref={section15_1Ref} data={data} />
  //           {reportType=='GRI Report: In accordance With' && <Section2 section15_1_1Ref={section15_1_1Ref} data={data} /> }  
  //           <Section3 section15_1_2Ref={section15_1_2Ref} data={data} reportType={reportType} />
  //           <Section4 section15_1_3Ref={section15_1_3Ref} data={data} reportType={reportType} />
  //           <Section5 section15_2Ref={section15_2Ref} data={data} reportType={reportType} />
  //           {reportType=='GRI Report: In accordance With' && <Section6 section15_2_1Ref={section15_2_1Ref} data={data} /> } 
            
  //           <Section7 section15_2_2Ref={section15_2_2Ref} data={data} reportType={reportType} />
  //           <Section8 section15_3Ref={section15_3Ref} data={data} reportType={reportType}/>
  //           {reportType=='GRI Report: In accordance With' && <Section9
  //             section15_3_1Ref={section15_3_1Ref}
  //             orgName={orgName}
  //             data={data}
  //           /> } 
           
            
  //         </div>
  //         {/* page sidebar */}

  //         <div className="p-4 border border-r-2 border-b-2 shadow-lg rounded-lg h-[550px] top-20 sticky mt-2 w-[20%] md:w-[25%] lg:w-[20%] xl:sticky xl:top-36 lg:sticky lg:top-36  md:fixed 
  // md:top-[19rem]
  // md:right-4  hidden xl:block md:block lg:block 2k:block 4k:block 2xl:block">
  //           <p className="text-[11px] text-[#727272] mb-2 uppercase">
  //             15. Customers, products & services 
  //           </p>
  //           <p
  //             className={`text-[12px] mb-2 cursor-pointer ${
  //               activeSection === "section15_1" ? "text-blue-400" : ""
  //             }`}
  //             onClick={() => scrollToSection(section15_1Ref, "section15_1")}
  //           >
  //             15.1. Products and services 
  //           </p>
  //           {reportType=='GRI Report: In accordance With'?(
  //              <p
  //              className={`text-[11px] mb-2 ml-2 cursor-pointer ${
  //                activeSection === "section15_1_1" ? "text-blue-400" : ""
  //              }`}
  //              onClick={() => scrollToSection(section15_1_1Ref, "section15_1_1")}
  //            >
  //              15.1.1. Management of material topic
  //            </p>
  //           ):(
  //             <div></div>
  //           )}
           
  //           <p
  //             className={`text-[11px] mb-2 ml-2 cursor-pointer ${
  //               activeSection === "section15_1_2" ? "text-blue-400" : ""
  //             }`}
  //             onClick={() => scrollToSection(section15_1_2Ref, "section15_1_2")}
  //           >
  //            {reportType=='GRI Report: In accordance With'?'15.1.2.':'15.1.1.'}  Health and safety impacts of product and service
  //             categories
  //           </p>
  //           <p
  //             className={`text-[11px] mb-2 ml-2 cursor-pointer ${
  //               activeSection === "section15_1_3" ? "text-blue-400" : ""
  //             }`}
  //             onClick={() => scrollToSection(section15_1_3Ref, "section15_1_3")}
  //           >
  //           {reportType=='GRI Report: In accordance With'?'15.1.3.':'15.1.2.'}  Incidents of non-compliance
  //           </p>
  //           <p
  //             className={`text-[12px] mb-2 cursor-pointer ${
  //               activeSection === "section15_2" ? "text-blue-400" : ""
  //             }`}
  //             onClick={() => scrollToSection(section15_2Ref, "section15_2")}
  //           >
  //             15.2. Product and service information and labelling
  //           </p>
  //           {reportType=='GRI Report: In accordance With'?(
  //              <p
  //              className={`text-[11px] mb-2 ml-2 cursor-pointer ${
  //                activeSection === "section15_2_1" ? "text-blue-400" : ""
  //              }`}
  //              onClick={() => scrollToSection(section15_2_1Ref, "section15_2_1")}
  //            >
  //              15.2.1. Management of material topic
  //            </p>
  //           ):(
  //             <div></div>
  //           )}
           
  //           <p
  //             className={`text-[11px] mb-2 ml-2 cursor-pointer ${
  //               activeSection === "section15_2_2" ? "text-blue-400" : ""
  //             }`}
  //             onClick={() => scrollToSection(section15_2_2Ref, "section15_2_2")}
  //           >
  //            {reportType=='GRI Report: In accordance With'?'15.2.2.':'15.2.1.'} Marketing
  //           </p>
  //           <p
  //             className={`text-[12px] mb-2 cursor-pointer ${
  //               activeSection === "section15_3" ? "text-blue-400" : ""
  //             }`}
  //             onClick={() => scrollToSection(section15_3Ref, "section15_3")}
  //           >
  //             15.3. Customers 
  //           </p>
  //           {reportType=='GRI Report: In accordance With'?(
  //              <p
  //              className={`text-[11px] mb-2 ml-2 cursor-pointer ${
  //                activeSection === "section15_3_1" ? "text-blue-400" : ""
  //              }`}
  //              onClick={() => scrollToSection(section15_3_1Ref, "section15_3_1")}
  //            >
  //              15.3.1. Management of material topic
  //            </p>
  //           ):(
  //             <div></div>
  //           )}
           
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
            {sectionOrder}. Customers, Products & Services
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
           {reportType!=='GRI Report: With Reference to' && (
             <Section10
             orgName={orgName}
             data={data}
             sectionOrder={sectionOrder}
             sectionNumber={null} // Not numbered
           />
           )}
          </div>

          {/* Page sidebar - only show if there are subsections */}
          {selectedSubsections.length > 0 && (
            <div className="p-4 border border-r-2 border-b-2 shadow-lg rounded-lg h-[500px] top-36 sticky mt-2 w-[20%] md:w-[25%] lg:w-[20%] xl:sticky xl:top-36 lg:sticky lg:top-36 md:fixed md:top-[19rem] md:right-4 hidden xl:block md:block lg:block 2k:block 4k:block 2xl:block z-10 bg-white">
              <p className="text-[11px] text-[#727272] mb-2 uppercase">
                {sectionOrder}. Customers, Products & Services 
              </p>

              {(() => {
                let groupIndex = 1;

                const groupedSidebar = [
                  {
                    groupId: "products_services",
                    title: "Products and Services",
                    children: [
                      {
                        id: 'products_services_material_topic_management',
                        label: 'Management of material topic'
                      },
                      {
                        id: 'safety_impact',
                        label: 'Health and safety impacts of product and service categories'
                      },
                      {
                        id: 'non_compliance',
                        label: 'Incidents of non-compliance'
                      }
                    ]
                  },
                  {
                    groupId: "product_labeling",
                    title: "Product and Service Information & Labelling",
                    children: [
                      {
                        id: 'product_labeling_material_topic_management',
                        label: 'Management of material topic'
                      },
                      {
                        id: 'marketing',
                        label: 'Marketing'
                      }
                    ]
                  },
                  {
                    groupId: "customers",
                    title: "Customers",
                    children: [
                      {
                        id: 'customers_material_topic_management',
                        label: 'Management of material topic'
                      }
                    ]
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
CustomerProductService.displayName = "CustomerProductService";

export default CustomerProductService;

