"use client";
import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { MdOutlinePlaylistAdd } from "react-icons/md";
import STARSVG from "../../../../../../../public/star.svg";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import {
  setBusinessRelation,
  setEntitiesInclude,
} from "../../../../../../lib/redux/features/ESGSlice/screen2Slice";
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const Section2 = ({
  section2_1_1Ref,
  section2_1Ref,
  orgName,
  data,
  sectionNumber = "2.1.1",
  sectionTitle = "Activities, Value Chain, and Other Business Relationships",
  sectionOrder = 2,
}) => {
  const [content, setContent] = useState(
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut at ipsum molestias dicta blanditiis harum laborum saepe expedita"
  );
  const content2 = useSelector(
    (state) => state.screen2Slice.business_relations
  );
  const dispatch = useDispatch();
  const content3 = useSelector((state) => state.screen2Slice.entities_included);
  const loadContent = () => {
    dispatch(
      setEntitiesInclude(
        `<p>This report includes sustainability performance data from all entities under ${
          orgName ? orgName : "[Company Name]"
        } operational control. This encompasses:</p>`
      )
    );
  };

  const loadContent2 = () => {
    dispatch(
      setBusinessRelation(
        `<p>
        ${
          orgName ? orgName : "[Company Name]"
        } is a leading manufacturer of [Products], serving a diverse range of industries including [Industries]. Our business model is built on innovation, quality, and sustainability. From raw material sourcing to product delivery, we aim to minimize our environmental footprint and maximize social value. In the current reporting period, we observed the following significant changes in these categories
        </p>
        `
      )
    );
  };
  const config = {
    enter: "BR", // Or customize behavior on Enter key
    cleanHTML: true,
    enablePasteHTMLFilter: false,
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    style: {
      fontSize: "14px",
      color: "#667085",
    },
    allowResizeY: false,
    defaultActionOnPaste: "insert_clear_html",
    toolbarSticky: false,
    toolbar: true,
    buttons: [
      "bold",
      "italic",
      "underline",
      "strikeThrough",
      "align",
      "outdent",
      "indent",
      "ul",
      "ol",
      "paragraph",
      "link",
      "table",
      "undo",
      "redo",
      "hr",
      "fontsize",
      "selectall",
    ],
    // Remove buttons from the extra buttons list
    removeButtons: [
      "fullsize",
      "preview",
      "source",
      "print",
      "about",
      "find",
      "changeMode",
      "paintFormat",
      "image",
      "brush",
      "font",
    ],
  };

  const handleEditorChange = (value) => {
    dispatch(setEntitiesInclude(value));
  };
  const handleChange = (value) => {
    dispatch(setBusinessRelation(value));
  };
  return (
    <>
      
      <div className="mb-2" ref={section2_1_1Ref}>
        <p className="text-[15px] text-[#344054] mb-2 font-semibold">
          {sectionNumber} {sectionTitle}
        </p>
        <div className="xl:flex lg:flex md:flex 4k:flex 2k:flex 2xl:flex justify-between">
          <p className="text-[15px] text-[#344054] mb-2 mt-3">
            Add Introduction about company’s domain
          </p>
          <button
            className="px-2 py-2 text-[#007EEF] border border-[#007EEF] text-[12px] rounded-md mb-2 flex"
            onClick={loadContent2}
          >
            {/* <MdOutlinePlaylistAdd className="mr-1 w-[20px] h-[20px]"/> */}
            <Image src={STARSVG} className="w-5 h-5 mr-1.5" alt="star" />
            Auto Fill
          </button>
        </div>
        {/* <textarea
            onChange={handleChange}
          value={content3}
          className={`border appearance-none text-sm border-gray-400 text-[#667085] pl-2 rounded-md py-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-400 cursor-pointer w-full mb-4 `}
          rows={4}
        /> */}
        <div className="mb-4">
          <JoditEditor
            // ref={editor}
            value={content2}
            config={config}
            tabIndex={1}
            onBlur={handleChange}
          />
        </div>
        <div className="text-sm mb-4">
          <ul className="list-disc ml-4">
            <li className="text-[15px] text-[#344054] mb-2 font-semibold">
              {orgName ? orgName + " is" : "We are"} active in the following
              sectors:
            </li>
            {/* <p className="mb-4">{content}</p> */}
            {data["2-6-a"] && data["2-6-a"].length > 0 ? (
              <ul className="list-disc ml-4">
                {data["2-6-a"].map((item, index) => (
                  <li key={index} className="text-[15px] text-[#344054] mb-2">
                    {item.Sector}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mb-4">No sectors or sub-industries available.</p>
            )}
            <li className="text-[15px] text-[#344054] mb-2 font-semibold">
              Our value chain encompasses several key stages: 
              <ul className="list-disc ml-4">
                <li className="text-[15px] text-[#344054] mb-2 font-semibold">
                  Activities:
                  <p className="mb-4 font-normal">
                    {data["2-6-b"]?.Q1 || "No data available"}
                  </p>
                </li>
                <li className="text-[15px] text-[#344054] mb-2 font-semibold">
                  Product:
                  <p className="mb-4 font-normal">
                    {data["2-6-b"]?.Q2 || "No data available"}
                  </p>
                </li>
                <li className="text-[15px] text-[#344054] mb-2 font-semibold">
                  Services:
                  <p className="mb-4 font-normal">
                    {data["2-6-b"]?.Q3 || "No data available"}
                  </p>
                </li>
                <li className="text-[15px] text-[#344054] mb-2 font-semibold">
                  Market served: 
                  <p className="mb-4 font-normal">
                    {data["2-6-b"]?.Q4 || "No data available"}
                  </p>
                </li>
                <li className="text-[15px] text-[#344054] mb-2 font-semibold">
                  Supply chain:
                  <p className="mb-4 font-normal">
                    {data["2-6-b"]?.Q5 || "No data available"}
                  </p>
                </li>
                <li className="text-[15px] text-[#344054] mb-2 font-semibold">
                  Entities downstream from the organisation & their activities:
                  <p className="mb-4 font-normal">
                    {data["2-6-b"]?.Q6 || "No data available"}
                  </p>
                </li>
                <li className="text-[15px] text-[#344054] mb-2 font-semibold">
                  Other relevant business relationships:
                  <p className="mb-4 font-normal">
                    {data["2-6-c"] || "No data available"}
                  </p>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <p className="mb-4 text-sm font-normal">
            {data && data["2-6-d"] || "No data available"}
        </p>
      </div>
    </>
  );
};

export default Section2;
