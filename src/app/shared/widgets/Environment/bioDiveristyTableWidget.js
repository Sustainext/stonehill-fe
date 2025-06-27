import React, { useState, useEffect, useCallback } from "react";
import { debounce } from "lodash";
import { MdInfoOutline } from "react-icons/md";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

const BioDiversityTableWidget = ({
  id,
  options,
  value,
  required,
  onChange,
  schema,
  formContext,
}) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleFieldChange = (index, key, newValue) => {
    const updatedValues = [...localValue];
    if (!updatedValues[index]) {
      updatedValues[index] = {};
    }
    updatedValues[index][key] = newValue;

    setLocalValue(updatedValues);
  };

  const debouncedUpdate = useCallback(debounce(onChange, 200), [onChange]);

  useEffect(() => {
    debouncedUpdate(localValue);
  }, [localValue, debouncedUpdate]);

  return (
    <div
      style={{ maxHeight: "400px" }}
      className="mb-2 custom-scrollbar overflow-x-auto"
    >
      <table
        id={id}
        className="rounded-md border border-gray-300 w-full"
        style={{ borderCollapse: "separate", borderSpacing: 0 }}
      >
        {formContext.view !== "0" && (
          <thead
            className={formContext.view === "0" ? "" : "gradient-background"}
          >
            <tr>
              {options.titles.map((item, idx) => (
                <th
                  key={idx}
                  className={` ${
                    idx === 0 ? "" : "border-l border-gray-300 "
                  } text-[12px] px-2 py-2 w-auto text-center`}
                >
                  <div className="flex relative w-[267px] xl:w-auto lg:w-auto  md:w-auto  2xl:w-auto  4k:w-auto  2k:w-auto">
                    <p className="">{item.title}</p>
                    <MdInfoOutline
                      data-tooltip-id={`tooltip-${item.title.replace(
                        /\s+/g,
                        "-"
                      )}`}
                      data-tooltip-content={item.tooltip}
                      className="ml-2 cursor-pointe mt-1  w-[10%] xl:w-[5%] md:w-[5%] lg:w-[5%] 2xl:w-[5%] 3xl:w-[5%] 4k:w-[5%] 2k:w-[5%]"
                      style={{ display: item.display }}
                    />
                    <ReactTooltip
                      id={`tooltip-${item.title.replace(/\s+/g, "-")}`}
                      place="top"
                      effect="solid"
                      style={{
                        width: "400px",
                        backgroundColor: "#000",
                        color: "white",
                        fontSize: "12px",
                        boxShadow: 3,
                        borderRadius: "8px",
                        zIndex: "1000",
                      }}
                    />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {options.rowLabels.map((label, rowIndex) => (
            <tr key={rowIndex}>
              <td className="border-t border-gray-300 p-3 text-left">
                <div className="flex relative w-[357px] xl:w-auto lg:w-auto  md:w-auto  2xl:w-auto  4k:w-auto  2k:w-auto">
                  <span className="text-[12px]">{label.title}</span>
                  <MdInfoOutline
                    data-tooltip-id={`tooltip-${label.title.replace(
                      /\s+/g,
                      "-"
                    )}`}
                    data-tooltip-content={label.tooltip}
                    className="ml-1 cursor-pointer mt-1 text-[12px]  w-[10%] xl:w-[5%] md:w-[5%] lg:w-[5%] 2xl:w-[5%] 3xl:w-[5%] 4k:w-[5%] 2k:w-[5%] "
                    style={{ display: label.display }}
                  />
                  <ReactTooltip
                    id={`tooltip-${label.title.replace(/\s+/g, "-")}`}
                    place="top"
                    effect="solid"
                    style={{
                      width: "400px",
                      backgroundColor: "#000",
                      color: "white",
                      fontSize: "12px",
                      boxShadow: 3,
                      borderRadius: "8px",
                      zIndex: "1000",
                    }}
                  />
                </div>
              </td>
              {options.titles
  .filter((col) => col.display !== "none").map((col, cellIndex) => {
                const key = col.key;
                const propertySchema = schema.items.properties[key];
                const isEnum =
                  propertySchema && propertySchema.hasOwnProperty("enum");

                return (
                  <td
                    key={cellIndex}
                    className={` border-t border-l border-gray-300  p-3 text-center`}
                  >
                    {isEnum ? (
                      <select
                        value={localValue[rowIndex][key]}
                        onChange={(e) =>
                          handleFieldChange(rowIndex, key, e.target.value)
                        }
                        className="text-[12px] pl-2 py-2 w-[197px] xl:w-full lg:w-full  md:w-full 2xl:w-full  4k:w-full 2k:w-full border-b"
                        required={required}
                      >
                        <option value="">Select</option>
                        {propertySchema.enum.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <textarea
                        type="text"
                        required={required}
                        value={localValue[rowIndex][key] || ""}
                        onChange={(e) =>
                          handleFieldChange(rowIndex, key, e.target.value)
                        }
                        className="text-[12px] pl-2 py-2 w-full border-b rounded-md"
                        placeholder="Enter"
                      />
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BioDiversityTableWidget;
