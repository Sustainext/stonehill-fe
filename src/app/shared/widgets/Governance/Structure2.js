"use client";
import React, { useState, useEffect } from "react";
import {
  MdInfoOutline,
  MdAdd,
  MdDelete,
} from "react-icons/md";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

const GovernanceWidget = ({ onChange, value = [], uiSchema = {} }) => {
  const [data, setData] = useState(value);

  // useEffect(() => {
  //   if (data.length === 0 || (data.length === 1 && data[0].length === 0)) {
  //     const defaultFirstRow = [""];
  //     setData([defaultFirstRow]);
  //     onChange([defaultFirstRow]);
  //   }
  // }, [data.length, onChange]);
  useEffect(() => {
    setData(value);
  }, [value]);

  const handleCellChange = (rowIndex, colIndex, event) => {
    const newData = [...data];
    newData[rowIndex][colIndex] = event.target.value;
    setData(newData);
    onChange(newData);
  };

  const addRow = () => {
    const newRow = new Array(data[0]?.length || 1).fill("");
    const newData = [...data, newRow];
    setData(newData);
    onChange(newData);
  };

  const addColumn = () => {
    const newData = data.map((row) => [...row, ""]);
    setData(newData);
    onChange(newData);
  };

  const deleteRow = (rowIndex) => {
    const newData = data.filter((_, index) => index !== rowIndex);
    setData(newData);
    onChange(newData);
  };

  const deleteColumn = (colIndex) => {
    if (data[0].length === 1) return;
    const newData = data.map((row) =>
      row.filter((_, index) => index !== colIndex)
    );
    setData(newData);
    onChange(newData);
  };

  return (
    <>
      <div className="mb-6">
        <div className="flex mb-2">
          <div className="relative">
            <p className="text-[14px] text-gray-700 font-[500] flex">
              {uiSchema["ui:title"]}
              <MdInfoOutline
                data-tooltip-id={`tooltip-${uiSchema["ui:title"].replace(
                  /\s+/g,
                  "-"
                )}`}
                data-tooltip-content={uiSchema["ui:tooltip"]}
                className="mt-1 ml-2 text-[14px] w-[20%] xl:w-[5%] md:w-[5%] lg:w-[5%] 2xl:w-[5%] 3xl:w-[5%] 4k:w-[5%] 2k:w-[5%]"
                style={{ display: uiSchema["ui:tooltipdisplay"] }}
              />
              <ReactTooltip
                id={`tooltip-${uiSchema["ui:title"].replace(/\s+/g, "-")}`}
                place="top"
                effect="solid"
                style={{
                  width: "300px",
                  backgroundColor: "#000",
                  color: "white",
                  fontSize: "12px",
                  boxShadow: 3,
                  borderRadius: "8px",
                }}
              />
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 overflow-x-auto custom-scrollbar">
          {data.map((row, rowIndex) => (
            <div key={rowIndex} className="flex items-center gap-2">
              {row.map((cell, colIndex) => (
                <textarea
                  key={colIndex}
                  placeholder="Enter data"
                  className="border appearance-none text-xs py-4 border-gray-400 text-neutral-600 pl-2 rounded-md  leading-tight focus:outline-none focus:bg-white focus:border-gray-400 cursor-pointer w-full min-w-[100px] max-w-[648px]"
                  value={cell}
                  onChange={(e) => handleCellChange(rowIndex, colIndex, e)}
                  rows={1}
                />
              ))}
              <button
                type="button"
                className="text-red-500 hover:text-red-700"
                onClick={() => deleteRow(rowIndex)}
              >
                <MdDelete />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-2">
          <button
            type="button"
            className="text-blue-500 hover:text-blue-700 flex items-center gap-1 text-[14px]"
            onClick={addRow}
          >
            <MdAdd /> Add Row
          </button>
          <button
            type="button"
            className="text-blue-500 hover:text-blue-700 flex items-center gap-1 text-[14px]"
            onClick={addColumn}
          >
            <MdAdd /> Add Column
          </button>
        </div>
      </div>
    </>
  );
};

export default GovernanceWidget;
