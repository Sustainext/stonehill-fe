'use client'
import React, { useState, useEffect, useRef } from 'react';
import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';
import { MdAdd, MdOutlineDeleteOutline, MdInfoOutline } from "react-icons/md";
import { GlobalState } from '../../../../../Context/page';
import dateWidget from '../../../../shared/widgets/Input/dateWidget';
import selectWidget from '../../../../shared/widgets/Select/selectWidget';
import inputWidget from '../../../../shared/widgets/Input/inputWidget';
import CustomFileUploadWidget from '../../../../shared/widgets/CustomFileUploadWidget';
import AssignToWidget from '../../../../shared/widgets/assignToWidget';
import CustomSelectInputWidget from '../../../../shared/widgets/CustomSelectInputWidget';
import RemoveWidget from '../../../../shared/widgets/RemoveWidget';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Oval } from 'react-loader-spinner';
import selectWidget3 from '../../../../shared/widgets/Select/selectWidget3';
import inputnumberWidget from "../../../../shared/widgets/Input/inputnumberWidget"
import axiosInstance from "../../../../utils/axiosMiddleware";
import InputnewnumberWidget from "../../../../shared/widgets/Input/inputnewnuberWidegt"
const widgets = {
    inputWidget: InputnewnumberWidget,
    dateWidget: dateWidget,
    selectWidget: selectWidget,
    FileUploadWidget: CustomFileUploadWidget,
    AssignTobutton: AssignToWidget,
    CustomSelectInputWidget: CustomSelectInputWidget,
    RemoveWidget: RemoveWidget,
    selectWidget3: selectWidget3,
    inputnumberWidget: inputnumberWidget,
};

const view_path = 'gri-environment-materials-301-2a-recycled_input_materials'
const client_id = 1
const user_id = 1

const schema = {
    type: 'array',
    items: {
        type: 'object',
        properties: {
            Totalweight: {
                type: "string",
                title: "Total weight or volume of materials used",
                tooltiptext: "Use the total weight or volume of materials used as specified in Disclosure 301-1",
                display: "block",

            },
            Unit: {
              type: "string",
              title: "Unit",
              enum: ['Cubic centimeter cm3', 'Cubic decimeter dm3', 'Cubic meter m3', 'Gram', 'Kilogram Kg', 'Liter', 'Milligram', 'Milliliter', 'Fluid Ounce fl Oz', 'Gallon Gal', 'Pint Pt', 'Pound Lb', 'Quart Qt', 'Cubic foot ft3', 'Metric ton', 'US short ton (tn)'],
              tooltiptext: "Use 1000 kilograms as the measure for a metric ton.",
              display: "none",
          },
            Recycledmaterialsused: {
                type: "string",
                title: "Recycled materials used",
                enum: ['Yes', 'No'],
                tooltiptext: "Does the company use recycled materials in its production process?",
                display: "block",
            },
            Typeofrecycledmaterialused: {
                type: "string",
                title: "Type of recycled material used",
                enum: ['Recycled plastic', 'Recycled metal', 'Recycled paper products', 'Recycled Glass', 'Natural materials', 'Other (please specify)'],
                tooltiptext: "What types of recycled materials does the company use?",
                display: "block",
            },
            Amountofmaterialrecycled: {
                type: "string",
                title: "Amount of material recycled ",
                tooltiptext: "Please specify the amount of material the company recycled during the reporting period.",
                display: "block",
            },

            Unit1: {
                type: "string",
                title: "Unit",
                enum: ['Cubic centimeter cm3', 'Cubic decimeter dm3', 'Cubic meter m3', 'Gram', 'Kilogram Kg', 'Liter', 'Milligram', 'Milliliter', 'Fluid Ounce fl Oz', 'Gallon Gal', 'Pint Pt', 'Pound Lb', 'Quart Qt', 'Cubic foot ft3', 'Metric ton', 'US short ton (tn)'],
                tooltiptext: "Use 1000 kilograms as the measure for a metric ton.",
                display: "none",
            },
            Amountofrecycledinputmaterialused: {
                type: "string",
                title: "Amount of recycled input material used ",
                tooltiptext: "How much recycled material is used for the production of goods or services? Recycled Input Materials: Materials that have been used and then processed into new materials. ",
                display: "block",
            },

            Unit2: {
                type: "string",
                title: "Unit",
                enum: ['Cubic centimeter cm3', 'Cubic decimeter dm3', 'Cubic meter m3', 'Gram', 'Kilogram Kg', 'Liter', 'Milligram', 'Milliliter', 'Fluid Ounce fl Oz', 'Gallon Gal', 'Pint Pt', 'Pound Lb', 'Quart Qt', 'Cubic foot ft3', 'Metric ton', 'US short ton (tn)'],
                tooltiptext: "Use 1000 kilograms as the measure for a metric ton.",
                display: "none",
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

        }
    }
};

const uiSchema = {

    items: {
        classNames: 'fieldset',
        'ui:order': [
            'Totalweight','Unit', 'Recycledmaterialsused', 'Typeofrecycledmaterialused', 'Amountofmaterialrecycled', 'Unit1', 'Amountofrecycledinputmaterialused', 'Unit2', 'AssignTo', 'FileUpload', 'Remove'
        ],
        Totalweight: {
            'ui:widget': 'inputWidget',
            'ui:inputtype':'number',
            'ui:horizontal': true,
            'ui:options': {
                label: false
            },
        },
        Unit: {
          'ui:widget': 'selectWidget3',
          'ui:horizontal': true,
          'ui:options': {
              label: false
          },
      },
        Recycledmaterialsused: {
            'ui:widget': 'selectWidget',
            'ui:horizontal': true,
            'ui:options': {
                label: false,
            },
        },
        Typeofrecycledmaterialused: {
            'ui:widget': 'selectWidget',
            'ui:options': {
                label: false
            },
        },
        Amountofmaterialrecycled: {
            'ui:widget': 'inputnumberWidget',
            'ui:horizontal': true,
            'ui:options': {
                label: false
            },
        },


        Unit1: {
            'ui:widget': 'selectWidget3',
            'ui:widgetDisable':true,
            'ui:horizontal': true,
            'ui:options': {
                label: false
            },
        },
        Amountofrecycledinputmaterialused: {
            'ui:widget': 'inputnumberWidget',
            'ui:horizontal': true,
            'ui:options': {
                label: false
            },
        },
        Unit2: {
            'ui:widget': 'selectWidget3',
            'ui:widgetDisable':true,
            'ui:horizontal': true,
            'ui:options': {
                label: false
            },
        },
        AssignTo: {
            "ui:widget": "AssignTobutton",
            'ui:horizontal': true,
            'ui:options': {
                label: false
            },
        },
        FileUpload: {
            'ui:widget': 'FileUploadWidget',
            'ui:horizontal': true,
            'ui:options': {
                label: false
            },
        },
        Remove: {
            "ui:widget": "RemoveWidget",
            'ui:options': {
                label: false
            },
        },
        'ui:options': {
            orderable: false,
            addable: false,
            removable: false,
            layout: 'horizontal',
        }
    }
};

const validateRows = (data) => {
  return data.map((row) => {
    const rowErrors = {};
    if (!row.Totalweight) {
      rowErrors.Totalweight = "Total weight or volume of materials used is required";
    }
    if (!row.Recycledmaterialsused) {
      rowErrors.Recycledmaterialsused = "Recycled materials used  is required";
    }
  
    if (!row.Typeofrecycledmaterialused) {
      rowErrors.Typeofrecycledmaterialused = "Type of recycled material used is required";
    }
    if (!row.Amountofmaterialrecycled) {
      rowErrors.Amountofmaterialrecycled = "Type of recycled material used is required";
    }
    if (!row.Unit) {
      rowErrors.Unit = "Unit is required";
    }
    if (!row.Unit1) {
      rowErrors.Unit1 = "Unit is required";
    }
    if (!row.Amountofrecycledinputmaterialused) {
      rowErrors.Amountofrecycledinputmaterialused = "Amount of recycled input material used is required";
    }
    if (!row.Unit2) {
      rowErrors.Unit2 = "Unit is required";
    }
    return rowErrors;
  });
};
const Recycledinput = ({location, year, month}) => {
  const { open } = GlobalState();
  const [formData, setFormData] = useState([{}]);
  const [r_schema, setRemoteSchema] = useState({});
  const [r_ui_schema, setRemoteUiSchema] = useState({});
  const [loopen, setLoOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
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
   // Dependencies // React only triggers this effect if these dependencies change
   const handleChange = (e) => {
    const updatedFormData = e.formData.map((item, index) => {
        const updatedItem = { ...item };
        // Check if Unit is updated and update Unit2
        if (updatedItem.Unit && updatedItem.Unit !== formData[index]?.Unit) {
          updatedItem.Unit1 = updatedItem.Unit; // Mirror the value of Unit to Unit1
            updatedItem.Unit2 = updatedItem.Unit; // Mirror the value of Unit to Unit2
        }

        return updatedItem;
    });

    setFormData(updatedFormData);
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
                  scopes="ec16"
                  setFormData={updateFormDatanew}
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

export default Recycledinput;

