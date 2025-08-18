"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Country, State, City } from "country-state-city";
import { FiArrowLeft } from "react-icons/fi";
import industryList from "../../../../shared/data/sectors";
import { timeZones } from "../../../../shared/data/timezones";
import axiosInstance, {
  patch,
  post,
  put,
} from "../../../../utils/axiosMiddleware";
import { Currency } from "../../../../shared/data/currency";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SearchableCityDropdown from "../SearchableCityDropdown";
const dateFormatOptions = [
  { label: "MM/DD/YYYY", value: "MM/DD/YYYY" },
  { label: "DD/MM/YYYY", value: "DD/MM/YYYY" },
  { label: "YYYY/MM/DD", value: "YYYY/MM/DD" },
];

const reportFramework = ["GRI"];

const initialState = {
  generalDetails: {
    name: "",
    email: "",
    phone: "",
    website: "",
    typelocation: "",
    location: "",
    Empcount: "",
    revenue: "",
    mobile: "",
    fax: "",
    sector: "",
    subIndustry: "",
    corporateEntity: "",
    timeZone: "",
    language: "",
    dateFormat: "",
  },
  addressInformation: {
    country: "",
    state: "",
    city: "",
    street: "",
    zipCode: "",
    latitude: "",
    longitude: "",
  },
  reportingPeriodInformation: {
    fromDate: "",
    toDate: "",
    reportingFramework: "",
  },
  errors: {
    latitude: "",
    longitude: "",
  },
};

const Location = ({ heading }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryData = searchParams.get("data");

  const [formData, setFormData] = useState(initialState);
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [subIndustries, setSubIndustries] = useState([]);
  const [corporates, setCorporates] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(``);
  const [selectedState, setSelectedState] = useState(``);
  const [selectedCity, setSelectedCity] = useState("");
  const [newselectedCountry, setnewSelectedCountry] = useState(``);
  const [newselectedState, setnewSelectedState] = useState(``);
  const [selectedFrameworks, setSelectedFrameworks] = useState([]);
  const [isSameAsCorporate, setIsSameAsCorporate] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [selectedCorporateEntityDetails, setSelectedCorporateEntityDetails] =
    useState(null);
  const [editData, setEditData] = useState(null);
  console.log(formData, "formData");
  useEffect(() => {
    if (queryData) {
      try {
        const decodedData = decodeURIComponent(queryData);
        const parsedData = JSON.parse(decodedData);
        setEditData(parsedData);
        setFormData(parsedData);
      } catch (error) {
        console.error("Failed to parse query data:", error);
      }
    }
  }, [queryData]);

  const loadFormData = async () => {
    const url = `${process.env.BACKEND_API_URL}/geo_data/countries/`;
    try {
      const response = await axiosInstance.get(url);
      setCountries(response.data);
      console.log("API call data", response.data);
    } catch (error) {
      console.error("API call failed:", error);
    } finally {
    }
  };
  useEffect(() => {
    // const allCountries = Country.getAllCountries();
    // setCountries(allCountries);
    loadFormData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`/corporategetonly`);
        console.log("Corporates:", response.data);
        setCorporates(response.data);
      } catch (e) {
        console.log(
          "failed fetching organization",
          process.env.BACKEND_API_URL
        );
      }
    };

    fetchData();
  }, [heading]);

  const validateForm = () => {
    const errors = {};
    // General Details validation
    if (!formData.generalDetails?.name) {
      errors.name = "Name is required";
    }
    if (!formData.generalDetails?.corporateEntity && !editData) {
      errors.corporateEntity = "Corporate Entity is required";
    }

    if (!formData.generalDetails?.phone) {
      errors.phone = "Phone is required";
    }

    if (!formData.generalDetails?.website) {
      errors.website = "Website is required";
    }

    if (!formData.generalDetails?.Empcount) {
      errors.Empcount = "Employee Count is required";
    }

    if (!formData.generalDetails?.revenue) {
      errors.revenue = "Revenue is required";
    }

    if (!formData.generalDetails?.sector) {
      errors.sector = "Sector is required";
    }

    if (!formData.generalDetails?.subIndustry) {
      errors.subIndustry = "Sub Industry is required";
    }

    if (!formData.generalDetails?.currency) {
      errors.currency = "Currency is required";
    }

    // Address Information Validation
    if (!formData.addressInformation?.street) {
      errors.street = "Street Address is required";
    }

    if (!formData.addressInformation?.country) {
      errors.country = "Country is required";
    }

    if (!formData.addressInformation?.state) {
      errors.state = "State is required";
    }

    if (!formData.addressInformation?.city) {
      errors.city = "City is required";
    }

    if (!formData.addressInformation?.zipCode) {
      errors.zipCode = "Zip Code is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSectorChange = (event) => {
    const selectedSector = event.target.value;
    setSelectedIndustry(selectedSector);

    // Find the selected industry object
    const selectedIndustryObj = industryList.find(
      (industry) => industry.industry === selectedSector
    );

    // Get sub-industries and set them
    const subIndustriesForSector = selectedIndustryObj?.subIndustries || [];
    setSubIndustries(subIndustriesForSector);

    setValidationErrors((prev) => ({
      ...prev,
      sector: "",
      subIndustry: "",
    }));
    // Update form data
    setFormData((prevFormData) => ({
      ...prevFormData,
      generalDetails: {
        ...prevFormData.generalDetails,
        sector: selectedSector,
        // Reset subIndustry when sector changes
        subIndustry: "",
      },
    }));
  };

  const handleGeneralDetailsChange = (event) => {
    const { name, value } = event.target;
    if (name === "name" && value.includes("&")) {
      alert("The name field should not contain &");
      return;
    }
    setValidationErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
    setFormData((prevFormData) => ({
      ...prevFormData,
      generalDetails: {
        ...prevFormData.generalDetails,
        [name]: value,
      },
    }));
  };

  const handleAddressInformationChange = (event) => {
    const { name, value } = event.target;

    const latLongRegex = /^-?\d+\.\d{0,6}$/;

    if (
      (name === "latitude" || name === "longitude") &&
      !latLongRegex.test(value)
    ) {
      setFormData((prevState) => ({
        ...prevState,
        errors: {
          ...prevState.errors,
          [name]: `${name} must be in the decimal format eg. 77.001012`,
        },
        addressInformation: {
          ...prevState.addressInformation,
          [name]: value,
        },
      }));
      return;
    } else {
      setFormData((prevState) => ({
        ...prevState,
        errors: {
          ...prevState.errors,
          [name]: "",
        },
        addressInformation: {
          ...prevState.addressInformation,
          [name]: value,
        },
      }));
    }

    setValidationErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    if (name === "country") {
      handleCountryChange({ target: { value } });
    }
    if (name === "state") {
      handleStateChange({ target: { value } });
    }
    if (name === "city") {
      setSelectedCity(value);
    }
  };

  const handleReportingPeriodChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      reportingPeriodInformation: {
        ...prevState.reportingPeriodInformation,
        [name]: value,
      },
    }));
  };

  const handleFrameworkChange = (event) => {
    const { value, checked } = event.target;
    setSelectedFrameworks((prevFrameworks) =>
      checked
        ? [...prevFrameworks, value]
        : prevFrameworks.filter((framework) => framework !== value)
    );
  };

  const handleCountryChange = async (event) => {
    const [countryId, countryShortname] = event.target.value.split(":"); // Split the value by ":"
    setSelectedCountry(countryId); // Store the country ID
    const newsortname = countryShortname;
    setnewSelectedCountry(event.target.value);

    try {
      // Fetch states based on the selected country ID
      const response = await axiosInstance.get(
        `/geo_data/states/?country_id=${countryId}`
      );
      setStates(response.data || []); // Set the fetched states into the state variable
      console.log("Fetched states:", response.data);
    } catch (error) {
      console.error("Failed to fetch states:", error);
      setStates([]); // Reset states in case of an error
    }

    // Update form data to reflect the selected country, and reset state and city selections
    setFormData((prevState) => ({
      ...prevState,
      addressInformation: {
        ...prevState.addressInformation,
        country: newsortname, // Set the selected country ID in the form data
        state: "", // Clear state selection
        city: "", // Clear city selection
      },
    }));

    setCities([]); // Reset cities
    setSelectedState(""); // Reset selected state
    setSelectedCity(""); // Reset selected city
  };

  const handleStateChange = async (event) => {
    const [stateId, statename] = event.target.value.split(":"); // Split the value by ":"
    setSelectedState(stateId); // Store the country ID
    const newstatename = statename;
    setnewSelectedState(event.target.value);
    // const stateId = event.target.value;
    // setSelectedState(stateId);

    try {
      const response = await axiosInstance.get(
        `/geo_data/cities/?state_id=${stateId}`
      );
      setCities(response.data || []);
      console.log("api to fetch cities:", response.data);
    } catch (error) {
      console.error("Failed to fetch cities:", error);
      setCities([]);
    }

    setFormData((prevState) => ({
      ...prevState,
      addressInformation: {
        ...prevState.addressInformation,
        state: newstatename,
        city: "",
      },
    }));

    setSelectedCity("");
  };

  const handleCityChange = (event) => {
    const cityId = event.target.value;
    setSelectedCity(cityId);
  };

  const handleAddLocation = async (event, data) => {
    event.preventDefault();

    const url = `/locationonlyview`;

    const payload = {
      corporateentity: data.generalDetails.corporateEntity || null,
      name: data.generalDetails.name || "Location 1",
      phone: data.generalDetails.phone || 9999999999,
      mobile: data.generalDetails.mobile || "",
      website: data.generalDetails.website || "Not Provided",
      fax: data.generalDetails.fax || "",
      employeecount: data.generalDetails.Empcount || 0,
      revenue: data.generalDetails.revenue || 0,
      sector: data.generalDetails.sector || "General",
      sub_industry: data.generalDetails.subIndustry || "General",
      streetaddress: data.addressInformation.street || "Not Provided",
      zipcode: data.addressInformation.zipCode || "N/A",
      state: data.addressInformation.state || "N/A",
      city: data.addressInformation.city || "N/A",
      country: data.addressInformation.country || "N/A",
      latitude: data.addressInformation.latitude || null,
      longitude: data.addressInformation.longitude || null,
      timezone: data.generalDetails.timeZone || "UTC",
      currency: data.generalDetails.currency || "USD",
      dateformat: data.generalDetails.dateFormat || "YYYY/MM/DD",
      from_date: data.reportingPeriodInformation.fromDate || null,
      to_date: data.reportingPeriodInformation.toDate || null,
      language: data.generalDetails.language || "English",
      location_type: data.generalDetails.typelocation || "Default",

      // currency: data.generalDetails.currency || "US Dollars",
      // typelocation: data.generalDetails.typelocation || "Headquarter Location",
      // area: 56775,
      // type_of_services: "sfsdfsd",
      // type_of_product: "adsf",
      // type_of_business_activities: "jhghf",
    };

    try {
      const response = await post(url, payload);
      toast.success("Location added successfully");
      setTimeout(() => {
        router.push("/dashboard/OrgStructure");
      }, 1000);
      console.log("POST request successful:", response.data);
    } catch (error) {
      const message =
        error?.response?.data?.message[0] || "Failed to add location";
      toast.error(message, "error");
      console.error("Error:", error);
    }

    console.log(payload, "payload");
  };

  const handleEditLocation = async (event, data, id) => {
    event.preventDefault();

    const url = `/location/${id}/`;

    // const payload = {
    //   name: data.generalDetails.name || "",
    //   typelocation: data.generalDetails.typelocation || "",
    //   currency: data.generalDetails.currency || "",
    //   dateformat: data.generalDetails.dateFormat || "",
    //   phone: data.generalDetails.phone || null,
    //   mobile: data.generalDetails.mobile || null,
    //   website: data.generalDetails.website || "",
    //   fax: data.generalDetails.fax || 234567,
    //   sector: data.generalDetails.sector || "",
    //   sub_industry: data.generalDetails.subIndustry || "",
    //   location_type: data.generalDetails.typelocation || "",
    //   timezone: data.generalDetails.timeZone || "",
    //   employeecount: data.generalDetails.Empcount || null,
    //   language: data.generalDetails.language || "",
    //   revenue: data.generalDetails.revenue || null,
    //   currency: data.generalDetails.currency || "",
    //   streetaddress: data.addressInformation.street || "",
    //   area: null,
    //   type_of_services: "sfsdfsd",
    //   type_of_product: "adsf",
    //   type_of_business_activities: "jhghf",
    //   zipcode: data.addressInformation.zipCode || null,
    //   state: data.addressInformation.state || "",
    //   city: data.addressInformation.city || "",
    //   country: data.addressInformation.country || "",
    //   latitude: data.addressInformation.latitude || null,
    //   longitude: data.addressInformation.longitude || null,
    //   from_date: data.reportingPeriodInformation.fromDate || null,
    //   to_date: data.reportingPeriodInformation.toDate || null,
    //   framework: data.reportingPeriodInformation.reportingFramework || "GRI",
    // };

    const payload = {
      // corporateentity: data.generalDetails.corporateEntity || null,
      name: data.generalDetails.name || "Location 1",
      phone: data.generalDetails.phone || 9999999999,
      mobile: data.generalDetails.mobile || "",
      website: data.generalDetails.website || "Not Provided",
      fax: data.generalDetails.fax || "",
      employeecount: data.generalDetails.Empcount || 0,
      revenue: data.generalDetails.revenue || 0,
      sector: data.generalDetails.sector || "General",
      sub_industry: data.generalDetails.subIndustry || "General",
      streetaddress: data.addressInformation.street || "Not Provided",
      zipcode: data.addressInformation.zipCode || "N/A",
      state: data.addressInformation.state || "N/A",
      city: data.addressInformation.city || "N/A",
      country: data.addressInformation.country || "N/A",
      latitude: data.addressInformation.latitude || null,
      longitude: data.addressInformation.longitude || null,
      timezone: data.generalDetails.timeZone || "UTC",
      currency: data.generalDetails.currency || "USD",
      dateformat: data.generalDetails.dateFormat || "YYYY/MM/DD",
      from_date: data.reportingPeriodInformation.fromDate || null,
      to_date: data.reportingPeriodInformation.toDate || null,
      language: data.generalDetails.language || "English",
      location_type: data.generalDetails.typelocation || "Default",
    };
    try {
      const response = await patch(url, payload);
      toast.success(
        `Changes made to Location '${data.generalDetails.name}' has been saved`
      );
      setTimeout(() => {
        router.push("/dashboard/OrgStructure");
      }, 2500);
    } catch (error) {
      toast.error("Failed to update location", "error");
      console.error("Error:", error);
    }

    console.log(payload, "payload");
  };

  const handleCorporateEntityChange = (event) => {
    const selectedCorporateEntityName = event.target.value;
    handleGeneralDetailsChange(event);

    const corporateEntityDetails = corporates.find(
      (corp) => corp.id == selectedCorporateEntityName
    );

    setSelectedCorporateEntityDetails(corporateEntityDetails || null);
  };

  const handleSameAsCorporateChange = async (e) => {
    setIsSameAsCorporate(e.target.checked);
    if (
      e.target.checked &&
      !formData.generalDetails.corporateEntity &&
      !editData
    ) {
      setIsSameAsCorporate(false);
      alert("Please select Corporate entity first.");
      return;
    }
    if (e.target.checked && selectedCorporateEntityDetails) {
      console.log("Selected corporate entity details:", selectedCorporateEntityDetails);
      const selectedCountryCode = selectedCorporateEntityDetails.country;
      const selectedStateCode = selectedCorporateEntityDetails.state;

      // Find the country object to get the country ID for API calls
      const countryObject = countries.find(c => c.sortname === selectedCountryCode);
      
      if (!countryObject) {
        console.log("Country not found for code:", selectedCountryCode);
        return;
      }

      console.log("Found country:", countryObject);

      // Fetch states based on the country ID using API
      try {
        const statesResponse = await axiosInstance.get(
          `/geo_data/states/?country_id=${countryObject.id}`
        );
        const fetchedStates = statesResponse.data || [];
        console.log("Fetched states from API:", fetchedStates);
        setStates(fetchedStates);

        // Find the state object in the fetched states
        const stateObject = fetchedStates.find(s => s.state_name === selectedStateCode);
        console.log("Found state object:", stateObject);

        if (stateObject) {
          // Fetch cities based on the state ID using API
          try {
            const citiesResponse = await axiosInstance.get(
              `/geo_data/cities/?state_id=${stateObject.id}`
            );
            const fetchedCities = citiesResponse.data || [];
            console.log("Fetched cities from API:", fetchedCities);
            setCities(fetchedCities);

            // Set the selected values with proper compound format
            const countryValue = `${countryObject.id}:${countryObject.sortname}`;
            const stateValue = `${stateObject.id}:${stateObject.state_name}`;
            const cityValue = selectedCorporateEntityDetails.city;

            console.log("Setting country:", countryValue);
            console.log("Setting state:", stateValue);
            console.log("Setting city:", cityValue);

            // Update dropdown states - use the correct state variables that the dropdowns are bound to
            setnewSelectedCountry(countryValue);  // Country dropdown uses newselectedCountry
            setnewSelectedState(stateValue);      // State dropdown uses newselectedState  
            setSelectedCity(cityValue);           // City dropdown uses selectedCity
          } catch (error) {
            console.error("Failed to fetch cities:", error);
            setCities([]);
          }
        } else {
          console.log("State not found in API data");
          setSelectedState("");
          setCities([]);
        }
      } catch (error) {
        console.error("Failed to fetch states:", error);
        setStates([]);
        setCities([]);
      }

      setValidationErrors((prev) => ({
        ...prev,
        street: "",
        country: "",
        state: "",
        city: "",
        zipCode: "",
      }));

      console.log("Setting form data with:", {
        street: selectedCorporateEntityDetails.address,
        country: selectedCorporateEntityDetails.country,
        state: selectedCorporateEntityDetails.state,
        city: selectedCorporateEntityDetails.city,
        zipCode: selectedCorporateEntityDetails.zipcode,
      });

      setFormData((prevFormData) => ({
        ...prevFormData,
        addressInformation: {
          ...prevFormData.addressInformation,
          street: selectedCorporateEntityDetails.address,
          country: selectedCorporateEntityDetails.country,
          state: selectedCorporateEntityDetails.state,
          city: selectedCorporateEntityDetails.city,
          zipCode: selectedCorporateEntityDetails.zipcode,
          latitude: selectedCorporateEntityDetails.latitude,
          longitude: selectedCorporateEntityDetails.longitude,
        },
      }));
    } else if (!e.target.checked) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        addressInformation: {
          ...prevFormData.addressInformation,
          street: "",
          country: "",
          state: "",
          city: "",
          zipCode: "",
          latitude: "",
          longitude: "",
        },
      }));

      setStates([]);
      setCities([]);

      setSelectedCountry("");
      setSelectedState("");
      setSelectedCity("");
    }
  };

  useEffect(() => {
    if (editData) {
      const selectedCountryCode = editData.filteredData[0].country;
      const selectedStateCode = editData.filteredData[0].state;
      const statesOfSelectedCountry =
        State.getStatesOfCountry(selectedCountryCode);
      const citiesOfSelectedState = City.getCitiesOfState(
        selectedCountryCode,
        selectedStateCode
      );

      const selectedIndustryValue = editData.filteredData[0].sector;

      // Find the corresponding industry object
      const selectedIndustryData = industryList.find(
        (industry) => industry.industry === selectedIndustryValue
      );

      setSelectedCorporateEntityDetails(
        editData.filteredData[0].corporate_data || null
      );

      // Get the sub-industries for the selected industry
      const subIndustriesForSelectedIndustry =
        selectedIndustryData?.subIndustries || [];

      const frameworkNumbers = editData.filteredData[0].framework;

      // Map the numeric values to framework names
      // const selectedFrameworks = Array.isArray(frameworkNumbers)
      //   ? frameworkNumbers.map((num) => frameworkMapping[num])
      //   : [frameworkMapping[frameworkNumbers]];
      // console.log('data in lcoation', editData.filteredData[0]);

      setFormData({
        generalDetails: {
          name: editData.filteredData[0].name || "",
          email: editData.filteredData[0].email || "",
          phone:
            editData.filteredData[0].phone == "9999999999"
              ? ""
              : editData.filteredData[0].phone || "",
          website:
            editData.filteredData[0].website == "Not Provided"
              ? ""
              : editData.filteredData[0].website || "",
          typelocation:
            editData.filteredData[0].location_type == "Default"
              ? ""
              : editData.filteredData[0].location_type || "",
          ownership: editData.filteredData[0].owner || "",
          location: editData.filteredData[0].location_of_headquarters || "",
          Empcount: editData.filteredData[0].employeecount || "",
          revenue: editData.filteredData[0].revenue || "",
          mobile: editData.filteredData[0].mobile || "",
          fax: editData.filteredData[0].fax || "",
          sector:
            editData.filteredData[0].sector == "General"
              ? ""
              : editData.filteredData[0].sector || "",
          subIndustry:
            editData.filteredData[0].sub_industry == "General"
              ? ""
              : editData.filteredData[0].sub_industry || "",
          organisation: editData.filteredData[0].organisation,
          dateFormat: editData.filteredData[0].dateformat,
          currency: editData.filteredData[0].currency,
          timeZone: editData.filteredData[0].timezone,
          language: editData.filteredData[0].language || "",
        },

        addressInformation: {
          country:
            editData.filteredData[0]?.country == "N/A"
              ? ""
              : editData.filteredData[0]?.country || "",
          state:
            editData.filteredData[0]?.state == "N/A"
              ? ""
              : editData.filteredData[0]?.state || "",
          city:
            editData.filteredData[0]?.city == "N/A"
              ? ""
              : editData.filteredData[0]?.city || "",
          street:
            editData.filteredData[0]?.street == "Not Provided"
              ? ""
              : editData.filteredData[0]?.street || "",
          zipCode:
            editData.filteredData[0].zipcode == "N/A"
              ? ""
              : editData.filteredData[0].zipcode || "",
          latitude: editData.filteredData[0].latitude,
          longitude: editData.filteredData[0].longitude,
        },

        reportingPeriodInformation: {
          fromDate: editData.filteredData[0].from_date,
          toDate: editData.filteredData[0].to_date,
          reportingFramework: editData.filteredData[0].framework,
        },
        errors: {
          latitude: "",
          longitude: "",
        },
      });

      setStates(statesOfSelectedCountry);
      setCities(citiesOfSelectedState);
      setSelectedCountry(selectedCountryCode);
      setSelectedState(selectedStateCode);
      setSelectedCity(editData.filteredData[0].city);

      setSelectedIndustry(selectedIndustryValue);
      setSubIndustries(subIndustriesForSelectedIndustry);

      setSelectedFrameworks(selectedFrameworks);
    }
  }, [editData]);
  useEffect(() => {
    const loadEditableLocationData = async () => {
      if (!editData || countries.length === 0) return;
  
      const selectedData = editData.filteredData[0] || {};
      const selectedCountryCode = selectedData.country || "";
      const selectedStateCode = selectedData.state || "";
      const selectedCityName = selectedData.city || "";
  
      // Match country by sortname (e.g., IN, US)
      const matchedCountry = countries.find(
        (country) => country.sortname === selectedCountryCode
      );
  
      const newCountryValue = matchedCountry
        ? `${matchedCountry.id}:${matchedCountry.sortname}`
        : "";
  
      setSelectedCountry(selectedCountryCode);
      setnewSelectedCountry(newCountryValue);
      console.log(newCountryValue,"test newCountryValue edite");
  
      if (matchedCountry?.id) {
        try {
          // Fetch states
          const stateResponse = await axiosInstance.get(
            `/geo_data/states/?country_id=${matchedCountry.id}`
          );
          const fetchedStates = stateResponse.data || [];
          setStates(fetchedStates);
  
          // Match state by code
          const matchedState = fetchedStates.find(
            (state) => state.state_name === selectedStateCode
          );
  
          const newStateValue = matchedState
            ? `${matchedState.id}:${matchedState.state_name}`
            : "";
  
          setSelectedState(selectedStateCode);
          setnewSelectedState(newStateValue);
          console.log(newStateValue,"test newStateValue edite");
          if (matchedState?.id) {
            try {
              // Fetch cities
              const cityResponse = await axiosInstance.get(
                `/geo_data/cities/?state_id=${matchedState.id}`
              );
              const fetchedCities = cityResponse.data || [];
              setCities(fetchedCities);
  
              // Set selected city
              setSelectedCity(selectedCityName);
            } catch (cityError) {
              console.error("Failed to fetch cities:", cityError);
              setCities([]);
            }
          }
        } catch (stateError) {
          console.error("Failed to fetch states:", stateError);
          setStates([]);
        }
      }
    };
  
    loadEditableLocationData();
  }, [editData,countries]);
  const handleAddCity = async (cityName) => {
    try {
      // API request to create a new city
      const response = await axiosInstance.post("geo_data/cities/create/", {
        city_name: cityName,
        state: selectedState,
      });

      // Assuming the response contains the newly created city object
      const newCity = response.data;

      // Add the newly created city to the state
      setCities((prevCities) => [...prevCities, newCity]);

      // Show a success toast message
      toast.success("City added successfully!");

      // Return the newly added city (optional)
      return newCity;
    } catch (error) {
      console.error("Error adding city:", error);
      // Show an error toast message
      toast.error("Failed to add city. Please try again.");
      // Handle error accordingly
      throw new Error("Failed to add city");
    }
  };
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="px-4 mt-4">
        <div className="flex justify-between items-center drop-shadow-lg border-b-2 py-6 w-full">
          <h2 className="self-stretch text-black text-opacity-90 text-[22px] font-normal leading-relaxed flex space-x-8 items-center">
            <button onClick={() => router.back()} className="flex items-center">
              <FiArrowLeft />
            </button>
            <span>{editData ? "Edit Location" : "Location of Operation"}</span>
          </h2>
          <button
            className="w-[73px] h-[31px] px-[22px] py-2 bg-sky-600 rounded shadow flex-col justify-center items-center inline-flex me-8 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              if (validateForm()) {
                editData
                  ? handleEditLocation(e, formData, editData.filteredData[0].id)
                  : handleAddLocation(e, formData);
              } else {
                console.log("in else");
              }
            }}
          >
            <div className="text-white text-xs font-bold leading-[15px]">
              Save
            </div>
          </button>
        </div>
        <div className="space-y-4 bg-white py-4">
          <div className="grid grid-cols-1 xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-3 4k:grid-cols-3 2k:grid-cols-3 2xl:grid-cols-3   gap-5">
            <div className="hidden xl:block md:block lg:block"></div>
            <div className="hidden xl:block md:block lg:block"></div>
            {editData ? (
              ""
            ) : (
              <div>
                <label
                  htmlFor="name"
                  className="text-neutral-800 text-[13px] font-normal"
                >
                  Corporate Entity <span className="text-red-500">*</span>
                </label>
                <select
                  name="corporateEntity"
                  value={formData.generalDetails.corporateEntity}
                  onChange={handleCorporateEntityChange}
                  className={`border ${
                    validationErrors.corporateEntity
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md w-full p-2 text-neutral-500 text-xs font-normal leading-tight`}
                >
                  <option value="">Select Corporate Entity</option>
                  {corporates?.map((corp) => (
                    <option key={corp.id} value={corp.id}>
                      {corp.name}
                    </option>
                  ))}{" "}
                </select>
                {validationErrors.corporateEntity && (
                  <p className="text-red-500 text-xs">
                    {validationErrors.corporateEntity}
                  </p>
                )}
              </div>
            )}
          </div>
          <div>
            <h3 className="text-neutral-400 text-xs font-semibold uppercase leading-relaxed tracking-wide my-8 mb-4">
              General Information
            </h3>
            <div className="grid grid-cols-1 xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-3 4k:grid-cols-3 2k:grid-cols-3 2xl:grid-cols-3   gap-5">
              <div className="space-y-3">
                <label
                  htmlFor="name"
                  className="block text-neutral-800 text-[13px] font-normal"
                >
                  Location Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter Location name"
                  value={formData.generalDetails?.name}
                  onChange={handleGeneralDetailsChange}
                  className={`border ${
                    validationErrors.name ? "border-red-500" : "border-gray-300"
                  } rounded-md w-full p-2 text-neutral-500 text-xs font-normal leading-tight`}
                />
                {validationErrors.name && (
                  <p className="text-red-500 text-xs">
                    {validationErrors.name}
                  </p>
                )}
              </div>
              <div className="hidden xl:block md:block lg:block"></div>
              <div className="hidden xl:block md:block lg:block"></div>
              <div className="space-y-3">
                <label
                  htmlFor="phone"
                  className="block text-neutral-800 text-[13px] font-normal"
                >
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="phone"
                  placeholder="Enter Phone Number"
                  value={formData.generalDetails?.phone}
                  onChange={handleGeneralDetailsChange}
                  className={`border ${
                    validationErrors.phone
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md w-full p-2 text-neutral-500 text-xs font-normal leading-tight`}
                />
                {validationErrors.phone && (
                  <p className="text-red-500 text-xs">
                    {validationErrors.phone}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <label
                  htmlFor="mobile"
                  className="block text-neutral-800 text-[13px] font-normal"
                >
                  Mobile
                </label>
                <input
                  type="number"
                  name="mobile"
                  value={formData.generalDetails?.mobile}
                  onChange={handleGeneralDetailsChange}
                  className="border border-gray-300 rounded-md w-full p-2 text-neutral-500 text-xs font-normal leading-tight"
                />
              </div>
              <div className="space-y-3">
                <label
                  htmlFor="website"
                  className="block text-neutral-800 text-[13px] font-normal"
                >
                  Website <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="website"
                  placeholder="Enter Website URL"
                  value={formData.generalDetails?.website}
                  onChange={handleGeneralDetailsChange}
                  className={`border ${
                    validationErrors.website
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md w-full p-2 text-neutral-500 text-xs font-normal leading-tight`}
                />
                {validationErrors.website && (
                  <p className="text-red-500 text-xs">
                    {validationErrors.website}
                  </p>
                )}
              </div>
              <div className="space-y-3">
                <label
                  htmlFor="fax"
                  className="block text-neutral-800 text-[13px] font-normal"
                >
                  Fax
                </label>
                <input
                  type="text"
                  name="fax"
                  value={formData.generalDetails?.fax}
                  onChange={handleGeneralDetailsChange}
                  className="border border-gray-300 rounded-md w-full p-2 text-neutral-500 text-xs font-normal leading-tight"
                />
              </div>
              <div className="space-y-3">
                <label
                  htmlFor="Empcount"
                  className="block text-neutral-800 text-[13px] font-normal"
                >
                  Employee Count <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="Empcount"
                  placeholder="Enter Employee Count"
                  value={formData.generalDetails?.Empcount}
                  onChange={handleGeneralDetailsChange}
                  className={`border ${
                    validationErrors.Empcount
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md w-full p-2 text-neutral-500 text-xs font-normal leading-tight`}
                />
                {validationErrors.Empcount && (
                  <p className="text-red-500 text-xs">
                    {validationErrors.Empcount}
                  </p>
                )}
              </div>
              <div className="space-y-3">
                <label
                  htmlFor="revenue"
                  className="block text-neutral-800 text-[13px] font-normal"
                >
                  Revenue <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="revenue"
                  placeholder="Enter Revenue"
                  value={formData.generalDetails?.revenue}
                  onChange={handleGeneralDetailsChange}
                  className={`border ${
                    validationErrors.revenue
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md w-full p-2 text-neutral-500 text-xs font-normal leading-tight`}
                />
                {validationErrors.revenue && (
                  <p className="text-red-500 text-xs">
                    {validationErrors.revenue}
                  </p>
                )}
              </div>
              <div className="space-y-3">
                <label
                  htmlFor="sector"
                  className="block text-neutral-800 text-[13px] font-normal"
                >
                  Sector <span className="text-red-500">*</span>
                </label>
                <select
                  name="sector"
                  value={formData.generalDetails?.sector}
                  onChange={handleSectorChange}
                  className={`border ${
                    validationErrors.sector
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md w-full p-2 text-neutral-500 text-xs font-normal leading-tight`}
                >
                  <option value="">Select Sector</option>
                  {industryList.map((industry) => (
                    <option key={industry.id} value={industry.value}>
                      {industry.industry}
                    </option>
                  ))}
                </select>
                {validationErrors.sector && (
                  <p className="text-red-500 text-xs">
                    {validationErrors.sector}
                  </p>
                )}
              </div>
              <div className="space-y-3">
                <label
                  htmlFor="subIndustry"
                  className="block text-neutral-800 text-[13px] font-normal"
                >
                  Sub Industry <span className="text-red-500">*</span>
                </label>
                <select
                  name="subIndustry"
                  value={formData.generalDetails?.subIndustry}
                  onChange={handleGeneralDetailsChange}
                  className={`border ${
                    validationErrors.subIndustry
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md w-full p-2 text-neutral-500 text-xs font-normal leading-tight`}
                >
                  <option value="">Select Sub Industry</option>
                  {subIndustries.map((subIndustry) => (
                    <option key={subIndustry.id} value={subIndustry.value}>
                      {subIndustry.subIndustry}
                    </option>
                  ))}
                </select>
                {validationErrors.subIndustry && (
                  <p className="text-red-500 text-xs">
                    {validationErrors.subIndustry}
                  </p>
                )}
              </div>
              <div className="hidden xl:block"></div>
              <div className="space-y-3">
                <label
                  htmlFor="typeOfLocation"
                  className="block text-neutral-800 text-[13px] font-normal"
                >
                  Type of Location
                </label>
                <input
                  type="text"
                  name="typelocation"
                  placeholder="Enter type of Location"
                  value={formData.generalDetails?.typelocation}
                  onChange={handleGeneralDetailsChange}
                  className="border border-gray-300 rounded-md w-full p-2 text-neutral-500 text-xs font-normal leading-tight"
                />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-6 xl:mt-[4rem] mt-[1rem] text-gray-700">
              ADDRESS INFORMATION
            </h3>

            <div className="grid grid-cols-1 xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-3 4k:grid-cols-3 2k:grid-cols-3 2xl:grid-cols-3 gap-5">
              <div className="space-y-3 w-full">
                <label
                  htmlFor="address"
                  className="block text-neutral-800 text-[13px] font-normal"
                >
                  Street Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="street"
                  placeholder="Enter Street Address"
                  value={formData.addressInformation?.street}
                  onChange={handleAddressInformationChange}
                  className={`border ${
                    validationErrors.street
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md w-full p-2 text-neutral-500 text-xs font-normal leading-tight`}
                />
                {validationErrors.street && (
                  <p className="text-red-500 text-xs">
                    {validationErrors.street}
                  </p>
                )}
              </div>
              <div className="hidden xl:block md:block lg:block"></div>
              <div className="hidden xl:block md:block lg:block"></div>
              <div className="space-y-3">
                <label
                  htmlFor="country"
                  className="block text-neutral-800 text-[13px] font-normal"
                >
                  Country <span className="text-red-500">*</span>
                </label>
                <select
                  name="country"
                  value={newselectedCountry}
                  onChange={handleAddressInformationChange}
                  className={`border ${
                    validationErrors.country
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md w-full p-2 text-neutral-500 text-xs font-normal leading-tight`}
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
                {validationErrors.country && (
                  <p className="text-red-500 text-xs">
                    {validationErrors.country}
                  </p>
                )}
              </div>

              {/* State */}
              <div className="space-y-3">
                <label
                  htmlFor="state"
                  className="block text-neutral-800 text-[13px] font-normal"
                >
                  State <span className="text-red-500">*</span>
                </label>
                <select
                  name="state"
                  value={newselectedState}
                  onChange={handleAddressInformationChange}
                  className={`border ${
                    validationErrors.state
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md w-full p-2 text-neutral-500 text-xs font-normal leading-tight`}
                >
                  <option value="">Select State</option>
                  {states.map((state) => (
                    <option
                      key={state.id}
                      value={`${state.id}:${state.state_name}`}
                    >
                      {state.state_name}
                    </option>
                  ))}
                </select>
                {validationErrors.state && (
                  <p className="text-red-500 text-xs">
                    {validationErrors.state}
                  </p>
                )}
              </div>

              {/* City */}
              <div className="space-y-3">
                <SearchableCityDropdown
                  cities={cities}
                  selectedCity={selectedCity}
                  onSelectCity={(cityName) => {
                    setSelectedCity(cityName);
                    setFormData((prevFormData) => ({
                      ...prevFormData,
                      addressInformation: {
                        ...prevFormData.addressInformation,
                        city: cityName,
                      },
                    }));
                    setValidationErrors((prev) => ({
                      ...prev,
                      city: "",
                    }));
                  }}
                  onAddCity={handleAddCity} // ✅ from parent
                  error={validationErrors.city}
                />
              </div>

              <div className="space-y-3">
                <label
                  htmlFor="zipCode"
                  className="block text-neutral-800 text-[13px] font-normal"
                >
                  Zip Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="zipCode"
                  placeholder="Enter zip code"
                  value={formData.addressInformation?.zipCode}
                  onChange={handleAddressInformationChange}
                  className={`border ${
                    validationErrors.zipCode
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md w-full p-2 text-neutral-500 text-xs font-normal leading-tight`}
                />
                {validationErrors.zipCode && (
                  <p className="text-red-500 text-xs">
                    {validationErrors.zipCode}
                  </p>
                )}
              </div>
              <div className="space-y-3">
                <label
                  htmlFor="latitude"
                  className="block text-neutral-800 text-[13px] font-normal"
                >
                  Latitude
                </label>
                <input
                  type="number"
                  name="latitude"
                  value={formData.addressInformation?.latitude}
                  onChange={handleAddressInformationChange}
                  className={`border rounded-md w-full p-2 text-neutral-500 text-xs font-normal leading-tight ${
                    formData.errors?.latitude
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {formData.errors?.latitude && (
                  <p className="text-red-500 text-xs mt-1">
                    {formData.errors?.latitude}
                  </p>
                )}
              </div>
              <div className="space-y-3">
                <label
                  htmlFor="longitude"
                  className="block text-neutral-800 text-[13px] font-normal"
                >
                  Longitude
                </label>
                <input
                  type="number"
                  name="longitude"
                  value={formData.addressInformation?.longitude}
                  onChange={handleAddressInformationChange}
                  className={`border rounded-md w-full p-2 text-neutral-500 text-xs font-normal leading-tight ${
                    formData.errors?.longitude
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {formData.errors?.longitude && (
                  <p className="text-red-500 text-xs mt-1">
                    {formData.errors?.longitude}
                  </p>
                )}
              </div>
              <div className="space-y-3 col-span-3">
                <label
                  htmlFor="sameAsCorporate"
                  className="block text-neutral-800 text-[13px] font-normal"
                >
                  <input
                    type="checkbox"
                    name="sameAsCorporate"
                    checked={isSameAsCorporate}
                    onChange={handleSameAsCorporateChange}
                    className="me-2 green-checkbox"
                  />
                  Same as Corporate Entity
                </label>
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-6 mt-[4rem] text-gray-700">
              LOCALE INFORMATION
            </h3>
            <div className="grid grid-cols-1 xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-3 4k:grid-cols-3 2k:grid-cols-3 2xl:grid-cols-3   gap-5">
              <div className="space-y-3">
                <label
                  htmlFor="dateFormat"
                  className="block text-neutral-800 text-[13px] font-normal"
                >
                  Date Format
                </label>
                <select
                  name="dateFormat"
                  value={formData.generalDetails?.dateFormat}
                  onChange={handleGeneralDetailsChange}
                  className="border border-gray-300 rounded-md w-full p-2 text-neutral-500 text-xs font-normal leading-tight"
                >
                  <option>Select Date Format</option>
                  {dateFormatOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-3">
                <label
                  htmlFor="currency"
                  className="block text-neutral-800 text-[13px] font-normal"
                >
                  Currency <span className="text-red-500">*</span>
                </label>
                <select
                  name="currency"
                  value={formData.generalDetails?.currency}
                  onChange={handleGeneralDetailsChange}
                  className={`border ${
                    validationErrors.currency
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md w-full p-2 text-neutral-500 text-xs font-normal leading-tight`}
                >
                  <option value="">Select currency</option>
                  {Currency.map((option) => (
                    <option key={option.currency} value={option.currency}>
                      {option.currency}
                    </option>
                  ))}
                </select>
                {validationErrors.currency && (
                  <p className="text-red-500 text-xs">
                    {validationErrors.currency}
                  </p>
                )}
              </div>
              <div className="hidden xl:block"></div>
              <div className="space-y-3">
                <label
                  htmlFor="timeZone"
                  className="block text-neutral-800 text-[13px] font-normal"
                >
                  Timezone
                </label>
                <select
                  name="timeZone"
                  value={formData.generalDetails?.timeZone}
                  onChange={handleGeneralDetailsChange}
                  className="border border-gray-300 rounded-md w-full p-2 text-neutral-500 text-xs font-normal leading-tight"
                >
                  <option>Select Timezone</option>
                  {timeZones.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-3">
                <label
                  htmlFor="language"
                  className="block text-neutral-800 text-[13px] font-normal"
                >
                  Language
                </label>
                <select
                  name="language"
                  value={formData.generalDetails?.language}
                  onChange={handleGeneralDetailsChange}
                  className="border border-gray-300 rounded-md w-full p-2 text-neutral-500 text-xs font-normal leading-tight"
                >
                  <option value="">Select Language</option>
                  <option value="English">English</option>
                  <option value="Arabic">Arabic</option>
                  <option value="Mandarin Chinese">Mandarin Chinese</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Korean">Korean</option>
                  <option value="Turkish">Turkish</option>
                  <option value="Japanese">Japanese</option>
                  <option value="Spanish">Spanish</option>
                  <option value="Russian">Russian</option>
                  <option value="Italian">Italian</option>
                  <option value="Portuguese">Portuguese</option>
                  <option value="Vietnamese">Vietnamese</option>
                  <option value="Persian">Persian</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Indonesian">Indonesian</option>
                  <option value="Thai">Thai</option>
                  <option value="Farsi">Farsi</option>
                  <option value="Polish">Polish</option>
                </select>
              </div>
            </div>
            <div className="h-[0px] border border-gray-200 my-8 w-full"></div>
            <h3 className="text-neutral-400 text-xs font-semibold uppercase leading-relaxed tracking-wide my-8 mb-4">
              REPORTING PERIOD
            </h3>
            <div className="grid grid-cols-1 xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-3 4k:grid-cols-3 2k:grid-cols-3 2xl:grid-cols-3   gap-5">
              <div className="space-y-3">
                <label
                  htmlFor="fromDate"
                  className="block text-neutral-800 text-[13px] font-normal"
                >
                  From Date
                </label>
                <input
                  type="date"
                  name="fromDate"
                  id="fromDate"
                  value={formData.reportingPeriodInformation?.fromDate}
                  onChange={handleReportingPeriodChange}
                  className="border border-gray-300 rounded-md w-full p-2 text-neutral-500 text-xs font-normal leading-tight"
                />
              </div>
              <div className="space-y-3">
                <label
                  htmlFor="toDate"
                  className="block text-neutral-800 text-[13px] font-normal"
                >
                  To Date
                </label>
                <input
                  type="date"
                  name="toDate"
                  id="toDate"
                  value={formData.reportingPeriodInformation?.toDate}
                  onChange={handleReportingPeriodChange}
                  className="border border-gray-300 rounded-md w-full p-2 text-neutral-500 text-xs font-normal leading-tight"
                />
              </div>
              <div className="hidden xl:block"></div>
            </div>
            {/* <div className="space-y-3 mt-4">
            <label
              htmlFor="reportingFramework"
              className="block text-neutral-800 text-[13px] font-normal mb-3"
            >
              Reporting Framework
            </label>
            {reportFramework.map((framework) => (
              <label
                key={framework}
                className="text-md font-semibold text-gray-700 me-4"
              >
                <input
                  type="checkbox"
                  value={framework}
                  checked={selectedFrameworks.includes(framework)}
                  onChange={handleFrameworkChange}
                  className="p-1 me-2 text-black text-opacity-90 text-xs font-normal leading-[18px] tracking-tight"
                />
                {framework}
              </label>
            ))}
          </div> */}
            <div className="w-full h-[0px] border border-gray-200 my-12"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Location;