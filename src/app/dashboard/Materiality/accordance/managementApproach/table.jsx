import React, { useState, useEffect, useRef } from "react";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import { MdAdd, MdOutlineDeleteOutline, MdInfoOutline } from "react-icons/md";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Oval } from "react-loader-spinner";
import { GlobalState } from "@/Context/page";
import axiosInstance from '@/app/utils/axiosMiddleware';
import MaterialityTableWidget from "../../../../shared/widgets/Table/materialityTableWidget";

const widgets = {
  MaterialityTableWidget: MaterialityTableWidget
};

const view_path = "gri-governance-critical_concerns-2-16-a-critical_concerns";
const client_id = 1;
const user_id = 1;

const Table = ({ selectedOrg, year, selectedCorp,setTableDataSubmit,tableDataSubmit }) => {
  const assessment_id = typeof window !== 'undefined' ?localStorage.getItem("id"):'';
  const [materialTopics, setMaterialTopics] = useState([]);
  const [dataPresent,setDatapresent]=useState(false)
  const [formData, setFormData] = useState([
    {
      MaterialTopic: "",
      ImpactType: "",
      ImpactOverview: "",
    },
  ]);
  const [loopen, setLoOpen] = useState(false);

  const LoaderOpen = () => {
    setLoOpen(true);
};

const LoaderClose = () => {
    setLoOpen(false);
};
  
  // Fetch material topics from API
  const fetchMaterialTopics = async () => {
    LoaderOpen()
    const url = `${process.env.BACKEND_API_URL}/materiality_dashboard/selected-material-topics/${assessment_id}/`;
    try {
      const response = await axiosInstance.get(url);
      if (response.status === 200) {
        LoaderClose()
        setMaterialTopics(response.data);
      }
    } catch (error) {
      LoaderClose()
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
    }
  };

  const fetchData=async()=>{
    LoaderOpen()
    const url = `${process.env.BACKEND_API_URL}/materiality_dashboard/materiality-impact/${assessment_id}/`;
    try {
      const response = await axiosInstance.get(url);
      if (response.status === 200) {
        LoaderClose()
        if(response.data.length>0){
          const arr=[]
        response.data.map((val)=>{
          const obj={
            MaterialTopic: val.material_topic,
            ImpactType: val.impact_type,
            ImpactOverview: val.impact_overview,
          }
          arr.push(obj)
        })
        setFormData(arr)
        setDatapresent(true)
        }
       
      }
    } catch (error) {
      LoaderClose()
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
    }
  }

  useEffect(() => {
    fetchMaterialTopics();
    fetchData()
  }, []);

  const schema = {
    type: "array",
    items: {
      type: "object",
      properties: {
        MaterialTopic: {
          // type: "number",
          title: "Material Topic",
          // enum: materialTopics.map(topic => topic.topic.id), // Store topic IDs in enum
        },
        ImpactType: {
          type: "string",
          title: "Impact Type",
          // enum: ["Positive Impact", "Negative Impact"],
        },
        ImpactOverview: {
          type: "string",
          title: "Impact Overview (if any)",
        },
      },
    },
  };

  const uiSchema = {
    "ui:widget": "MaterialityTableWidget",
    "ui:options": {
      titles: [
        {
          key: "MaterialTopic",
          title: "Material Topic",
          tooltip: "Specify name of the material topic.",
          // type:"number"
        },
        {
          key: "ImpactType",
          title: "Impact Type",
          tooltip: "Indicate if a topic is material to the organisation because of negative impacts, positive impacts, or both.",
          type:"string"
        },
        {
          key: "ImpactOverview",
          title: "Impact Overview (if any)",
          tooltip: "Provide an overview of the impact for the mentioned material topic.",
          type:"string"
        },
      ],
      materialTopics: materialTopics, // Pass the fetched material topics to the widget
    },
  };

  const handleChange = (e) => {
    setFormData(e.formData);
  };

  // const handleRemoveCommittee = (index) => {
  //   const newFormData = formData.filter((_, i) => i !== index);
  //   setFormData(newFormData);
  // };

  const handleRemoveCommittee = (index) => {
    const newFormData = formData.filter((_, i) => i !== index);
    // Ensure that we always have at least one row with default values
    if (newFormData.length === 0) {
      newFormData.push({
        MaterialTopic: "", 
        ImpactType: "", 
        ImpactOverview: "",
      });
    }
    setFormData(newFormData);
  };
  
  
 
  
  const handleAddCommittee = () => {
    const newCommittee = {
      MaterialTopic: "",
      ImpactType: "",
      ImpactOverview: "",
    };
    setFormData([...formData, newCommittee]);
  };

  const transformFormData = (data) => {
    return data.map((item) => ({
      assessment: assessment_id, // Static value for assessment
      material_topic: parseInt(item.MaterialTopic, 10), // Convert MaterialTopic to material_topic as an integer
      impact_type: item.ImpactType, // Map ImpactType to impact_type
      impact_overview: item.ImpactOverview // Map ImpactOverview to impact_overview
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const transformedData = transformFormData(formData);
    
  const url = dataPresent?`${process.env.BACKEND_API_URL}/materiality_dashboard/materiality-impact/${assessment_id}/edit/`:`${process.env.BACKEND_API_URL}/materiality_dashboard/materiality-impact/create/`
try {
  const response = dataPresent?await axiosInstance.put(url,transformedData):await axiosInstance.post(url,transformedData);
  
  if(response.status>=200&&response.status<300){
    toast.success("Data submitted", {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    setTableDataSubmit(true)
  }
  else{
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
  }
  
  }
 
catch (error) {
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
}
    
  };

  

  return (
    <>
      <div className="p-3 mb-6 pb-6 rounded-md shadow-lg mx-4 mt-10">
      <div className="xl:mb-4 md:mb-4 2xl:mb-4 lg:mb-4 4k:mb-4 2k:mb-4 mb-6 block xl:flex lg:flex md:flex 2xl:flex 4k:flex 2k:flex">
          <div className="w-[100%] xl:w-[80%] lg:w-[80%] md:w-[80%] 2xl:w-[80%] 4k:w-[80%] 2k:w-[80%] relative  xl:mb-0 lg:mb-0 md:mb-0 2xl:mb-0 4k:mb-0 2k:mb-0">
            <h2 className="flex mx-2 text-[15px] ">
            Describe actual and potential, negative and positive impacts on the economy, environment and people including impacts on their human rights.
              <MdInfoOutline
                data-tooltip-id="tooltip-$e86" 
                data-tooltip-html={`
                  <p>Impact: Effect the organization has or could have on the economy including 
on their human rights, which in turn can indicate its contribution 
(negative or positive) to sustainable development.
</p>
                  <p>Human rights: Rights inherent to all human beings, which include, at a 
minimum, the rights set out in the United Nations (UN) 
International Bill of Human Rights and the principles concerning 
fundamental rights set out in the International Labour Organization 
(ILO) Declaration on Fundamental Principles and Rights at Work.</p>
                `}
                className="mt-1.5 ml-2 text-[15px] w-[10%] xl:w-[5%] md:w-[5%] lg:w-[5%] 2xl:w-[5%] 3xl:w-[5%] 4k:w-[5%] 2k:w-[5%]"
              />
              <ReactTooltip
                id="tooltip-$e86"
                place="bottom"
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
            </h2>
          </div>

          <button className="text-[#007EEF] bg-slate-200 rounded-md text-[11px] w-[72px] h-[22px] xl:ml-6 ml-2 text-center ">
            GRI-3-3-a
          </button>
        </div>
        <div className="mx-2 mb-4">
          <Form
            schema={schema}
            uiSchema={uiSchema}
            formData={formData}
            onChange={handleChange}
            validator={validator}
            widgets={widgets}
            formContext={{
              onRemove: handleRemoveCommittee,
            }}
          />
        </div>
        <div className="flex justify-between">
          <div className="flex right-1 mx-2 border-gray-200">
            <button
              type="button"
              className={` text-[13px] flex  mt-5 mb-2 mx-2 ${materialTopics.length!=0?"text-[#007EEF] cursor-pointer":"text-gray-300"}`}
              onClick={handleAddCommittee}
              disabled={materialTopics.length==0}
            >
              Add row <MdAdd className="text-lg" />
            </button>
          </div>
          <div>
            <button
              type="button"
              className={`mt-5 text-center py-1 text-sm w-[100px] ${materialTopics.length === 0 ||
                (materialTopics.length > 0 &&
                 (!formData[0].MaterialTopic || !formData[0].ImpactType))
?"bg-gray-200":"bg-blue-500 text-white hover:bg-blue-600"} rounded  focus:outline-none focus:shadow-outline`}
              onClick={handleSubmit}
              disabled={
                materialTopics.length === 0 ||
                (materialTopics.length > 0 &&
                 (!formData[0].MaterialTopic || !formData[0].ImpactType))
              }
              
            >
              Submit
            </button>
          </div>
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

export default Table;
