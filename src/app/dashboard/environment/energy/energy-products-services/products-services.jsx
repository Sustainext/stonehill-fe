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
import inputnumberWidget from "../../../../shared/widgets/Input/inputnumberWidget";
import axiosInstance from "../../../../utils/axiosMiddleware";
import TextareasectionWidgets from "../../../../shared/widgets/Textarea/TextareasectionWidgets"
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
  TextareasectionWidgets:TextareasectionWidgets,
};

const view_path = 'gri-environment-energy-302-5a-5b-reduction_in_energy_in_products_and_servies'
const client_id = 1
const user_id = 1
const getCurrentYear = () => new Date().getFullYear();
const generateYearRange = (startYear) => {
  const currentYear = getCurrentYear();
  let years = [];
  for (let year = startYear; year <= currentYear; year++) {
    years.push(year.toString()); // Convert years to string if needed
  }
  return years;
};

// Generate the year range before defining the schema
const yearRange = generateYearRange(1991);
const schema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {

      ProductServices: {
        type: "string",
        title: "Product / Services",
        tooltiptext: "Indicate the product or service for which Energy Requirements have been reduced."
      },

      Quantity: {
        type: "string",
        title: "Quantity of reduced energy requirement",
        tooltiptext: "Indicate the quantity of reduced energy requirement"
      },
      Unit: {
        type: "string",
        title: "Unit",
        enum: ['Joules', 'KJ', 'Wh', 'KWh', 'GJ', 'MMBtu'],
        tooltiptext: "Select the correct unit corresponding to the quantity"
      },
      Baseyear: {
        type: "string",
        title: "Base year/Baseline",
        enum: yearRange,
        tooltiptext: "Indicate the base year/baseline used for comparing energy saved before the intervention"
      },
      Rationalebaseyear: {
        type: "string",
        title: "Rationale for choosing base year",
        tooltiptext: "Explain the rationale for choosing base year"
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
      'ProductServices', 'Quantity', 'Unit', 'Baseyear','Rationalebaseyear','AssignTo', 'FileUpload', 'Remove'
    ],

    ProductServices: {
      'ui:widget': 'inputWidget',
      'ui:options': {
        label: false
      },
    },
    Quantity: {
      'ui:widget': 'inputnumberWidget',
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
    Baseyear: {
      'ui:widget': 'selectWidget',
      'ui:inputtype':'number',
      'ui:options': {
        label: false
      },
    },
    Rationalebaseyear: {
      'ui:widget': 'TextareasectionWidgets',
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
    if (!row.ProductServices) {
      rowErrors.ProductServices = "Product / Services is required";
    }
    if (!row.Quantity) {
      rowErrors.Quantity = "Quantity of reduced energy requirement is required";
    }
  
    if (!row.Unit) {
      rowErrors.Unit = "Unit is required";
    }
    if (!row.Baseyear) {
      rowErrors.Baseyear = "Base year/Baseline is required";
    }
    if (!row.Rationalebaseyear) {
      rowErrors.Rationalebaseyear = "Rationale for choosing base year is required";
    }
 
    return rowErrors;
  });
};
const Productsservices = ({location, year, month}) => {
  const { open } = GlobalState();
  const [formData, setFormData] = useState([{}]);
  const [r_schema, setRemoteSchema] = useState({})
  const [r_ui_schema, setRemoteUiSchema] = useState({})
  const [loopen, setLoOpen] = useState(false);
  const toastShown = useRef(false);
  const [validationErrors, setValidationErrors] = useState([]);

  const LoaderOpen = () => {
    setLoOpen(true);
  };
  const LoaderClose = () => {
    setLoOpen(false);
  };
  // const handleChange = (e) => {
  //   setFormData(e.formData);

  // };

  // const handleAddNew = () => {
  //   const newData = [...formData, {}];
  //   setFormData(newData);

  // };

  const updateFormData = async () => {
    const data = {
      client_id : client_id,
      user_id : user_id,
      path: view_path,
      form_data: formData,
      location,
      year,
      month
    }

    const url = `${process.env.BACKEND_API_URL}/datametric/update-fieldgroup`
    try{
      const response = await axiosInstance.post(url,data);

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

      }else {
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
      setFormData([{}])
      const url = `${process.env.BACKEND_API_URL}/datametric/get-fieldgroups?path_slug=${view_path}&client_id=${client_id}&user_id=${user_id}&location=${location}&year=${year}&month=${month}`;
      try {
          const response = await axiosInstance.get(url);
          console.log('API called successfully:', response.data);
          setRemoteSchema(response.data.form[0].schema);
          setRemoteUiSchema(response.data.form[0].ui_schema);
          const form_parent = response.data.form_data;
          setFormData(form_parent[0].data);
      } catch (error) {
          console.error('API call failed:', error);
      } finally {
          LoaderClose();
      }
  };
  //Reloading the forms -- White Beard
  useEffect(() => {
    //console.long(r_schema, '- is the remote schema from django), r_ui_schema, '- is the remote ui schema from django')
  },[r_schema, r_ui_schema])

  // console log the form data change
  useEffect(() => {
    console.log('Form data is changed -', formData)
  },[formData])

  // fetch backend and replace initialized forms
  useEffect (()=> {
    if (location && year && month) {
        loadFormData();
        toastShown.current = false; // Reset the flag when valid data is present
    } else {
        // Only show the toast if it has not been shown already
       if (!toastShown.current) {

            toastShown.current = true; // Set the flag to true after showing the toast
        }
    }
  },[location, year, month])

  const handleChange = (e) => {
    const newData = e.formData.map((item, index) => ({
      ...item, // Ensure each item retains its structure
    }));
    setFormData(newData); // Update the formData with new values
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
                  scopes="ps1"
                  setFormData={updateFormDatanew}
                />
              )

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

      <div className="flex justify-start mt-4 right-1">
        <button type="button" className="text-[#007EEF] text-[12px] flex cursor-pointer mt-5 mb-5" onClick={handleAddNew}>
          <MdAdd className='text-lg' /> Add Row
        </button>
      </div>
      <div className='mb-4'>
      <button type="button"  className=" text-center py-1 text-sm w-[100px] bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline float-end" onClick={handleSubmit}>Submit</button>
      </div>

    </>
  );
};

export default Productsservices;
