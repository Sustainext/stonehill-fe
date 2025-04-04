"use client";
import React, { useState, useEffect, useRef } from "react";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import { MdAdd, MdOutlineDeleteOutline, MdInfoOutline } from "react-icons/md";
import dateWidget from "../../../../../shared/widgets/Input/dateWidget";
import selectWidget from "../../../../../shared/widgets/Select/selectWidget";
import inputWidget from "../../../../../shared/widgets/Input/inputWidget";
import { GlobalState } from "../../../../../../Context/page";
import CustomFileUploadWidget from "../../../../../shared/widgets/CustomFileUploadWidget";
import AssignToWidget from "../../../../../shared/widgets/assignToWidget";
import CustomSelectInputWidget from "../../../../../shared/widgets/CustomSelectInputWidget";
import RemoveWidget from "../../../../../shared/widgets/RemoveWidget";
import selectWidget3 from "../../../../../shared/widgets/Select/selectWidget3";
import inputnumberWidget from "../../../../../shared/widgets/Input/inputnumberWidget";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Oval } from "react-loader-spinner";
import axiosInstance from "../../../../../utils/axiosMiddleware";
import { debounce } from "lodash";
const widgets = {
  inputWidget: inputWidget,
  dateWidget: dateWidget,
  selectWidget: selectWidget,
  FileUploadWidget: CustomFileUploadWidget,
  AssignTobutton: AssignToWidget,
  CustomSelectInputWidget: CustomSelectInputWidget,
  RemoveWidget: RemoveWidget,
  selectWidget3: selectWidget3,
  inputnumberWidget: inputnumberWidget,
};

const view_path = "gri-environment-energy-302-1a-1b-direct_purchased";
const client_id = 1;
const user_id = 1;

const schema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      EnergyType: {
        type: "string",
        title: "Energy Type",
        enum: ["Electricity", "Heating", "Cooling", "Steam"],
        tooltiptext: "Indicate the type of energy purchased from the drop down",
      },
      Source: {
        type: "string",
        title: "Source",
        enum: [
          "Coal",
          "Solar",
          "LPG",
          "Diesel",
          "Wind",
          "Hydro",
          "Natural gas",
          "Electricity",
          "Cooling",
          "Steam",
          "Heating",
          "Wood Biomas",
          "Biogas",
          "Other",
        ],
        tooltiptext: "Indicate where the energy comes from",
      },
      Purpose: {
        type: "string",
        title: "Purpose",
        required: true,
        tooltiptext:
          "Indicate where the energy comes fromIndicate the purpose it's being used for.E.g. Manufacturing, packaging, combustion",
      },
      Renewable: {
        type: "string",
        title: "Renewable/ Non-renewable",
        enum: ["Renewable", "Non-renewable"],
        tooltiptext:
          "Select from the dropdown to indicate whether it's Renewable or Non-Renewable Energy",
      },

      Quantity: {
        type: "string",
        title: "Quantity",
        tooltiptext: "Indicate the purchased quantity",
      },
      Unit: {
        type: "string",
        title: "Unit",
        enum: ["Joules", "KJ", "Wh", "KWh", "GJ", "MMBtu"],
        tooltiptext:
          "Select the correct unit corresponding to the quantity purchased.",
      },
      AssignTo: {
        type: "string",
      },
      FileUpload: {
        type: "string",
        format: "data-url",
      },

      Remove: {
        type: "string",
      },
      // Define other properties as needed
    },
  },
};

const uiSchema = {
  items: {
    "ui:order": [
      "EnergyType",
      "Source",
      "Purpose",
      "Renewable",
      "Quantity",
      "Unit",
      "AssignTo",
      "FileUpload",
      "Remove",
    ],
    EnergyType: {
      "ui:widget": "selectWidget",
      "ui:horizontal": true,
      "ui:options": {
        label: false,
      },
    },
    Source: {
      "ui:widget": "selectWidget",
      "ui:horizontal": true,
      "ui:options": {
        label: false,
      },
    },
    Purpose: {
      "ui:widget": "inputWidget",
      "ui:options": {
        label: false,
      },
    },
    Renewable: {
      "ui:widget": "selectWidget",
      "ui:horizontal": true,
      "ui:options": {
        label: false,
      },
    },
    Quantity: {
      "ui:widget": "inputnumberWidget",
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
    classNames: "fieldset",
    "ui:options": {
      orderable: false,
      addable: false,
      removable: false,
      layout: "horizontal",
    },
  },
};
const validateRows = (data) => {
  return data.map((row) => {
    const rowErrors = {};
    if (!row.EnergyType) {
      rowErrors.EnergyType = "Energy Type is required";
    }
    if (!row.Source) {
      rowErrors.Source = "Source is required";
    }
    if (!row.Purpose) {
      rowErrors.Purpose = "Purpose is required";
    }
    if (!row.Renewable) {
      rowErrors.Renewable = "Renewable/Non-renewable is required";
    }
    if (!row.Quantity) {
      rowErrors.Quantity = "Quantity is required";
    }
    if (!row.Unit) {
      rowErrors.Unit = "Unit is required";
    }
    return rowErrors;
  });
};
const Purchased = ({ location, year, month,monthname,locationname }) => {
  const { open } = GlobalState();
  const [formData, setFormData] = useState([{}]);
  const [r_schema, setRemoteSchema] = useState({});
  const [r_ui_schema, setRemoteUiSchema] = useState({});
  const [loopen, setLoOpen] = useState(false);
  const toastShown = useRef(false);
  const [validationErrors, setValidationErrors] = useState([]);
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
      toastShown.current = false;
    } else {
      if (!toastShown.current) {
        toastShown.current = true;
      }
    }
  }, [location, year, month]);
  useEffect(() => {
    console.log("formData has been updated:", formData);
  }, [formData]);
  const handleChange = (e) => {
    const newData = e.formData.map((item, index) => ({
      ...item,
    }));
    setFormData(newData);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submit button clicked"); // Debugging log
    const errors = validateRows(formData);
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
  

  const renderError = (rowIndex, fieldName) => {
    const rowErrors = validationErrors[rowIndex] || {};
    return rowErrors[fieldName] ? <div className="text-red-500 text-sm mt-1">{rowErrors[fieldName]}</div> : null;
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
      <div className={`overflow-auto custom-scrollbar flex py-4`}>
        <div>
        <Form
            className='flex'
            schema={r_schema}
            uiSchema={r_ui_schema}
            formData={formData}
            onChange={handleChange}
            validator={validator}
            formContext={{ validationErrors }}
            widgets={{

              ...widgets,

              RemoveWidget: (props) => {
                // Assuming the widget framework passes a unique ID that includes the index
                // Make sure this ID fetching logic is correct
                return (
                  <RemoveWidget
                    {...props}
                    index={props.id.split('_')[1]} // Pass the index
                    onRemove={handleRemove}
                  />
                );
              },
              FileUploadWidget: (props) => (
                <CustomFileUploadWidget
                  {...props}
                  scopes="ec1"
                  setFormData={updateFormDatanew}
                  locationname={locationname}
                  year={year}
                  monthname={monthname}
                  sectionname="Direct Purchased Heating, Cooling, Electricity and Steam"
                  tabname="Energy consumed inside the organization"
                />
              ),
             
            }}

          >
          </Form>

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
          className="text-[#007EEF] text-[12px] 4k:text-[15px] flex cursor-pointer mt-5 mb-5"
          onClick={handleAddNew}
        >
          <MdAdd className="text-lg mt-0 4k:mt-0.5" /> Add Row
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

export default Purchased;