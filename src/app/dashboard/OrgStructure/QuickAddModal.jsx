import React, { useState, useEffect } from "react";
// Removed unused import
import industryList from "@/app/shared/data/sectors";
import { post } from "@/app/utils/axiosMiddleware";
import { useRouter } from "next/navigation";
import { showToast } from "@/app/utils/toastUtils";
import axiosInstance from "../../utils/axiosMiddleware";
import SearchableCityDropdown from "./forms/SearchableCityDropdown";
import Cookies from "js-cookie";
const INITIAL_FORM_STATE = {
  name: "",
  country: "",
  state: "",
  city: "",
  sector: "",
  subIndustry: "",
  locationType: "",
};

const QuickAddModal = ({ isOpen, onClose, type, parentName }) => {
  const router = useRouter();
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [subIndustries, setSubIndustries] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [countriesids, setCountriesids] = useState();
  const [statesids, setStatesids] = useState();
  const [selectedCountry, setSelectedCountry] = useState(``);
  const [selectedState, setSelectedState] = useState(``);
  // Removed unused selectedCity state
  let brsrFrameworkId = Cookies.get('selected_brsr_framework_id') || 0
  const handleCancel = () => {
    setFormData(INITIAL_FORM_STATE);
    setFormErrors({});
    setSubIndustries([]);
    setStates([]);
    setCities([]);
    setSelectedCountry(``);
    onClose();

  };
  const handleAddCity = async (cityName) => {
    console.log("handleAddCity called with:", cityName);
    console.log("statesids:", statesids);
    
    if (!statesids) {
      showToast("Please select a state before adding a city.", "error");
      throw new Error("State not selected");
    }
    
    try {
      // API request to create a new city
      const response = await axiosInstance.post("geo_data/cities/create/", {
        city_name: cityName,
        state: statesids,
      });

      // Assuming the response contains the newly created city object
      const newCity = response.data;

      // Add the newly created city to the state
      setCities((prevCities) => [...prevCities, newCity]);

      // Show a success toast message
      showToast("City added successfully!");

      // Return the newly added city (optional)
      return newCity;
    } catch (error) {
      console.error("Error adding city:", error);
      // Show an error toast message
      showToast("Failed to add city. Please try again.", "error");
      // Handle error accordingly
      throw new Error("Failed to add city");
    }
  };
  useEffect(() => {
    const loadCountries = async () => {
      try {
        const response = await axiosInstance.get("/geo_data/countries/");
        setCountries(response.data);
      } catch (error) {
        console.error("Failed to load countries:", error);
      }
    };

    loadCountries();
  }, []);
  useEffect(() => {
    const fetchStates = async () => {
      if (type === "location" && countriesids) {
        try {
          const response = await axiosInstance.get(
            `/geo_data/states/?country_id=${countriesids}`
          );
          setStates(response.data);
          setCities([]);
          setFormData((prev) => ({ ...prev, state: "", city: "" }));
        } catch (err) {
          console.error("Failed to fetch states:", err);
        }
      }
    };

    fetchStates();
  }, [countriesids, type]);
  useEffect(() => {
    const fetchCities = async () => {
      if (type === "location" && statesids) {
        try {
          const response = await axiosInstance.get(
            `/geo_data/cities/?state_id=${statesids}`
          );
          setCities(response.data);
          setFormData((prev) => ({ ...prev, city: "" }));
        } catch (err) {
          console.error("Failed to fetch cities:", err);
        }
      }
    };

    fetchCities();
  }, [statesids, type]);

  // useEffect(() => {
  //   // Only handle state/city updates for location type
  //   if (type === "location" && formData.country) {
  //     const statesOfCountry = State.getStatesOfCountry(formData.country);
  //     setStates(statesOfCountry);
  //     setCities([]);
  //     setFormData((prev) => ({ ...prev, state: "", city: "" }));
  //   }
  // }, [formData.country, type]);

  // useEffect(() => {
  //   // Only handle city updates for location type
  //   if (type === "location" && formData.country && formData.state) {
  //     const citiesOfState = City.getCitiesOfState(
  //       formData.country,
  //       formData.state
  //     );
  //     setCities(citiesOfState);
  //     setFormData((prev) => ({ ...prev, city: "" }));
  //   }
  // }, [formData.state, type]);

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));

  //   // Clear error when field is changed
  //   setFormErrors((prev) => ({
  //     ...prev,
  //     [name]: "",
  //   }));

  //   if (name === "sector") {
  //     const selectedIndustry = industryList.find(
  //       (industry) => industry.industry === value
  //     );
  //     setSubIndustries(selectedIndustry?.subIndustries || []);
  //   }
  // };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log("handleInputChange:", name, value);

    if (name === "country") {
      const [countryId, countryCode] = value.split(":");
      const selectedCountryObj = countries.find(c => c.id === parseInt(countryId));
      console.log("Country selected:", countryId, countryCode, selectedCountryObj?.country_name);
      setCountriesids(countryId);
      setSelectedCountry(value);
      setFormData((prev) => ({
        ...prev,
        country: selectedCountryObj?.country_name || countryCode,
        state: "",
        city: "",
      }));
    } else if (name === "state") {
      const [stateId, stateName] = value.split(":");
      console.log("State selected:", stateId, stateName);
      setStatesids(stateId);
      setSelectedState(value);
      setFormData((prev) => ({
        ...prev,
        state: stateName,
        city: "",
      }));
    } else if (name === "city") {
      // Handle city selection if needed
      console.log("City selected:", value);
    } 
    else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    setFormErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    if (name === "sector") {
      const selectedIndustry = industryList.find(
        (industry) => industry.industry === value
      );
      setSubIndustries(selectedIndustry?.subIndustries || []);
    }
  };

  const validateForm = () => {
    console.log("validateForm called with formData:", formData);
    const errors = {};

    if (!formData.name.trim()) {
      console.log("Name validation failed");
      errors.name = "Name is required";
    }
    if (!formData.country) {
      console.log("Country validation failed");
      errors.country = "Country is required";
    }

    if (!formData.sector && (type === "corporate" || type === "organization")) {
      errors.sector = "Sector is required";
    }

    if(brsrFrameworkId ==4 && !formData.email && type !== "location"){
      errors.email = "E-mail is required";
    }
    if(formData.email){
      if(!(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email))){
          errors.email = "Please enter a valid email address";
      }
    }


    if (type === "corporate") {
      if (!formData.subIndustry) {
        errors.subIndustry = "Sub Industry is required";
      }
    }

    if (type === "location") {
      if (!formData.state) {
        console.log("State validation failed");
        errors.state = "State is required";
      }
      if (!formData.city) {
        console.log("City validation failed");
        errors.city = "City is required";
      }
    }

    console.log("Validation errors:", errors);
    setFormErrors(errors);
    const isValid = Object.keys(errors).length === 0;
    console.log("Form is valid:", isValid);
    return isValid;
  };

  const handleAddMoreDetails = () => {
    onClose();
    switch (type) {
      case "organization":
        router.push("/dashboard/OrgStructure/forms/Organization");
        break;
      case "corporate":
        router.push("/dashboard/OrgStructure/forms/Entity");
        break;
      case "location":
        router.push("/dashboard/OrgStructure/forms/Location");
        break;
    }
  };

  const handleSubmit = async () => {
    console.log("handleSubmit called");
    console.log("Current formData:", formData);
    console.log("Validation check...");
    
    if (!validateForm()) {
      console.log("Validation failed, form errors:", formErrors);
      return;
    }
    
    console.log("Validation passed, proceeding with submission...");

    let endpoint = "";
    let payload = {};
    let entityType = "";

    switch (type) {
      case "organization":
        endpoint = "/organization";
        entityType = "Organization";
        // payload = {
        //   name: formData.name,
        //   countryoperation: formData.country,
        //   sector: formData.sector,
        //   type_corporate_entity: "Office",
        //   owner: "Default",
        //   phone: 9876543210,
        //   mobile: 9876543210,
        //   website: "https://www.sustainext.ai",
        //   fax: 234567,
        //   employeecount: 100,
        //   revenue: 100000,
        //   date_format: "mm/dd/yyyy",
        //   currency: "USD",
        //   timezone: "+00:00",
        //   language: "English",
        //   active: true,
        //   framework: "GRI",
        //   subindustry: formData.subIndustry || "Default",
        //   address: formData.address || "Bengaluru",
        //   state: formData.state || "Karnataka",
        //   city: formData.city || "Bengaluru",
        //   from_date: formData.from_date || null,
        //   to_date: formData.to_date || null,
        //   no_of_employees: 100,
        //   amount: null,
        //   ownership_and_legal_form: null,
        //   group: null,
        //   type_of_corporate_entity: formData.type || "Default",
        //   location_of_headquarters: formData.location || "Bengaluru",
        //   sub_industry: "Default",
        //   type_of_business_activities: null,
        //   type_of_product: null,
        //   type_of_services: null,
        //   sdg: "SDG1",
        //   rating: "rating1",
        //   certification: null,
        //   target: null,
        //   username: "mahinder.singh@sustainext.ai",
        // };
        payload = {
          name: formData.name || "Entity 1",
          type_corporate_entity: "Not Specified",
          owner: "",
          location_of_headquarters: "Not Specified",
          phone: 9999999999,
          mobile: "",
          website: "Not Provided",
          fax: "",
          employeecount: 0,
          revenue: 0,
          email:formData.email || "",
          sector: formData.sector || "General",
          subindustry: formData.subIndustry || "General",
          address: formData.address || "Not Provided",
          country: formData.country || "N/A",
          state: formData.state || "N/A",
          city: formData.city || "N/A",
          date_format: "YYYY/MM/DD",
          currency: "USD",
          timezone: "UTC",
          from_date: formData.from_date || null,
          to_date: formData.to_date || null,
          sdg: [],
          rating: [],
          certification: [],
          target: [],
          framework: [1],
          // language: data.generalDetails.language || 'English',
          // active: true,
          // no_of_employees: 100,
          // amount: null,
          // ownership_and_legal_form: null,
          // group: null,
          // type_of_corporate_entity: data.generalDetails.type || 'Default',
          // sub_industry: 'General',
          // type_of_business_activities: null,
          // type_of_product: null,
          // type_of_services: null,
          // username: 'mahinder.singh@sustainext.ai',
        };
        break;

      case "corporate":
        endpoint = "/corporate";
        entityType = "Corporate entity";
        // payload = {
        //   name: formData.name,
        //   Country: formData.country,
        //   sector: formData.sector,
        //   subindustry: formData.subIndustry,
        //   organization: parentNode.name,
        //   corporatetype: "Default",
        //   ownershipnature: "Default",
        //   location_headquarters: "Default",
        //   phone: 9876543210,
        //   mobile: 9876543210,
        //   website: "https://www.sustainext.ai",
        //   fax: 234567,
        //   employeecount: 100,
        //   revenue: 100000,
        //   currency: "USD",
        //   timezone: "+00:00",
        //   language: "English",
        //   date_format: "mm/dd/yyyy",
        //   framework: "GRI: With reference to",
        // };

        payload = {
          name: formData.name || "Test Corp",
          corporatetype: "Not Specified",
          ownershipnature: "",
          email:formData.email || "",
          location_headquarters: "Not Specified",
          phone: 9999999999,
          mobile: "",
          website: "Not Provided",
          fax: "",
          employeecount: 0,
          revenue: 0,
          organization: parentName.id,
          sector: formData.sector || "General",
          subindustry: formData.subIndustry || "General",
          address: "Not Provided",
          country: formData.country || "N/A",
          state: "N/A",
          city: "N/A",
          // zipcode:  null,
          date_format: "YYYY/MM/DD",
          currency: "USD",
          timezone: "UTC",
          from_date: null,
          to_date: null,
          // legalform: "1",
          // ownership:  "",
          // group: null,
          // location_of_headquarters: "Not Specified",
          // amount: null,
          // type_of_business_activities: null,
          // type_of_product: null,
          // type_of_services: null,
          // type_of_business_relationship: null,
          framework: [1],
          sdg: [],
          rating: [],
          certification: [],
          target: [],
        };
        break;

      case "location":
        endpoint = "/locationonlyview";
        entityType = "Location";
        console.log("Setting up location payload...");
        // payload = {
        //   name: formData.name,
        //   typelocation: formData.locationType,
        //   country: formData.country,
        //   state: formData.state,
        //   city: formData.city,
        //   corporateentity: parentName.name,
        //   currency: "USD",
        //   dateformat: "mm/dd/yyyy",
        //   phone: 9876543210,
        //   mobile: 9876543210,
        //   website: "https://www.sustainext.ai",
        //   fax: 234567,
        //   timezone: "+00:00",
        //   employeecount: 100,
        //   language: "English",
        //   revenue: 100000,
        //   area: 56775,
        // };

        payload = {
          corporateentity: parentName.id,
          name: formData.name || "Location 1",
          phone: 9999999999,
          mobile: "",
          website: "Not Provided",
          fax: "",
          employeecount: 0,
          revenue: 0,
          sector: "General",
          sub_industry: "General",
          streetaddress: "Not Provided",
          zipcode: "N/A",
          state: formData.state || "N/A",
          city: formData.city || "N/A",
          country: formData.country || "N/A",
          latitude: null,
          longitude: null,
          timezone: "UTC",
          currency: "USD",
          dateformat: "YYYY/MM/DD",
          from_date: null,
          to_date: null,
          language: "English",
          location_type: formData.locationType || "Default",
        };
        break;
    }

    console.log("Making API call to:", endpoint);
    console.log("Payload:", payload);
    
    try {
      const response = await post(endpoint, payload);
      console.log("API response:", response);
      showToast(`${entityType} added successfully`);
      onClose();
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      const message =
        error?.response?.data?.message[0] ||
        `Failed to add ${entityType.toLowerCase()}`;
      showToast(message, "error");
      console.error("Error adding:", error);
    }
  };

  const renderLocationFields = () => {
    if (type !== "location") return null;

    return (
      <>
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location Type
          </label>
          <input
            type="text"
            name="locationType"
            value={formData.locationType}
            onChange={handleInputChange}
            className={`w-full border ${
              formErrors.locationType ? "border-red-500" : "border-gray-300"
            } rounded-md p-2 text-sm`}
            placeholder="Type"
          />
          {formErrors.locationType && (
            <p className="text-red-500 text-xs mt-1">
              {formErrors.locationType}
            </p>
          )}
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Country *
          </label>
          <select
            name="country"
            value={selectedCountry}
            onChange={handleInputChange}
            className={`w-full border ${
              formErrors.country ? "border-red-500" : "border-gray-300"
            } rounded-md p-2 text-sm`}
          >
            <option value="">Select Country</option>
            {countries.map((country) => (
              <option
                key={country.id}
                value={`${country.id}:${country.sortname}`}
              >
                {country.country_name}
              </option>
            ))}
          </select>
          {formErrors.country && (
            <p className="text-red-500 text-xs mt-1">{formErrors.country}</p>
          )}
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State *
          </label>
          <select
            name="state"
            value={selectedState}
            onChange={handleInputChange}
            className={`w-full border ${
              formErrors.state ? "border-red-500" : "border-gray-300"
            } rounded-md p-2 text-sm`}
            disabled={!formData.country}
          >
            <option value="">Select State</option>
            {states.map((state) => (
              <option key={state.id} value={`${state.id}:${state.state_name}`}>
                {state.state_name}
              </option>
            ))}
          </select>
          {formErrors.state && (
            <p className="text-red-500 text-xs mt-1">{formErrors.state}</p>
          )}
        </div>

        <div className="mb-4">
          {console.log("QuickAddModal - cities:", cities.length, "statesids:", statesids, "disabled:", !statesids)}
          <SearchableCityDropdown
            cities={cities}
            selectedCity={formData.city} // Directly bind to formData.city
            onSelectCity={(cityName) => {
              console.log("onSelectCity called with:", cityName);
              setFormData((prevFormData) => ({
                ...prevFormData,
                city: cityName, // Directly update city in the form data
              }));
            }}
            onAddCity={handleAddCity}
            disabled={!statesids}
            error={formErrors.city }
          />

          {/* <label className="block text-sm font-medium text-gray-700 mb-1">
            City *
          </label>
          <select
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            className={`w-full border ${
              formErrors.city ? "border-red-500" : "border-gray-300"
            } rounded-md p-2 text-sm`}
            disabled={!formData.state}
          >
            <option value="">Select City</option>
            {cities.map((city) => (
              <option key={city.id} value={city.city_name}>
                {city.city_name}
              </option>
            ))}
          </select>
          {formErrors.city && (
            <p className="text-red-500 text-xs mt-1">{formErrors.city}</p>
          )} */}
        </div>
      </>
    );
  };

  const renderParentInfo = () => {
    if (type === "organization") return null;

    console.log("renderParentInfo - type:", type, "parentName:", parentName);

    return (
      <div className="mb-4">
        {type === "location" ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-start sm:space-x-6 space-y-4 sm:space-y-0">
            <div className="flex flex-col">
              <div className="text-sm text-gray-600 mb-1">Organization</div>
              <div className="inline-block px-3 py-1 rounded-md text-sm bg-blue-100 text-blue-800">
                {parentName.organization || "N/A"}
              </div>
            </div>
            <div className="flex flex-col">
              <div className="text-sm text-gray-600 mb-1">Corporate Entity</div>
              <div className="inline-block px-3 py-1 rounded-md text-sm bg-green-100 text-green-800">
                {parentName.name || "N/A"}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="text-sm text-gray-600 mb-2">Organization</div>
            <div className="inline-block px-3 py-1 rounded-md text-sm bg-blue-100 text-blue-800">
              {parentName.name}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[480px] max-h-[90vh] table-scrollbar overflow-y-auto">
        <h2 className="text-xl font-medium mb-1">
          Quick Add {type.charAt(0).toUpperCase() + type.slice(1)}
        </h2>
        <p className="text-gray-600 text-sm mb-6">
          Add {type} quickly with just the necessary details
        </p>

        {renderParentInfo()}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {type.charAt(0).toUpperCase() + type.slice(1)} Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`w-full border ${
              formErrors.name ? "border-red-500" : "border-gray-300"
            } rounded-md p-2 text-sm`}
            placeholder="Name"
          />
          {formErrors.name && (
            <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
          )}
        </div>

       {type !=='location' && (
         <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {type.charAt(0).toUpperCase() + type.slice(1)} E-mail {brsrFrameworkId ==4 && <span>*</span>}
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full border ${
              formErrors.email ? "border-red-500" : "border-gray-300"
            } rounded-md p-2 text-sm`}
            placeholder="E-mail"
          />
          {formErrors.email && (
            <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
          )}
        </div>
       )}

        {renderLocationFields()}

        {type !== "location" && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country *
            </label>
            <select
              name="country"
              value={selectedCountry}
              onChange={handleInputChange}
              className={`w-full border ${
                formErrors.country ? "border-red-500" : "border-gray-300"
              } rounded-md p-2 text-sm`}
            >
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option
                  key={country.id}
                  value={`${country.id}:${country.sortname}`}
                >
                  {country.country_name}
                </option>
              ))}
            </select>
            {formErrors.country && (
              <p className="text-red-500 text-xs mt-1">{formErrors.country}</p>
            )}
          </div>
        )}

        {(type === "organization" || type === "corporate") && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sector *
              </label>
              <select
                name="sector"
                value={formData.sector}
                onChange={handleInputChange}
                className={`w-full border ${
                  formErrors.sector ? "border-red-500" : "border-gray-300"
                } rounded-md p-2 text-sm`}
              >
                <option value="">Select Sector</option>
                {industryList.map((industry) => (
                  <option key={industry.id} value={industry.value}>
                    {industry.industry}
                  </option>
                ))}
              </select>
              {formErrors.sector && (
                <p className="text-red-500 text-xs mt-1">{formErrors.sector}</p>
              )}
            </div>

            {type === "corporate" && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sub Industry *
                </label>
                <select
                  name="subIndustry"
                  value={formData.subIndustry}
                  onChange={handleInputChange}
                  className={`w-full border ${
                    formErrors.subIndustry
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md p-2 text-sm`}
                  disabled={!formData.sector}
                >
                  <option value="">Select Sub Industry</option>
                  {subIndustries.map((subIndustry) => (
                    <option key={subIndustry.id} value={subIndustry.value}>
                      {subIndustry.subIndustry}
                    </option>
                  ))}
                </select>
                {formErrors.subIndustry && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.subIndustry}
                  </p>
                )}
              </div>
            )}
          </>
        )}

        <button
          onClick={handleAddMoreDetails}
          className="text-blue-600 text-sm hover:text-blue-700 mb-6 flex items-center"
        >
          <span>Add More Details</span>
          <span className="ml-1">→</span>
        </button>

        <div className="flex justify-end space-x-3">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickAddModal;