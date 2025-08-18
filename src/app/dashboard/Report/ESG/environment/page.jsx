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
import Section34 from "./sections/section34";
import Section35 from "./sections/section35";
import Section36 from "./sections/section36";
import axiosInstance, { patch } from "../../../../utils/axiosMiddleware";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { Oval } from "react-loader-spinner";
import {
  setEnvironmentStatement,
  setEmission,
  setScopeOneEmission,
  setScopeTwoEmission,
  setScopeThreeEmission,
  setGHGEmissionIntensityTracking,
  setGHGEmissionReductionEfforts,
  setOzoneDepletingSubstanceElimination,
  setMaterialManagementStrategy,
  setRecyclingProcess,
  setReclamationRecyclingProcess,
  setWaterWithdrawalTracking,
  setWaterConsumptionGoals,
  setEnergyConsumptionWithinOrganization,
  setEnergyConsumptionOutsideOrganization,
  setEnergyIntensityTracking,
  setBaseYear,
  setConsolidation,
  setEnergyConsumptionReductionCommitment,
  setSignificantSpills,
  setHabitatProtectionRestorationCommitment,
  setAirQualityProtectionCommitment,
  setBiogenicCO2Emission,
  setBiogenicCO2305,
} from "../../../../../lib/redux/features/ESGSlice/screen12Slice";

const Environment = forwardRef(( {
  onSubmitSuccess,
  subsections = [],
  sectionOrder = 12,
  sectionId,
  sectionTitle,
  hasChanges,
}, ref) => {
  const [activeSection, setActiveSection] = useState("emissions");
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
  const environmental_responsibility_statement = useSelector(
    (state) => state.screen12Slice.environmental_responsibility_statement
  );
  const emissions = useSelector((state) => state.screen12Slice.emissions);
  const scope_one_emissions = useSelector(
    (state) => state.screen12Slice.scope_one_emissions
  );
  const scope_two_emissions = useSelector(
    (state) => state.screen12Slice.scope_two_emissions
  );
  const scope_three_emissions = useSelector(
    (state) => state.screen12Slice.scope_three_emissions
  );
  const ghg_emission_intensity_tracking = useSelector(
    (state) => state.screen12Slice.ghg_emission_intensity_tracking
  );
  const ghg_emission_reduction_efforts = useSelector(
    (state) => state.screen12Slice.ghg_emission_reduction_efforts
  );
  const ozone_depleting_substance_elimination = useSelector(
    (state) => state.screen12Slice.ozone_depleting_substance_elimination
  );
  const material_management_strategy = useSelector(
    (state) => state.screen12Slice.material_management_strategy
  );
  const recycling_process = useSelector(
    (state) => state.screen12Slice.recycling_process
  );
  const reclamation_recycling_process = useSelector(
    (state) => state.screen12Slice.reclamation_recycling_process
  );
  const water_withdrawal_tracking = useSelector(
    (state) => state.screen12Slice.water_withdrawal_tracking
  );
  const water_consumption_goals = useSelector(
    (state) => state.screen12Slice.water_consumption_goals
  );
  const energy_consumption_within_organization = useSelector(
    (state) => state.screen12Slice.energy_consumption_within_organization
  );
  const energy_consumption_outside_organization = useSelector(
    (state) => state.screen12Slice.energy_consumption_outside_organization
  );
  const energy_intensity_tracking = useSelector(
    (state) => state.screen12Slice.energy_intensity_tracking
  );
  const energy_consumption_reduction_commitment = useSelector(
    (state) => state.screen12Slice.energy_consumption_reduction_commitment
  );
  const significant_spills = useSelector(
    (state) => state.screen12Slice.significant_spills
  );
  const habitat_protection_restoration_commitment = useSelector(
    (state) => state.screen12Slice.habitat_protection_restoration_commitment
  );
  const air_quality_protection_commitment = useSelector(
    (state) => state.screen12Slice.air_quality_protection_commitment
  );
  const biogenic_c02_emissions = useSelector(
    (state) => state.screen12Slice.biogenic_c02_emissions
  );
  const biogenic_c02_emissions_305_3c = useSelector(
    (state) => state.screen12Slice.biogenic_c02_emissions_305_3c
  );
  const consolidation = useSelector(
    (state) => state.screen12Slice.consolidation
  );
  const base_year = useSelector((state) => state.screen12Slice.base_year);
  const dispatch = useDispatch();

  const isWithReference = reportType === "GRI Report: With Reference to";

  const groupedSubsections = [
    {
      groupId: "emissions",
      title: "Emissions",
      children: [
        !isWithReference && { id: "emissions_material_topic_management", label: "Management Of Material Topics" },
        { id: "scope_1_ghg_emissions", label: "Scope 1 GHG Emissions" },
        { id: "scope_2_ghg_emissions", label: "Scope 2 GHG Emissions" },
        { id: "scope_3_ghg_emissions", label: "Scope 3 GHG Emissions" },
        { id: "base_year", label: "Base Year" },
        { id: "consolidation_approach", label: "Consolidation Approach" },
        { id: "ghg_emission_intensity", label: "GHG Emission Intensity" },
        { id: "reduction_in_ghg_emissions", label: "Reduction In GHG Emissions" },
        { id: "ozone_depleting_substances", label: "Ozone Depleting Substances" }
      ].filter(Boolean),
    },
    {
      groupId: "materials",
      title: "Materials",
      children: [
        !isWithReference && { id: "materials_material_topic_management", label: "Management Of Material Topics" },
        { id: "recycled_input_materials", label: "Recycled Input Materials Used" },
        { id: "reclaimed_products_packaging", label: "Reclaimed Products And Their Packaging Materials" }
      ].filter(Boolean),
    },
    {
      groupId: "water",
      title: "Water",
      children: [
        !isWithReference && { id: "water_material_topic_management", label: "Management Of Material Topic" },
        { id: "water_withdrawal", label: "Water Withdrawal" },
        { id: "water_discharge_impact", label: "Water Discharge & Management Of Associated Impact" },
        { id: "water_consumption", label: "Water Consumption" }
      ].filter(Boolean),
    },
    {
      groupId: "energy",
      title: "Energy",
      children: [
        !isWithReference && { id: "energy_material_topic_management", label: "Management Of Material Topics" },
        { id: "energy_consumption_within", label: "Energy Consumption Within The Organisation" },
        { id: "energy_consumption_outside", label: "Energy Consumption Outside Of The Organisation" },
        { id: "energy_intensity", label: "Energy Intensity" },
        { id: "energy_reduction", label: "Reduction In Energy Consumption" }
      ].filter(Boolean),
    },
    {
      groupId: "waste",
      title: "Waste",
      children: [
        !isWithReference && { id: "waste_material_topic_management", label: "Management Of Material Topics" },
        { id: "waste_generation_impacts", label: "Waste Generation And Impacts" },
        { id: "waste_impact_management", label: "Management Of Waste Related Impacts" },
        { id: "waste_disposed", label: "Waste Disposed" },
        { id: "waste_diverted", label: "Waste Diverted From Disposal" },
        { id: "significant_spills", label: "Significant Spills" }
      ].filter(Boolean),
    },
    {
      groupId: "biodiversity",
      title: "Biodiversity",
      children: [
        !isWithReference && { id: "biodiversity_material_topic_management", label: "Management Of Material Topic" },
        { id: "habitat_protected_restored", label: "Habitat Protected And Restored" }
      ].filter(Boolean),
    },
    {
      groupId: "air_quality",
      title: "Air Quality",
      children: [
        !isWithReference && { id: "air_quality_material_topic_management", label: "Management Of Material Topics" }
      ].filter(Boolean),
    }
  ];
  
      
      
  
      const subsectionMapping = {
        // Emissions
        emissions: {
          component: Section2,
          title: "Emissions",
          subSections: [],
        },
        ...(!isWithReference && {
          emissions_material_topic_management: {
            component: Section3,
            title: "Management Of Material Topics",
            subSections: [],
          }
        }),
        scope_1_ghg_emissions: {
          component: Section4,
          title: "Scope 1 GHG Emissions",
          subSections: [],
        },
        scope_2_ghg_emissions: {
          component: Section5,
          title: "Scope 2 GHG Emissions",
          subSections: [],
        },
        scope_3_ghg_emissions: {
          component: Section6,
          title: "Scope 3 GHG Emissions",
          subSections: [],
        },
        base_year: {
          component: Section7,
          title: "Base Year",
          subSections: [],
        },
        consolidation_approach: {
          component: Section35,
          title: "Consolidation Approach",
          subSections: [],
        },
        ghg_emission_intensity: {
          component: Section36,
          title: "GHG Emission Intensity",
          subSections: [],
        },
        reduction_in_ghg_emissions: {
          component: Section8,
          title: "Reduction In GHG Emissions",
          subSections: [],
        },
        ozone_depleting_substances: {
          component: Section9,
          title: "Ozone Depleting Substances",
          subSections: [],
        },
      
        // Materials
        materials: {
          component: Section10,
          title: "Materials",
          subSections: [],
        },
        ...(!isWithReference && {
          materials_material_topic_management: {
            component: Section11,
            title: "Management Of Material Topics",
            subSections: [],
          }
        }),
        recycled_input_materials: {
          component: Section12,
          title: "Recycled Input Materials Used",
          subSections: [],
        },
        reclaimed_products_packaging: {
          component: Section13,
          title: "Reclaimed Products And Their Packaging Materials",
          subSections: [],
        },
      
        // Water
        water: {
          component: Section14,
          title: "Water",
          subSections: [],
        },
        ...(!isWithReference && {
          water_material_topic_management: {
            component: Section15,
            title: "Management Of Material Topic",
            subSections: [],
          }
        }),
        water_withdrawal: {
          component: Section16,
          title: "Water Withdrawal",
          subSections: [],
        },
        water_discharge_impact: {
          component: Section17,
          title: "Water Discharge & Management Of Associated Impact",
          subSections: [],
        },
        water_consumption: {
          component: Section18,
          title: "Water Consumption",
          subSections: [],
        },
      
        // Energy
        energy: {
          component: ({ section12_4Ref, sectionNumber = "12.4", sectionTitle = "Energy", sectionOrder = 12 }) => {
            return (
              <div id="section12_4" ref={section12_4Ref}>
                <h3 className="text-[17px] text-[#344054] mb-4 text-left font-semibold">
                  {sectionNumber} {sectionTitle}
                </h3>
              </div>
            );
          },
          title: "Energy",
          subSections: [],
        },
        ...(!isWithReference && {
          energy_material_topic_management: {
            component: Section19,
            title: "Management Of Material Topics",
            subSections: [],
          }
        }),
        energy_consumption_within: {
          component: Section20,
          title: "Energy Consumption Within The Organisation",
          subSections: [],
        },
        energy_consumption_outside: {
          component: Section21,
          title: "Energy Consumption Outside Of The Organisation",
          subSections: [],
        },
        energy_intensity: {
          component: Section22,
          title: "Energy Intensity",
          subSections: [],
        },
        energy_reduction: {
          component: Section23,
          title: "Reduction In Energy Consumption",
          subSections: [],
        },
      
        // Waste
        waste: {
          component: ({ section12_5Ref, sectionNumber = "12.5", sectionTitle = "Waste", sectionOrder = 12 }) => {
            return (
              <div id="section12_5" ref={section12_5Ref}>
                <h3 className="text-[17px] text-[#344054] mb-4 text-left font-semibold">
                  {sectionNumber} {sectionTitle}
                </h3>
              </div>
            );
          },
          title: "Waste",
          subSections: [],
        },
        ...(!isWithReference && {
          waste_material_topic_management: {
            component: Section24,
            title: "Management Of Material Topics",
            subSections: [],
          }
        }),
        waste_generation_impacts: {
          component: Section25,
          title: "Waste Generation And Impacts",
          subSections: [],
        },
        waste_impact_management: {
          component: Section26,
          title: "Management Of Waste Related Impacts",
          subSections: [],
        },
        waste_disposed: {
          component: Section27,
          title: "Waste Disposed",
          subSections: [],
        },
        waste_diverted: {
          component: Section28,
          title: "Waste Diverted From Disposal",
          subSections: [],
        },
        significant_spills: {
          component: Section29,
          title: "Significant Spills",
          subSections: [],
        },
      
        // Biodiversity
        biodiversity: {
          component: Section30,
          title: "Biodiversity",
          subSections: [],
        },
        ...(!isWithReference && {
          biodiversity_material_topic_management: {
            component: Section31,
            title: "Management Of Material Topic",
            subSections: [],
          }
        }),
        habitat_protected_restored: {
          component: Section32,
          title: "Habitat Protected And Restored",
          subSections: [],
        },
      
        // Air Quality
        air_quality: {
          component: Section33,
          title: "Air Quality",
          subSections: [],
        },
        ...(!isWithReference && {
          air_quality_material_topic_management: {
            component: Section34,
            title: "Management Of Material Topics",
            subSections: [],
          }
        }),
      };
      
      
      
      const getSubsectionsToShow = () => {
        if (reportType === "Custom ESG Report") {
          const userSelected = Array.isArray(subsections) ? subsections : [];
  
          // Get default order
          const defaultOrder = [
            "emissions",
            "emissions_material_topic_management",
            "scope_1_ghg_emissions",
            "scope_2_ghg_emissions",
            "scope_3_ghg_emissions",
            "base_year",
            "consolidation_approach",
            "ghg_emission_intensity",
            "reduction_in_ghg_emissions",
            "ozone_depleting_substances",
            "materials",
            "materials_material_topic_management",
            "recycled_input_materials",
            "reclaimed_products_packaging",
            "water",
            "water_material_topic_management",
            "water_withdrawal",
            "water_discharge_impact",
            "water_consumption",
            "energy",
            "energy_material_topic_management",
            "energy_consumption_within",
            "energy_consumption_outside",
            "energy_intensity",
            "energy_reduction",
            "waste",
            "waste_material_topic_management",
            "waste_generation_impacts",
            "waste_impact_management",
            "waste_disposed",
            "waste_diverted",
            "significant_spills",
            "biodiversity",
            "biodiversity_material_topic_management",
            "habitat_protected_restored",
            "air_quality",
            "air_quality_material_topic_management"
          ]
          
  
          // Return sorted list based on fixed order
          return defaultOrder.filter((id) => userSelected.includes(id));
        } else {
          return [
            "emissions",
            "emissions_material_topic_management",
            "scope_1_ghg_emissions",
            "scope_2_ghg_emissions",
            "scope_3_ghg_emissions",
            "base_year",
            "consolidation_approach",
            "ghg_emission_intensity",
            "reduction_in_ghg_emissions",
            "ozone_depleting_substances",
            "materials",
            "materials_material_topic_management",
            "recycled_input_materials",
            "reclaimed_products_packaging",
            "water",
            "water_material_topic_management",
            "water_withdrawal",
            "water_discharge_impact",
            "water_consumption",
            "energy",
            "energy_material_topic_management",
            "energy_consumption_within",
            "energy_consumption_outside",
            "energy_intensity",
            "energy_reduction",
            "waste",
            "waste_material_topic_management",
            "waste_generation_impacts",
            "waste_impact_management",
            "waste_disposed",
            "waste_diverted",
            "significant_spills",
            "biodiversity",
            "biodiversity_material_topic_management",
            "habitat_protected_restored",
            "air_quality",
            "air_quality_material_topic_management"
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
  environmental_responsibility_statement,
  emissions,
  scope_one_emissions,
  scope_two_emissions,
  scope_three_emissions,
  ghg_emission_intensity_tracking,
  ghg_emission_reduction_efforts,
  ozone_depleting_substance_elimination,
  material_management_strategy,
  recycling_process,
  reclamation_recycling_process,
  water_withdrawal_tracking,
  water_consumption_goals,
  energy_consumption_within_organization,
  energy_consumption_outside_organization,
  energy_intensity_tracking,
  // energy_consumption_reduction_commitment,
  significant_spills,
  habitat_protection_restoration_commitment,
  air_quality_protection_commitment,
  biogenic_c02_emissions_305_3c,
  biogenic_c02_emissions,
  consolidation,
  base_year
  }
  const submitForm = async (type) => {
    LoaderOpen();
    if (!hasChanges(initialData, currentData)) {
      LoaderClose();
      return false;
    }
    const data = {};

data.environmental_responsibility_statement = {
  page: "screen_twelve",
  label: `${sectionOrder}. Environment`,
  subLabel: "Add statement about company’s responsibility to minimize the environmental impact",
  type: "textarea",
  content: environmental_responsibility_statement,
  field: "environmental_responsibility_statement",
  isSkipped: false,
};

// Emissions
if (subsectionsToShow.includes("emissions")) {
  const sectionNumber = dynamicSectionNumberMap["emissions"];
  data.emissions = {
    page: "screen_twelve",
    label: `${sectionNumber} Emissions`,
    subLabel: "Add statement about company’s strategy to reduce emission",
    type: "textarea",
    content: emissions,
    field: "emissions",
    isSkipped: false,
  };
}

if (subsectionsToShow.includes("scope_1_ghg_emissions")) {
  const sectionNumber = dynamicSectionNumberMap["scope_1_ghg_emissions"];
  data.scope_one_emissions = {
    page: "screen_twelve",
    label: `${sectionNumber} Scope 1 GHG Emissions`,
    subLabel: "Add statement about company’s scope 1 emissions",
    type: "textarea",
    content: scope_one_emissions,
    field: "scope_one_emissions",
    isSkipped: false,
  };
}

if (subsectionsToShow.includes("scope_2_ghg_emissions")) {
  const sectionNumber = dynamicSectionNumberMap["scope_2_ghg_emissions"];
  data.scope_two_emissions = {
    page: "screen_twelve",
    label: `${sectionNumber} Scope 2 GHG Emissions`,
    subLabel: "Add statement about company’s scope 2 emissions",
    type: "textarea",
    content: scope_two_emissions,
    field: "scope_two_emissions",
    isSkipped: false,
  };
}

if (subsectionsToShow.includes("scope_3_ghg_emissions")) {
  const sectionNumber = dynamicSectionNumberMap["scope_3_ghg_emissions"];
  data.scope_three_emissions = {
    page: "screen_twelve",
    label: `${sectionNumber} Scope 3 GHG Emissions`,
    subLabel: "Add statement about company’s scope 3 emissions",
    type: "textarea",
    content: scope_three_emissions,
    field: "scope_three_emissions",
    isSkipped: false,
  };
}

if (subsectionsToShow.includes("ghg_emission_intensity")) {
  const sectionNumber = dynamicSectionNumberMap["ghg_emission_intensity"];
  data.ghg_emission_intensity_tracking = {
    page: "screen_twelve",
    label: `${sectionNumber} GHG Emission Intensity`,
    subLabel: "Add statement about tracking of GHG emission intensity",
    type: "richTextarea",
    content: ghg_emission_intensity_tracking,
    field: "ghg_emission_intensity_tracking",
    isSkipped: false,
  };
}

if (subsectionsToShow.includes("reduction_in_ghg_emissions")) {
  const sectionNumber = dynamicSectionNumberMap["reduction_in_ghg_emissions"];
  data.ghg_emission_reduction_efforts = {
    page: "screen_twelve",
    label: `${sectionNumber} Reduction in GHG Emissions`,
    subLabel: "Add statement about efforts to reduce GHG emission",
    type: "richTextarea",
    content: ghg_emission_reduction_efforts,
    field: "ghg_emission_reduction_efforts",
    isSkipped: false,
  };
}

if (subsectionsToShow.includes("ozone_depleting_substances")) {
  const sectionNumber = dynamicSectionNumberMap["ozone_depleting_substances"];
  data.ozone_depleting_substance_elimination = {
    page: "screen_twelve",
    label: `${sectionNumber} Ozone Depleting Substances`,
    subLabel: "Add statement about company’s commitment to eliminate use of ozone depleting substance",
    type: "richTextarea",
    content: ozone_depleting_substance_elimination,
    field: "ozone_depleting_substance_elimination",
    isSkipped: false,
  };
}
if(subsectionsToShow.includes("materials")){
  const sectionNumber = dynamicSectionNumberMap["materials"];
  data.material_management_strategy= {
    page: "screen_twelve",
    label: `${sectionNumber} Materials`,
    subLabel: "Add statement about company’s material management strategy",
    type: "textarea",
    content: material_management_strategy,
    field: "material_management_strategy",
    isSkipped: false,
  }
}
if(subsectionsToShow.includes("recycled_input_materials")){
  const sectionNumber = dynamicSectionNumberMap["recycled_input_materials"];
  data.recycling_process= {
    page: "screen_twelve",
    label: `${sectionNumber} Recycled Input Materials Used`,
    subLabel: "Add statement about company’s process for recycling",
    type: "textarea",
    content: recycling_process,
    field: "recycling_process",
    isSkipped: false,
  }
}
if(subsectionsToShow.includes("reclaimed_products_packaging")){
  const sectionNumber = dynamicSectionNumberMap["reclaimed_products_packaging"];
  data.reclamation_recycling_process= {
    page: "screen_twelve",
    label: `${sectionNumber} Reclaimed Products and Their Packaging Materials`,
    subLabel:
      "Add statement about company’s reclamation and recycling process",
    type: "textarea",
    content: reclamation_recycling_process,
    field: "reclamation_recycling_process",
    isSkipped: false,
  }
}
if (subsectionsToShow.includes("water_withdrawal")) {
  const sectionNumber = dynamicSectionNumberMap["water_withdrawal"];
  data.water_withdrawal_tracking = {
    page: "screen_twelve",
    label: `${sectionNumber} Water Withdrawal`,
    subLabel: "Add statement about company’s tracking of water withdrawal",
    type: "textarea",
    content: water_withdrawal_tracking,
    field: "water_withdrawal_tracking",
    isSkipped: false,
  };
}

if (subsectionsToShow.includes("water_consumption")) {
  const sectionNumber = dynamicSectionNumberMap["water_consumption"];
  data.water_consumption_goals = {
    page: "screen_twelve",
    label: `${sectionNumber} Water Consumption`,
    subLabel: "Add statement about company’s water consumption goals",
    type: "textarea",
    content: water_consumption_goals,
    field: "water_consumption_goals",
    isSkipped: false,
  };
}
if (subsectionsToShow.includes("energy_consumption_within")) {
  const sectionNumber = dynamicSectionNumberMap["energy_consumption_within"];
  data.energy_consumption_within_organization = {
    page: "screen_twelve",
    label: `${sectionNumber} Energy Consumption within the Organization`,
    subLabel: "Add statement about company’s energy consumption within organisation",
    type: "textarea",
    content: energy_consumption_within_organization,
    field: "energy_consumption_within_organization",
    isSkipped: false,
  };
}

if (subsectionsToShow.includes("energy_consumption_outside")) {
  const sectionNumber = dynamicSectionNumberMap["energy_consumption_outside"];
  data.energy_consumption_outside_organization = {
    page: "screen_twelve",
    label: `${sectionNumber} Energy Consumption Outside of the Organization`,
    subLabel: "Add statement about company’s energy consumption outside of the organisation",
    type: "textarea",
    content: energy_consumption_outside_organization,
    field: "energy_consumption_outside_organization",
    isSkipped: false,
  };
}

if (subsectionsToShow.includes("energy_intensity")) {
  const sectionNumber = dynamicSectionNumberMap["energy_intensity"];
  data.energy_intensity_tracking = {
    page: "screen_twelve",
    label: `${sectionNumber} Energy Intensity`,
    subLabel: "Add statement about tracking the Energy Intensity",
    type: "textarea",
    content: energy_intensity_tracking,
    field: "energy_intensity_tracking",
    isSkipped: false,
  };
}
if (subsectionsToShow.includes("significant_spills")) {
  const sectionNumber = dynamicSectionNumberMap["significant_spills"];
  data.significant_spills = {
    page: "screen_twelve",
    label: `${sectionNumber} Significant Spills`,
    subLabel: "Add statement about company’s programs for preventing and managing significant spills",
    type: "textarea",
    content: significant_spills,
    field: "significant_spills",
    isSkipped: false,
  };
}
if (subsectionsToShow.includes("habitat_protected_restored")) {
  const sectionNumber = dynamicSectionNumberMap["habitat_protected_restored"];
  data.habitat_protection_restoration_commitment = {
    page: "screen_twelve",
    label: `${sectionNumber} Habitat Protected and Restored`,
    subLabel: "Add statement about company’s commitment to protect and restore habitats",
    type: "richTextarea",
    content: habitat_protection_restoration_commitment,
    field: "habitat_protection_restoration_commitment",
    isSkipped: false,
  };
}
if (subsectionsToShow.includes("air_quality")) {
  const sectionNumber = dynamicSectionNumberMap["air_quality"];
  data.air_quality_protection_commitment = {
    page: "screen_twelve",
    label: `${sectionNumber} Air Quality`,
    subLabel: "Add statement about company’s commitment to protect and maintain air quality",
    type: "richTextarea",
    content: air_quality_protection_commitment,
    field: "air_quality_protection_commitment",
    isSkipped: false,
  };
}

// Biogenic Emissions
if (subsectionsToShow.includes("scope_3_ghg_emissions")) {
  const sectionNumber = dynamicSectionNumberMap["scope_3_ghg_emissions"];
  data.biogenic_c02_emissions_305_3c = {
    page: "screen_twelve",
    label: `${sectionNumber} Biogenic CO2 emissions (305-3-c)`,
    subLabel: "",
    type: "richTextarea",
    content: biogenic_c02_emissions_305_3c,
    field: "biogenic_c02_emissions_305_3c",
    isSkipped: false,
  };
}

if (subsectionsToShow.includes("scope_1_ghg_emissions")) {
  const sectionNumber = dynamicSectionNumberMap["scope_1_ghg_emissions"];
  data.biogenic_c02_emissions = {
    page: "screen_twelve",
    label: `${sectionNumber} Biogenic CO2 emissions`,
    subLabel: "",
    type: "richTextarea",
    content: biogenic_c02_emissions,
    field: "biogenic_c02_emissions",
    isSkipped: false,
  };
}

// Consolidation
if (subsectionsToShow.includes("consolidation_approach")) {
  const sectionNumber = dynamicSectionNumberMap["consolidation_approach"];
  data.consolidation = {
    page: "screen_twelve",
    label: `${sectionNumber} Consolidation Approach`,
    subLabel: "Add statement about tracking of Consolidation Approach",
    type: "textarea",
    content: consolidation,
    field: "consolidation",
    isSkipped: false,
  };
}

if (subsectionsToShow.includes("base_year")) {
  const sectionNumber = dynamicSectionNumberMap["base_year"];
  data.base_year = {
    page: "screen_twelve",
    label: `${sectionNumber} Base Year`,
    subLabel: "Add statement about emissions in the Base Year",
    type: "textarea",
    content: base_year,
    field: "base_year",
    isSkipped: false,
  };
}

    // const data = {
    //   environmental_responsibility_statement: {
    //     page: "screen_twelve",
    //     label: "12. Environment",
    //     subLabel:
    //       "Add statement about company’s responsibility to minimize the environmental impact",
    //     type: "textarea",
    //     content: environmental_responsibility_statement,
    //     field: "environmental_responsibility_statement",
    //     isSkipped: false,
    //   },
    //   emissions: {
    //     page: "screen_twelve",
    //     label: "12.1 Emissions",
    //     subLabel: "Add statement about company’s strategy to reduce emission",
    //     type: "textarea",
    //     content: emissions,
    //     field: "emissions",
    //     isSkipped: false,
    //   },
    //   scope_one_emissions: {
    //     page: "screen_twelve",
    //     label: "12.1.2 Scope 1 GHG Emissions",
    //     subLabel: "Add statement about company’s scope 1 emissions",
    //     type: "textarea",
    //     content: scope_one_emissions,
    //     field: "scope_one_emissions",
    //     isSkipped: false,
    //   },
    //   scope_two_emissions: {
    //     page: "screen_twelve",
    //     label: "12.1.3 Scope 2 GHG Emissions",
    //     subLabel: "Add statement about company’s scope 2 emissions",
    //     type: "textarea",
    //     content: scope_two_emissions,
    //     field: "scope_two_emissions",
    //     isSkipped: false,
    //   },
    //   scope_three_emissions: {
    //     page: "screen_twelve",
    //     label: "12.1.4 Scope 3 GHG Emissions",
    //     subLabel: "Add statement about company’s scope 3 emissions",
    //     type: "textarea",
    //     content: scope_three_emissions,
    //     field: "scope_three_emissions",
    //     isSkipped: false,
    //   },
    //   ghg_emission_intensity_tracking: {
    //     page: "screen_twelve",
    //     label: "12.1.5 GHG Emission Intensity",
    //     subLabel: "Add statement about tracking of GHG emission intensity",
    //     type: "richTextarea",
    //     content: ghg_emission_intensity_tracking,
    //     field: "ghg_emission_intensity_tracking",
    //     isSkipped: false,
    //   },
    //   ghg_emission_reduction_efforts: {
    //     page: "screen_twelve",
    //     label: "12.1.6 Reduction in GHG Emissions",
    //     subLabel: "Add statement about efforts to reduce GHG emission",
    //     type: "richTextarea",
    //     content: ghg_emission_reduction_efforts,
    //     field: "ghg_emission_reduction_efforts",
    //     isSkipped: false,
    //   },
    //   ozone_depleting_substance_elimination: {
    //     page: "screen_twelve",
    //     label: "12.1.7 Ozone Depleting Substances",
    //     subLabel:
    //       "Add statement about company’s commitment to eliminate use of ozone depleting substance",
    //     type: "richTextarea",
    //     content: ozone_depleting_substance_elimination,
    //     field: "ozone_depleting_substance_elimination",
    //     isSkipped: false,
    //   },
    //   material_management_strategy: {
    //     page: "screen_twelve",
    //     label: "12.2 Materials",
    //     subLabel: "Add statement about company’s material management strategy",
    //     type: "textarea",
    //     content: material_management_strategy,
    //     field: "material_management_strategy",
    //     isSkipped: false,
    //   },
    //   recycling_process: {
    //     page: "screen_twelve",
    //     label: "12.2.2 Recycled Input Materials Used",
    //     subLabel: "Add statement about company’s process for recycling",
    //     type: "textarea",
    //     content: recycling_process,
    //     field: "recycling_process",
    //     isSkipped: false,
    //   },
    //   reclamation_recycling_process: {
    //     page: "screen_twelve",
    //     label: "12.2.3 Reclaimed Products and Their Packaging Materials",
    //     subLabel:
    //       "Add statement about company’s reclamation and recycling process",
    //     type: "textarea",
    //     content: reclamation_recycling_process,
    //     field: "reclamation_recycling_process",
    //     isSkipped: false,
    //   },
    //   water_withdrawal_tracking: {
    //     page: "screen_twelve",
    //     label: "12.3.2 Water Withdrawal",
    //     subLabel: "Add statement about company’s tracking of water withdrawal",
    //     type: "textarea",
    //     content: water_withdrawal_tracking,
    //     field: "water_withdrawal_tracking",
    //     isSkipped: false,
    //   },
    //   water_consumption_goals: {
    //     page: "screen_twelve",
    //     label: "12.3.4 Water Consumption",
    //     subLabel: "Add statement about company’s water consumption goals",
    //     type: "textarea",
    //     content: water_consumption_goals,
    //     field: "water_consumption_goals",
    //     isSkipped: false,
    //   },
    //   energy_consumption_within_organization: {
    //     page: "screen_twelve",
    //     label: "12.4.2 Energy Consumption within the Organization",
    //     subLabel:
    //       "Add statement about company’s energy consumption within organisation",
    //     type: "textarea",
    //     content: energy_consumption_within_organization,
    //     field: "energy_consumption_within_organization",
    //     isSkipped: false,
    //   },
    //   energy_consumption_outside_organization: {
    //     page: "screen_twelve",
    //     label: "12.4.3 Energy Consumption Outside of the Organization",
    //     subLabel:
    //       "Add statement about company’s energy consumption outside of the organisation",
    //     type: "textarea",
    //     content: energy_consumption_outside_organization,
    //     field: "energy_consumption_outside_organization",
    //     isSkipped: false,
    //   },
    //   energy_intensity_tracking: {
    //     page: "screen_twelve",
    //     label: "12.4.4 Energy Intensity",
    //     subLabel: "Add statement about tracking the Energy Intensity",
    //     type: "textarea",
    //     content: energy_intensity_tracking,
    //     field: "energy_intensity_tracking",
    //     isSkipped: false,
    //   },
    //   // energy_consumption_reduction_commitment: {
    //   //   page: "screen_twelve",
    //   //   label: "12.4.5 Reduction in Energy consumption",
    //   //   subLabel:
    //   //     "Add statement about company’s commitment to reduce energy consumption",
    //   //   type: "textarea",
    //   //   content: energy_consumption_reduction_commitment,
    //   //   field: "energy_consumption_reduction_commitment",
    //   //   isSkipped: false,
    //   // },
    //   significant_spills: {
    //     page: "screen_twelve",
    //     label: "12.5.6 Significant Spills",
    //     subLabel:
    //       "Add statement about company’s programs for preventing and managing significant spills",
    //     type: "richTextarea",
    //     content: significant_spills,
    //     field: "significant_spills",
    //     isSkipped: false,
    //   },
    //   habitat_protection_restoration_commitment: {
    //     page: "screen_twelve",
    //     label: "12.6.2 Habitat Protected and Restored",
    //     subLabel:
    //       "Add statement about company’s commitment to protect and restore habitats",
    //     type: "richTextarea",
    //     content: habitat_protection_restoration_commitment,
    //     field: "habitat_protection_restoration_commitment",
    //     isSkipped: false,
    //   },
    //   air_quality_protection_commitment: {
    //     page: "screen_twelve",
    //     label: "12.7 Air Quality",
    //     subLabel:
    //       "Add statement about company’s commitment to protect and maintain air quality",
    //     type: "richTextarea",
    //     content: air_quality_protection_commitment,
    //     field: "air_quality_protection_commitment",
    //     isSkipped: false,
    //   },
    //   biogenic_c02_emissions_305_3c: {
    //     page: "screen_twelve",
    //     label: "305-3-c. Biogenic CO2 emissions",
    //     subLabel: "",
    //     type: "richTextarea",
    //     content: biogenic_c02_emissions_305_3c,
    //     field: "biogenic_c02_emissions_305_3c",
    //     isSkipped: false,
    //   },
    //   biogenic_c02_emissions: {
    //     page: "screen_twelve",
    //     label: "Biogenic CO2 emissions",
    //     subLabel: "",
    //     type: "richTextarea",
    //     content: biogenic_c02_emissions,
    //     field: "biogenic_c02_emissions",
    //     isSkipped: false,
    //   },
    //   consolidation: {
    //     page: "screen_twelve",
    //     label: "Consolidation Approach",
    //     subLabel: "Add statement about tracking of Consolidation Approach",
    //     type: "textarea",
    //     content: consolidation,
    //     field: "consolidation",
    //     isSkipped: false,
    //   },
    //   base_year: {
    //     page: "screen_twelve",
    //     label: "Base Year",
    //     subLabel: "Add statement about emissions in the Base Year",
    //     type: "textarea",
    //     content: base_year,
    //     field: "base_year",
    //     isSkipped: false,
    //   },
    // };

    const url = `${process.env.BACKEND_API_URL}/esg_report/screen_twelve/${reportid}/`;
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
    dispatch(setEnvironmentStatement(""));
    dispatch(setEmission(""));
    dispatch(setScopeOneEmission(""));
    dispatch(setScopeTwoEmission(""));
    dispatch(setScopeThreeEmission(""));
    dispatch(setGHGEmissionIntensityTracking(""));
    dispatch(setGHGEmissionReductionEfforts(""));
    dispatch(setOzoneDepletingSubstanceElimination(""));
    dispatch(setMaterialManagementStrategy(""));
    dispatch(setRecyclingProcess(""));
    dispatch(setBaseYear(""));
    dispatch(setConsolidation(""));
    dispatch(setReclamationRecyclingProcess(""));
    dispatch(setWaterWithdrawalTracking(""));
    dispatch(setWaterConsumptionGoals(""));
    dispatch(setEnergyConsumptionWithinOrganization(""));
    dispatch(setEnergyConsumptionOutsideOrganization(""));
    dispatch(setEnergyIntensityTracking(""));
    dispatch(setEnergyConsumptionReductionCommitment(""));
    dispatch(setSignificantSpills(""));
    dispatch(setHabitatProtectionRestorationCommitment(""));
    dispatch(setAirQualityProtectionCommitment(""));
    dispatch(setBiogenicCO2Emission(""));
    dispatch(setBiogenicCO2305(""));

    const url = `${process.env.BACKEND_API_URL}/esg_report/screen_twelve/${reportid}/`;
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
          setEnvironmentStatement(
            response.data.environmental_responsibility_statement?.content || ""
          )
        );
        dispatch(setEmission(response.data.emissions?.content || ""));
        dispatch(
          setScopeOneEmission(response.data.scope_one_emissions?.content || "")
        );
        dispatch(
          setScopeTwoEmission(response.data.scope_two_emissions?.content || "")
        );
        dispatch(
          setScopeThreeEmission(
            response.data.scope_three_emissions?.content || ""
          )
        );
        dispatch(
          setGHGEmissionIntensityTracking(
            response.data.ghg_emission_intensity_tracking?.content || ""
          )
        );
        dispatch(
          setGHGEmissionReductionEfforts(
            response.data.ghg_emission_reduction_efforts?.content || ""
          )
        );
        dispatch(
          setOzoneDepletingSubstanceElimination(
            response.data.ozone_depleting_substance_elimination?.content || ""
          )
        );
        dispatch(
          setMaterialManagementStrategy(
            response.data.material_management_strategy?.content || ""
          )
        );
        dispatch(
          setRecyclingProcess(response.data.recycling_process?.content || "")
        );
        dispatch(
          setReclamationRecyclingProcess(
            response.data.reclamation_recycling_process?.content || ""
          )
        );
        dispatch(
          setWaterWithdrawalTracking(
            response.data.water_withdrawal_tracking?.content || ""
          )
        );
        dispatch(
          setWaterConsumptionGoals(
            response.data.water_consumption_goals?.content || ""
          )
        );
        dispatch(
          setEnergyConsumptionWithinOrganization(
            response.data.energy_consumption_within_organization?.content || ""
          )
        );
        dispatch(
          setEnergyConsumptionOutsideOrganization(
            response.data.energy_consumption_outside_organization?.content || ""
          )
        );
        dispatch(
          setEnergyIntensityTracking(
            response.data.energy_intensity_tracking?.content || ""
          )
        );
        dispatch(
          setEnergyConsumptionReductionCommitment(
            response.data.energy_consumption_reduction_commitment?.content || ""
          )
        );
        dispatch(
          setSignificantSpills(response.data.significant_spills?.content || "")
        );
        dispatch(
          setHabitatProtectionRestorationCommitment(
            response.data.habitat_protection_restoration_commitment?.content ||
              ""
          )
        );
        dispatch(
          setAirQualityProtectionCommitment(
            response.data.air_quality_protection_commitment?.content || ""
          )
        );
        dispatch(
          setBiogenicCO2Emission(
            response.data.biogenic_c02_emissions?.content || ""
          )
        );
        dispatch(
          setBiogenicCO2305(
            response.data.biogenic_c02_emissions_305_3c?.content || ""
          )
        );
        dispatch(setBaseYear(response.data.base_year?.content || ""));
        dispatch(setConsolidation(response.data.consolidation?.content || ""));
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
            {sectionOrder}. Environment
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
             <div className={`p-4 border border-r-2 border-b-2 shadow-lg rounded-lg ${selectedSubsections.length < 14 ? 'h-[500px]' : 'h-fit'} top-36 sticky mt-2 w-[20%] md:w-[25%] lg:w-[20%] xl:sticky xl:top-36 lg:sticky lg:top-36 md:fixed md:top-[19rem] md:right-4 hidden xl:block md:block lg:block 2k:block 4k:block 2xl:block`}>
              <p className="text-[11px] text-[#727272] mb-2 uppercase">
                {sectionOrder}. Environment
              </p>

              {(() => {
                let groupIndex = 1;

                const groupedSidebar = [
                  {
                    groupId: "emissions",
                    title: "Emissions",
                    children: [
                      {
                        id: "emissions_material_topic_management",
                        label: "Management Of Material Topics",
                      },
                      {
                        id: "scope_1_ghg_emissions",
                        label: "Scope 1 GHG Emissions",
                      },
                      {
                        id: "scope_2_ghg_emissions",
                        label: "Scope 2 GHG Emissions",
                      },
                      {
                        id: "scope_3_ghg_emissions",
                        label: "Scope 3 GHG Emissions",
                      },
                      {
                        id: "base_year",
                        label: "Base Year",
                      },
                      {
                        id: "consolidation_approach",
                        label: "Consolidation Approach",
                      },
                      {
                        id: "ghg_emission_intensity",
                        label: "GHG Emission Intensity",
                      },
                      {
                        id: "reduction_in_ghg_emissions",
                        label: "Reduction In GHG Emissions",
                      },
                      {
                        id: "ozone_depleting_substances",
                        label: "Ozone Depleting Substances",
                      },
                    ],
                  },
                  {
                    groupId: "materials",
                    title: "Materials",
                    children: [
                      {
                        id: "materials_material_topic_management",
                        label: "Management Of Material Topics",
                      },
                      {
                        id: "recycled_input_materials",
                        label: "Recycled Input Materials Used",
                      },
                      {
                        id: "reclaimed_products_packaging",
                        label: "Reclaimed Products And Their Packaging Materials",
                      },
                    ],
                  },
                  {
                    groupId: "water",
                    title: "Water",
                    children: [
                      {
                        id: "water_material_topic_management",
                        label: "Management Of Material Topic",
                      },
                      {
                        id: "water_withdrawal",
                        label: "Water Withdrawal",
                      },
                      {
                        id: "water_discharge_impact",
                        label: "Water Discharge & Management Of Associated Impact",
                      },
                      {
                        id: "water_consumption",
                        label: "Water Consumption",
                      },
                    ],
                  },
                  {
                    groupId: "energy",
                    title: "Energy",
                    children: [
                      {
                        id: "energy_material_topic_management",
                        label: "Management Of Material Topics",
                      },
                      {
                        id: "energy_consumption_within",
                        label: "Energy Consumption Within The Organisation",
                      },
                      {
                        id: "energy_consumption_outside",
                        label: "Energy Consumption Outside Of The Organisation",
                      },
                      {
                        id: "energy_intensity",
                        label: "Energy Intensity",
                      },
                      {
                        id: "energy_reduction",
                        label: "Reduction In Energy Consumption",
                      },
                    ],
                  },
                  {
                    groupId: "waste",
                    title: "Waste",
                    children: [
                      {
                        id: "waste_material_topic_management",
                        label: "Management Of Material Topics",
                      },
                      {
                        id: "waste_generation_impacts",
                        label: "Waste Generation And Impacts",
                      },
                      {
                        id: "waste_impact_management",
                        label: "Management Of Waste Related Impacts",
                      },
                      {
                        id: "waste_disposed",
                        label: "Waste Disposed",
                      },
                      {
                        id: "waste_diverted",
                        label: "Waste Diverted From Disposal",
                      },
                      {
                        id: "significant_spills",
                        label: "Significant Spills",
                      },
                    ],
                  },
                  {
                    groupId: "biodiversity",
                    title: "Biodiversity",
                    children: [
                      {
                        id: "biodiversity_material_topic_management",
                        label: "Management Of Material Topic",
                      },
                      {
                        id: "habitat_protected_restored",
                        label: "Habitat Protected And Restored",
                      },
                    ],
                  },
                  {
                    groupId: "air_quality",
                    title: "Air Quality",
                    children: [
                      {
                        id: "air_quality_material_topic_management",
                        label: "Management Of Material Topics",
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
Environment.displayName = "Environment";

export default Environment;
