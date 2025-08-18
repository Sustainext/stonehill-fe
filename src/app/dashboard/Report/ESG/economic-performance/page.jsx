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
import Section11 from "./sections/section11";
import Section12 from "./sections/section12";
import Section13 from "./sections/section13";
import Section14 from "./sections/section14";
import Section15 from "./sections/section15";
import Section16 from "./sections/section16";
import Section17 from "./sections/section17";
import Section18 from "./sections/section18";
import Section19 from "./sections/section19";
import Section20 from "./sections/section20";
import Section21 from './sections/section21'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { Oval } from "react-loader-spinner";
import axiosInstance from "../../../../utils/axiosMiddleware";
import {
  setCompanyeconomic,
  setFinancialassistanc,
  setIntroductionto,
  setInfrastructureInvestment,
  setgetdata,
} from "../../../../../lib/redux/features/ESGSlice/screen11Slice";

const EconomicPerformance = forwardRef(
  (
    {
      onSubmitSuccess,
      subsections = [],
      sectionOrder = 11,
      sectionId,
      sectionTitle,
      hasChanges,
    },
    ref
  ) => {
    const [data, setData] = useState("");
    const [initialData, setInitialData] = useState({});
    
    const [reportid, setReportid] = useState("");
    const [reportType, setReportType] = useState("");
    const [orgName, setOrgname] = useState("");
    
    // Update after mount on client only
    useEffect(() => {
      setReportid(localStorage.getItem("reportid") || "");
      setReportType(localStorage.getItem("reportType") || "");
      setOrgname(localStorage.getItem("reportorgname") || "");
    }, []);
    
    const company_economic_performance_statement = useSelector(
      (state) => state.screen11Slice.company_economic_performance_statement
    );
    const financial_assistance_from_government = useSelector(
      (state) => state.screen11Slice.financial_assistance_from_government
    ); // Assuming imageceo is a File object
    const introduction_to_economic_value_creation = useSelector(
      (state) => state.screen11Slice.introduction_to_economic_value_creation
    );

    const infrastructure_investement = useSelector(
      (state) => state.screen11Slice.infrastructure_investement
    );

    const [activeSection, setActiveSection] = useState(`economic_highlights`);
    const apiCalledRef = useRef(false);
    const [loopen, setLoOpen] = useState(false);
    const dispatch = useDispatch();

    const isWithReference = reportType === "GRI Report: With Reference to";

    const groupedSubsections = [
      {
        groupId: "economic_highlights",
        title: "Highlights",
        children: [
          !isWithReference && {
            id: "highlights_material_topic_management",
            label: "Management Of Material Topics",
          },
          {
            id: "economic_value_creation",
            label: "Economic Value Creation",
          },
          {
            id: "financial_assistance_government",
            label: "Financial Assistance Received From Government",
          },
        ].filter(Boolean),
      },
      {
        groupId: "infrastructure_investment",
        title: "Infrastructure Investment And Services Supported",
        children: [
          !isWithReference && {
            id: "infrastructure_material_topic_management",
            label: "Management Of Material Topics",
          },
          {
            id: "indirect_economic_impacts",
            label: "Indirect Economic Impacts",
          },
        ].filter(Boolean),
      },
      {
        groupId: "climate_financials",
        title: "Climate-Related Financial Implications, Risks And Opportunities",
        children: [
          !isWithReference && {
            id: "climate_material_topic_management",
            label: "Management Of Material Topics",
          },
          {
            groupId: "climate_financial_implications",
            title: "Climate-Related Financial Implications",
            children: [
              {
                id: "climate_related_risks",
                label: "Climate-Related Risks",
              },
              {
                id: "climate_related_opportunities",
                label: "Climate-Related Opportunities",
              },
            ],
          },
        ].filter(Boolean),
      },
      {
        groupId: "tax",
        title: "Tax",
        children: [
          !isWithReference && {
            id: "tax_material_topic_management",
            label: "Management Of Material Topic",
          },
          {
            id: "approach_to_tax",
            label: "Approach To Tax",
          },
          {
            id: "tax_governance_risk",
            label: "Tax Governance And Risk Management",
          },
          {
            id: "tax_stakeholder_engagement",
            label: "Stakeholder Engagement And Management Of Concerns Related To Tax",
          },
        ].filter(Boolean),
      },
      {
        groupId: "anti_corruption",
        title: "Anti-Corruption",
        children: [
          !isWithReference && {
            id: "anti_corruption_material_topic_management",
            label: "Management Of Material Topic",
          },
          {
            id: "risk_assessment_anti_corruption",
            label: "Operations Assessed For Risks Related To Anti-Corruption",
          },
          {
            id: "incidents_anti_corruption",
            label: "Incidents Of Anti-Corruption",
          },
          {
            id: "training_anti_corruption",
            label: "Training On Anti-Corruption",
          },
        ].filter(Boolean),
      },
      {
        groupId: "political_contribution",
        title: "Political Contribution",
        children: [
          !isWithReference && {
            id: "political_contribution_material_topic_management",
            label: "Management Of Material Topic",
          },
        ].filter(Boolean),
      },
    ];
    
    

    const subsectionMapping = {
      // Economic Highlights
      economic_highlights: {
        component: ({ section11_1Ref,sectionNumber = "11.1",
          sectionTitle = 'Highlights',
          sectionOrder = 11, })=>{
          return (
            <div id="section11_1" ref={section11_1Ref}>
        <h3 className="text-[17px] text-[#344054] mb-4 text-left font-semibold">
         {sectionNumber} {sectionTitle}
        </h3>
      </div>
          )
        },
        title: "Highlights",
        subSections: [],
      },
      ...(!isWithReference && {
        highlights_material_topic_management: {
          component: Section2,
          title: "Management Of Material Topics",
          subSections: [],
        }
      }),
      economic_value_creation: {
        component: Section3,
        title: "Economic Value Creation",
        subSections: [],
      },
      financial_assistance_government: {
        component: Section4,
        title: "Financial Assistance Received From Government",
        subSections: [],
      },
    
      // Infrastructure Investment
      infrastructure_investment: {
        component: Section5,
        title: "Infrastructure Investment And Services Supported",
        subSections: [],
      },
      ...(!isWithReference && { infrastructure_material_topic_management: {
        component: Section6,
        title: "Management Of Material Topics",
        subSections: [],
      }}),
      indirect_economic_impacts: {
        component: Section7,
        title: "Indirect Economic Impacts",
        subSections: [],
      },
    
      // Climate Financials
      climate_financials: {
        component: ({section11_3Ref,sectionNumber = "11.3",
          sectionTitle = 'Climate-related Impacts, Risks, and Opportunities',
          sectionOrder = 11})=>{
          return (
            <div id="section11_3" ref={section11_3Ref}>
            <h3 className="text-[17px] text-[#344054] mb-4 text-left font-semibold">
             {sectionNumber} {sectionTitle}
            </h3>
          </div>
          )
        },
        title: "Climate-Related Financial Implications, Risks And Opportunities",
        subSections: [],
      },
      ...(!isWithReference && { climate_material_topic_management: {
        component: Section8,
        title: "Management Of Material Topics",
        subSections: [],
      }}),
      climate_financial_implications: {
        component: Section9,
        title: "Climate-Related Financial Implications",
        subSections: [],
      },
      climate_related_risks: {
        component: Section10,
        title: "Climate-Related Risks",
        subSections: [],
      },
      climate_related_opportunities: {
        component: Section11,
        title: "Climate-Related Opportunities",
        subSections: [],
      },
    
      // Tax
      tax: {
        component: ({section11_4Ref,sectionNumber = "11.4",
          sectionTitle = 'Tax',
          sectionOrder = 11})=>{
          return (
            <div id="section11_4" ref={section11_4Ref}>
            <h3 className="text-[17px] text-[#344054] mb-4 text-left font-semibold">
             {sectionNumber} {sectionTitle}
            </h3>
          </div>
          )
        },
        title: "Tax",
        subSections: [],
      },
      ...(!isWithReference && { tax_material_topic_management: {
        component: Section12,
        title: "Management Of Material Topic",
        subSections: [],
      }}),
      approach_to_tax: {
        component: Section13,
        title: "Approach To Tax",
        subSections: [],
      },
      tax_governance_risk: {
        component: Section14,
        title: "Tax Governance And Risk Management",
        subSections: [],
      },
      tax_stakeholder_engagement: {
        component: Section15,
        title: "Stakeholder Engagement And Management Of Concerns Related To Tax",
        subSections: [],
      },
    
      // Anti-Corruption
      anti_corruption: {
        component: ({section11_5Ref,sectionNumber = "11.5",
          sectionTitle = 'Anti-Corruption',
          sectionOrder = 11})=>{
          return (
            <div id="section11_5" ref={section11_5Ref}>
            <h3 className="text-[17px] text-[#344054] mb-4 text-left font-semibold">
             {sectionNumber} {sectionTitle}
            </h3>
          </div>
          )
        },
        title: "Anti-Corruption",
        subSections: [],
      },
      ...(!isWithReference && { anti_corruption_material_topic_management: {
        component: Section16,
        title: "Management Of Material Topic",
        subSections: [],
      }}),
      risk_assessment_anti_corruption: {
        component: Section17,
        title: "Operations Assessed For Risks Related To Anti-Corruption",
        subSections: [],
      },
      incidents_anti_corruption: {
        component: Section18,
        title: "Incidents Of Anti-Corruption",
        subSections: [],
      },
      training_anti_corruption: {
        component: Section19,
        title: "Training On Anti-Corruption",
        subSections: [],
      },
    
      // Political Contribution
      political_contribution: {
        component: Section20,
        title: "Political Contribution",
        subSections: [],
      },
      ...(!isWithReference && { political_contribution_material_topic_management: {
        component: Section21,
        title: "Management Of Material Topic",
        subSections: [],
      }}),
    };

    
    
    const getSubsectionsToShow = () => {
      if (reportType === "Custom ESG Report") {
        const userSelected = Array.isArray(subsections) ? subsections : [];

        // Get default order
        const defaultOrder = [
          "economic_highlights",
          "highlights_material_topic_management",
          "economic_value_creation",
          "financial_assistance_government",
          "infrastructure_investment",
          "infrastructure_material_topic_management",
          "indirect_economic_impacts",
          "climate_financials",
          "climate_material_topic_management",
          "climate_financial_implications",
          "climate_related_risks",
          "climate_related_opportunities",
          "tax",
          "tax_material_topic_management",
          "approach_to_tax",
          "tax_governance_risk",
          "tax_stakeholder_engagement",
          "anti_corruption",
          "anti_corruption_material_topic_management",
          "risk_assessment_anti_corruption",
          "incidents_anti_corruption",
          "training_anti_corruption",
          "political_contribution",
          "political_contribution_material_topic_management",
        ];

        // Return sorted list based on fixed order
        return defaultOrder.filter((id) => userSelected.includes(id));
      } else {
        return[
          "economic_highlights",
          "highlights_material_topic_management",
          "economic_value_creation",
          "financial_assistance_government",
          "infrastructure_investment",
          "infrastructure_material_topic_management",
          "indirect_economic_impacts",
          "climate_financials",
          "climate_material_topic_management",
          "climate_financial_implications",
          "climate_related_risks",
          "climate_related_opportunities",
          "tax",
          "tax_material_topic_management",
          "approach_to_tax",
          "tax_governance_risk",
          "tax_stakeholder_engagement",
          "anti_corruption",
          "anti_corruption_material_topic_management",
          "risk_assessment_anti_corruption",
          "incidents_anti_corruption",
          "training_anti_corruption",
          "political_contribution",
          "political_contribution_material_topic_management",
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

    
    
    
    
    //   groupedSubsections.forEach((group) => {
    //     if (group.children) {
    //       const parentSelected = selectedSubsections.some((s) => s.id === group.groupId);
    //       const visibleChildren = group.children.filter((child) =>
    //         selectedSubsections.some((s) => s.id === child.id)
    //       );
    
    //       // Render the parent (if selected)
    //       if (parentSelected) {
    //         dynamicMap.push({
    //           id: group.groupId,
    //           sectionNumber: `${sectionOrder}.${groupIndex}`,
    //           groupTitle: `${sectionOrder}.${groupIndex} ${group.title}`,
    //         });
    //       }
    
    //       // Render children (if any selected)
    //       if (visibleChildren.length > 0) {
    //         let childIndex = 1;
    //         visibleChildren.forEach((child) => {
    //           dynamicMap.push({
    //             id: child.id,
    //             sectionNumber: `${sectionOrder}.${groupIndex}.${childIndex++}`,
    //             groupTitle: `${sectionOrder}.${groupIndex} ${group.title}`,
    //           });
    //         });
    //       }
    
    //       // Increase group index if either parent or children are rendered
    //       if (parentSelected || visibleChildren.length > 0) {
    //         groupIndex++;
    //       }
    //     } else {
    //       const isVisible = selectedSubsections.some((s) => s.id === group.id);
    //       if (!isVisible) return;
    
    //       dynamicMap.push({
    //         id: group.id,
    //         sectionNumber: `${sectionOrder}.${groupIndex++}`,
    //       });
    //     }
    //   });
    
    //   return dynamicMap;
    // };


 const getDynamicSectionMap = () => {
  function walk(nodes, sectionPath = [], groupTitle = '') {
    let map = [];
    // Don't filter nodes, always walk all for numbering!
    nodes.forEach((item, i) => {
      // Section index for this item (i+1 to get 1-based indexing)
      const thisIndex = i + 1;
      const currentSectionNumber = [...sectionPath, thisIndex].join('.');

      // Check if this item is selected
      const isSelected = selectedSubsections.some((s) => s.id === (item.groupId || item.id));

      // Descend into children regardless (for numbering, but only render visible ones)
      let visibleDescendants = [];
      if (item.children && item.children.length > 0) {
        visibleDescendants = walk(item.children, [...sectionPath, thisIndex], `${currentSectionNumber} ${item.title || item.label}`);
      }

      // Only render if node or any descendent is selected/visible
      if (isSelected || visibleDescendants.length > 0) {
        map.push({
          id: item.groupId || item.id,
          sectionNumber: currentSectionNumber,
          groupTitle: groupTitle ? groupTitle : undefined
        });

        map = map.concat(visibleDescendants);
      }
    });
    return map;
  }

  // sectionOrder is assumed to be a string/number like "11"
  return walk(groupedSubsections, [sectionOrder]);
};
    const numberedSubsections = getDynamicSectionMap();
    console.log(numberedSubsections,"kkllkkl")

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

    const currentData = {
      company_economic_performance_statement,
      introduction_to_economic_value_creation,
      financial_assistance_from_government,
      infrastructure_investement,
    };
    const submitForm = async (type) => {
      LoaderOpen();
      if (!hasChanges(initialData, currentData)) {
        LoaderClose();
        return false;
      }

      const data={};
      data.company_economic_performance_statement={
        page: "screen_eleven",
        label: `${sectionOrder}. Economic Performance`,
        subLabel: "Add statement about company’s economic performance",
        type: "textarea",
        content: company_economic_performance_statement,
        field: "company_economic_performance_statement",
        isSkipped: false,
      }
      if (subsectionsToShow.includes("economic_value_creation")) {
        const sectionNumber = dynamicSectionNumberMap["economic_value_creation"];
        data.introduction_to_economic_value_creation= {
          page: "screen_eleven",
          label: `${sectionNumber} Economic Value Creation`,
          subLabel: "Add introduction for company’s economic value creation",
          type: "textarea",
          content: introduction_to_economic_value_creation,
          field: "introduction_to_economic_value_creation",
          isSkipped: false,
        }
      }
      if (subsectionsToShow.includes("financial_assistance_government")) {
        const sectionNumber = dynamicSectionNumberMap["financial_assistance_government"];
        data.financial_assistance_from_government={
          page: "screen_eleven",
          label: `${sectionNumber} Financial Assistance Received from Government`,
          subLabel:
            "Add introduction about financial assistance received from government",
          type: "textarea",
          content: financial_assistance_from_government,
          field: "financial_assistance_from_government",
          isSkipped: false,
        
      }
    }
      if (subsectionsToShow.includes("infrastructure_investment")) {
        const sectionNumber = dynamicSectionNumberMap["infrastructure_investment"];
        data.infrastructure_investement= {
          page: "screen_eleven",
          label: `${sectionNumber} Infrastructure Investment and Services Supported`,
          subLabel:
            "Add statement for infrastructure investment and services provided",
          type: "textarea",
          content: infrastructure_investement,
          field: "infrastructure_investement",
          isSkipped: false,
        }
      }

      const url = `${process.env.BACKEND_API_URL}/esg_report/screen_eleven/${reportid}/`;
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
      dispatch(setCompanyeconomic(""));
      dispatch(setFinancialassistanc(""));
      dispatch(setIntroductionto(""));
      dispatch(setInfrastructureInvestment(""));

      const url = `${process.env.BACKEND_API_URL}/esg_report/screen_eleven/${reportid}/`;
      try {
        const response = await axiosInstance.get(url);
        if (response.data) {
          console.error("API response data11", response.data);
          const flatData = {};
          Object.keys(response.data).forEach((key) => {
            flatData[key] = response.data[key]?.content || "";
          });

          setInitialData(flatData);
          setData(response.data);
          dispatch(setgetdata(response.data));
          dispatch(
            setCompanyeconomic(
              response.data.company_economic_performance_statement?.content ||
                ""
            )
          );
          dispatch(
            setIntroductionto(
              response.data.introduction_to_economic_value_creation?.content ||
                ""
            )
          );
          dispatch(
            setFinancialassistanc(
              response.data.financial_assistance_from_government?.content || ""
            )
          );
          dispatch(
            setInfrastructureInvestment(
              response.data.infrastructure_investement?.content || ""
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
          // console.log(section,"see all sections")
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


  return (
    <>
      <div className="mx-2 p-2">
        <div>
          <h3 className="text-[22px] text-[#344054] mb-4 text-left font-semibold">
            {sectionOrder}. Economic Performance
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
             <div className={`p-4 border border-r-2 border-b-2 shadow-lg rounded-lg ${selectedSubsections.length < 5 ? 'h-[500px]' : 'h-fit'} top-36 sticky mt-2 w-[20%] md:w-[25%] lg:w-[20%] xl:sticky xl:top-36 lg:sticky lg:top-36 md:fixed md:top-[19rem] md:right-4 hidden xl:block md:block lg:block 2k:block 4k:block 2xl:block z-10 bg-white`}>
              <p className="text-[11px] text-[#727272] mb-2 uppercase">
                {sectionOrder}. Economic Performance 
              </p>

              {(() => {
                let groupIndex = 1;

                const groupedSidebar = [
                  {
                    groupId: "economic_highlights",
                    title: "Highlights",
                    children: [
                      {
                        id: "highlights_material_topic_management",
                        label: "Management Of Material Topics",
                      },
                      {
                        id: "economic_value_creation",
                        label: "Economic Value Creation",
                      },
                      {
                        id: "financial_assistance_government",
                        label: "Financial Assistance Received From Government",
                      },
                    ],
                  },
                  {
                    groupId: "infrastructure_investment",
                    title: "Infrastructure Investment And Services Supported",
                    children: [
                      {
                        id: "infrastructure_material_topic_management",
                        label: "Management Of Material Topics",
                      },
                      {
                        id: "indirect_economic_impacts",
                        label: "Indirect Economic Impacts",
                      },
                    ],
                  },
                  {
                    groupId: "climate_financials",
                    title: "Climate-Related Financial Implications, Risks And Opportunities",
                    children: [
                      {
                        id: "climate_material_topic_management",
                        label: "Management Of Material Topics",
                      },
                      {
                        groupId: "climate_financial_implications",
                        title: "Climate-Related Financial Implications",
                        children: [
                          {
                            id: "climate_related_risks",
                            label: "Climate-Related Risks",
                          },
                          {
                            id: "climate_related_opportunities",
                            label: "Climate-Related Opportunities",
                          },
                        ],
                      },
                    ],
                  },
                  {
                    groupId: "tax",
                    title: "Tax",
                    children: [
                      {
                        id: "tax_material_topic_management",
                        label: "Management Of Material Topic",
                      },
                      {
                        id: "approach_to_tax",
                        label: "Approach To Tax",
                      },
                      {
                        id: "tax_governance_risk",
                        label: "Tax Governance And Risk Management",
                      },
                      {
                        id: "tax_stakeholder_engagement",
                        label: "Stakeholder Engagement And Management Of Concerns Related To Tax",
                      },
                    ],
                  },
                  {
                    groupId: "anti_corruption",
                    title: "Anti-Corruption",
                    children: [
                      {
                        id: "anti_corruption_material_topic_management",
                        label: "Management Of Material Topic",
                      },
                      {
                        id: "risk_assessment_anti_corruption",
                        label: "Operations Assessed For Risks Related To Anti-Corruption",
                      },
                      {
                        id: "incidents_anti_corruption",
                        label: "Incidents Of Anti-Corruption",
                      },
                      {
                        id: "training_anti_corruption",
                        label: "Training On Anti-Corruption",
                      },
                    ],
                  },
                  {
                    groupId: "political_contribution",
                    title: "Political Contribution",
                    children: [
                      {
                        id: "political_contribution_material_topic_management",
                        label: "Management Of Material Topic",
                      },
                    ],
                  },
                ];
                
                

                // return groupedSidebar.map((item) => {
                //   if (item.children) {
                //     const isGroupSelected = selectedSubsections.some(
                //       (sec) => sec.id === item.groupId
                //     );
                
                //     const visibleChildren = item.children.filter((child) =>
                //       selectedSubsections.some((sec) => sec.id === child.id)
                //     );
                    
                //     // Show group if parent OR any child is selected
                //     if (!isGroupSelected && visibleChildren.length === 0) return null;
                
                //     const currentGroupIndex = groupIndex++;
                //     let childIndex = 1;
                
                //     return (
                //       <div key={item.groupId} className="mb-2">
                //         {/* Show the parent title (group) */}
                //         <p
                //           className={`text-[12px] mb-2 font-medium cursor-pointer  ${
                //                 activeSection === item.groupId ? "text-blue-400" : "text-gray-600"
                //               }`}
                //           onClick={() => scrollToSection(item.groupId)} // optional scroll to parent section
                //         >
                //           {sectionOrder}.{currentGroupIndex} {item.title}
                //         </p>
                
                //         {/* Render selected children */}
                //         {visibleChildren.map((child) => {
                //           const labelText =
                //             child.label?.trim() !== "" ? child.label : item.title;
                
                //           return (
                //             <p
                //               key={child.id}
                //               className={`text-[11px] mb-2 ml-2 cursor-pointer ${
                //                 activeSection === child.id ? "text-blue-400" : ""
                //               }`}
                //               onClick={() => scrollToSection(child.id)}
                //             >
                //               {sectionOrder}.{currentGroupIndex}.{childIndex++} {labelText}
                //             </p>
                //           );
                //         })}
                //       </div>
                //     );
                //   } else {
                //     // Standalone item
                //     if (!selectedSubsections.some((sec) => sec.id === item.id)) return null;
                
                //     const label = `${sectionOrder}.${groupIndex++} ${item.label}`;
                //     return (
                //       <p
                //         key={item.id}
                //         className={`text-[12px] mb-2 cursor-pointer ${
                //           activeSection === item.id ? "text-blue-400" : ""
                //         }`}
                //         onClick={() => scrollToSection(item.id)}
                //       >
                //         {label}
                //       </p>
                //     );
                //   }
                // });
                
                const renderGroup = (item, indexPath = "", level = 1) => {
    const isGroupSelected = selectedSubsections.some(
      (sec) => sec.id === item.groupId || sec.id === item.id
    );

    const visibleChildren =
      item.children?.filter((child) =>
        selectedSubsections.some((sec) => sec.id === child.id || sec.id === child.groupId)
      ) || [];

    if (!isGroupSelected && visibleChildren.length === 0) return null;

    const currentLabel = `${sectionOrder}.${indexPath}`;
    const key = item.groupId || item.id;

    return (
      <div key={key} className={`mb-${level === 1 ? "2" : "1"} ml-${level * 1}`}>
        <p
          className={`text-[${level === 1 ? "12px" : "11px"}] mb-2 font-medium cursor-pointer ${
            activeSection === key ? "text-blue-400" : "text-gray-600"
          }`}
          onClick={() => scrollToSection(key)}
        >
          {currentLabel} {item.title || item.label}
        </p>

        {visibleChildren.map((child, i) =>
          renderGroup(child, `${indexPath}.${i + 1}`, level + 1)
        )}
      </div>
    );
  };

  return groupedSidebar.map((item, index) =>
    renderGroup(item, `${index + 1}`, 1)
  );

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

EconomicPerformance.displayName = "EconomicPerformance";

export default EconomicPerformance;
