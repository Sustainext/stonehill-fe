"use client";
import {
  forwardRef,
  useImperativeHandle,
  createRef,
  useState,
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
import Section21 from "./sections/section21";
import Section22 from "./sections/section22";
import Section23 from "./sections/section23";
import Section25 from "./sections/section25";
import axiosInstance, { patch } from "../../../../utils/axiosMiddleware";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { Oval } from "react-loader-spinner";
import {
  setStatement,
  setBoardGov,
  setRemunerationPolicies,
  setPolicyPublic,
} from "../../../../../lib/redux/features/ESGSlice/screen9Slice";

const CorporateGovernance = forwardRef(({
  onSubmitSuccess,
  subsections = [],
  sectionOrder = 9,
  sectionId,
  sectionTitle,
  hasChanges
}, ref) => {
  const [activeSection, setActiveSection] = useState("board_of_directors");
 

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
  const statement = useSelector((state) => state.screen9Slice.statement);
  const board_gov_statement = useSelector(
    (state) => state.screen9Slice.board_gov_statement
  );
  const remuneration_policies = useSelector(
    (state) => state.screen9Slice.remuneration_policies
  );
  const policy_not_public_reason = useSelector(
    (state) => state.screen9Slice.policy_not_public_reason
  );

  const dispatch = useDispatch();
  const isWithReference = reportType === "GRI Report: With Reference to";
  const groupedSubsections = [
    {
      groupId: "board_of_directors",
      title: "Board of Directors",
      children: [
        { id: "governance_structure_composition" }
      ],
    },
    {
      groupId: "general_governance",
      title: "General Governance",
      children: [
        { id: "nomination_selection" },
        { id: "chair_highest_governance_body" },
        { id: "senior_management_local" },
        !isWithReference &&{ id: "management_of_material_topic" },
      ].filter(Boolean),
    },
    {
      groupId: "board_responsibility_evaluation_remuneration",
      title: "Responsibility, Evaluation and Remuneration of the Board",
      children: [
        { id: "role_highest_governance_body" },
        { id: "collective_knowledge" },
        { id: "sustainability_reporting_role" },
        { id: "delegation_of_responsibility" },
        { id: "communication_critical_concerns" },
        { id: "performance_evaluation" },
        { id: "remuneration_policies_process" },
        { id: "annual_compensation_ratio" },
      ],
    },
    {
      groupId: "strategy",
      title: "Strategy",
      children: [
        { id: "sustainable_strategy_statement" },
        { id: "membership_association" },
      ],
    },
    {
      groupId: "risk_management",
      title: "Risk Management",
      children: [
        { id: "remediation_negative_impacts" },
        { id: "advice_mechanism" },
        { id: "compliance" },
      ],
    },
    {
      groupId: "policy",
      title: "Policy",
      children: [
        { id: "embedding_policy_commitment" },
        { id: "anti_trust_behavior" },
        { id: "retirement_benefits" },
      ],
    },
    {
      id: "conflict_of_interest",
      title: "Conflict of interest",
    },
  ];
  
    
  const subsectionMapping = {
    board_of_directors: {
      component: ({section9_1Ref,data, sectionNumber = "9.1", sectionTitle = "Board of Directors", sectionOrder = 9})=>{
        return(
          <div id="section9_1" ref={section9_1Ref}>
        <h3 className="text-[17px] text-[#344054] mb-4 text-left font-semibold">
         {sectionNumber} {sectionTitle}
        </h3>
      </div>
        )
      },
      title: "Board of Directors",
      subSections: [],
    },
    governance_structure_composition: {
      component: Section2,
      title: "Governance structure and composition",
      subSections: [],
    },
    general_governance:{
      component: ({section9_2Ref,data, sectionNumber = "9.2", sectionTitle = "General Governance", sectionOrder = 9})=>{
        return(
          <div id="section9_2" ref={section9_2Ref}>
        <h3 className="text-[17px] text-[#344054] mb-4 text-left font-semibold">
         {sectionNumber} {sectionTitle}
        </h3>
      </div>
        )
      },
      title: "General Governance",
      subSections: [],
    },
    nomination_selection: {
      component: Section3,
      title: "Nomination, selection of the highest governance body",
      subSections: [],
    },
    chair_highest_governance_body: {
      component: Section4,
      title: "Chair of the highest governance body",
      subSections: [],
    },
    senior_management_local: {
      component: Section5,
      title: "Senior management hired from local community",
      subSections: [],
    },
    ...(!isWithReference && { management_of_material_topic: {
      component: Section6,
      title: "Management of material topic",
      subSections: [],
    }}),
    board_responsibility_evaluation_remuneration:{
      component: ({section9_3Ref,data, sectionNumber = "9.3", sectionTitle = "Responsibility, Evaluation, and Remuneration of the Board", sectionOrder = 9})=>{
        return (
          <div id="section9_3" ref={section9_3Ref}>
          <h3 className="text-[17px] text-[#344054] mb-4 text-left font-semibold">
            {sectionNumber} {sectionTitle}
          </h3>
        </div>
        )
      },
      title: "Responsibility, Evaluation, and Remuneration of the Board ",
      subSections: [],
    },
    role_highest_governance_body: {
      component: Section7,
      title: "Role of the highest governance body",
      subSections: [],
    },
    collective_knowledge: {
      component: Section8,
      title: "Collective knowledge of the highest governance body",
      subSections: [],
    },
    sustainability_reporting_role: {
      component: Section9,
      title: "Role of the highest governance body in sustainability reporting",
      subSections: [],
    },
    delegation_of_responsibility: {
      component: Section10,
      title: "Delegation of responsibility for managing impacts",
      subSections: [],
    },
    communication_critical_concerns: {
      component: Section11,
      title: "Communication of critical concerns",
      subSections: [],
    },
    performance_evaluation: {
      component: Section12,
      title: "Evaluation of the performance of the highest governance body",
      subSections: [],
    },
    remuneration_policies_process: {
      component: Section13,
      title: "Remuneration policies & process to determine remuneration",
      subSections: [],
    },
    annual_compensation_ratio: {
      component: Section14,
      title: "Annual compensation ratio",
      subSections: [],
    },
    strategy:{
      component: ({section9_4Ref,data, sectionNumber = "9.4", sectionTitle = "Strategy", sectionOrder = 9})=>{
        return(
          <div id="section9_4" ref={section9_4Ref}>
        <h3 className="text-[17px] text-[#344054] mb-4 text-left font-semibold">
        {sectionNumber} {sectionTitle}
            </h3>
        </div>
        )
      },
      title: "Strategy",
      subSections: [],
    },
    sustainable_strategy_statement: {
      component: Section15,
      title: "Statement on sustainable development strategy",
      subSections: [],
    },
    membership_association: {
      component: Section16,
      title: "Membership association",
      subSections: [],
    },
    risk_management:{
      component: ({section9_5Ref,data, sectionNumber = "9.5", sectionTitle = "Risk Management", sectionOrder = 9})=>{
        return(
          <div id="section9_5" ref={section9_5Ref}>
          <h3 className="text-[17px] text-[#344054] mb-4 text-left font-semibold">
         {sectionNumber} {sectionTitle}
              </h3>
              
          
          </div>
        )
      },
      title: "Risk Management",
      subSections: [],
    },
    remediation_negative_impacts: {
      component: Section17,
      title: "Remediation of negative impacts",
      subSections: [],
    },
    advice_mechanism: {
      component: Section18,
      title: "Mechanism for seeking advice and raising concerns",
      subSections: [],
    },
    compliance: {
      component: Section19,
      title: "Compliance",
      subSections: [],
    },
    policy: {
      component: Section20,
      title: "Policy",
      subSections: [],
    },
    embedding_policy_commitment: {
      component: Section21,
      title: "Embedding policy commitment",
      subSections: [],
    },
    anti_trust_behavior: {
      component: Section22,
      title: "Anti-trust, anti-competitive behavior, monopoly practices",
      subSections: [],
    },
    retirement_benefits: {
      component: Section23,
      title: "Defined benefit plan obligations and other retirement plans",
      subSections: [],
    },
    conflict_of_interest: {
      component: Section25,
      title: "Conflict of interest",
      subSections: [],
    },
  };
  
  
      const getSubsectionsToShow = () => {
        if (reportType === "Custom ESG Report") {
          const userSelected = Array.isArray(subsections) ? subsections : [];
    
          // Get default order
          const defaultOrder = [
            "board_of_directors",
            "governance_structure_composition",
            "general_governance",
            "nomination_selection",
            "chair_highest_governance_body",
            "senior_management_local",
            "management_of_material_topic",
            "board_responsibility_evaluation_remuneration",
            "role_highest_governance_body",
            "collective_knowledge",
            "sustainability_reporting_role",
            "delegation_of_responsibility",
            "communication_critical_concerns",
            "performance_evaluation",
            "remuneration_policies_process",
            "annual_compensation_ratio",
            "strategy",
            "sustainable_strategy_statement",
            "membership_association",
            "risk_management",
            "remediation_negative_impacts",
            "advice_mechanism",
            "compliance",
            "policy",
            "embedding_policy_commitment",
            "anti_trust_behavior",
            "retirement_benefits",
            "conflict_of_interest"
          ];
          
    
          // Return sorted list based on fixed order
          return defaultOrder.filter((id) => userSelected.includes(id));
        } else {
          return [
            "board_of_directors",
            "governance_structure_composition",
            "general_governance",
            "nomination_selection",
            "chair_highest_governance_body",
            "senior_management_local",
            "management_of_material_topic",
            "board_responsibility_evaluation_remuneration",
            "role_highest_governance_body",
            "collective_knowledge",
            "sustainability_reporting_role",
            "delegation_of_responsibility",
            "communication_critical_concerns",
            "performance_evaluation",
            "remuneration_policies_process",
            "annual_compensation_ratio",
            "strategy",
            "sustainable_strategy_statement",
            "membership_association",
            "risk_management",
            "remediation_negative_impacts",
            "advice_mechanism",
            "compliance",
            "policy",
            "embedding_policy_commitment",
            "anti_trust_behavior",
            "retirement_benefits",
            "conflict_of_interest"
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
    
      // const getDynamicSectionMap = () => {
      //   let groupIndex = 1;
      //   const dynamicMap = [];
    
      //   groupedSubsections.forEach((group) => {
      //     if (group.children) {
      //       const visibleChildren = group.children.filter((child) =>
      //         selectedSubsections.some((s) => s.id === child.id)
      //       );
    
      //       if (visibleChildren.length === 0) return;
    
      //       let childIndex = 1;
      //       visibleChildren.forEach((child) => {
      //         dynamicMap.push({
      //           id: child.id,
      //           sectionNumber: `${sectionOrder}.${groupIndex}.${childIndex++}`,
      //           groupTitle: `${sectionOrder}.${groupIndex} ${group.title}`,
      //         });
      //       });
    
      //       groupIndex++;
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
    statement,
    board_gov_statement,
    remuneration_policies,
    policy_not_public_reason
  }
  const submitForm = async (type) => {
    LoaderOpen();
    if (!hasChanges(initialData, currentData)) {
      LoaderClose();
      return false;
    }
    const data={}
    data.statement= {
      page: "screen_nine",
      label: `${sectionOrder}. Corporate Governance`,
      subLabel: "Add statement about company’s corporate governance",
      type: "textarea",
      content: statement,
      field: "statement",
      isSkipped: false,
    }
    if(subsectionsToShow.includes("governance_structure_composition")){
      const sectionNumber = dynamicSectionNumberMap["governance_structure_composition"];
      data. board_gov_statement= {
        page: "screen_nine",
        label: `${sectionNumber} Governance structure and composition`,
        subLabel: "Add statement about company’s board of directors",
        type: "textarea",
        content: board_gov_statement,
        field: "board_gov_statement",
        isSkipped: false,
      }
    }
    if(subsectionsToShow.includes("remuneration_policies_process")){
      const sectionNumber = dynamicSectionNumberMap["remuneration_policies_process"];
      data.remuneration_policies= {
        page: "screen_nine",
        label:
          `${sectionNumber} Remuneration Policies & Process to Determine Remuneration`,
        subLabel: "Add statement about company’s remuneration policies",
        type: "textarea",
        content: remuneration_policies,
        field: "remuneration_policies",
        isSkipped: false,
      }
    }
    if(subsectionsToShow.includes("embedding_policy_commitment")){
      const sectionNumber = dynamicSectionNumberMap["embedding_policy_commitment"];
      data. policy_not_public_reason= {
        page: "screen_nine",
        label: `${sectionNumber} Embedding Policy Commitment`,
        subLabel: "Add statement about embedding policy commitment",
        type: "textarea",
        content: policy_not_public_reason,
        field: "policy_not_public_reason",
        isSkipped: false,
      }
    }
   

    const url = `${process.env.BACKEND_API_URL}/esg_report/screen_nine/${reportid}/`;
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
    dispatch(setStatement(""));
    dispatch(setBoardGov(""));
    dispatch(setRemunerationPolicies(""));
    dispatch(setPolicyPublic(""));
    const url = `${process.env.BACKEND_API_URL}/esg_report/screen_nine/${reportid}/`;
    try {
      const response = await axiosInstance.get(url);
      if (response.data) {
        const flatData = {};
  Object.keys(response.data).forEach((key) => {
    flatData[key] = response.data[key]?.content || "";
  });

  setInitialData(flatData);
        setData(response.data);
        dispatch(setStatement(response.data.statement?.content || ""));
        dispatch(setBoardGov(response.data.board_gov_statement?.content || ""));
        dispatch(
          setRemunerationPolicies(
            response.data.remuneration_policies?.content || ""
          )
        );
        dispatch(
          setPolicyPublic(response.data.policy_not_public_reason?.content || "")
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
  

  

  
return (
      <>
        <div className="mx-2 p-2">
          <div>
            <h3 className="text-[22px] text-[#344054] mb-4 text-left font-semibold">
              {sectionOrder}. Corporate Governance
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
              <div className={`p-4 border border-r-2 border-b-2 shadow-lg rounded-lg ${selectedSubsections.length < 5 ? 'h-[500px]' : 'h-fit'} top-36 sticky mt-2 w-[20%] md:w-[25%] lg:w-[20%] xl:sticky xl:top-36 lg:sticky lg:top-36 md:fixed md:top-[19rem] md:right-4 hidden xl:block md:block lg:block 2k:block 4k:block 2xl:block`}>
                <p className="text-[11px] text-[#727272] mb-2 uppercase">
                  {sectionOrder}. Corporate Governance 
                </p>
  
                {(() => {
                  let groupIndex = 1;
  
                  const groupedSidebar = [
                    {
                      groupId: "board_of_directors",
                      title: "Board of Directors",
                      children: [
                        {
                          id: "governance_structure_composition",
                          label: "Governance structure and composition",
                        },
                      ],
                    },
                    {
                      groupId: "general_governance",
                      title: "General Governance",
                      children: [
                        {
                          id: "nomination_selection",
                          label: "Nomination, selection of the highest governance body",
                        },
                        {
                          id: "chair_highest_governance_body",
                          label: "Chair of the highest governance body",
                        },
                        {
                          id: "senior_management_local",
                          label: "Senior management hired from local community",
                        },
                        {
                          id: "management_of_material_topic",
                          label: "Management of material topic",
                        },
                      ],
                    },
                    {
                      groupId: "board_responsibility_evaluation_remuneration",
                      title: "Responsibility, Evaluation and Remuneration of the Board",
                      children: [
                        {
                          id: "role_highest_governance_body",
                          label: "Role of the highest governance body",
                        },
                        {
                          id: "collective_knowledge",
                          label: "Collective knowledge of the highest governance body",
                        },
                        {
                          id: "sustainability_reporting_role",
                          label: "Role of the highest governance body in sustainability reporting",
                        },
                        {
                          id: "delegation_of_responsibility",
                          label: "Delegation of responsibility for managing impacts",
                        },
                        {
                          id: "communication_critical_concerns",
                          label: "Communication of critical concerns",
                        },
                        {
                          id: "performance_evaluation",
                          label: "Evaluation of the performance of the highest governance body",
                        },
                        {
                          id: "remuneration_policies_process",
                          label: "Remuneration policies & process to determine remuneration",
                        },
                        {
                          id: "annual_compensation_ratio",
                          label: "Annual compensation ratio",
                        },
                      ],
                    },
                    {
                      groupId: "strategy",
                      title: "Strategy",
                      children: [
                        {
                          id: "sustainable_strategy_statement",
                          label: "Statement on sustainable development strategy",
                        },
                        {
                          id: "membership_association",
                          label: "Membership association",
                        },
                      ],
                    },
                    {
                      groupId: "risk_management",
                      title: "Risk Management",
                      children: [
                        {
                          id: "remediation_negative_impacts",
                          label: "Remediation of negative impacts",
                        },
                        {
                          id: "advice_mechanism",
                          label: "Mechanism for seeking advice and raising concerns",
                        },
                        {
                          id: "compliance",
                          label: "Compliance",
                        },
                      ],
                    },
                    {
                      groupId: "policy",
                      title: "Policy",
                      children: [
                        {
                          id: "embedding_policy_commitment",
                          label: "Embedding policy commitment",
                        },
                        {
                          id: "anti_trust_behavior",
                          label: "Anti-trust, anti-competitive behavior, monopoly practices",
                        },
                        {
                          id: "retirement_benefits",
                          label: "Defined benefit plan obligations and other retirement plans",
                        },
                      ],
                    },
                    {
                      groupId: "conflict_of_interest",
                      title: "Conflict of interest",
                      children: [],
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

CorporateGovernance.displayName = "CorporateGovernance";

export default CorporateGovernance;
