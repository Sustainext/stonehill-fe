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
import Section24 from "./sections/section24";
import Section25 from "./sections/section25";
import Section26 from "./sections/section26";
import Section27 from "./sections/section27";
import Section28 from "./sections/section28";
import Section29 from "./sections/section29";
import Section30 from "./sections/section30";
import Section31 from "./sections/section31";
import Section32 from "./sections/section32";
import Section33 from "./sections/section33";
import axiosInstance, { patch } from "../../../../utils/axiosMiddleware";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { Oval } from "react-loader-spinner";
import {
  setEmployeePoliciesStatement,
  setWorkforceHireRetentionStatement,
  setStandardWage,
  setPerformanceReviewProcess,
  setForcedLaborPosition,
  setChildLaborPosition,
  setEmployeeDiversityPosition,
  setEmployeeSkillUpgradePrograms,
  setRemunerationPractices,
  setOHSPolicies,
  setHazardRiskAssessment,
  setWorkRelatedHealthInjuries,
  setSafetyTraining,
  setOHSManagementSystem,
  setFreedomOfAssociationViews,
  setViolationDiscriminationPolicy,
  setIndigenousRightsPolicy,
  setParentalLeaves,
  setSecurityPersonnelInternalTraining,
  setSecurityPersonnelExternalTraining,
} from "../../../../../lib/redux/features/ESGSlice/screen13Slice";

const People = forwardRef(({
  onSubmitSuccess,
  subsections = [],
  sectionOrder = 13,
  sectionId,
  sectionTitle,
  hasChanges,
}, ref) => {
  const [activeSection, setActiveSection] = useState("employees");
  const [initialData, setInitialData] = useState({});
 
  // const orgName =
  //   typeof window !== "undefined" ? localStorage.getItem("reportorgname") : "";
  // const reportid =
  //   typeof window !== "undefined" ? localStorage.getItem("reportid") : "";
  // const reportType =
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
  const [data, setData] = useState("");
  const [loopen, setLoOpen] = useState(false);
  const employee_policies_statement = useSelector(
    (state) => state.screen13Slice.employee_policies_statement
  );
  const workforce_hire_retention_statement = useSelector(
    (state) => state.screen13Slice.workforce_hire_retention_statement
  );
  const standard_wage = useSelector(
    (state) => state.screen13Slice.standard_wage
  );
  const performance_review_process = useSelector(
    (state) => state.screen13Slice.performance_review_process
  );
  const forced_labor_position = useSelector(
    (state) => state.screen13Slice.forced_labor_position
  );
  const child_labor_position = useSelector(
    (state) => state.screen13Slice.child_labor_position
  );
  const employee_diversity_position = useSelector(
    (state) => state.screen13Slice.employee_diversity_position
  );
  const employee_skill_upgrade_programs = useSelector(
    (state) => state.screen13Slice.employee_skill_upgrade_programs
  );
  const remuneration_practices = useSelector(
    (state) => state.screen13Slice.remuneration_practices
  );
  const ohs_policies = useSelector((state) => state.screen13Slice.ohs_policies);
  const hazard_risk_assessment = useSelector(
    (state) => state.screen13Slice.hazard_risk_assessment
  );
  const work_related_health_injuries = useSelector(
    (state) => state.screen13Slice.work_related_health_injuries
  );
  const safety_training = useSelector(
    (state) => state.screen13Slice.safety_training
  );
  const ohs_management_system = useSelector(
    (state) => state.screen13Slice.ohs_management_system
  );
  const freedom_of_association_views = useSelector(
    (state) => state.screen13Slice.freedom_of_association_views
  );
  const violation_discrimination_policy = useSelector(
    (state) => state.screen13Slice.violation_discrimination_policy
  );
  const indigenous_rights_policy = useSelector(
    (state) => state.screen13Slice.indigenous_rights_policy
  );
  const parental_leaves = useSelector(
    (state) => state.screen13Slice.parental_leaves
  );
  const security_personnel_internal_training = useSelector(
    (state) => state.screen13Slice.security_personnel_internal_training
  );
  const security_personnel_external_training = useSelector(
    (state) => state.screen13Slice.security_personnel_external_training
  );

  const dispatch = useDispatch();

  const isWithReference = reportType === "GRI Report: With Reference to";


  const groupedSubsections = [
    {
      groupId: "employees",
      title: "Employees",
      children: [
        !isWithReference && { id: "employees_material_topic_management", label: "Management Of Material Topics" },
        { id: "employee_hiring_turnover", label: "Employee Hire, Turnover" },
        { id: "employee_benefits_health", label: "Employee Benefits And Health Services" },
        { id: "parental_leaves", label: "Parental Leaves" },
        { id: "standard_wages", label: "Standard Wage" },
        { id: "career_development_reviews", label: "Performance And Career Development Reviews Of Employees" },
      ].filter(Boolean),
    },
    {
      groupId: "labour_management",
      title: "Labour Management",
      children: [
        !isWithReference && { id: "labour_material_topic_management", label: "Management Of Material Topics" },
        { id: "non_employee_workers", label: "Workers Who Are Not Employees" },
        { id: "forced_labour", label: "Forced Or Compulsory Labour" },
      ].filter(Boolean),
    },
    {
      groupId: "child_labour",
      title: "Incidents Of Child Labour",
      children: [
        !isWithReference && { id: "child_labour_material_topic_management", label: "Management Of Material Topic" },
      ].filter(Boolean),
    },
    {
      groupId: "diversity_inclusion",
      title: "Diversity, Inclusion",
      children: [
        !isWithReference && { id: "diversity_material_topic_management", label: "Management Of Material Topics" },
        { id: "diversity_governance_employees", label: "Diversity Of Governance Bodies And Employees" },
        { id: "diversity_remuneration", label: "Remuneration" },
      ].filter(Boolean),
    },
    {
      groupId: "training_education",
      title: "Training & Education",
      children: [
        !isWithReference && { id: "training_material_topic_management", label: "Management Of Material Topics" },
        { id: "training_programs_upgrading_skills", label: "Programs For Upgrading Employee Skills And Transition Assistance Programs" },
      ].filter(Boolean),
    },
    {
      groupId: "occupational_health_safety",
      title: "Occupational Health And Safety",
      children: [
        !isWithReference && { id: "ohs_material_topic_management", label: "Management Of Material Topic" },
        { id: "ohs_management_system", label: "OHS Management System" },
        { id: "occupational_health_services", label: "Occupational Health Services" },
        { id: "worker_ohs_participation", label: "Worker Participation, Consultation, And Communication On OHS" },
        { id: "promotion_worker_health", label: "Promotion Of Worker Health" },
        { id: "ohs_impact_prevention", label: "Prevention And Mitigation Of OHS Impacts" },
        { id: "hazard_risk_identification", label: "Hazard, Risk Identification And Investigation" },
        { id: "work_related_illness_injuries", label: "Work-Related Ill-Health & Injuries" },
        { id: "safety_training", label: "Safety Training" },
        { id: "workers_covered_ohs", label: "Workers Covered By OHS Management System" },
      ].filter(Boolean),
    },
    {
      groupId: "collective_bargaining",
      title: "Collective Bargaining",
      children: [
        { id: "freedom_of_association_risks", label: "Operations And Suppliers In Which The Right To Freedom Of Association And Collective Bargaining May Be At Risk" },
      ]
    },
    {
      groupId: "violations_discrimination",
      title: "Incidents Of Violation/Discrimination",
      children: [
        !isWithReference && { id: "violations_material_topic_management", label: "Management Of Material Topic" },
      ].filter(Boolean),
    }
  ];
  
  
  
  

  const subsectionMapping = {
    // Employees
    employees: {
      component: ({ section13_1Ref, sectionNumber = "13.1", sectionTitle = "Employees", sectionOrder = 13 }) => {
        return (
          <div id="section13_1" ref={section13_1Ref}>
            <h3 className="text-[17px] text-[#344054] mb-4 text-left font-semibold">
              {sectionNumber} {sectionTitle}
            </h3>
          </div>
        );
      },
      title: "Employees",
      subSections: [],
    },
    ...(!isWithReference && {
      employees_material_topic_management: {
        component: Section2,
        title: "Management Of Material Topics",
        subSections: [],
      }
    }),
    employee_hiring_turnover: {
      component: Section3,
      title: "Employee Hire, Turnover",
      subSections: [],
    },
    employee_benefits_health: {
      component: Section4,
      title: "Employee Benefits And Health Services",
      subSections: [],
    },
    parental_leaves: {
      component: Section5,
      title: "Parental Leaves",
      subSections: [],
    },
    standard_wages: {
      component: Section6,
      title: "Standard Wage",
      subSections: [],
    },
    career_development_reviews: {
      component: Section7,
      title: "Performance And Career Development Reviews Of Employees",
      subSections: [],
    },
  
    // Labour Management
    labour_management: {
      component: ({ section13_2Ref, data, sectionNumber = "13.2", sectionTitle = "Labour Management", sectionOrder = 13 }) => {
        return (
          <div id="section13_2" ref={section13_2Ref}>
            <h3 className="text-[17px] text-[#344054] mb-4 text-left font-semibold">
              {sectionNumber} {sectionTitle}
            </h3>
            <p className="text-sm mb-4">
              {data?.["409-1b"]?.data?.[0]?.Q1 || "No data available"}
            </p>
          </div>
        );
      },
      title: "Labour Management",
      subSections: [],
    },
    ...(!isWithReference && {
      labour_material_topic_management: {
        component: Section8,
        title: "Management Of Material Topics",
        subSections: [],
      }
    }),
    non_employee_workers: {
      component: Section9,
      title: "Workers Who Are Not Employees",
      subSections: [],
    },
    forced_labour: {
      component: Section10,
      title: "Forced Or Compulsory Labour",
      subSections: [],
    },
  
    // Child Labour
    child_labour: {
      component: Section11,
      title: "Incidents Of Child Labour",
      subSections: [],
    },
    ...(!isWithReference && {
      child_labour_material_topic_management: {
        component: Section12,
        title: "Management Of Material Topic",
        subSections: [],
      }
    }),
  
    // Diversity & Inclusion
    diversity_inclusion: {
      component: ({ section13_4Ref, data, sectionNumber = "13.4", sectionTitle = "Diversity, Inclusion", sectionOrder = 13 }) => {
        return (
          <div id="section13_4" ref={section13_4Ref}>
            <h3 className="text-[17px] text-[#344054] mb-4 text-left font-semibold">
              {sectionNumber} {sectionTitle}
            </h3>
            <p className="text-[15px] text-[#344054] mb-2 font-semibold">
              Significant Locations of Operation
            </p>
            <p className="text-sm mb-4">
              {data?.["405-2b-significant_locations"]?.data?.[0]?.Q1 || "No data available"}
            </p>
          </div>
        );
      },
      title: "Diversity, Inclusion",
      subSections: [],
    },
    ...(!isWithReference && {
      diversity_material_topic_management: {
        component: Section13,
        title: "Management Of Material Topics",
        subSections: [],
      }
    }),
    diversity_governance_employees: {
      component: Section14,
      title: "Diversity Of Governance Bodies And Employees",
      subSections: [],
    },
    diversity_remuneration: {
      component: Section15,
      title: "Remuneration",
      subSections: [],
    },
  
    // Training & Education
    training_education: {
      component: ({ section13_5Ref, data, sectionNumber = "13.5", sectionTitle = "Training & Education", sectionOrder = 13 }) => {
        return (
          <div id="section13_5" ref={section13_5Ref}>
            <h3 className="text-[17px] text-[#344054] mb-4 text-left font-semibold">
              {sectionNumber} {sectionTitle}
            </h3>
          </div>
        );
      },
      title: "Training & Education",
      subSections: [],
    },
    ...(!isWithReference && {
      training_material_topic_management: {
        component: Section16,
        title: "Management Of Material Topics",
        subSections: [],
      }
    }),
    training_programs_upgrading_skills: {
      component: Section17,
      title: "Programs For Upgrading Employee Skills And Transition Assistance Programs",
      subSections: [],
    },
  
    // Occupational Health & Safety
    occupational_health_safety: {
      component: ({ section13_6Ref, data, sectionNumber = "13.6", sectionTitle = "Occupational Health and Safety", sectionOrder = 13 }) => {
        return (
          <div id="section13_6" ref={section13_6Ref}>
            <h3 className="text-[17px] text-[#344054] mb-4 text-left font-semibold">
              {sectionNumber} {sectionTitle}
            </h3>
          </div>
        );
      },
      title: "Occupational Health And Safety",
      subSections: [],
    },
    ...(!isWithReference && {
      ohs_material_topic_management: {
        component: Section18,
        title: "Management Of Material Topic",
        subSections: [],
      }
    }),
    ohs_management_system: {
      component: Section19,
      title: "OHS Management System",
      subSections: [],
    },
    occupational_health_services: {
      component: Section20,
      title: "Occupational Health Services",
      subSections: [],
    },
    worker_ohs_participation: {
      component: Section21,
      title: "Worker Participation, Consultation, And Communication On OHS",
      subSections: [],
    },
    promotion_worker_health: {
      component: Section22,
      title: "Promotion Of Worker Health",
      subSections: [],
    },
    ohs_impact_prevention: {
      component: Section23,
      title: "Prevention And Mitigation Of OHS Impacts",
      subSections: [],
    },
    hazard_risk_identification: {
      component: Section24,
      title: "Hazard, Risk Identification And Investigation",
      subSections: [],
    },
    work_related_illness_injuries: {
      component: Section25,
      title: "Work-Related Ill-Health & Injuries",
      subSections: [],
    },
    safety_training: {
      component: Section26,
      title: "Safety Training",
      subSections: [],
    },
    workers_covered_ohs: {
      component: Section27,
      title: "Workers Covered By OHS Management System",
      subSections: [],
    },
  
    // Collective Bargaining
    collective_bargaining: {
      component: Section28,
      title: "Collective Bargaining",
      subSections: [],
    },
    freedom_of_association_risks: {
      component: Section30,
      title: "Operations And Suppliers In Which The Right To Freedom Of Association And Collective Bargaining May Be At Risk",
      subSections: [],
    },
  
    // Violations / Discrimination
    violations_discrimination: {
      component: Section31,
      title: "Incidents Of Violation/Discrimination",
      subSections: [],
    },
    ...(!isWithReference && {
      violations_material_topic_management: {
        component: Section32,
        title: "Management Of Material Topic",
        subSections: [],
      }
    }),
  };
  
  
  
  //console.log(subsections,"subsections")
  const getSubsectionsToShow = () => {
    if (reportType === "Custom ESG Report") {
      const userSelected = Array.isArray(subsections) ? subsections : [];

      // Get default order
      const defaultOrder = [
        "employees",
        "employees_material_topic_management",
        "employee_hiring_turnover",
        "employee_benefits_health",
        "parental_leaves",
        "standard_wages",
        "career_development_reviews",
        "labour_management",
        "labour_material_topic_management",
        "non_employee_workers",
        "forced_labour",
        "child_labour",
        "child_labour_material_topic_management",
        "diversity_inclusion",
        "diversity_material_topic_management",
        "diversity_governance_employees",
        "diversity_remuneration",
        "training_education",
        "training_material_topic_management",
        "training_programs_upgrading_skills",
        "occupational_health_safety",
        "ohs_material_topic_management",
        "ohs_management_system",
        "occupational_health_services",
        "worker_ohs_participation",
        "promotion_worker_health",
        "ohs_impact_prevention",
        "hazard_risk_identification",
        "work_related_illness_injuries",
        "safety_training",
        "workers_covered_ohs",
        "collective_bargaining",
        "freedom_of_association_risks",
        "violations_discrimination",
        "violations_material_topic_management"
      ]
      
      

      // Return sorted list based on fixed order
      return defaultOrder.filter((id) => userSelected.includes(id));
    } else {
     return [
        "employees",
        "employees_material_topic_management",
        "employee_hiring_turnover",
        "employee_benefits_health",
        "parental_leaves",
        "standard_wages",
        "career_development_reviews",
        "labour_management",
        "labour_material_topic_management",
        "non_employee_workers",
        "forced_labour",
        "child_labour",
        "child_labour_material_topic_management",
        "diversity_inclusion",
        "diversity_material_topic_management",
        "diversity_governance_employees",
        "diversity_remuneration",
        "training_education",
        "training_material_topic_management",
        "training_programs_upgrading_skills",
        "occupational_health_safety",
        "ohs_material_topic_management",
        "ohs_management_system",
        "occupational_health_services",
        "worker_ohs_participation",
        "promotion_worker_health",
        "ohs_impact_prevention",
        "hazard_risk_identification",
        "work_related_illness_injuries",
        "safety_training",
        "workers_covered_ohs",
        "collective_bargaining",
        "freedom_of_association_risks",
        "violations_discrimination",
        "violations_material_topic_management"
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

  //console.log(selectedSubsections,"selectedSubsections")

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
  //console.log(numberedSubsections,"see the sections of screen 13")

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
    employee_policies_statement,
    workforce_hire_retention_statement,
    parental_leaves,
    standard_wage,
    performance_review_process,
    forced_labor_position,
    // child_labor_position,
    employee_diversity_position,
    employee_skill_upgrade_programs,
    remuneration_practices,
    ohs_policies,
    hazard_risk_assessment,
    work_related_health_injuries,
    safety_training,
    ohs_management_system,
    freedom_of_association_views,
    violation_discrimination_policy,
    // indigenous_rights_policy,
    // security_personnel_external_training,
    // security_personnel_internal_training,
  };
  
  const submitForm = async (type) => {
    LoaderOpen();
    if (!hasChanges(initialData, currentData)) {
      LoaderClose();
      return false;
    }

    const data = {};

data.employee_policies_statement = {
  page: "screen_thirteen",
  label: `${sectionOrder}. People`,
  subLabel: "Add statement about company’s employees and their policies",
  type: "textarea",
  content: employee_policies_statement,
  field: "employee_policies_statement",
  isSkipped: false,
};

if (subsectionsToShow.includes("employee_hiring_turnover")) {
  const sectionNumber = dynamicSectionNumberMap["employee_hiring_turnover"];
  data.workforce_hire_retention_statement = {
    page: "screen_thirteen",
    label: `${sectionNumber} Employee Hire, Turnover`,
    subLabel: "Add statement about company’s workforce hire and retention",
    type: "textarea",
    content: workforce_hire_retention_statement,
    field: "workforce_hire_retention_statement",
    isSkipped: false,
  };
}
if (subsectionsToShow.includes("parental_leaves")) {
  const sectionNumber = dynamicSectionNumberMap["parental_leaves"];
  data.parental_leaves = {
    page: "screen_thirteen",
    label: `${sectionNumber} Parental Leaves`,
    subLabel: "Add statement about company’s policy on parental leave",
    type: "textarea",
    content: parental_leaves,
    field: "parental_leaves",
    isSkipped: false,
  };
}
if (subsectionsToShow.includes("standard_wages")) {
  const sectionNumber = dynamicSectionNumberMap["standard_wages"];
  data.standard_wage = {
    page: "screen_thirteen",
    label: `${sectionNumber} Standard Wage`,
    subLabel: "Add statement about company’s policy on employee compensation",
    type: "textarea",
    content: standard_wage,
    field: "standard_wage",
    isSkipped: false,
  };
}
if (subsectionsToShow.includes("career_development_reviews")) {
  const sectionNumber = dynamicSectionNumberMap["career_development_reviews"];
  data.performance_review_process = {
    page: "screen_thirteen",
    label: `${sectionNumber} Performance and Career Development Reviews of Employees`,
    subLabel: "Add statement about company’s process for performance review of employees",
    type: "textarea",
    content: performance_review_process,
    field: "performance_review_process",
    isSkipped: false,
  };
}
if (subsectionsToShow.includes("forced_labour")) {
  const sectionNumber = dynamicSectionNumberMap["forced_labour"];
  data.forced_labor_position = {
    page: "screen_thirteen",
    label: `${sectionNumber} Forced or Compulsory Labour`,
    subLabel: "Add statement about company’s position on forced / compulsory labor",
    type: "textarea",
    content: forced_labor_position,
    field: "forced_labor_position",
    isSkipped: false,
  };
}
if (subsectionsToShow.includes("diversity_governance_employees")) {
  const sectionNumber = dynamicSectionNumberMap["diversity_governance_employees"];
  data.employee_diversity_position = {
    page: "screen_thirteen",
    label: `${sectionNumber} Diversity of Governance Bodies and Employees`,
    subLabel: "Add statement about company’s position on diversity",
    type: "textarea",
    content: employee_diversity_position,
    field: "employee_diversity_position",
    isSkipped: false,
  };
}
if (subsectionsToShow.includes("training_programs_upgrading_skills")) {
  const sectionNumber = dynamicSectionNumberMap["training_programs_upgrading_skills"];
  data.employee_skill_upgrade_programs = {
    page: "screen_thirteen",
    label: `${sectionNumber} Programs for Upgrading Employee Skills and Transition Assistance Programs`,
    subLabel: "Add statement about company’s programs for upgrading employee’s skills",
    type: "textarea",
    content: employee_skill_upgrade_programs,
    field: "employee_skill_upgrade_programs",
    isSkipped: false,
  };
}
if (subsectionsToShow.includes("diversity_remuneration")) {
  const sectionNumber = dynamicSectionNumberMap["diversity_remuneration"];
  data.remuneration_practices = {
    page: "screen_thirteen",
    label: `${sectionNumber} Remuneration`,
    subLabel: "Add statement about company’s remuneration practices",
    type: "textarea",
    content: remuneration_practices,
    field: "remuneration_practices",
    isSkipped: false,
  };
}
if (subsectionsToShow.includes("worker_ohs_participation")) {
  const sectionNumber = dynamicSectionNumberMap["worker_ohs_participation"];
  data.ohs_policies = {
    page: "screen_thirteen",
    label: `${sectionNumber} Worker Participation, Consultation, and Communication on OHS`,
    subLabel: "Add statement about company’s OHS policies",
    type: "textarea",
    content: ohs_policies,
    field: "ohs_policies",
    isSkipped: false,
  };
}
if (subsectionsToShow.includes("hazard_risk_identification")) {
  const sectionNumber = dynamicSectionNumberMap["hazard_risk_identification"];
  data.hazard_risk_assessment = {
    page: "screen_thirteen",
    label: `${sectionNumber} Hazard, Risk Identification and Investigation`,
    subLabel: "Add statement about company’s process of Hazard and risk assessment",
    type: "textarea",
    content: hazard_risk_assessment,
    field: "hazard_risk_assessment",
    isSkipped: false,
  };
}
if (subsectionsToShow.includes("work_related_illness_injuries")) {
  const sectionNumber = dynamicSectionNumberMap["work_related_illness_injuries"];
  data.work_related_health_injuries = {
    page: "screen_thirteen",
    label: `${sectionNumber} Work-Related Ill-Health & Injuries`,
    subLabel: "Add statement about work related ill health and injuries in company",
    type: "textarea",
    content: work_related_health_injuries,
    field: "work_related_health_injuries",
    isSkipped: false,
  };
}
if (subsectionsToShow.includes("safety_training")) {
  const sectionNumber = dynamicSectionNumberMap["safety_training"];
  data.safety_training = {
    page: "screen_thirteen",
    label: `${sectionNumber} Safety Training`,
    subLabel: "Add statement about company’s safety training",
    type: "textarea",
    content: safety_training,
    field: "safety_training",
    isSkipped: false,
  };
}
if (subsectionsToShow.includes("workers_covered_ohs")) {
  const sectionNumber = dynamicSectionNumberMap["workers_covered_ohs"];
  data.ohs_management_system = {
    page: "screen_thirteen",
    label: `${sectionNumber} Workers Covered by OHS Management System`,
    subLabel: "Add statement about company’s OHS management system",
    type: "textarea",
    content: ohs_management_system,
    field: "ohs_management_system",
    isSkipped: false,
  };
}
if (subsectionsToShow.includes("freedom_of_association_risks")) {
  const sectionNumber = dynamicSectionNumberMap["freedom_of_association_risks"];
  data.freedom_of_association_views = {
    page: "screen_thirteen",
    label: `${sectionNumber} Operations and Suppliers in Which the Right to Freedom of Association and Collective Bargaining May Be at Risk`,
    subLabel: "Add statement about company’s views on freedom of association and collective bargaining",
    type: "textarea",
    content: freedom_of_association_views,
    field: "freedom_of_association_views",
    isSkipped: false,
  };
}
if (subsectionsToShow.includes("violations_discrimination")) {
  const sectionNumber = dynamicSectionNumberMap["violations_discrimination"];
  data.violation_discrimination_policy = {
    page: "screen_thirteen",
    label: `${sectionNumber} Incidents of Violation/Discrimination`,
    subLabel: "Add statement about company’s policy for addressing violation/ discrimination",
    type: "textarea",
    content: violation_discrimination_policy,
    field: "violation_discrimination_policy",
    isSkipped: false,
  };
}

    const url = `${process.env.BACKEND_API_URL}/esg_report/screen_thirteen/${reportid}/`;
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
    dispatch(setEmployeePoliciesStatement(""));
    dispatch(setWorkforceHireRetentionStatement(""));
    dispatch(setStandardWage(""));
    dispatch(setPerformanceReviewProcess(""));
    dispatch(setForcedLaborPosition(""));
    dispatch(setChildLaborPosition(""));
    dispatch(setEmployeeDiversityPosition(""));
    dispatch(setEmployeeSkillUpgradePrograms(""));
    dispatch(setRemunerationPractices(""));
    dispatch(setOHSPolicies(""));
    dispatch(setHazardRiskAssessment(""));
    dispatch(setWorkRelatedHealthInjuries(""));
    dispatch(setSafetyTraining(""));
    dispatch(setOHSManagementSystem(""));
    dispatch(setFreedomOfAssociationViews(""));
    dispatch(setViolationDiscriminationPolicy(""));
    dispatch(setIndigenousRightsPolicy(""));
    dispatch(setParentalLeaves(""));
    dispatch(setSecurityPersonnelInternalTraining(""));
    dispatch(setSecurityPersonnelExternalTraining(""));

    const url = `${process.env.BACKEND_API_URL}/esg_report/screen_thirteen/${reportid}/`;
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
          setEmployeePoliciesStatement(
            response.data.employee_policies_statement?.content || ""
          )
        );
        dispatch(
          setWorkforceHireRetentionStatement(
            response.data.workforce_hire_retention_statement?.content || ""
          )
        );
        dispatch(setStandardWage(response.data.standard_wage?.content || ""));
        dispatch(
          setPerformanceReviewProcess(
            response.data.performance_review_process?.content || ""
          )
        );
        dispatch(
          setForcedLaborPosition(
            response.data.forced_labor_position?.content || ""
          )
        );
        dispatch(
          setChildLaborPosition(
            response.data.child_labor_position?.content || ""
          )
        );
        dispatch(
          setEmployeeDiversityPosition(
            response.data.employee_diversity_position?.content || ""
          )
        );
        dispatch(
          setEmployeeSkillUpgradePrograms(
            response.data.employee_skill_upgrade_programs?.content || ""
          )
        );
        dispatch(
          setRemunerationPractices(
            response.data.remuneration_practices?.content || ""
          )
        );
        dispatch(setOHSPolicies(response.data.ohs_policies?.content || ""));
        dispatch(
          setHazardRiskAssessment(
            response.data.hazard_risk_assessment?.content || ""
          )
        );
        dispatch(
          setWorkRelatedHealthInjuries(
            response.data.work_related_health_injuries?.content || ""
          )
        );
        dispatch(
          setSafetyTraining(response.data.safety_training?.content || "")
        );
        dispatch(
          setOHSManagementSystem(
            response.data.ohs_management_system?.content || ""
          )
        );
        dispatch(
          setFreedomOfAssociationViews(
            response.data.freedom_of_association_views?.content || ""
          )
        );
        dispatch(
          setViolationDiscriminationPolicy(
            response.data.violation_discrimination_policy?.content || ""
          )
        );
        dispatch(
          setIndigenousRightsPolicy(
            response.data.indigenous_rights_policy?.content || ""
          )
        );
        dispatch(
          setParentalLeaves(response.data.parental_leaves?.content || "")
        );
        dispatch(
          setSecurityPersonnelInternalTraining(
            response.data.security_personnel_internal_training?.content || ""
          )
        );
        dispatch(
          setSecurityPersonnelExternalTraining(
            response.data.security_personnel_external_training?.content || ""
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
  

 

                 return (
                  <>
                    <div className="mx-2 p-2">
                      <div>
                        <h3 className="text-[22px] text-[#344054] mb-4 text-left font-semibold">
                          {sectionOrder}. People
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
                          <div className={`p-4 border border-r-2 border-b-2 shadow-lg rounded-lg ${selectedSubsections.length < 13 ? 'h-[500px]' : 'h-fit'} top-36 sticky mt-2 w-[20%] md:w-[25%] lg:w-[20%] xl:sticky xl:top-36 lg:sticky lg:top-36 md:fixed md:top-[19rem] md:right-4 hidden xl:block md:block lg:block 2k:block 4k:block 2xl:block z-10 bg-white`}>
                            <p className="text-[11px] text-[#727272] mb-2 uppercase">
                              {sectionOrder}. People
                            </p>
              
                            {(() => {
                              let groupIndex = 1;
              
                              const groupedSidebar = [
                                {
                                  groupId: "employees",
                                  title: "Employees",
                                  children: [
                                    { id: "employees_material_topic_management", label: "Management Of Material Topics" },
                                    { id: "employee_hiring_turnover", label: "Employee Hire, Turnover" },
                                    { id: "employee_benefits_health", label: "Employee Benefits And Health Services" },
                                    { id: "parental_leaves", label: "Parental Leaves" },
                                    { id: "standard_wages", label: "Standard Wage" },
                                    { id: "career_development_reviews", label: "Performance And Career Development Reviews Of Employees" }
                                  ]
                                },
                                {
                                  groupId: "labour_management",
                                  title: "Labour Management",
                                  children: [
                                    { id: "labour_material_topic_management", label: "Management Of Material Topics" },
                                    { id: "non_employee_workers", label: "Workers Who Are Not Employees" },
                                    { id: "forced_labour", label: "Forced Or Compulsory Labour" }
                                  ]
                                },
                                {
                                  groupId: "child_labour",
                                  title: "Incidents Of Child Labour",
                                  children: [
                                    { id: "child_labour_material_topic_management", label: "Management Of Material Topic" }
                                  ]
                                },
                                {
                                  groupId: "diversity_inclusion",
                                  title: "Diversity, Inclusion",
                                  children: [
                                    { id: "diversity_material_topic_management", label: "Management Of Material Topics" },
                                    { id: "diversity_governance_employees", label: "Diversity Of Governance Bodies And Employees" },
                                    { id: "diversity_remuneration", label: "Remuneration" }
                                  ]
                                },
                                {
                                  groupId: "training_education",
                                  title: "Training & Education",
                                  children: [
                                    { id: "training_material_topic_management", label: "Management Of Material Topics" },
                                    { id: "training_programs_upgrading_skills", label: "Programs For Upgrading Employee Skills And Transition Assistance Programs" }
                                  ]
                                },
                                {
                                  groupId: "occupational_health_safety",
                                  title: "Occupational Health And Safety",
                                  children: [
                                    { id: "ohs_material_topic_management", label: "Management Of Material Topic" },
                                    { id: "ohs_management_system", label: "OHS Management System" },
                                    { id: "occupational_health_services", label: "Occupational Health Services" },
                                    { id: "worker_ohs_participation", label: "Worker Participation, Consultation, And Communication On OHS" },
                                    { id: "promotion_worker_health", label: "Promotion Of Worker Health" },
                                    { id: "ohs_impact_prevention", label: "Prevention And Mitigation Of OHS Impacts" },
                                    { id: "hazard_risk_identification", label: "Hazard, Risk Identification And Investigation" },
                                    { id: "work_related_illness_injuries", label: "Work-Related Ill-Health & Injuries" },
                                    { id: "safety_training", label: "Safety Training" },
                                    { id: "workers_covered_ohs", label: "Workers Covered By OHS Management System" }
                                  ]
                                },
                                {
                                  groupId: "collective_bargaining",
                                  title: "Collective Bargaining",
                                  children: [
                                    { id: "freedom_of_association_risks", label: "Operations And Suppliers In Which The Right To Freedom Of Association And Collective Bargaining May Be At Risk" }
                                  ]
                                },
                                {
                                  groupId: "violations_discrimination",
                                  title: "Incidents Of Violation/Discrimination",
                                  children: [
                                    { id: "violations_material_topic_management", label: "Management Of Material Topic" }
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

People.displayName = "People";

export default People;