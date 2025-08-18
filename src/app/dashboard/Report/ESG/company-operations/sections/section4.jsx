"use client";
import { useState, useRef, useEffect } from "react";
import { MdOutlinePlaylistAdd } from "react-icons/md";
import STARSVG from "../../../../../../../public/star.svg";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { setSupplyChain } from "../../../../../../lib/redux/features/ESGSlice/screen2Slice";
import dynamic from "next/dynamic";
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const Section4 = ({
  section2_2Ref,
  orgName,
  sectionNumber = "2.2",
  sectionTitle = "Supply Chain",
}) => {
  const content = useSelector(
    (state) => state.screen2Slice.supply_chain_description
  );
  const dispatch = useDispatch();

  const loadContent = () => {
    dispatch(
      setSupplyChain(
        `<p>Our supply chain is integral to our sustainability strategy. We work closely with our suppliers to ensure they meet our high standards for environmental and social responsibility. Key initiatives in our supply chain include</p>`
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
    dispatch(setSupplyChain(value));
  };
  return (
    <>
      <div ref={section2_2Ref}>
        <h3 className="text-[17px] text-[#344054] mb-4 text-left font-semibold">
          {sectionNumber} {sectionTitle}
        </h3>
      </div>
      <div className="xl:flex lg:flex md:flex 4k:flex 2k:flex 2xl:flex justify-between">
        <p className="text-[15px] text-[#344054] mb-2 mt-3">
          Add statement about company's supply chain process{" "}
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
      <div className="mb-6">
        <JoditEditor
          // ref={editor}
          value={content}
          config={config}
          tabIndex={1}
          onBlur={handleEditorChange}
        />
      </div>
    </>
  );
};

export default Section4;
