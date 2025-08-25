"use client";

import { useState, useEffect } from "react";
import {
  MdOutlineWarehouse,
  MdOutlineFactory,
  MdOutlineDeleteOutline,
  MdOutlineTungsten,
  MdKeyboardArrowDown,
  MdOutlineWater,
  MdEmojiNature,
  MdOutlineAir,
  MdClose,
} from "react-icons/md";
import { LuPackage } from "react-icons/lu";
import { GiWoodPile } from "react-icons/gi";

const sectionTabMap = {
  emissions: [
    "Management of Material topic emission",
    "GHG Emissions",
    "Base Year",
    "Consolidation Approach",
    "Standards",
    "EmissionIntensity",
    "EmissionReductionInitiatives",
  ],
  // energy: [
  //   "Management of Material topic energy",
  //   "Energy consumed inside the organization",
  //   "Energy consumption outside of the organization",
  //   "Energy Intensity",
  //   "Reduction of energy consumption",
  //   "Reductions in energy requirements of products and services",
  //   "Standards, methodologies, assumptions and calculation tools used",
  // ],
  // waste: [
  //   "Significant waste related impact",
  //   "Management of significant waste related impacts",
  //   "Management of Material topic waste",
  //   "Waste generated",
  //   "Waste Diverted from disposal",
  //   "Waste diverted to disposal",
  //   "Data Collection Methodology",
  //   "Significant Spills",
  // ],
  // materials: [
  //   "Management of Material topic Materials",
  //   "Materials used by weight or volume",
  //   "Recycled input materials used",
  // ],
  // packaging: [
  //   "Management of Material topic Packaging Materials",
  //   "Reclaimed products and their packaging materials",
  // ],
  // water: [
  //   "Management of Material topic Water",
  //   "Interaction with water as shared resource",
  //   "Water Withdrawal and Water Discharge from All Areas",
  //   "Water withdrawal/Discharge from areas with water stress",
  //   "Substances of concern",
  //   "Change in water storage",
  // ],
  // biodiversity: [
  //   "Management of Material topic Bio diversity",
  //   "Biodiversity Policies",
  //   "Management of biodiversity impacts",
  //   "Synergies, Trade-offs & Stakeholder Engagement",
  //   "Access and benefit-sharing",
  //   "Operational Sites",
  //   "Significant impacts",
  //   "Habitat Protected",
  //   "IUCN",
  //   "Identification of biodiversity impacts",
  //   "Location with Significant impacts on Biodiversity",
  //   "Changes in Ecosystem Use and Biodiversity Condition",
  //   "Ecosystem services and beneficiaries",
  //   "Products/Services with impact on Biodiversity",
  //   "Standards, methodologies, and assumptions"
  // ],
  // supplier: [
  //   "Management of Material topic Supplier",
  //   "New suppliers that were screened using environmental criteria",
  //   "Negative environmental impacts in the supply chain and actions taken",
  // ],
  // airquality: [
  //   "Management of Material topic air quality",
  //   "Nitrogen Oxides",
  //   "Standard Methodology",
  //   "ODS Import Export",
  //   "Emissions ODS",
  // ],
};

const menu = [
  {
    key: "emissions",
    label: "Emissions",
    icon: <MdOutlineFactory className="w-5 h-5 mr-2" />,
    material: "EnvGhgEmission",
    mandatoryLabel: "Management of Material topic",
    mandatoryKey: "Management of Material topic emission",
    tabs: [
      { key: "GHG Emissions", label: "GHG Emissions" },
      { key: "Base Year", label: "Base Year" },
      {
        key: "Consolidation Approach",
        label: "Consolidation Approach and Assumptions",
      },
      {
        key: "Standards",
        label: "Standards, methodologies and/or calculation tools used",
      },
      { key: "EmissionIntensity", label: "GHG Emission Intensity" },
      {
        key: "EmissionReductionInitiatives",
        label: "GHG Emission Reduction Initiatives",
      },
    ],
  },
  // {
  //   key: "energy",
  //   label: "Energy",
  //   icon: <MdOutlineTungsten className="w-5 h-5 mr-2" />,
  //   material: "EnvEnergy",
  //   mandatoryLabel: "Management of Material topic",
  //   mandatoryKey: "Management of Material topic energy",
  //   tabs: [
  //     {
  //       key: "Energy consumed inside the organization",
  //       label: "Energy consumed inside the organization",
  //     },
  //     {
  //       key: "Energy consumption outside of the organization",
  //       label: "Energy consumption outside of the organization",
  //     },
  //     { key: "Energy Intensity", label: "Energy Intensity" },
  //     {
  //       key: "Reduction of energy consumption",
  //       label: "Reduction of energy consumption",
  //     },
  //     {
  //       key: "Reductions in energy requirements of products and services",
  //       label: "Reductions in energy requirements of products and services",
  //     },
  //     {
  //       key: "Standards, methodologies, assumptions and calculation tools used",
  //       label:
  //         "Standards, methodologies, assumptions and calculation tools used",
  //     },
  //   ],
  // },
  // {
  //   key: "waste",
  //   label: "Waste Management",
  //   icon: <MdOutlineDeleteOutline className="w-5 h-5 mr-2" />,
  //   material: "EnvWasteManagement",
  //   mandatoryLabel: "Management of Material topic",
  //   mandatoryKey: "Management of Material topic waste",
  //   tabs: [
  //     {
  //       key: "Significant waste related impact",
  //       label: "Significant waste related impact",
  //     },
  //     {
  //       key: "Management of significant waste related impacts",
  //       label: "Management of significant waste related impacts",
  //     },
  //     { key: "Waste generated", label: "Waste generated" },
  //     {
  //       key: "Waste Diverted from disposal",
  //       label: "Waste Diverted from disposal",
  //     },
  //     {
  //       key: "Waste diverted to disposal",
  //       label: "Waste Directed to disposal",
  //     },
  //     {
  //       key: "Data Collection Methodology",
  //       label: "Data Collection Methodology",
  //     },
  //     { key: "Significant Spills", label: "Significant Spills" },
  //   ],
  // },
  // {
  //   key: "materials",
  //   label: "Material Use and Efficiency",
  //   icon: <GiWoodPile className="w-5 h-5 mr-2" />,
  //   material: "EnvRawMaterialSourcing",
  //   mandatoryLabel: "Management of Material topic",
  //   mandatoryKey: "Management of Material topic Materials",
  //   tabs: [
  //     {
  //       key: "Materials used by weight or volume",
  //       label: "Materials used by weight or volume",
  //     },
  //     {
  //       key: "Recycled input materials used",
  //       label: "Recycled input materials used",
  //     },
  //   ],
  // },
  // {
  //   key: "packaging",
  //   label: "Packaging Material",
  //   icon: <LuPackage className="w-5 h-5 mr-2" />,
  //   material: "EnvPackagingMaterial",
  //   mandatoryLabel: "Management of Material topic",
  //   mandatoryKey: "Management of Material topic Packaging Materials",
  //   tabs: [
  //     {
  //       key: "Reclaimed products and their packaging materials",
  //       label: "Reclaimed products and their packaging materials",
  //     },
  //   ],
  // },
  // {
  //   key: "water",
  //   label: "Water and effluents",
  //   icon: <MdOutlineWater className="w-5 h-5 mr-2" />,
  //   material: "EnvWaterEffluent",
  //   mandatoryLabel: "Management of Material topic",
  //   mandatoryKey: "Management of Material topic Water",
  //   tabs: [
  //     {
  //       key: "Interaction with water as shared resource",
  //       label: "Interaction with water as shared resource",
  //     },
  //     {
  //       key: "Water Withdrawal and Water Discharge from All Areas",
  //       label: "Water Withdrawal and Water Discharge from All Areas",
  //     },
  //     {
  //       key: "Water withdrawal/Discharge from areas with water stress",
  //       label:
  //         "Water withdrawal and Water Discharge from areas with water stress",
  //     },
  //     { key: "Substances of concern", label: "Substances of concern" },
  //     { key: "Change in water storage", label: "Change in water storage" },
  //   ],
  // },
  // {
  //   key: "biodiversity",
  //   label: "Bio Diversity",
  //   icon: <MdEmojiNature className="w-6 h-6 mr-2" />,
  //   material: "EnvBioDiversityLandUse",
  //   mandatoryLabel: "Management of Material topic",
  //   mandatoryKey: "Management of Material topic Bio diversity",
  //   tabs: [
  //     {
  //       key: "Operational Sites",
  //       label: "Operational Sites In/Near Areas of High Biodiversity Value",
  //     },
  //     {
  //       key: "Significant impacts",
  //       label: "Significant impacts on Biodiversity",
  //     },
  //     { key: "Habitat Protected", label: "Habitat Protected or Restored" },
  //     {
  //       key: "IUCN",
  //       label: "IUCN & national conservation list species in affected areas",
  //     },

  //     { key: "Biodiversity Policies", label: "Biodiversity Policies" },
  //     {
  //       key: "Management of biodiversity impacts",
  //       label: "Management of biodiversity impacts",
  //     },
  //     {
  //       key: "Synergies, Trade-offs & Stakeholder Engagement",
  //       label: "Synergies, Trade-offs & Stakeholder Engagement",
  //     },
  //     {
  //       key: "Access and benefit-sharing",
  //       label: "Access and benefit-sharing",
  //     },
  //     { key: "Identification of biodiversity impacts", label: "Identification of biodiversity impacts" },
  //     {
  //       key: "Location with Significant impacts on Biodiversity",
  //       label: "Location with Significant impacts on Biodiversity",
  //     },
  //     {
  //       key: "Changes in Ecosystem Use and Biodiversity Condition",
  //       label: "Changes in Ecosystem Use and Biodiversity Condition",
  //     },
  //     {
  //       key: "Ecosystem services and beneficiaries",
  //       label: "Ecosystem services and beneficiaries",
  //     },
  //     {
  //       key:"Products/Services with impact on Biodiversity",
  //       label:"Products/Services with impact on Biodiversity"
  //     },
  //     {
  //       key:"Standards, methodologies, and assumptions",
  //       label:"Standards, methodologies, and assumptions"
  //     }
      
  //   ],
  // },
  // {
  //   key: "supplier",
  //   label: "Supplier Environmental Assessment",
  //   icon: <MdOutlineWarehouse className="w-5 h-5 mr-2" />,
  //   material: "EnvSupplyChainSustainability",
  //   mandatoryLabel: "Management of Material topic",
  //   mandatoryKey: "Management of Material topic Supplier",
  //   tabs: [
  //     {
  //       key: "New suppliers that were screened using environmental criteria",
  //       label: "New suppliers that were screened using environmental criteria",
  //     },
  //     {
  //       key: "Negative environmental impacts in the supply chain and actions taken",
  //       label:
  //         "Negative environmental impacts in the supply chain and actions taken",
  //     },
  //   ],
  // },
  // {
  //   key: "airquality",
  //   label: "Air Quality & other emissions",
  //   icon: <MdOutlineAir className="w-5 h-5 mr-2" />,
  //   material: "EnvAirQuality",
  //   mandatoryLabel: "Management of Material topic",
  //   mandatoryKey: "Management of Material topic air quality",
  //   tabs: [
  //     {
  //       key: "Nitrogen Oxides",
  //       label:
  //         "Nitrogen oxides (NOx), sulfur oxides (SOx), and other significant air emissions",
  //     },
  //     {
  //       key: "Standard Methodology",
  //       label: "Standards, methodologies, and assumptions used",
  //     },
  //     { key: "ODS Import Export", label: "ODS Production, Import and Export" },
  //     {
  //       key: "Emissions ODS",
  //       label: "Emissions of ozone- depleting substances (ODS)",
  //     },
  //   ],
  // },
];

const tabToSectionKey = Object.entries(sectionTabMap).reduce(
  (acc, [section, tabs]) => {
    tabs.forEach((t) => (acc[t] = section));
    return acc;
  },
  {}
);

const Aside = ({ activeTab, handleTabClick, apiData, setMobileopen }) => {
  const materialityEnvData =
    apiData && apiData.environment ? apiData.environment : {};
  const [openSection, setOpenSection] = useState(null);

  useEffect(() => {
    setOpenSection(tabToSectionKey[activeTab] || null);
  }, [activeTab]);

  return (
    <div className="m-3 ml-2 p-2 border border-r-2 border-b-2 shadow-lg rounded-md  h-full">
      <div className="flex items-start py-4 rounded-lg text-[0.875rem] overflow-x-hidden w-full max-w-[240px] scrollable-content">
        <div className="flex flex-col w-full font-medium">
          <button className="flex justify-between items-center px-4 py-2 -mt-4 mb-8 rounded-none focus:outline-none text-[#727272] font-bold">
            <span className="text-[16px] font-extrabold">Environment</span>
            <span className="float-end block xl:hidden md:block lg:hidden 2xl:hidden 4k:hidden">
              <MdClose
                onClick={() => setMobileopen(false)}
                className="text-3xl"
              />
            </span>
          </button>
          {menu.map((section) => {
            const isOpen = openSection === section.key;
            const isActive = [
              ...section.tabs.map((t) => t.key),
              section.mandatoryKey,
            ].includes(activeTab);
            const material =
              section.material &&
              materialityEnvData[section.material]?.is_material_topic;
            return (
              <div key={section.key}>
                <button
                  className={`flex items-center justify-between  px-2 py-2 mb-2 focus:outline-none w-full ${
                    isActive ? "text-[#007EEF]" : "bg-white text-[#727272]"
                  }`}
                  onClick={() =>
                    setOpenSection(
                      openSection === section.key ? null : section.key
                    )
                  }
                >
                  <div className="xl:w-[15%] lg:w-[15%] 2xl:w-[15%] 4k:w-[15%] 2k:w-[15%] md:w-[15%] w-[10%]">
                    {section.icon}
                  </div>
                  <div className="w-[50%] text-left ml-2">
                    <span className="indent-0">{section.label}</span>
                  </div>
                  {material ? (
                    <div className="w-[20%] flex justify-end">
                      <span className="text-[#007EEF] text-[10px] bg-[#0057a51a] py-[4px] px-[6px] rounded-md">
                        M
                      </span>
                    </div>
                  ) : (
                    <span className="w-[20%]"></span>
                  )}
                  <div className="inset-y-0 flex items-center pointer-events-none w-[15%] justify-end">
                    <MdKeyboardArrowDown
                      className={`text-lg text-neutral-500 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>
                {isOpen && (
                  <div className="bg-white px-10 ml-4 xl:px-2 border-l-2 border-gray-300">
                    {material && (
                      <>
                        <p className="text-[12px] ml-3 text-gray-400">
                          Mandatory Management Disclosure
                        </p>
                        <p
                          className={`flex text-start ml-4 px-2 py-2 focus:outline-none w-full text-[12px] cursor-pointer ${
                            activeTab === section.mandatoryKey
                              ? "text-blue-400"
                              : "bg-transparent text-[#727272]"
                          }`}
                          onClick={() => handleTabClick(section.mandatoryKey)}
                        >
                          {section.mandatoryLabel}
                        </p>
                      </>
                    )}

                    {section.key === "biodiversity" ? (
                      <>
                        {/* First 4 under Bio diversity 2016 */}
                        <p className="text-[12px] ml-3 text-gray-400">
                          Bio diversity 2016
                        </p>
                        {section.tabs.slice(0, 4).map((tab) => (
                          <p
                            key={tab.key}
                            className={`flex text-start ml-4 px-2 py-2 focus:outline-none w-full text-[12px] cursor-pointer ${
                              activeTab === tab.key
                                ? "text-blue-400"
                                : "bg-transparent text-[#727272]"
                            }`}
                            onClick={() => handleTabClick(tab.key)}
                          >
                            {tab.label}
                          </p>
                        ))}

                        {/* Next 4 under Bio diversity 2021 > Topic Management Disclosure */}
                        <p className="text-[12px] ml-3 text-gray-400">
                          Bio diversity 2021 &gt; Topic Management Disclosure
                        </p>
                        {section.tabs.slice(4,8).map((tab) => (
                          <p
                            key={tab.key}
                            className={`flex text-start ml-4 px-2 py-2 focus:outline-none w-full text-[12px] cursor-pointer ${
                              activeTab === tab.key
                                ? "text-blue-400"
                                : "bg-transparent text-[#727272]"
                            }`}
                            onClick={() => handleTabClick(tab.key)}
                          >
                            {tab.label}
                          </p>
                        ))}

                        {/* Topic Disclosure */}
                        <p className="text-[12px] ml-3 text-gray-400">
                        Topic disclosure
                        </p>
                        {section.tabs.slice(8).map((tab) => (
                          <p
                            key={tab.key}
                            className={`flex text-start ml-4 px-2 py-2 focus:outline-none w-full text-[12px] cursor-pointer ${
                              activeTab === tab.key
                                ? "text-blue-400"
                                : "bg-transparent text-[#727272]"
                            }`}
                            onClick={() => handleTabClick(tab.key)}
                          >
                            {tab.label}
                          </p>
                        ))}
                      </>
                    ) : (
                      <>
                        {/* Default for all other sections */}
                        <p className="text-[12px] ml-3 text-gray-400">
                          Topic disclosure
                        </p>
                        {section.tabs.map((tab) => (
                          <p
                            key={tab.key}
                            className={`flex text-start ml-4 px-2 py-2 focus:outline-none w-full text-[12px] cursor-pointer ${
                              activeTab === tab.key
                                ? "text-blue-400"
                                : "bg-transparent text-[#727272]"
                            }`}
                            onClick={() => handleTabClick(tab.key)}
                          >
                            {tab.label}
                          </p>
                        ))}
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Aside;
