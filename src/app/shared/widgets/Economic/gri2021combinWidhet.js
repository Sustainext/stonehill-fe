import React, { useState, useEffect, useCallback, useRef } from "react";
import { MdAdd, MdOutlineDeleteOutline, MdInfoOutline } from "react-icons/md";
import Select from "react-select";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { Currency } from "../../data/currency";

// Debounce function to delay state updates
const useDebounce = (callback, delay) => {
  const timer = useRef(null);
  return (...args) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      callback(...args);
    }, delay);
  };
};

const options = { enumOptions: ["Yes", "No", "Variable"] };

const customStyles = {
  control: (provided) => ({
    ...provided,
    border: "none",
    boxShadow: "none",
    padding: 0,
    margin: 0,
    minHeight: "auto",
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    color: "#000",
    padding: 0,
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: "0",
  }),
  input: (provided) => ({
    ...provided,
    margin: 0,
    padding: 0,
  }),
  menu: (provided) => ({
    ...provided,
    marginTop: 0,
  }),
};

const currencyOptions = Currency.map(({ currency, country, currency_name }) => ({
  value: currency,
  label: `${currency} - ${currency_name}`,
}));

const GRI2021combinWidhet = ({ locationdata, onChange, value = {} }) => {
  const [locations, setLocations] = useState(
    Array.isArray(value.locations) ? value.locations : [{ id: 1, value: "" }]
  );
  const [radioValue, setRadioValue] = useState(value.radioValue || "");
  const [currencyValue, setCurrencyValue] = useState(value.currencyValue || "");
  const [wages, setWages] = useState(value.wages || {});
  const [error, setError] = useState(""); // Error state for duplicate locations

  // Debounce the onChange handler to prevent too many updates
  const debouncedOnChange = useDebounce((formData) => {
    onChange(formData);
  }, 300);
  const handleKeyDown = (event) => {
    if (["e", "E", "+", "-"].includes(event.key)) {
      event.preventDefault();
    }
  };
  useEffect(() => {
    const formData = {
      locations,
      radioValue,
      currencyValue,
      wages,
    };
    debouncedOnChange(formData);
  }, [locations, radioValue, currencyValue, wages, debouncedOnChange]);

  // Handle location selection change
  const handleLocationChange = (id, selectedOption) => {
    const selectedValue = selectedOption ? selectedOption.value : "";

    // Check if the selected location is already chosen
    const isDuplicate = locations.some(
      (location) => location.value === selectedValue && location.id !== id
    );

    if (isDuplicate) {
      setError("This location is already selected. Please choose another location.");
      return; // Prevent updating the state
    }

    setError(""); // Clear error if the location is unique

    setLocations((prevLocations) =>
      prevLocations.map((location) =>
        location.id === id ? { ...location, value: selectedValue } : location
      )
    );
  };

  // Handle radio button change for minimum wage
  const handleRadioChange = (e) => {
    setRadioValue(e.target.value);
  };

  // Handle currency selection change
  const handleCurrencyChange = (selectedOption) => {
    setCurrencyValue(selectedOption ? selectedOption.value : "");
  };

  // Handle wage input change
  const handleWageChange = (locationValue, gender, wageValue) => {
    setWages((prevWages) => ({
      ...prevWages,
      [locationValue]: {
        ...prevWages[locationValue],
        [gender]: wageValue,
      },
    }));
  };

  // Add new location row
  const addRow = () => {
    setLocations([...locations, { id: Date.now(), value: "" }]);
  };

  // Remove a location row
  const removeRow = (id) => {
    setLocations(locations.filter((location) => location.id !== id));
    setWages((prevWages) => {
      const updatedWages = { ...prevWages };
      delete updatedWages[id];
      return updatedWages;
    });
  };

  const genders = ["Male", "Female", "Non-binary"];

  return (
    <>
      {/* Location Selection */}
      <div className="mb-4">
        {Array.isArray(locations) && locations.length > 0 ? (
          locations.map((location, index) => (
            <div key={location.id} className="mb-2 flex items-center">
              <select
                className="block p-2 text-[#727272] text-[12px] bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 capitalize w-full"
                value={location.value}
                onChange={(e) =>
                  handleLocationChange(location.id, { value: e.target.value })
                }
              >
                <option value="">{`Select from location`}</option>
                {locationdata && locationdata.length > 0 ? (
                  locationdata.map((loc) => (
                    <option key={loc.location_name} value={loc.location_name}>
                      {loc.location_name}
                    </option>
                  ))
                ) : (
                  <option disabled>No locations available</option>
                )}
              </select>
              {/* Show Remove button only if locationdata count is more than 1 and locations.length is more than 1 */}
              {locationdata.length > 1 && locations.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeRow(location.id)}
                  className="text-red-500 ml-2"
                >
                  <MdOutlineDeleteOutline className="text-lg" />
                </button>
              )}
            </div>
          ))
        ) : (
          <p>No locations added</p>
        )}
        {error && (
          <p className="text-red-500 text-[12px]">{error}</p> // Error message
        )}
        <div className="mt-2">
          {/* Show Add button only if there are locations left to add */}
          {locationdata.length > 1 && locations.length < locationdata.length && (
            <button
              type="button"
              onClick={addRow}
              className="text-blue-500 flex items-center ml-1 text-[14px]"
            >
              Add Row <MdAdd className="ml-2" />
            </button>
          )}
        </div>
      </div>

      {/* Radio Button Section */}
      <div className="mb-4">
        <div className="flex mb-4 items-center relative">
          <p className="text-[14px] text-gray-700 font-[500] flex">
            Does a minimum local wage exist for the selected location?
            <MdInfoOutline
              data-tooltip-id={`tooltip-es231`}
              data-tooltip-content="Indicate whether a local minimum wage is absent or variable at significant locations of operation, by gender."
              className="ml-2 text-[14px] align-middle mt-1"
            />
            <ReactTooltip
              id={`tooltip-es231`}
              place="top"
              effect="solid"
              style={{
                width:"400px",
                backgroundColor: "#000",
                color: "white",
                fontSize: "12px",
                boxShadow: 3,
                borderRadius: "8px",
                zIndex:"1000",
              }}
            />
          </p>
        </div>
        <div className="flex gap-2">
          {options.enumOptions.map((option, index) => (
            <label key={index} className="flex items-center gap-2 text-[14px]  mb-2">
              <input
                type="radio"
                name="wageRadio"
                value={option}
                onChange={handleRadioChange}
                className="form-radio h-3 w-3"
                checked={radioValue === option}
              />
              {option}
            </label>
          ))}
        </div>
      </div>

      {radioValue === "Variable" && (
        <>
      <div className="flex mb-4 items-center relative">
        <p className="text-[14px] text-gray-700 font-[500] flex mb-2">
          If a local minimum wage exists or variable at significant locations of
          operation, please mention a minimum local wage by gender:
          <MdInfoOutline
            data-tooltip-id={`tooltip-es245`}
            data-tooltip-content="If minimum wages vary across locations, then specify the minimum wage."
            className="ml-2 text-[14px] align-middle mt-1"
          />
          <ReactTooltip
            id={`tooltip-es245`}
            place="top"
            effect="solid"
            style={{
              width:"400px",
              backgroundColor: "#000",
              color: "white",
              fontSize: "12px",
              boxShadow: 3,
              borderRadius: "8px",
              zIndex:"1000",
            }}
          />
        </p>
      </div>
      <div>
        <p className="text-[14px] text-gray-500  flex mb-4">Select Currency</p>
        <Select
          styles={customStyles}
          className="block w-[20vw] text-[12px] leading-6 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-[12px] sm:leading-5 border-b-2 border-gray-300 mb-4"
          onChange={handleCurrencyChange}
          value={
            currencyOptions.find((option) => option.value === currencyValue) ||
            null
          }
          options={currencyOptions}
          isClearable
          placeholder="Select Currency"
        />
      </div>

      <div className="mb-4">
        <table className="min-w-full border-collapse border border-gray-300 rounded-md" style={{ borderCollapse: "separate", borderSpacing: 0 }}>
          <thead className="gradient-background h-[80px]">
            <tr className="text-center">
              <th className="text-[12px] font-medium p-2 border-r border-gray-300">
                Significant location of operations
              </th>
              <th className=" text-[12px] font-medium p-2 border-r border-gray-300">
                Gender
              </th>
              <th className=" text-[12px] font-medium p-2 ">
                Minimum wage
              </th>
            </tr>
          </thead>
          <tbody>
            {locations.map((location) =>
              location.value
                ? genders.map((gender, index) => (
                    <tr key={`${location.id}-${gender}`}>
                      {index === 0 && (
                        <td
                          rowSpan={genders.length}
                          className="p-2 border-t border-gray-300 text-center text-[12px]"
                        >
                          {location.value}
                        </td>
                      )}
                      <td className="p-2 border-l border-t border-gray-300 text-center text-[12px]">
                        {gender}
                      </td>
                      <td className="p-2 border-l border-t border-gray-300">
                        <input
                          type="number"
                          className="w-full p-2 border-b border-gray-300 rounded text-[12px]"
                          placeholder="Enter Value"
                          value={wages[location.value]?.[gender] || ""}
                          onKeyDown={handleKeyDown} 
                          onChange={(e) =>
                            handleWageChange(
                              location.value,
                              gender,
                              e.target.value
                            )
                          }
                        />
                      </td>
                    </tr>
                  ))
                : null
            )}
          </tbody>
        </table>
      </div>
      </>
)}
    </>
  );
};

export default GRI2021combinWidhet;
