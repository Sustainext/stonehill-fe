"use client";
import React, { useState, useEffect } from "react";
import Aside from "./Aside";
import EnvironmentTrack from "./Environment/page";
import SocialTrack from "./Social/page";
import GovernanceTrack from "./Governance/page";
import GeneralTrack from "./General/page";
import EconomicTrack from "./Economic/page";
import { GlobalState } from "../../../Context/page";
import axiosInstance from "../../utils/axiosMiddleware";
import {
  setHeadertext1,
  setHeadertext2,
  setHeaderdisplay,
  setMiddlename,
} from "../../../lib/redux/features/topheaderSlice";
import { useDispatch } from "react-redux";

const Index = () => {
  const [activeModule, setActiveModule] = useState("Environment");
  const [dashboardData, setDashboardData] = useState(null);

  const open = GlobalState();
  const dispatch = useDispatch();
  
  const handleTabClick = (module) => {
    setActiveModule(module);
  };
  
  useEffect(() => {
    dispatch(setHeadertext1("Track"));
    dispatch(setHeaderdisplay(null));
    dispatch(setHeadertext2(activeModule));
    dispatch(setMiddlename(null));
  }, [activeModule, dispatch]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const response = await axiosInstance("/sustainapp/track_dashboards/");
      console.log("response", response);

      const data = response.data;
      setDashboardData(data);
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="flex flex-col lg:flex-row w-full max-w-full overflow-hidden">
      <div className="flex-shrink-0 lg:w-[220px] py-[11px]">
        <Aside activeTab={activeModule} handleTabClick={handleTabClick} />
      </div>

      <div className="flex-1 flex justify-center items-start w-full max-w-full overflow-hidden">
        {activeModule === "Environment" && (
          <EnvironmentTrack dashboardData={dashboardData} />
        )}
        {/* {activeModule === "Social" && (
          <SocialTrack dashboardData={dashboardData} />
        )}
        {activeModule === "Governance" && (
          <GovernanceTrack dashboardData={dashboardData} />
        )}
        {activeModule === "General" && (
          <GeneralTrack dashboardData={dashboardData} />
        )}
        {activeModule === "Economic" && (
          <EconomicTrack dashboardData={dashboardData} />
        )} */}
      </div>
    </div>
  );
};

export default Index;