"use client";
import React, { useState, useEffect, useRef } from "react";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import { MdAdd, MdOutlineDeleteOutline, MdInfoOutline } from "react-icons/md";
import { GlobalState } from "../../../../../Context/page";
import dateWidget from "../../../../shared/widgets/Input/dateWidget";
import selectWidget from "../../../../shared/widgets/Select/selectWidget";
import inputWidget from "../../../../shared/widgets/Input/inputWidget";
import LonginputWidget from "../../../../shared/widgets/Input/longtextinputWidget"
import CustomFileUploadWidget from "../../../../shared/widgets/CustomFileUploadWidget";
import AssignToWidget from "../../../../shared/widgets/assignToWidget";
import CustomSelectInputWidget from "../../../../shared/widgets/CustomSelectInputWidget";
import RemoveWidget from "../../../../shared/widgets/RemoveWidget";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Oval } from "react-loader-spinner";
import selectWidget3 from "../../../../shared/widgets/Select/selectWidget3";
import axiosInstance from "../../../../utils/axiosMiddleware";
import LonginputrdonlyWidget from "../../../../shared/widgets/Input/LonginputrdonlyWidget"
const widgets = {
  inputWidget: LonginputWidget,
  dateWidget: dateWidget,
  selectWidget: selectWidget,
  FileUploadWidget: CustomFileUploadWidget,
  AssignTobutton: AssignToWidget,
  CustomSelectInputWidget: CustomSelectInputWidget,
  RemoveWidget: RemoveWidget,
  selectWidget3: selectWidget3,
  LonginputrdonlyWidget:LonginputrdonlyWidget,
};

const view_path = "gri-environment-water-303-5c-change_in_water_storage";
const client_id = 1;
const user_id = 1;

const schema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      Unit: {
        type: "string",
        title: "Unit",
        enum: [
          "Litre",
          "Megalitre",
          "Cubic meter",
          "Kilolitre",
          "Million litrse per day",
        ],
        tooltiptext:
          "Select the correct unit corresponding to the change in water storage.",
      },

      Reporting1: {
        type: "string",
        title: "Total water storage at the end of the reporting period",
        tooltiptext:
          "What was the water storage capacity of the company at the end of the reporting period?",
      },
      Reporting2: {
        type: "string",
        title: "Total water storage at the beginning of the reporting period",
        tooltiptext:
          "What was the water storage capacity of the company at the beginning of the reporting period?",
      },
      Reporting3: {
        type: "string",
        title: "Change in water storage",
        tooltiptext:
          "Change in water storage = Total water storage at the end of the reporting period - Total water storage at the beginning of the reporting period",
      },

      AssignTo: {
        type: "string",
        title: "Assign To",
      },
      FileUpload: {
        type: "string",
        format: "data-url",
        title: "File Upload",
      },
      Remove: {
        type: "string",
        title: "Remove",
      },
    },
  },
};

const uiSchema = {
  items: {
    classNames: "fieldset",
    "ui:order": [
      "Unit",
      "Reporting1",
      "Reporting2",
      "Reporting3",
      "AssignTo",
      "FileUpload",
      "Remove",
    ],
    Unit: {
      "ui:widget": "selectWidget3",
      "ui:horizontal": true,
      "ui:options": {
        label: false,
      },
    },
    Reporting1: {
      "ui:widget": "inputWidget",
      "ui:inputtype": "number",
      "ui:horizontal": true,
      "ui:options": {
        label: false,
      },
    },
    Reporting2: {
      "ui:widget": "inputWidget",
      "ui:inputtype": "number",
      "ui:options": {
        label: false,
      },
    },
    Reporting3: {
      "ui:widget": "LonginputrdonlyWidget",
      "ui:horizontal": true,
      "ui:options": {
        label: false,
      },
    },

    AssignTo: {
      "ui:widget": "AssignTobutton",
      "ui:horizontal": true,
      "ui:options": {
        label: false,
      },
    },
    FileUpload: {
      "ui:widget": "FileUploadWidget",
      "ui:horizontal": true,
      "ui:options": {
        label: false,
      },
    },
    Remove: {
      "ui:widget": "RemoveWidget",
      "ui:options": {
        label: false,
      },
    },
    "ui:options": {
      orderable: false,
      addable: false,
      removable: false,
      layout: "horizontal",
    },
  },
};

const validateRows = (data, selectedOption) => {
  const rowErrors = [];

  if (selectedOption === "yes") {
    data.forEach((row, index) => {
      const errors = {};
      if (!row.Reporting1) {
        errors.Reporting1 = "Total water storage at the end is required.";
      }
      if (!row.Reporting2) {
        errors.Reporting2 = "Total water storage at the beginning is required.";
      }
      if (!row.Unit) {
        errors.Unit = "Unit is required.";
      }
      rowErrors[index] = errors;
    });
  }

  return rowErrors;
};
const WaterstorageQ1 = ({ location, year, month }) => {

  const { open } = GlobalState();
  const [formData, setFormData] = useState([{}]);
  const [r_schema, setRemoteSchema] = useState({});
  const [r_ui_schema, setRemoteUiSchema] = useState({});
  const [selectedOption, setSelectedOption] = useState("");
  const [validationErrors, setValidationErrors] = useState([]);
  const [selectOptionError, setSelectOptionError] = useState("");
  const [loopen, setLoOpen] = useState(false);
  const toastShown = useRef(false);

  const LoaderOpen = () => {
    setLoOpen(true);
  };
  const LoaderClose = () => {
    setLoOpen(false);
  };

  const updateFormData = async () => {
    const data = {
      client_id: client_id,
      user_id: user_id,
      path: view_path,
      form_data: [
        {
          formData: formData,
          selectedOption: selectedOption,
        },
      ],
      location,
      year,
      month,
    };

    const url = `${process.env.BACKEND_API_URL}/datametric/update-fieldgroup`;
    try {
      const response = await axiosInstance.post(url, data);

      if (response.status === 200) {
        toast.success("Data added successfully", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        LoaderClose();
        loadFormData();
      } else {
        toast.error("Oops, something went wrong", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        LoaderClose();
      }
    } catch (error) {
      toast.error("Oops, something went wrong", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      LoaderClose();
    }
  };

  const loadFormData = async () => {
    LoaderOpen();
    setFormData([{}]);
    setSelectedOption("");
    const url = `${process.env.BACKEND_API_URL}/datametric/get-fieldgroups?path_slug=${view_path}&client_id=${client_id}&user_id=${user_id}&location=${location}&year=${year}&month=${month}`;
    try {
      const response = await axiosInstance.get(url);
      console.log("API called successfully:", response.data);
      setRemoteSchema(response.data.form[0].schema);
      setRemoteUiSchema(response.data.form[0].ui_schema);
      const form_parent = response.data.form_data;
      const f_data = form_parent[0].data[0].formData;
      const option_data = form_parent[0].data[0].selectedOption;
      setFormData(f_data);
      setSelectedOption(option_data);
    } catch (error) {
      console.error("API call failed:", error);
    } finally {
      LoaderClose();
    }
  };


  // fetch backend and replace initialized forms
  useEffect(() => {
    if (location && year && month) {
      loadFormData();
      toastShown.current = false; // Reset the flag when valid data is present
    } else {
      // Only show the toast if it has not been shown already
      if (!toastShown.current) {
        toastShown.current = true; // Set the flag to true after showing the toast
      }
    }
  }, [location, year, month]);

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
    setSelectOptionError("");
  };
  const handleChange = (e) => {
    const newData = e.formData.map((item) => {
      const reporting1 = parseFloat(item.Reporting1) || 0; // Safely parse or default to 0
      const reporting2 = parseFloat(item.Reporting2) || 0;
      const reporting3 = reporting1 - reporting2; // Calculate the sum
      return {
        ...item, // Retain other fields
        Reporting3: reporting3.toString(), // Ensure it remains a string for the form
      };
    });
    setFormData(newData); // Update the formData with the calculated values
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedOption) {
      setSelectOptionError("Please select Yes or No.");
     
      return;
    } else {
      setSelectOptionError(""); // Clear the error if valid
    }
    console.log("Submit button clicked"); // Debugging log
    const errors = validateRows(formData, selectedOption);
    setValidationErrors(errors);
    console.log("Validation Errors:", errors); // Debugging log
  
    const hasErrors = errors.some(rowErrors => Object.keys(rowErrors).length > 0);
    if (!hasErrors) {
      console.log("No validation errors, proceeding to update data"); // Debugging log
      updateFormData();
    } else {
      console.log("Validation errors found, submission aborted"); // Debugging log
    }
  };

  const handleAddNew = () => {
    const newData = [...formData, {}];
    setFormData(newData);
  };

  const updateFormDatanew = (updatedData) => {
    setFormData(updatedData);
  };

  const handleRemove = (index) => {
    const updatedData = [...formData];
    updatedData.splice(index, 1);
    setFormData(updatedData);
  };
  return (
    <>
      <div className="w-full max-w-xs mb-2">
        <label className="text-sm leading-5 text-gray-700 flex">
          Does water storage have a significant water-related impact?
          <div className="ml-2 relative">
            <MdInfoOutline
              data-tooltip-id={`tooltip-$e1678`}
              data-tooltip-content="Indicate whether the water storage have a significant water-related impact."
              className="mt-1.5 ml-2 text-[15px]"
            />
            <ReactTooltip
              id={`tooltip-$e1678`}
              place="top"
              effect="solid"
              style={{
                width: "290px",
                backgroundColor: "#000",
                color: "white",
                fontSize: "12px",
                boxShadow: 3,
                borderRadius: "8px",
                textAlign: "left",
              }}
            ></ReactTooltip>
          </div>
        </label>
        <select
          className={`block w-[270px] py-2 text-sm leading-6  focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5 border-b-2 border-gray-300 ${selectOptionError ? 'border-red-500' : 'border-gray-300'}`}
          value={selectedOption}
          onChange={handleSelectChange}
        >
          <option>Select Yes/No</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
        {selectOptionError && (
            <p className="text-red-500 text-xs mt-1">{selectOptionError}</p>
          )}
      </div>
      {selectedOption === "yes" && (
        <>
          <div className="overflow-auto custom-scrollbar flex">
            <div>
              <Form
                className="flex"
                schema={schema}
                uiSchema={uiSchema}
                formData={formData}
                onChange={handleChange}
                validator={validator}
                formContext={{validationErrors }}
                widgets={{
                  ...widgets,
                  RemoveWidget: (props) => (
                    <RemoveWidget
                      {...props}
                      index={props.id.split("_")[1]} // Pass the index
                      onRemove={handleRemove}
                    />
                  ),
                  FileUploadWidget: (props) => (
                    <CustomFileUploadWidget
                      {...props}
                      scopes="in1"
                      setFormData={updateFormDatanew}
                    />
                  ),
                }}
              />
            </div>
          </div>

          <div className="flex justify-start mt-4 right-1">
            <button
              type="button"
              className="text-[#007EEF] text-[12px] flex cursor-pointer mt-5 mb-5"
              onClick={handleAddNew}
            >
              <MdAdd className="text-lg" /> Add Row
            </button>
          </div>
        </>
      )}
      <div className="mb-6 mt-">
        <button
          type="button"
          className=" text-center py-1 text-sm w-[100px] bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline float-end"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
      {loopen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <Oval
            height={50}
            width={50}
            color="#00BFFF"
            secondaryColor="#f3f3f3"
            strokeWidth={2}
            strokeWidthSecondary={2}
          />
        </div>
      )}
    </>
  );
};

export default WaterstorageQ1;
