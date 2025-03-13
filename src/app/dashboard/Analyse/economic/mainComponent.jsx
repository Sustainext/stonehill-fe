'use client'
import React, { useState,useEffect } from "react";
import Header from "./Header";
import Aside from "./Aside";
import Operationsassessed from "./operations-assessed/page";
import Ratioentrylevels from "./ratio-entry-levels/page";
import Anticorruptions from "./anti-corruption/page"
import {
  setHeadertext1,
  setHeadertext2,
  setHeaderdisplay,
  setMiddlename
} from "../../../../lib/redux/features/topheaderSlice";
import { useDispatch } from "react-redux";
const AnalyseEconomic = () => {
  const [activeTab, setActiveTab] = useState("Tab2");
  const [isBoxOpen, setIsBoxOpen] = useState(false);
  const dispatch = useDispatch();
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  useEffect(() => {
    const headerTextMapping = {
      Tab1: 'Ratio of the entry-level wage to the minimum wage by gender at significant locations of operation',
      Tab2: 'Operations assessed for risks related to corruption',
      Tab3: 'Communication and training about anti-corruption policies and procedures',
  
    };
    dispatch(setHeadertext1("Analyse"));
    dispatch(setHeaderdisplay("block"));
    dispatch(setHeadertext2(headerTextMapping[activeTab] || 'Ratio of the entry-level wage to the minimum wage by gender at significant locations of operation'));
    dispatch(setMiddlename("Economic"));
}, [activeTab, dispatch]);
  return (
    <div className="relative flex justify-start">
      <div className="relative left-10 w-[199px] min-h-[90vh] py-[11px] flex-col items-end inline-flex">
        <Aside activeTab={activeTab} handleTabClick={handleTabClick} />
      </div>
      <div className="w-full ms-8">
        <div className="sticky top-14 bg-white z-[100]">
          <Header activeTab={activeTab} setIsBoxOpen={setIsBoxOpen} />
        </div>
       {activeTab === "Tab1" && <Ratioentrylevels />}
        {activeTab === "Tab2" && <Operationsassessed />}
        {activeTab === "Tab3" && <Anticorruptions />}   

      </div>
    </div>
  );
};

export default AnalyseEconomic;
