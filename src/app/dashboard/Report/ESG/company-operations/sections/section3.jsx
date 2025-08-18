"use client";
import { useState, useRef, useEffect } from "react";
import { MdOutlinePlaylistAdd } from "react-icons/md";
import STARSVG from "../../../../../../../public/star.svg";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import {
  setBusinessRelation,
  setEntitiesInclude,
} from "../../../../../../lib/redux/features/ESGSlice/screen2Slice";
import dynamic from "next/dynamic";
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const Section3 = ({
  section2_1_2Ref,
  orgName,
  data,
  sectionNumber = "2.1.2",
  sectionTitle = "Entities Included in the Organization's Sustainability Reporting",
}) => {
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
  return (
    <>
      <div className="mb-2" ref={section2_1_2Ref}>
        <p className="text-[15px] text-[#344054] mb-2 font-semibold">
          {sectionNumber} {sectionTitle}
        </p>
        <div className="xl:flex lg:flex md:flex 4k:flex 2k:flex 2xl:flex justify-between">
          <p className="text-[15px] text-[#344054] mb-2 mt-3">
            Add statement about sustainability performance data for all
            entities.
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
        <div className="mb-4">
          <JoditEditor
            // ref={editor}
            value={content3}
            config={config}
            tabIndex={1}
            onBlur={handleEditorChange}
          />
        </div>
        {data["2-2-a"]?.map((item, index) => (
          <p className="mb-2 text-[15px]">{item}</p>
        ))}
        {/* 2-2-b */}
        <p className="mb-4 text-[15px]">
          {data["2-2-b"]
            ? data["2-2-b"]?.answer == "Yes"
              ? data["2-2-b"]?.explanation
              : ""
            : ""}
        </p>

        {/* 2-2-c */}
        <p className="mb-4 text-[15px]">
          {data["2-2-c"]
            ? data["2-2-c"]?.answer == "Yes"
              ? data["2-2-c"]?.explanation
              : ""
            : ""}
        </p>

        {/* <p className="text-[15px] text-[#344054] mb-2">
          Each entity adheres to our comprehensive sustainability framework,
          ensuring consistent ESG practices across our entire organization. 
        </p> */}
      </div>
    </>
  );
};

export default Section3;
