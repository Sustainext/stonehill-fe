"use client";
import React, { useState } from "react";
import AnalyseHeader2 from "../../AnalyseHeader2";
import Ratioentrysection from "./ratio-entry-section";
const Ratioentrylevels = () => {
  const [activeMonth, setActiveMonth] = useState(1);
  const [year, setYear] = useState();
  const [selectedOrg, setSelectedOrg] = useState("");
  const [selectedCorp, setSelectedCorp] = useState("");
  const [togglestatus,setToggleStatus] = useState("Organization");
  return (
    <>
      <AnalyseHeader2
        activeMonth={activeMonth}
        setActiveMonth={setActiveMonth}
        selectedOrg={selectedOrg}
        setSelectedOrg={setSelectedOrg}
        selectedCorp={selectedCorp}
        setSelectedCorp={setSelectedCorp}
        year={year}
        setYear={setYear}
        setToggleStatus={setToggleStatus}
      />
      <Ratioentrysection
        selectedOrg={selectedOrg}
        selectedCorp={selectedCorp}
        year={year}
        month={activeMonth}
        togglestatus={togglestatus}
      />
    </>
  );
};

export default Ratioentrylevels;
