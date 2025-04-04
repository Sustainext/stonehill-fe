
'use client'
import React, { useState,useEffect,useRef } from 'react';
import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';
import { MdInfoOutline } from "react-icons/md";
import { Tooltip as ReactTooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import CustomTableWidget5 from '../../../../../shared/widgets/Table/tableWidget5';
import axios from 'axios';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Oval } from 'react-loader-spinner';

const widgets = {
    TableWidget: CustomTableWidget5,
};

const view_path = 'gri-social-employee_hires-401-1a-new_emp_hire-temp_emp'
const client_id = 1
const user_id = 1

const schema = {
    type: 'array',
    items: {
        type: 'object',
        properties: {
            yearsold30: { type: "number", title: "< 30 years old" },
            yearsold30to50: { type: "number", title: "30 - 50 years old" },
            yearsold50: { type: "number", title: "> 50 years old" },
            total: { type: "number", title: "Total" },

        },
    },
};

const uiSchema = {
    "ui:widget": "TableWidget",
    'ui:options': {
        titles: [
            { key: "yearsold30", title: "< 30 years old"},
            { key: "yearsold30to50", title: "30 - 50 years old"},
            { key: "yearsold50", title: "> 50 years old"},

        ],
        rowLabels: [
            {title:"Male"},
            {title:"Female"},
            {title:"Others"},

        ]
    },
};


const Tab2 = ({
    fullName,
    year,
    month,
    selectedOrg,
    selectedCorp,
    togglestatus,
  }) => {
    const initialFormData = [
      { yearsold30: "", yearsold30to50: "", yearsold50: "", total: 0 },
      { yearsold30: "", yearsold30to50: "", yearsold50: "", total: 0 },
      { yearsold30: "", yearsold30to50: "", yearsold50: "", total: 0 },
    ];
    const [formData, setFormData] = useState(initialFormData);
    const [r_schema, setRemoteSchema] = useState({});
    const [r_ui_schema, setRemoteUiSchema] = useState({});
    const [loopen, setLoOpen] = useState(false);
    const toastShown = useRef(false);
  
    const getAuthToken = () => {
      if (typeof window !== "undefined") {
        return localStorage.getItem("token")?.replace(/"/g, "");
      }
      return "";
    };
    const token = getAuthToken();
    const LoaderOpen = () => {
      setLoOpen(true);
    };
    const LoaderClose = () => {
      setLoOpen(false);
    };
  
    const handleChange = (e) => {
      setFormData(e.formData); // Ensure you are extracting formData from the event
    };
  
    // The below code on updateFormData
    let axiosConfig = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    const updateFormData = async () => {
      LoaderOpen();
      const data = {
        client_id: client_id,
        user_id: user_id,
        path: view_path,
        form_data: formData,
        corporate: selectedCorp,
        organisation: selectedOrg,
        year,
        month,
      };
  
      const url = `${process.env.BACKEND_API_URL}/datametric/update-fieldgroup`;
      try {
        const response = await axios.post(url, data, axiosConfig);
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
      setFormData(initialFormData);
      const url = `${process.env.BACKEND_API_URL}/datametric/get-fieldgroups?path_slug=${view_path}&client_id=${client_id}&user_id=${user_id}&corporate=${selectedCorp}&organisation=${selectedOrg}&year=${year}&month=${month}`;
      try {
        const response = await axios.get(url, axiosConfig);
        console.log("API called successfully:", response.data);
        setRemoteSchema(response.data.form[0].schema);
        setRemoteUiSchema(response.data.form[0].ui_schema);
        setFormData(response.data.form_data[0].data);
      } catch (error) {
        setFormData(initialFormData);
      } finally {
        LoaderClose();
      }
    };
  
 useEffect(() => {
    if (selectedOrg && year && month && togglestatus) {
      if (togglestatus === "Corporate" && selectedCorp) {
        loadFormData(); 
      } else if (togglestatus === "Corporate" && !selectedCorp) {
         setFormData(initialFormData);
        setRemoteSchema({});
        setRemoteUiSchema({});
      } else {
        loadFormData(); 
      }
  
      toastShown.current = false; 
    } else {
    
      if (!toastShown.current) {
        toastShown.current = true; 
      }
    }
  }, [selectedOrg, year, selectedCorp, togglestatus,month]);
  
    const handleSubmit = (e) => {
      e.preventDefault();
      console.log("Form data:", formData);
      updateFormData();
    };
  
    return (
      <>
        <div className="pb-11 rounded-md">
          <Form
            schema={r_schema}
            uiSchema={r_ui_schema}
            formData={formData}
            onChange={handleChange}
            validator={validator}
            formContext={{ newMonth: fullName }}
            widgets={widgets}
          />
         <div className="mt-4">
          <button
            type="button"
            className={`text-center py-1 text-sm w-[100px] bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline float-end ${
              (!selectedCorp && togglestatus === "Corporate") ||
              !selectedOrg ||
              !year ||!month
                ? "cursor-not-allowed opacity-90"
                : ""
            }`}
            onClick={handleSubmit}
            disabled={
              (togglestatus === "Corporate" && !selectedCorp) ||
              (togglestatus !== "Corporate" && (!selectedOrg || !year ||!month))
            }
          >
            Submit
          </button>
        </div>
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

export default Tab2;
