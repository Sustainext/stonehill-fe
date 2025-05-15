"use client";
import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import SustainabilityJourneyTable from "../table";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const Section7 = ({ section10_3_3Ref, data }) => {
  const [content, setContent] = useState(
    `Our approach to supply chain sustainability focuses on ensuring that our suppliers adhere to high environmental and social standards. We engage with our suppliers through regular assessments, audits, and capacity-building programs to help them improve their sustainability performance.`
  );
  return (
    <>
      <div ref={section10_3_3Ref} id="section10_3_3">
        <h3 className="text-[15px] text-[#344054] mb-4 text-left font-semibold">
          10.3.3 Negative Environmental & Social Impacts in the Supply Chain
        </h3>
        <p className="text-[15px] text-[#344054] mb-2 font-semibold">
        Actual and Potential Negative Environmental Impact 
        </p>
       <p className="text-sm mb-4">
       {
          data['308_2abc_collect']?data['308_2abc_collect']['308-2-c']?data['308_2abc_collect']['308-2-c']?.Q1 || "No data available":'No data available':'No data available'
        }
       </p>
        {/* <p className="text-[15px] text-[#344054] mb-4">
          We recognize that our supply chain can have negative environmental and
          social impacts, and we are committed to mitigating these risks. Our
          approach includes:
        </p> */}

        <p className="text-[15px] text-[#344054] mb-2 font-semibold">
        Number of suppliers assessed for environmental impacts:
        </p>
        <p className="text-sm mb-4">
          {/* {data["gri_308_2d"]
            ? data["gri_308_2d"][0]
              ? data["gri_308_2d"][0].percentage + " %"
              : "No data available"
            : "No data available"} */}
              {
          data['308_2abc_collect']?data['308_2abc_collect']['308-2-a']?data['308_2abc_collect']['308-2-a']?.Q1 || "No data available":'No data available':'No data available'
        }
        </p>
        <p className="text-[15px] text-[#344054] mb-2 font-semibold">
        Number of suppliers identified as having significant actual and potential negative environmental impacts:
        </p>
        <p className="text-sm mb-4">
          {/* {data["gri_308_2e"]
            ? data["gri_308_2e"][0]
              ? data["gri_308_2e"][0].percentage + " %"
              : "No data available"
            : "No data available"} */}
             {
          data['308_2abc_collect']?data['308_2abc_collect']['308-2-b']?data['308_2abc_collect']['308-2-b']?.Q1 || "No data available":'No data available':'No data available'
        }
        </p>
        <p className="text-[15px] text-[#344054] mb-2 font-semibold">
        Percentage of suppliers identified as having significant actual and potential negative environmental impacts with which improvements were agreed upon as a result of assessment:
        </p>
        <p className="text-sm mb-4">
          {/* {data["414_1a_collect"]
            ? data["414_1a_collect"].Q1
              ? data["414_1a_collect"].Q1
              : "No data available"
            : "No data available"} */}
             {data["gri_308_2d"]
            ? data["gri_308_2d"][0]
              ? data["gri_308_2d"][0].percentage + " %"
              : "No data available"
            : "No data available"}
        </p>
        <p className="text-[15px] text-[#344054] mb-2 font-semibold">
        Percentage of Suppliers identified as having significant actual and potential negative environmental impacts with terminated Relationship:
        </p>
        <p className="text-sm mb-6">
          {/* {data["414_1a_analyse"]
            ? data["414_1a_analyse"]
                .new_suppliers_that_were_screened_using_social_criteria
              ? data["414_1a_analyse"]
                  .new_suppliers_that_were_screened_using_social_criteria
                  .percentage
                ? data["414_1a_analyse"]
                    .new_suppliers_that_were_screened_using_social_criteria
                    .percentage + " %"
                : "No data available"
              : "No data available"
            : "No data available"} */}
            {data["gri_308_2e"]
            ? data["gri_308_2e"][0]
              ? data["gri_308_2e"][0].percentage + " %"
              : "No data available"
            : "No data available"}
        </p>

        <p className="text-[15px] text-[#344054] mb-2 font-semibold">
        Actual and Potential Negative Social Impact
        </p>

            {
              data['414-2c']?<p className="mb-4 text-sm">
                {data['414-2c'] || ''}
              </p>:''
            }
        <p className="text-[15px] text-[#344054] mb-4 font-semibold">
        Percentage of suppliers screened using social criteria:
        </p>
        <p className="text-sm mb-4">
        {data["414_1a_analyse"]
            ? data["414_1a_analyse"]["new_suppliers_that_were_screened_using_social_criteria"]?.percentage
              ? data["414_1a_analyse"]["new_suppliers_that_were_screened_using_social_criteria"]?.percentage + " %"
              : "No data available"
            : "No data available"}
        </p>
        <p className="text-[15px] text-[#344054] mb-4 font-semibold">
        Percentage of suppliers identified as having significant actual and potential negative social impacts with which improvements were agreed upon as a result of assessment:
        </p>
        <p className="text-sm mb-4">
          {data["414_1a_analyse"]
            ? data["414_1a_analyse"]["negative_social_impacts_in_the_supply_chain_and_actions_taken"]?.percentage_negative
              ? data["414_1a_analyse"]["negative_social_impacts_in_the_supply_chain_and_actions_taken"]?.percentage_negative + " %"
              : "No data available"
            : "No data available"}
        </p>
        <p className="text-[15px] text-[#344054] mb-4 font-semibold">
        Percentage of Suppliers identified as having significant actual and potential negative social impacts with terminated Relationship:
        </p>
        <p className="text-sm mb-4">
        {data["414_1a_analyse"]
            ? data["414_1a_analyse"]["negative_social_impacts_in_the_supply_chain_and_actions_taken"]?.percentage_improved
              ? data["414_1a_analyse"]["negative_social_impacts_in_the_supply_chain_and_actions_taken"]?.percentage_improved + " %"
              : "No data available"
            : "No data available"}
        </p>
        {/* <p className="text-[15px] text-[#344054] mb-4 font-semibold">
        Number of suppliers identified as having significant actual and potential negative social impacts:
        </p>
        <p className="text-sm mb-4">
          {data["308_2e_collect"]
            ? data["308_2e_collect"].Q1
              ? data["308_2e_collect"].Q1
              : "No data available"
            : "No data available"}
        </p> */}
        <p className="text-[15px] text-[#344054] mb-4 font-semibold">
        Number of suppliers identified having significant actual and potential negative social impacts:
        </p>
        <div className="shadow-md rounded-md">
          <SustainabilityJourneyTable
            tableData={data["414-2b"] ? data["414-2b"] : []}
          />
        </div>
      </div>
    </>
  );
};

export default Section7;
