"use client";
import { useState, useRef, useEffect } from "react";
import STARSVG from "../../../../../../../public/star.svg";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import {
  setRemunerationPolicies,
  setPolicyPublic,
} from "../../../../../../lib/redux/features/ESGSlice/screen9Slice";

const Section13 = ({ section9_3_7Ref, data,
  sectionNumber = "9.3.7",
  sectionTitle = 'Remuneration Policies & Process to Determine Remuneration',
  sectionOrder = 9,
 }) => {
  const remuneration_policies = useSelector(
    (state) => state.screen9Slice.remuneration_policies
  );
  const dispatch = useDispatch();
  const loadContent = () => {
    dispatch(
      setRemunerationPolicies(
        `Our remuneration policies are designed to attract, retain, and motivate high-caliber Board members and executives. Compensation is based on industry benchmarks, individual performance, and the achievement of strategic objectives`
      )
    );
  };

  const handleEditorChange = (e) => {
    dispatch(setRemunerationPolicies(e.target.value));
  };
  return (
    <>
      <div id="section9_3_7" ref={section9_3_7Ref}>
        <h3 className="text-[15px] text-[#344054] mb-4 text-left font-semibold">
          {sectionNumber} {sectionTitle}
        </h3>
        <div className="xl:flex lg:flex md:flex 4k:flex 2k:flex 2xl:flex justify-between">
          <p className="text-[15px] text-[#344054] mb-2 mt-3">
            Add statement about company’s remuneration policies
          </p>
          <button
            className="px-2 py-2 text-[#007EEF] border border-[#007EEF] text-[12px] rounded-md mb-2 flex"
            onClick={loadContent}
          >
            {/* <MdOutlinePlaylistAdd className="mr-1 w-[20px] h-[20px]"/> */}
            <Image src={STARSVG} className="w-5 h-5 mr-1.5" alt="star" />
            Auto Fill
          </button>
        </div>
        <textarea
          value={remuneration_policies}
          onChange={handleEditorChange}
          className={`border appearance-none text-sm border-gray-400 text-[#667085] pl-2 rounded-md py-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-400 cursor-pointer w-full mb-4 `}
          rows={4}
        />

        <p className="text-[15px] text-[#344054] mb-2 font-semibold">
          Fixed pay & variable pay: 
        </p>
        <p className="text-sm mb-4">
          {data["2_19_a"]
            ? data["2_19_a"].remuneration_policy_fixed_and_variable_pay.text
            : "No data available"}
        </p>
        <p className="text-[15px] text-[#344054] mb-2 font-semibold">
          Sign-on bonuses or recruitment incentive payments: 
        </p>
        <p className="text-sm mb-4">
          {data["2_19_a"]
            ? data["2_19_a"].remuneration_policy_sign_on_bonuses.text
            : "No data available"}
        </p>
        <p className="text-[15px] text-[#344054] mb-2 font-semibold">
          Termination payments:
        </p>
        <p className="text-sm mb-4">
          {data["2_19_a"]
            ? data["2_19_a"].remuneration_policy_termination_payments.text
            : "No data available"}
        </p>
        <p className="text-[15px] text-[#344054] mb-2 font-semibold">
          Clawbacks: 
        </p>
        <p className="text-sm mb-4">
          {data["2_19_a"]
            ? data["2_19_a"].remuneration_policy_clawbacks.text
            : "No data available"}
        </p>
        <p className="text-[15px] text-[#344054] mb-2 font-semibold">
          Retirement benefits: 
        </p>
        <p className="text-sm mb-4">
          {data["2_19_a"]
            ? data["2_19_a"].remuneration_policy_retirement_benefits.text
            : "No data available"}
        </p>
        <p className="text-[15px] text-[#344054] mb-2 font-semibold">
        Remuneration policies for members of the highest governance body and senior executives relate to their objectives and performance in relation to the management of the organization's impacts on the economy, environment, and people.
        </p>
        <p className="text-sm mb-4">
          {data["2_19_b"]
            ? data["2_19_b"]?.Q1 || "No data available"
            : "No data available"}
        </p>
        <p className="text-[16px] text-[#344054] mb-2 font-bold">
          Process to determine remuneration:
        </p>
        <p className="text-[15px] text-[#344054] mb-2 font-semibold">
          Process for designing remuneration policies and for determining
          remuneration
        </p>
        <p className="text-sm mb-4">
          {data["2_20_a"]
            ? data["2_20_a"].processDescription
            : "No data available"}
        </p>

        <p className="text-[15px] text-[#344054] mb-2 font-semibold">
          Independent highest governance body members or an independent
          remuneration committee Overseeing the process for determining
          remuneration
        </p>
        <p className="text-sm mb-4">
          {data["2_20_a"]?.tableData?.[0]?.How
            ? data["2_20_a"].tableData[0].How
            : "No data available"}
        </p>

        <p className="text-[15px] text-[#344054] mb-2 font-semibold">
          How the views of stakeholders (including shareholders) regarding
          remuneration are sought and taken into consideration
        </p>
        <p className="text-sm mb-4">
          {data["2_20_a"]?.tableData?.[1]?.How
            ? data["2_20_a"].tableData[1].How
            : "No data available"}
        </p>

        <p className="text-[15px] text-[#344054] mb-2 font-semibold">
          Remuneration consultants involved in determining remuneration and
          whether they are independent of the organization, its highest
          governance body and senior executives
        </p>
        <p className="text-sm mb-4">
          {data["2_20_a"]?.tableData?.[2]?.How
            ? data["2_20_a"].tableData[2].How
            : "No data available"}
        </p>

        <p className="text-[15px] text-[#344054] mb-2 font-semibold">
          Results of votes of stakeholders (including shareholders) on
          remuneration policies and proposals.
        </p>
        <p className="text-sm mb-4">
          {data["2_20_b"] ? data["2_20_b"] : "No data available"}
        </p>
      </div>
    </>
  );
};

export default Section13;
