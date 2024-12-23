"use client";
import React, { useState, useEffect, useRef } from "react";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import { MdAdd, MdOutlineDeleteOutline, MdInfoOutline } from "react-icons/md";
import { GlobalState } from "../../../../../Context/page";
import dateWidget from "../../../../shared/widgets/Input/dateWidget";
import selectWidget from "../../../../shared/widgets/Select/selectWidget";
import inputWidget from "../../../../shared/widgets/Input/inputWidget";
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
const widgets = {
  inputWidget: inputWidget,
  dateWidget: dateWidget,
  selectWidget: selectWidget,
  FileUploadWidget: CustomFileUploadWidget,
  AssignTobutton: AssignToWidget,
  CustomSelectInputWidget: CustomSelectInputWidget,
  RemoveWidget: RemoveWidget,
  selectWidget3: selectWidget3,
};

const view_path =
  "gri-environment-waste-306-4b-4c-4d-waste_diverted_from_disposal";
const client_id = 1;
const user_id = 1;

const schema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      Wastecategory: {
        type: "string",
        title: "Waste category",
        enum: ["Hazardous", "Non Hazardous"],
        tooltiptext: "Select the waste category from the given dropdown.",
        display: "block",
      },
      WasteType: {
        type: "string",
        title: "Waste Type",
        tooltiptext:
          "Please specify the type of waste. e.g. Paper waste, E-waste, chemical waste etc. ",
        display: "block",
      },
      Unit: {
        type: "string",
        title: "Unit",
        enum: ["g", "Kgs", "t (metric tons)", "ton (US short ton)", "lbs"],
        tooltiptext: "Use 1000 kilograms as the measure for a metric ton.",
        display: "block",
      },
      Wastediverted: {
        type: "string",
        title: "Waste Diverted",
        tooltiptext: "Enter the amount of waste diverted.",
        display: "block",
      },
      RecoveryOperations: {
        type: "string",
        title: "Recovery Operations",
        enum: ["Preparation for reuse", "Recycling", "Other (please specify)"],
        tooltiptext:
          "<p>Recovery:Operation wherein products, components of products, or materials that have become waste are prepared to fulfill a purpose in place of new products, components, or materials that would otherwise have been used for that purpose. </p> <p> Recovery Methods:Preparation for reuse: Checking, cleaning, or repairing operations, by which products or components of products that have become waste are prepared to be put to use for the same purpose for which they were conceived.</p> <p>Recycling: Reprocessing of products or components of products that have become waste, to make new materials </p>",
        display: "block",
      },
      Site: {
        type: "string",
        title: "Site",
        enum: ["Onsite", "Offsite"],
        tooltiptext:
          "On-site: ‘Onsite’ means within the physical boundary  or administrative control of the reporting organization Off-site: ‘Offsite’ means outside the physical boundary  or administrative control of the reporting organization",
        display: "block",
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
      "Wastecategory",
      "WasteType",
      "Unit",
      "Wastediverted",
      "RecoveryOperations",
      "Site",
      "AssignTo",
      "FileUpload",
      "Remove",
    ],
    Wastecategory: {
      "ui:widget": "selectWidget",
      "ui:horizontal": true,
      "ui:options": {
        label: false,
      },
    },
    WasteType: {
      "ui:widget": "inputWidget",
      "ui:options": {
        label: false,
      },
    },
    Unit: {
      "ui:widget": "selectWidget3",
      "ui:horizontal": true,
      "ui:options": {
        label: false,
      },
    },
    Wastediverted: {
      "ui:widget": "inputWidget",
      "ui:inputtype": "number",
      "ui:horizontal": true,
      "ui:options": {
        label: false,
      },
    },

    RecoveryOperations: {
      "ui:widget": "selectWidget",
      "ui:horizontal": true,
      "ui:options": {
        label: false,
      },
    },
    Site: {
      "ui:widget": "selectWidget",
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
const Wastedivertedimpact = ({ location, year, month }) => {
  const { open } = GlobalState();
  const [formData, setFormData] = useState([{}]);
  const [r_schema, setRemoteSchema] = useState({});
  const [r_ui_schema, setRemoteUiSchema] = useState({});
  const [loopen, setLoOpen] = useState(false);
  const toastShown = useRef(false);
  const LoaderOpen = () => {
    setLoOpen(true);
  };
  const LoaderClose = () => {
    setLoOpen(false);
  };

  const updateFormData = async () => {
    LoaderOpen();
    const data = {
      client_id: client_id,
      user_id: user_id,
      path: view_path,
      form_data: formData,
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
    const url = `${process.env.BACKEND_API_URL}/datametric/get-fieldgroups?path_slug=${view_path}&client_id=${client_id}&user_id=${user_id}&location=${location}&year=${year}&month=${month}`;
    try {
      const response = await axiosInstance.get(url);
      console.log("API called successfully:", response.data);
      setRemoteSchema(response.data.form[0].schema);
      setRemoteUiSchema(response.data.form[0].ui_schema);
      const form_parent = response.data.form_data;
      setFormData(form_parent[0].data);
    } catch (error) {
      console.error("API call failed:", error);
    } finally {
      LoaderClose();
    }
  };
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
  
  const handleChange = (e) => {
    const newData = e.formData.map((item, index) => ({
      ...item, // Ensure each item retains its structure
    }));
    setFormData(newData); // Update the formData with new values
  };
  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   updateFormData();
  // };

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

  // Add validation state
  const [validationErrors, setValidationErrors] = useState([]);

  // Add validation function
  const validateRows = (data) => {
    return data.map((row) => {
      const rowErrors = {};

      if (!row.Wastecategory) {
        rowErrors.Wastecategory = "Waste category is required";
      }

      if (!row.WasteType || row.WasteType.trim() === "") {
        rowErrors.WasteType = "Waste type is required";
      }

      if (!row.Unit) {
        rowErrors.Unit = "Unit is required";
      }

      if (!row.Wastediverted || row.Wastediverted.trim() === "") {
        rowErrors.Wastediverted = "Waste diverted amount is required";
      }

      if (!row.RecoveryOperations) {
        rowErrors.RecoveryOperations = "Recovery operation is required";
      }

      if (!row.Site) {
        rowErrors.Site = "Site is required";
      }

      return rowErrors;
    });
  };

  // Add renderError helper function
  const renderError = (rowIndex, fieldName) => {
    const rowErrors = validationErrors[rowIndex] || {};
    return rowErrors[fieldName] ? (
      <div className="text-red-500 text-[12px] mt-1">
        {rowErrors[fieldName]}
      </div>
    ) : null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateRows(formData);
    setValidationErrors(errors);

    const hasErrors = errors.some(
      (rowErrors) => Object.keys(rowErrors).length > 0
    );
    if (!hasErrors) {
      updateFormData();
    }
  };

  return (
    <>
      <div className={`overflow-auto custom-scrollbar flex py-4`}>
        <div>
          <Form
            className="flex"
            schema={schema}
            uiSchema={uiSchema}
            formData={formData}
            onChange={handleChange}
            validator={validator}
            formContext={{ validationErrors }}
            widgets={{
              ...widgets,

              RemoveWidget: (props) => {
                const match = props.id.match(/^root_(\d+)/);
                const index = match ? parseInt(match[1], 10) : null;

                return (
                  <RemoveWidget
                    {...props}
                    index={index}
                    onRemove={handleRemove}
                  />
                );
              },
              FileUploadWidget: (props) => (
                <CustomFileUploadWidget
                  {...props}
                  scopes="ec2"
                  setFormData={updateFormDatanew}
                />
              ),
            }}
          ></Form>
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
      </div>
      <div></div>

      <div className="flex justify-start mt-4 right-1">
        <button
          type="button"
          className="text-[#007EEF] text-[12px] flex cursor-pointer mt-5 mb-5"
          onClick={handleAddNew}
        >
          <MdAdd className="text-lg" /> Add Row
        </button>
      </div>
      <div className="mb-4">
        <button
          type="button"
          className=" text-center py-1 text-sm w-[100px] bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline float-end"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </>
  );
};

export default Wastedivertedimpact;
